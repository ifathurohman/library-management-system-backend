const pool = require("../../config");

const index = async (req, res) => {
  const { search } = req.query;
  try {
    const result = search
      ? await pool.query("SELECT * FROM MasterBuku WHERE judul ILIKE $1", [
          `%${search}%`,
        ])
      : await pool.query("SELECT * FROM MasterBuku");
    res.send(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const view = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM MasterBuku WHERE buku_id = $1",
      [id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const store = async (req, res) => {
  const { judul, penulis, penerbit, tahun_terbit, isbn, lokasi_rak, jumlah } =
    req.body;
  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    // Insert into MasterBuku
    const bookResult = await client.query(
      "INSERT INTO MasterBuku (judul, penulis, penerbit, tahun_terbit, isbn) VALUES ($1, $2, $3, $4, $5) RETURNING buku_id",
      [judul, penulis, penerbit, tahun_terbit, isbn]
    );
    const bukuId = bookResult.rows[0].buku_id;

    // Insert into RakBuku
    const rackResult = await client.query(
      "INSERT INTO RakBuku (lokasi_rak) VALUES ($1) RETURNING rak_id",
      [lokasi_rak]
    );
    const rakId = rackResult.rows[0].rak_id;

    // Insert into InventoryStokBuku
    await client.query(
      "INSERT INTO InventoryStokBuku (buku_id, rak_id, jumlah) VALUES ($1, $2, $3)",
      [bukuId, rakId, jumlah]
    );

    await client.query("COMMIT");

    res.status(201).json({
      status: true,
      message: "Book added successfully.",
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    res.status(400).json({
      errorMessage: error.message,
      status: false,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { judul, penulis, penerbit, tahun_terbit, isbn } = req.body;
  try {
    const result = await pool.query(
      "UPDATE MasterBuku SET judul = $1, penulis = $2, penerbit = $3, tahun_terbit = $4, isbn = $5 WHERE buku_id = $6 RETURNING *",
      [judul, penulis, penerbit, tahun_terbit, isbn, id]
    );
    res.status(200).json({
      status: true,
      message: "Book updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      errorMessage: error.message,
      status: false,
    });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM MasterBuku WHERE buku_id = $1 RETURNING *",
      [id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const destroyAllData = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM MasterBuku RETURNING *");
    res.status(200).json({
      status: true,
      message: "All books deleted successfully.",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  index,
  view,
  store,
  update,
  destroy,
  destroyAllData,
};
