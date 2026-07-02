const db = require('../config/db');

class Booking {
  // Membuat pemesanan baru (User)
  static async create({ user_id, car_id, tanggal_mulai, tanggal_selesai, total_harga, status = 'Pending' }) {
    const [result] = await db.execute(
      `INSERT INTO bookings (user_id, car_id, tanggal_mulai, tanggal_selesai, total_harga, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, car_id, tanggal_mulai, tanggal_selesai, total_harga, status]
    );
    return result.insertId;
  }

  // Mengambil riwayat pemesanan milik user tertentu
  static async getByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT b.*, c.nama_mobil, c.merek, c.gambar, c.harga_per_hari 
       FROM bookings b
       JOIN cars c ON b.car_id = c.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return rows;
  }

  // Mengambil semua data pemesanan (untuk Admin Dashboard)
  static async getAll() {
    const [rows] = await db.execute(
      `SELECT b.*, 
              u.nama_lengkap AS nama_user, u.username, u.no_telepon,
              c.nama_mobil, c.merek, c.harga_per_hari
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN cars c ON b.car_id = c.id
       ORDER BY b.created_at DESC`
    );
    return rows;
  }

  // Mengambil detail pemesanan berdasarkan ID
  static async getById(id) {
    const [rows] = await db.execute(
      `SELECT b.*, 
              u.nama_lengkap AS nama_user, u.email AS email_user, u.no_telepon,
              c.nama_mobil, c.merek, c.tahun, c.gambar, c.harga_per_hari
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN cars c ON b.car_id = c.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // Mengubah status pemesanan (Admin: Approved, Rejected, Completed)
  static async updateStatus(id, status) {
    const [result] = await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  }
}

module.exports = Booking;
