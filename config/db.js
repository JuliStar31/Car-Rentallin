const mysql = require('mysql2/promise');
require('dotenv').config();

// Membuat connection pool untuk database MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'car_rental',
  waitForConnections: true,
  connectionLimit: 10, // Batas maksimal koneksi simultan
  queueLimit: 0
});

// Verifikasi koneksi saat file ini dimuat pertama kali
pool.getConnection()
  .then(conn => {
    console.log('Koneksi database berhasil! Terhubung ke database: ' + (process.env.DB_NAME || 'car_rental'));
    conn.release();
  })
  .catch(err => {
    console.error('========================================================');
    console.error('Gagal terhubung ke MySQL! Pastikan MySQL Laragon aktif.');
    console.error('Detail Error:', err.message);
    console.error('========================================================');
  });

module.exports = pool;
