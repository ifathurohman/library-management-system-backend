const pool = require("../../config");

const addStockToInventory = async (req, res) => {
  const { buku_id, rak_id, jumlah } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookResult = await client.query(
      `SELECT 1 FROM MasterBuku WHERE buku_id = $1`,
      [buku_id]
    );

    if (bookResult.rowCount === 0) {
      return res.status(400).json({
        errorMessage: `Book with ID ${buku_id} does not exist.`,
      });
    }

    const rackResult = await client.query(
      `SELECT 1 FROM RakBuku WHERE rak_id = $1`,
      [rak_id]
    );

    if (rackResult.rowCount === 0) {
      return res.status(400).json({
        errorMessage: `Rack with ID ${rak_id} does not exist.`,
      });
    }

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
      message: "Stock added successfully.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ errorMessage: error.message });
  } finally {
    client.release();
  }
};

module.exports = {
  addStockToInventory,
};
