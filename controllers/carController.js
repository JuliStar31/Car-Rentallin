const Car = require('../models/Car');
const fs = require('fs');
const path = require('path');

// [USER] Melihat daftar mobil di katalog
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.getAll();
    const error = req.query.error || null;
    const success = req.query.success || null;
    
    return res.render('user/dashboard', { 
      cars, 
      error, 
      success, 
      user: req.session.user 
    });
  } catch (err) {
    console.error('Error saat memuat daftar mobil:', err);
    return res.status(500).send('Terjadi kesalahan pada server.');
  }
};

// [USER] Melihat detail mobil dan memesan
exports.getCarDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const car = await Car.getById(id);
    if (!car) {
      return res.redirect('/cars?error=Mobil tidak ditemukan.');
    }
    
    const error = req.query.error || null;
    const success = req.query.success || null;
    
    return res.render('user/car-detail', { 
      car, 
      error, 
      success, 
      user: req.session.user 
    });
  } catch (err) {
    console.error('Error saat memuat detail mobil:', err);
    return res.redirect('/cars?error=Gagal memuat detail mobil.');
  }
};

// =======================================================
// CONTROLLER KHUSUS ADMIN (CRUD MOBIL)
// =======================================================

// [ADMIN] Menampilkan daftar mobil di panel admin
exports.adminGetCars = async (req, res) => {
  try {
    const cars = await Car.getAll();
    const error = req.query.error || null;
    const success = req.query.success || null;
    
    return res.render('admin/cars/index', { 
      cars, 
      error, 
      success, 
      user: req.session.user 
    });
  } catch (err) {
    console.error('Error admin get cars:', err);
    return res.redirect('/admin?error=Gagal memuat daftar mobil.');
  }
};

// [ADMIN] Menampilkan halaman tambah mobil
exports.adminGetAddCar = (req, res) => {
  const error = req.query.error || null;
  return res.render('admin/cars/add', { 
    error, 
    user: req.session.user 
  });
};

// [ADMIN] Memproses penambahan mobil
exports.adminPostAddCar = async (req, res) => {
  const { nama_mobil, merek, tahun, harga_per_hari, status } = req.body;
  const fileGambar = req.file;

  try {
    if (!nama_mobil || !merek || !tahun || !harga_per_hari) {
      // Hapus file yang sudah diunggah jika validasi gagal
      if (fileGambar) {
        fs.unlinkSync(fileGambar.path);
      }
      return res.redirect('/admin/cars/add?error=Semua data kecuali gambar wajib diisi.');
    }

    // Gunakan nama file yang diunggah, jika tidak ada, gunakan default-car.jpg
    const namaGambar = fileGambar ? fileGambar.filename : 'default-car.jpg';

    await Car.create({
      nama_mobil,
      merek,
      tahun: parseInt(tahun),
      harga_per_hari: parseFloat(harga_per_hari),
      gambar: namaGambar,
      status: status || 'Tersedia'
    });

    return res.redirect('/admin/cars?success=Mobil berhasil ditambahkan ke sistem.');
  } catch (err) {
    console.error('Error saat tambah mobil:', err);
    if (fileGambar) {
      fs.unlinkSync(fileGambar.path);
    }
    return res.redirect('/admin/cars/add?error=Terjadi kesalahan saat menambahkan data mobil.');
  }
};

// [ADMIN] Menampilkan halaman edit mobil
exports.adminGetEditCar = async (req, res) => {
  const id = req.params.id;
  try {
    const car = await Car.getById(id);
    if (!car) {
      return res.redirect('/admin/cars?error=Mobil tidak ditemukan.');
    }
    
    const error = req.query.error || null;
    return res.render('admin/cars/edit', { 
      car, 
      error, 
      user: req.session.user 
    });
  } catch (err) {
    console.error('Error admin edit view:', err);
    return res.redirect('/admin/cars?error=Gagal memuat halaman edit.');
  }
};

// [ADMIN] Memproses edit mobil
exports.adminPostEditCar = async (req, res) => {
  const id = req.params.id;
  const { nama_mobil, merek, tahun, harga_per_hari, status } = req.body;
  const fileGambar = req.file;

  try {
    const car = await Car.getById(id);
    if (!car) {
      if (fileGambar) fs.unlinkSync(fileGambar.path);
      return res.redirect('/admin/cars?error=Mobil tidak ditemukan.');
    }

    if (!nama_mobil || !merek || !tahun || !harga_per_hari || !status) {
      if (fileGambar) fs.unlinkSync(fileGambar.path);
      return res.redirect(`/admin/cars/edit/${id}?error=Semua data wajib diisi.`);
    }

    const updateData = {
      nama_mobil,
      merek,
      tahun: parseInt(tahun),
      harga_per_hari: parseFloat(harga_per_hari),
      status
    };

    if (fileGambar) {
      updateData.gambar = fileGambar.filename;
      
      // Hapus gambar lama dari server jika bukan gambar default bawaan seed
      const defaultImages = ['default-car.jpg', 'avanza.jpg', 'civic.jpg', 'xpander.jpg', 'brio.jpg'];
      if (car.gambar && !defaultImages.includes(car.gambar)) {
        const oldImagePath = path.join(__dirname, '../public/uploads', car.gambar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    await Car.update(id, updateData);
    return res.redirect('/admin/cars?success=Mobil berhasil diupdate.');
  } catch (err) {
    console.error('Error saat edit mobil:', err);
    if (fileGambar) fs.unlinkSync(fileGambar.path);
    return res.redirect(`/admin/cars/edit/${id}?error=Terjadi kesalahan saat mengupdate data.`);
  }
};

// [ADMIN] Memproses penghapusan mobil
exports.adminDeleteCar = async (req, res) => {
  const id = req.params.id;
  try {
    const car = await Car.getById(id);
    if (!car) {
      return res.redirect('/admin/cars?error=Mobil tidak ditemukan.');
    }

    // Hapus file gambar dari server jika bukan gambar default bawaan seed
    const defaultImages = ['default-car.jpg', 'avanza.jpg', 'civic.jpg', 'xpander.jpg', 'brio.jpg'];
    if (car.gambar && !defaultImages.includes(car.gambar)) {
      const imagePath = path.join(__dirname, '../public/uploads', car.gambar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Car.delete(id);
    return res.redirect('/admin/cars?success=Mobil berhasil dihapus.');
  } catch (err) {
    console.error('Error saat hapus mobil:', err);
    return res.redirect('/admin/cars?error=Gagal menghapus data mobil.');
  }
};
