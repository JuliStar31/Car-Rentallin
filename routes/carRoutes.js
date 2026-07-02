const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { requireLogin } = require('../middleware/authMiddleware');

// Katalog Mobil (Dashboard User)
router.get('/', requireLogin, carController.getCars);

// Detail Mobil
router.get('/detail/:id', requireLogin, carController.getCarDetail);

module.exports = router;
