# Library Management System API
This API manages library transactions including managing books, borrowing books, and returning books. It is built using Node.js and PostgreSQL.

## Database Schema

### MasterBuku

| Column        | Type    | Constraints        |
| ------------- | ------- | ------------------ |
| buku_id       | SERIAL  | PRIMARY KEY        |
| judul         | TEXT    | NOT NULL           |
| penulis       | TEXT    | NOT NULL           |
| penerbit      | TEXT    | NOT NULL           |
| tahun_terbit  | INTEGER | NOT NULL           |
| isbn          | TEXT    | UNIQUE, NOT NULL   |

### RakBuku

| Column    | Type    | Constraints |
| --------- | ------- | ----------- |
| rak_id    | SERIAL  | PRIMARY KEY |
| lokasi_rak| TEXT    | NOT NULL    |

### InventoryStokBuku

| Column    | Type    | Constraints  |
| --------- | ------- | ------------ |
| buku_id   | INTEGER | FOREIGN KEY  |
| rak_id    | INTEGER | FOREIGN KEY  |
| jumlah    | INTEGER | NOT NULL     |

### MasterMahasiswa

| Column        | Type    | Constraints        |
| ------------- | ------- | ------------------ |
| mahasiswa_id  | SERIAL  | PRIMARY KEY        |
| nama          | TEXT    | NOT NULL           |
| nim           | TEXT    | UNIQUE, NOT NULL   |
| jurusan       | TEXT    | NOT NULL           |
| angkatan      | INTEGER | NOT NULL           |
| status        | TEXT    | NOT NULL           |

### TransaksiPeminjaman

| Column          | Type    | Constraints  |
| --------------- | ------- | ------------ |
| transaksi_id    | SERIAL  | PRIMARY KEY  |
| mahasiswa_id    | INTEGER | FOREIGN KEY  |
| tanggal_pinjam  | DATE    | NOT NULL     |
| tanggal_kembali | DATE    | NOT NULL     |

### DetailTransaksiPeminjaman

| Column          | Type    | Constraints |
| --------------- | ------- | ----------- |
| transaksi_id    | INTEGER | FOREIGN KEY |
| buku_id         | INTEGER | FOREIGN KEY |
| jumlah          | INTEGER | NOT NULL    |

### HistoryPeminjaman

| Column          | Type    | Constraints |
| --------------- | ------- | ----------- |
| transaksi_id    | INTEGER | FOREIGN KEY |
| mahasiswa_id    | INTEGER | FOREIGN KEY |
| buku_id         | INTEGER | FOREIGN KEY |
| tanggal_pinjam  | DATE    | NOT NULL    |
| tanggal_kembali | DATE    | NOT NULL    |
| status          | TEXT    | NOT NULL    |

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up the PostgreSQL database and update the configuration in `.env`.
4. Execute database.sql
4. Run the server using `npm run start`.
