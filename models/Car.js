const db = require('../config/db');

class Car {
  // Mengambil semua data mobil
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM cars ORDER BY id DESC');
    return rows;
  }

  // Mengambil data mobil berdasarkan ID
  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM cars WHERE id = ?', [id]);
    return rows[0] || null;
  }

  // Menambahkan mobil baru (Admin)
  static async create({ nama_mobil, merek, tahun, harga_per_hari, gambar, status = 'Tersedia' }) {
    const [result] = await db.execute(
      `INSERT INTO cars (nama_mobil, merek, tahun, harga_per_hari, gambar, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama_mobil, merek, tahun, harga_per_hari, gambar, status]
    );
    return result.insertId;
  }

  // Mengedit data mobil (Admin)
  static async update(id, { nama_mobil, merek, tahun, harga_per_hari, gambar, status }) {
    let sql = `UPDATE cars SET nama_mobil = ?, merek = ?, tahun = ?, harga_per_hari = ?, status = ?`;
    let params = [nama_mobil, merek, tahun, harga_per_hari, status];

    // Jika ada gambar baru yang diunggah
    if (gambar) {
      sql += `, gambar = ?`;
      params.push(gambar);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    const [result] = await db.execute(sql, params);
    return result.affectedRows > 0;
  }

  // Menghapus data mobil (Admin)
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM cars WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Mengubah status ketersediaan mobil secara dinamis
  static async updateStatus(id, status) {
    const [result] = await db.execute('UPDATE cars SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  }
}

module.exports = Car;
