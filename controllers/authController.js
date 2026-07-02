const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Menampilkan halaman Register
exports.getRegister = (req, res) => {
  const error = req.query.error || null;
  const success = req.query.success || null;
  res.render('auth/register', { error, success, user: null });
};

// Memproses Register Akun Baru
exports.postRegister = async (req, res) => {
  const { nama_lengkap, email, username, password, confirm_password, no_telepon } = req.body;

  try {
    // Validasi form kosong
    if (!nama_lengkap || !email || !username || !password || !confirm_password || !no_telepon) {
      return res.redirect('/auth/register?error=Semua data harus diisi.');
    }

    // Validasi kecocokan password
    if (password !== confirm_password) {
      return res.redirect('/auth/register?error=Konfirmasi password tidak sesuai.');
    }

    // Cek apakah username sudah ada
    const userExist = await User.findByUsername(username);
    if (userExist) {
      return res.redirect('/auth/register?error=Username sudah digunakan.');
    }

    // Cek apakah email sudah terdaftar
    const emailExist = await User.findByEmail(email);
    if (emailExist) {
      return res.redirect('/auth/register?error=Email sudah terdaftar.');
    }

    // Hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan ke database
    await User.create({
      nama_lengkap,
      email,
      username,
      password: hashedPassword,
      role: 'user', // Default sebagai user biasa
      no_telepon
    });

    return res.redirect('/auth/login?success=Pendaftaran akun berhasil! Silakan login.');
  } catch (err) {
    console.error('Error saat registrasi:', err);
    return res.redirect('/auth/register?error=Gagal mendaftarkan akun. Coba beberapa saat lagi.');
  }
};

// Menampilkan halaman Login
exports.getLogin = (req, res) => {
  const error = req.query.error || null;
  const success = req.query.success || null;
  res.render('auth/login', { error, success, user: null });
};

// Memproses Login Akun
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.redirect('/auth/login?error=Username dan password wajib diisi.');
    }

    // Cari user berdasarkan username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.redirect('/auth/login?error=Username tidak ditemukan.');
    }

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect('/auth/login?error=Password yang Anda masukkan salah.');
    }

    // Masukkan data user ke session
    req.session.user = {
      id: user.id,
      nama_lengkap: user.nama_lengkap,
      username: user.username,
      email: user.email,
      role: user.role
    };

    // Arahkan ke halaman utama sesuai role
    if (user.role === 'admin') {
      return res.redirect('/admin');
    } else {
      return res.redirect('/cars');
    }
  } catch (err) {
    console.error('Error saat login:', err);
    return res.redirect('/auth/login?error=Terjadi kesalahan pada server.');
  }
};

// Memproses Logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error saat logout:', err);
      return res.redirect('/cars?error=Gagal logout.');
    }
    // Arahkan kembali ke halaman login setelah logout
    res.redirect('/auth/login?success=Anda telah berhasil keluar dari sistem.');
  });
};
