-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               PostgreSQL 16.3, compiled by Visual C++ build 1938, 64-bit
-- Server OS:                    
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table public.detailtransaksipeminjaman
CREATE TABLE IF NOT EXISTS "detailtransaksipeminjaman" (
	"detail_id" SERIAL NOT NULL,
	"transaksi_id" INTEGER NULL DEFAULT NULL,
	"buku_id" INTEGER NULL DEFAULT NULL,
	"jumlah" INTEGER NOT NULL,
	PRIMARY KEY ("detail_id"),
	CONSTRAINT "detailtransaksipeminjaman_buku_id_fkey" FOREIGN KEY ("buku_id") REFERENCES "masterbuku" ("buku_id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "detailtransaksipeminjaman_transaksi_id_fkey" FOREIGN KEY ("transaksi_id") REFERENCES "transaksipeminjaman" ("transaksi_id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Dumping data for table public.detailtransaksipeminjaman: 4 rows
/*!40000 ALTER TABLE "detailtransaksipeminjaman" DISABLE KEYS */;
INSERT INTO "detailtransaksipeminjaman" ("detail_id", "transaksi_id", "buku_id", "jumlah") VALUES
	(52, 49, 11, 1),
	(53, 49, 12, 1),
	(54, 50, 11, 1),
	(55, 50, 12, 1);
/*!40000 ALTER TABLE "detailtransaksipeminjaman" ENABLE KEYS */;

-- Dumping structure for table public.historypeminjaman
CREATE TABLE IF NOT EXISTS "historypeminjaman" (
	"history_id" SERIAL NOT NULL,
	"transaksi_id" INTEGER NULL DEFAULT NULL,
	"mahasiswa_id" INTEGER NULL DEFAULT NULL,
	"buku_id" INTEGER NULL DEFAULT NULL,
	"tanggal_pinjam" DATE NOT NULL,
	"tanggal_kembali" DATE NULL DEFAULT NULL,
	"status" VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY ("history_id"),
	CONSTRAINT "historypeminjaman_buku_id_fkey" FOREIGN KEY ("buku_id") REFERENCES "masterbuku" ("buku_id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "historypeminjaman_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mastermahasiswa" ("mahasiswa_id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "historypeminjaman_transaksi_id_fkey" FOREIGN KEY ("transaksi_id") REFERENCES "transaksipeminjaman" ("transaksi_id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Dumping data for table public.historypeminjaman: 4 rows
/*!40000 ALTER TABLE "historypeminjaman" DISABLE KEYS */;
INSERT INTO "historypeminjaman" ("history_id", "transaksi_id", "mahasiswa_id", "buku_id", "tanggal_pinjam", "tanggal_kembali", "status") VALUES
	(44, 49, 34, 11, '2024-05-30', '2024-06-13', 'Pinjam'),
	(45, 49, 34, 12, '2024-05-30', '2024-06-13', 'Pinjam'),
	(46, 50, 36, 11, '2024-05-30', '2024-06-13', 'Pinjam'),
	(47, 50, 36, 12, '2024-05-30', '2024-06-13', 'Pinjam');
/*!40000 ALTER TABLE "historypeminjaman" ENABLE KEYS */;

-- Dumping structure for table public.inventorystokbuku
CREATE TABLE IF NOT EXISTS "inventorystokbuku" (
	"stok_id" SERIAL NOT NULL,
	"buku_id" INTEGER NULL DEFAULT NULL,
	"rak_id" INTEGER NULL DEFAULT NULL,
	"jumlah" INTEGER NOT NULL,
	PRIMARY KEY ("stok_id"),
	UNIQUE INDEX "unique_buku_rak" ("buku_id", "rak_id"),
	CONSTRAINT "inventorystokbuku_buku_id_fkey" FOREIGN KEY ("buku_id") REFERENCES "masterbuku" ("buku_id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "inventorystokbuku_rak_id_fkey" FOREIGN KEY ("rak_id") REFERENCES "rakbuku" ("rak_id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Dumping data for table public.inventorystokbuku: 2 rows
/*!40000 ALTER TABLE "inventorystokbuku" DISABLE KEYS */;
INSERT INTO "inventorystokbuku" ("stok_id", "buku_id", "rak_id", "jumlah") VALUES
	(9, 12, 4, 8),
	(8, 11, 3, 13);
/*!40000 ALTER TABLE "inventorystokbuku" ENABLE KEYS */;

-- Dumping structure for table public.masterbuku
CREATE TABLE IF NOT EXISTS "masterbuku" (
	"buku_id" SERIAL NOT NULL,
	"judul" VARCHAR(255) NOT NULL,
	"penulis" VARCHAR(255) NULL DEFAULT NULL,
	"penerbit" VARCHAR(255) NULL DEFAULT NULL,
	"tahun_terbit" INTEGER NULL DEFAULT NULL,
	"isbn" VARCHAR(20) NULL DEFAULT NULL,
	PRIMARY KEY ("buku_id"),
	UNIQUE INDEX "masterbuku_isbn_key" ("isbn")
);

-- Dumping data for table public.masterbuku: 2 rows
/*!40000 ALTER TABLE "masterbuku" DISABLE KEYS */;
INSERT INTO "masterbuku" ("buku_id", "judul", "penulis", "penerbit", "tahun_terbit", "isbn") VALUES
	(11, 'To Kill a Mockingbird', 'Harper Lee', 'J. B. Lippincott & Co.', 1960, '9780061120084'),
	(12, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Scribner', 1925, '9780743273565');
/*!40000 ALTER TABLE "masterbuku" ENABLE KEYS */;

-- Dumping structure for table public.mastermahasiswa
CREATE TABLE IF NOT EXISTS "mastermahasiswa" (
	"mahasiswa_id" SERIAL NOT NULL,
	"nama" VARCHAR(255) NOT NULL,
	"nim" VARCHAR(20) NOT NULL,
	"jurusan" VARCHAR(100) NULL DEFAULT NULL,
	"angkatan" INTEGER NULL DEFAULT NULL,
	"status" VARCHAR(20) NULL DEFAULT 'aktif',
	PRIMARY KEY ("mahasiswa_id"),
	UNIQUE INDEX "mastermahasiswa_nim_key" ("nim")
);

-- Dumping data for table public.mastermahasiswa: 2 rows
/*!40000 ALTER TABLE "mastermahasiswa" DISABLE KEYS */;
INSERT INTO "mastermahasiswa" ("mahasiswa_id", "nama", "nim", "jurusan", "angkatan", "status") VALUES
	(34, 'test', '182355124', 'teknik informatika', 2020, 'aktif'),
	(36, 'lorem123', '812636512', 'teknik informatika', 2022, 'aktif');
/*!40000 ALTER TABLE "mastermahasiswa" ENABLE KEYS */;

-- Dumping structure for table public.rakbuku
CREATE TABLE IF NOT EXISTS "rakbuku" (
	"rak_id" SERIAL NOT NULL,
	"lokasi_rak" VARCHAR(100) NOT NULL,
	PRIMARY KEY ("rak_id")
);

-- Dumping data for table public.rakbuku: 2 rows
/*!40000 ALTER TABLE "rakbuku" DISABLE KEYS */;
INSERT INTO "rakbuku" ("rak_id", "lokasi_rak") VALUES
	(3, 'B2'),
	(4, 'A1');
/*!40000 ALTER TABLE "rakbuku" ENABLE KEYS */;

-- Dumping structure for table public.transaksipeminjaman
CREATE TABLE IF NOT EXISTS "transaksipeminjaman" (
	"transaksi_id" SERIAL NOT NULL,
	"mahasiswa_id" INTEGER NULL DEFAULT NULL,
	"tanggal_pinjam" DATE NOT NULL,
	"tanggal_kembali" DATE NULL DEFAULT NULL,
	PRIMARY KEY ("transaksi_id"),
	CONSTRAINT "transaksipeminjaman_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mastermahasiswa" ("mahasiswa_id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Dumping data for table public.transaksipeminjaman: 2 rows
/*!40000 ALTER TABLE "transaksipeminjaman" DISABLE KEYS */;
INSERT INTO "transaksipeminjaman" ("transaksi_id", "mahasiswa_id", "tanggal_pinjam", "tanggal_kembali") VALUES
	(49, 34, '2024-05-30', '2024-06-13'),
	(50, 36, '2024-05-30', '2024-06-13');
/*!40000 ALTER TABLE "transaksipeminjaman" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
