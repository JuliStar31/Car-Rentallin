const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfLoggedIn } = require('../middleware/authMiddleware');

// Route Registrasi Akun
router.get('/register', redirectIfLoggedIn, authController.getRegister);
router.post('/register', redirectIfLoggedIn, authController.postRegister);

// Route Login
router.get('/login', redirectIfLoggedIn, authController.getLogin);
router.post('/login', redirectIfLoggedIn, authController.postLogin);

// Route Logout
router.get('/logout', authController.logout);

module.exports = router;
