const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Inisialisasi Express
const app = express();

// Konfigurasi Port
const PORT = process.env.PORT || 3000;

// Pastikan folder uploads tersedia untuk upload gambar mobil
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set EJS sebagai view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pembaca request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan folder public secara statis
app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'rentalkar_super_secret_key_123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // Session aktif selama 2 jam
      secure: false // Set true jika menggunakan HTTPS
    }
  })
);

// Middleware global untuk menyisipkan data session user ke file view EJS secara otomatis
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Import Router
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Pasang Router ke Path Utama
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);

// Route Halaman Root: Mengalihkan sesuai status login
app.get('/', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin');
    }
    return res.redirect('/cars');
  }
  // Jika belum login, alihkan ke login
  return res.redirect('/auth/login');
});

// Handler 404 (Halaman Tidak Ditemukan) dengan visual premium
app.use((req, res, next) => {
  res.status(404).render('auth/login', {
    error: 'Halaman yang Anda tuju tidak ditemukan (404).',
    success: null,
    user: null
  });
});

// Handler Error Server (500)
app.use((err, req, res, next) => {
  console.error('Server Internal Error:', err);
  res.status(500).send('Terjadi kesalahan internal pada server kami.');
});

// Menjalankan Server
app.listen(PORT, () => {
  console.log('========================================================');
  console.log(`Server Rental Mobil berjalan aktif di localhost:${PORT}`);
  console.log(`Buka browser: http://localhost:${PORT}`);
  console.log('========================================================');
});
