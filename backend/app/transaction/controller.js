const pool = require("../../config");

const index = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM TransaksiPeminjaman
       LEFT JOIN DetailTransaksiPeminjaman ON TransaksiPeminjaman.transaksi_id = DetailTransaksiPeminjaman.transaksi_id`
    );
    res.send(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createTransaction = async (req, res) => {
  const { mahasiswa_id, books } = req.body;
  const client = await pool.connect();

  try {

    const mahasiswaResult = await client.query(
      `SELECT 1 FROM MasterMahasiswa WHERE mahasiswa_id = $1 AND status = 'aktif'`,
      [mahasiswa_id]
    );

    if (mahasiswaResult.rowCount === 0) {
      return res.status(400).json({
        errorMessage: `Mahasiswa with ID ${mahasiswa_id} is not active or does not exist.`,
      });
    }

    const alreadyBorrowedResult = await client.query(
      `SELECT DISTINCT transaksi_id 
         FROM DetailTransaksiPeminjaman 
         WHERE transaksi_id IN (
           SELECT transaksi_id 
           FROM TransaksiPeminjaman 
           WHERE mahasiswa_id = $1
         ) AND buku_id = ANY($2)`,
      [mahasiswa_id, books]
    );

    if (alreadyBorrowedResult.rowCount > 0) {
      const alreadyBorrowedTransactions = alreadyBorrowedResult.rows.map(
        (row) => row.transaksi_id
      );
      return res.status(400).json({
        errorMessage: `Mahasiswa with ID ${mahasiswa_id} has already borrowed books in transaction(s): ${alreadyBorrowedTransactions.join(
          ", "
        )}.`,
      });
    }

    const maxPinjamDate = new Date();
    maxPinjamDate.setDate(maxPinjamDate.getDate() + 14);
    const tanggal_kembali_final = maxPinjamDate.toISOString().split("T")[0];

    await client.query("BEGIN");

    const transactionResult = await client.query(
      `INSERT INTO TransaksiPeminjaman (mahasiswa_id, tanggal_pinjam, tanggal_kembali)
       VALUES ($1, CURRENT_DATE, $2)
       RETURNING transaksi_id`,
      [mahasiswa_id, tanggal_kembali_final]
    );

    const transaksi_id = transactionResult.rows[0].transaksi_id;

    const borrowedBooks = [];

    if (Array.isArray(books) && books.length > 0) {
      for (let book_id of books) {

        const bookStockResult = await client.query(
          `SELECT jumlah FROM InventoryStokBuku WHERE buku_id = $1`,
          [book_id]
        );

        if (
          bookStockResult.rowCount === 0 ||
          bookStockResult.rows[0].jumlah < 1
        ) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            errorMessage: `Book with ID ${book_id} is out of stock.`,
          });
        }

        await client.query(
          `INSERT INTO DetailTransaksiPeminjaman (transaksi_id, buku_id, jumlah)
           VALUES ($1, $2, $3)`,
          [transaksi_id, book_id, 1]
        );

        await client.query(
          `UPDATE InventoryStokBuku SET jumlah = jumlah - 1 WHERE buku_id = $1`,
          [book_id]
        );

        await client.query(
          `INSERT INTO HistoryPeminjaman (transaksi_id, mahasiswa_id, buku_id, tanggal_pinjam, tanggal_kembali, status)
           VALUES ($1, $2, $3, CURRENT_DATE, $4, $5)`,
          [transaksi_id, mahasiswa_id, book_id, tanggal_kembali_final, "Pinjam"]
        );

        const bookDetailResult = await client.query(
          `SELECT judul FROM MasterBuku WHERE buku_id = $1`,
          [book_id]
        );

        borrowedBooks.push({
          book_id,
          judul: bookDetailResult.rows[0].judul,
          tanggal_pinjam: new Date().toISOString().split("T")[0], // Set to current date
          tanggal_kembali: tanggal_kembali_final,
          mahasiswa_id,
        });
      }
    }

    await client.query("COMMIT");

    res.status(201).send({ transaction_id: transaksi_id, borrowedBooks });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ errorMessage: error.message });
  } finally {
    client.release();
  }
};

const addStockToInventory = async (req, res) => {
  const { buku_id, rak_id, jumlah } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if the book exists
    const bookResult = await client.query(
      `SELECT 1 FROM MasterBuku WHERE buku_id = $1`,
      [buku_id]
    );

    if (bookResult.rowCount === 0) {
      return res.status(400).json({
        errorMessage: `Book with ID ${buku_id} does not exist.`,
      });
    }

    // Check if the rack exists
    const rackResult = await client.query(
      `SELECT 1 FROM RakBuku WHERE rak_id = $1`,
      [rak_id]
    );

    if (rackResult.rowCount === 0) {
      return res.status(400).json({
        errorMessage: `Rack with ID ${rak_id} does not exist.`,
      });
    }

    // Update the inventory stock
    await client.query(
      `INSERT INTO InventoryStokBuku (buku_id, rak_id, jumlah)
       VALUES ($1, $2, $3)
       ON CONFLICT (buku_id, rak_id) DO UPDATE
       SET jumlah = InventoryStokBuku.jumlah + EXCLUDED.jumlah`,
      [buku_id, rak_id, jumlah]
    );

    await client.query("COMMIT");

    res.status(200).json({
      status: true,
      message: 'Stock added successfully.',
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ errorMessage: error.message });
  } finally {
    client.release();
  }
};

module.exports = {
  index,
  createTransaction,
  addStockToInventory
};
