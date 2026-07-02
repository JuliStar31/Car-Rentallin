const db = require('../config/db');

class User {
  // Membuat user baru (untuk registrasi)
  static async create({ nama_lengkap, email, username, password, role = 'user', no_telepon }) {
    const [result] = await db.execute(
      `INSERT INTO users (nama_lengkap, email, username, password, role, no_telepon) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama_lengkap, email, username, password, role, no_telepon]
    );
    return result.insertId;
  }

  // Mencari user berdasarkan username (untuk login)
  static async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  }

  // Mencari user berdasarkan email (validasi keunikan email)
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  // Mencari user berdasarkan ID
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, nama_lengkap, email, username, role, no_telepon, created_at FROM users WHERE id = ?', 
      [id]
    );
    return rows[0] || null;
  }
}

module.exports = User;
