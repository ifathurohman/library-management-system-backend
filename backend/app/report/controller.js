const pool = require("../../config");

const reportBorrowingHistory = async (req, res) => {
  const {
    nim,
    nama_mahasiswa,
    buku_id,
    nama_buku,
    tanggal_pinjam,
    tanggal_kembali,
    lama_pinjam
  } = req.query;

  try {
    let query = `
      SELECT 
        hm.transaksi_id,
        mm.nim,
        mm.nama AS nama_mahasiswa,
        mb.buku_id,
        mb.judul AS nama_buku,
        hm.tanggal_pinjam,
        hm.tanggal_kembali,
        (hm.tanggal_kembali - hm.tanggal_pinjam) AS lama_pinjam
      FROM 
        HistoryPeminjaman hm
      JOIN 
        MasterMahasiswa mm ON hm.mahasiswa_id = mm.mahasiswa_id
      JOIN 
        MasterBuku mb ON hm.buku_id = mb.buku_id
      WHERE 1=1
    `;

    const params = [];

    if (nim) {
      query += ` AND mm.nim = $${params.length + 1}`;
      params.push(nim);
    }

    if (nama_mahasiswa) {
      query += ` AND mm.nama ILIKE $${params.length + 1}`;
      params.push(`%${nama_mahasiswa}%`);
    }

    if (buku_id) {
      query += ` AND mb.buku_id = $${params.length + 1}`;
      params.push(buku_id);
    }

    if (nama_buku) {
      query += ` AND mb.judul ILIKE $${params.length + 1}`;
      params.push(`%${nama_buku}%`);
    }

    if (tanggal_pinjam) {
      query += ` AND hm.tanggal_pinjam = $${params.length + 1}`;
      params.push(tanggal_pinjam);
    }

    if (tanggal_kembali) {
      query += ` AND hm.tanggal_kembali = $${params.length + 1}`;
      params.push(tanggal_kembali);
    }

    if (lama_pinjam) {
      query += ` AND (hm.tanggal_kembali - hm.tanggal_pinjam) = $${params.length + 1}`;
      params.push(lama_pinjam);
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

module.exports = {
  reportBorrowingHistory,
};
