-- Membuat database car_rental jika belum ada
CREATE DATABASE IF NOT EXISTS `car_rental`;
USE `car_rental`;

-- =======================================================
-- 1. TABEL USERS
-- =======================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `no_telepon` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================
-- 2. TABEL CARS (MOBIL)
-- =======================================================
CREATE TABLE IF NOT EXISTS `cars` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_mobil` VARCHAR(100) NOT NULL,
  `merek` VARCHAR(50) NOT NULL,
  `tahun` INT NOT NULL,
  `harga_per_hari` DECIMAL(10, 2) NOT NULL,
  `gambar` VARCHAR(255) NOT NULL, -- Menyimpan nama file gambar yang diupload
  `status` ENUM('Tersedia', 'Tidak Tersedia') DEFAULT 'Tersedia'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================
-- 3. TABEL BOOKINGS (PEMESANAN)
-- =======================================================
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `car_id` INT NOT NULL,
  `tanggal_mulai` DATE NOT NULL,
  `tanggal_selesai` DATE NOT NULL,
  `total_harga` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('Pending', 'Disetujui', 'Ditolak', 'Selesai') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================
-- SEED DATA (DATA AWAL)
-- =======================================================

-- Masukkan Data User Awal (Password telah di-hash dengan bcrypt, rounds: 10)
-- Password untuk admin: 'admin123'
-- Password untuk user: 'user123'
INSERT INTO `users` (`nama_lengkap`, `email`, `username`, `password`, `role`, `no_telepon`) VALUES
('Administrator Utama', 'admin@rental.com', 'admin', '$2a$10$UxJADbx5QfYsU5juAZW/JuhmMecsqBWkgHU/IJm778BdDSEG8iGBW', 'admin', '081234567890'),
('Budi Setiawan', 'budi@gmail.com', 'user', '$2a$10$NUbbjE3vvaIp/OD1PeZeO./xqifFeE/t9xN6T68B7zk/I7977G20q', 'user', '089876543210')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Masukkan Data Mobil Awal
INSERT INTO `cars` (`nama_mobil`, `merek`, `tahun`, `harga_per_hari`, `gambar`, `status`) VALUES
('Avanza Veloz', 'Toyota', 2022, 350000.00, 'avanza.jpg', 'Tersedia'),
('Civic RS', 'Honda', 2023, 750000.00, 'civic.jpg', 'Tersedia'),
('Xpander Ultimate', 'Mitsubishi', 2021, 400000.00, 'xpander.jpg', 'Tersedia'),
('Brio Satya', 'Honda', 2020, 250000.00, 'brio.jpg', 'Tidak Tersedia')
ON DUPLICATE KEY UPDATE `id`=`id`;
