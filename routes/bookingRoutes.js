const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireLogin } = require('../middleware/authMiddleware');

// Riwayat Pemesanan User
router.get('/', requireLogin, bookingController.getBookings);

// Proses Mengajukan Pemesanan
router.post('/add', requireLogin, bookingController.postBooking);

module.exports = router;
