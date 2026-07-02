const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const carController = require('../controllers/carController');
const bookingController = require('../controllers/bookingController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Konfigurasi Multer untuk menangani upload gambar mobil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    // Memberikan nama acak berbasis timestamp agar tidak bentrok
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Hanya perbolehkan file gambar
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(new Error('Hanya diperbolehkan mengupload file gambar (jpg, jpeg, png, webp).'), false);
  },
  limits: { fileSize: 3 * 1024 * 1024 } // Batas ukuran file 3MB
});

// Terapkan middleware proteksi admin ke seluruh route di bawah ini
router.use(requireAdmin);

// =======================================================
// ROUTE DASHBOARD & TRANSAKSI PEMESANAN (ADMIN)
// =======================================================

// Tampilan dashboard utama admin (Overview + daftar semua pemesanan)
router.get('/', bookingController.adminGetDashboard);

// Update status pemesanan (Disetujui/Ditolak/Selesai)
router.post('/bookings/status/:id', bookingController.adminUpdateBookingStatus);

// =======================================================
// ROUTE CRUD DATA MOBIL (ADMIN)
// =======================================================

// Tampilan daftar mobil
router.get('/cars', carController.adminGetCars);

// Tampilan form tambah mobil
router.get('/cars/add', carController.adminGetAddCar);

// Proses form tambah mobil (menggunakan upload single file 'gambar')
router.post('/cars/add', (req, res, next) => {
  upload.single('gambar')(req, res, (err) => {
    if (err) {
      // Jika terjadi error upload (misal: format salah / file terlalu besar)
      return res.redirect(`/admin/cars/add?error=${encodeURIComponent(err.message)}`);
    }
    next();
  });
}, carController.adminPostAddCar);

// Tampilan form edit mobil
router.get('/cars/edit/:id', carController.adminGetEditCar);

// Proses form edit mobil
router.post('/cars/edit/:id', (req, res, next) => {
  upload.single('gambar')(req, res, (err) => {
    if (err) {
      return res.redirect(`/admin/cars/edit/${req.params.id}?error=${encodeURIComponent(err.message)}`);
    }
    next();
  });
}, carController.adminPostEditCar);

// Proses hapus mobil (menggunakan GET agar mudah dipanggil melalui button link)
router.get('/cars/delete/:id', carController.deleteCar || carController.adminDeleteCar);

module.exports = router;
