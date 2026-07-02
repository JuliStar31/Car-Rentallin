// Middleware untuk melindungi route yang butuh login
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login?error=Silakan login terlebih dahulu.');
  }
  next();
}

// Middleware untuk melindungi route khusus admin
function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login?error=Silakan login terlebih dahulu.');
  }
  if (req.session.user.role !== 'admin') {
    // Jika bukan admin, arahkan kembali ke katalog dengan pesan error
    return res.redirect('/cars?error=Akses ditolak! Anda bukan admin.');
  }
  next();
}

// Middleware untuk mengarahkan user yang sudah login dari halaman login/register
function redirectIfLoggedIn(req, res, next) {
  if (req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin');
    }
    return res.redirect('/cars');
  }
  next();
}

module.exports = {
  requireLogin,
  requireAdmin,
  redirectIfLoggedIn
};
