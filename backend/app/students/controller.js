const pool = require("../../config");

const index = async (req, res) => {
  const { search } = req.query;
  try {
    let query = "SELECT * FROM MasterMahasiswa";
    let values = [];
    if (search) {
      query += " WHERE nama ILIKE $1";
      values.push(`%${search}%`);
    }
    const result = await pool.query(query, values);
    res.send(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const view = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM MasterMahasiswa WHERE mahasiswa_id = $1",
      [id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const store = async (req, res) => {
  console.log("Request Body:", req.body); // Log the request body

  const { nama, nim, jurusan, angkatan } = req.body;

  if (!nama || !nim || !jurusan || !angkatan) {
    return res.status(400).json({
      errorMessage: "All fields (nama, nim, jurusan, angkatan) are required.",
      status: false,
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO MasterMahasiswa (nama, nim, jurusan, angkatan) VALUES ($1, $2, $3, $4) RETURNING *",
      [nama, nim, jurusan, angkatan]
    );
    res.status(200).json({
      status: true,
      message: "Mahasiswa added successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      errorMessage: error.message,
      status: false,
    });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { nama, nim, jurusan, angkatan } = req.body;
  try {
    const result = await pool.query(
      "UPDATE MasterMahasiswa SET nama = $1, nim = $2, jurusan = $3, angkatan = $4 WHERE mahasiswa_id = $5 RETURNING *",
      [nama, nim, jurusan, angkatan, id]
    );
    res.status(200).json({
      status: true,
      message: "Mahasiswa updated successfully.",
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
      "DELETE FROM MasterMahasiswa WHERE mahasiswa_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 1) {
      res.status(200).json({
        status: true,
        message: "Mahasiswa deleted successfully.",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Mahasiswa not found.",
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const destroyAllData = async (req, res) => {
  try {
    await pool.query("DELETE FROM MasterMahasiswa");
    res.status(200).json({
      status: true,
      message: "All Mahasiswa deleted successfully.",
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
