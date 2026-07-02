const Booking = require('../models/Booking');
const Car = require('../models/Car');

// [USER] Memproses pembuatan booking baru
exports.postBooking = async (req, res) => {
  const { car_id, tanggal_mulai, tanggal_selesai } = req.body;
  const user_id = req.session.user.id;

  try {
    if (!car_id || !tanggal_mulai || !tanggal_selesai) {
      return res.redirect(`/cars/detail/${car_id}?error=Tanggal sewa harus diisi dengan lengkap.`);
    }

    // Cek detail mobil
    const car = await Car.getById(car_id);
    if (!car) {
      return res.redirect('/cars?error=Mobil tidak ditemukan.');
    }

    // Pastikan mobil berstatus Tersedia
    if (car.status !== 'Tersedia') {
      return res.redirect(`/cars/detail/${car_id}?error=Mobil saat ini tidak tersedia untuk disewa.`);
    }

    const start = new Date(tanggal_mulai);
    const end = new Date(tanggal_selesai);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validasi tanggal
    if (start < today) {
      return res.redirect(`/cars/detail/${car_id}?error=Tanggal mulai tidak boleh di hari kemarin.`);
    }
    if (end < start) {
      return res.redirect(`/cars/detail/${car_id}?error=Tanggal selesai tidak boleh mendahului tanggal mulai.`);
    }

    // Hitung perbedaan hari (durasi sewa)
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24))); // Minimal sewa 1 hari

    const total_harga = dayDiff * parseFloat(car.harga_per_hari);

    // Simpan data pemesanan
    await Booking.create({
      user_id,
      car_id,
      tanggal_mulai,
      tanggal_selesai,
      total_harga,
      status: 'Pending'
    });

    return res.redirect('/bookings?success=Pemesanan berhasil dibuat! Silakan tunggu konfirmasi persetujuan admin.');
  } catch (err) {
    console.error('Error saat membuat booking:', err);
    return res.redirect(`/cars/detail/${car_id}?error=Terjadi kesalahan saat memproses pemesanan.`);
  }
};

// [USER] Menampilkan riwayat pemesanan sendiri
exports.getBookings = async (req, res) => {
  const userId = req.session.user.id;
  try {
    const bookings = await Booking.getByUserId(userId);
    const success = req.query.success || null;
    const error = req.query.error || null;
    
    return res.render('user/bookings', { 
      bookings, 
      success, 
      error, 
      user: req.session.user 
    });
  } catch (err) {
    console.error('Error saat memuat riwayat booking:', err);
    return res.status(500).send('Gagal memuat riwayat pemesanan.');
  }
};

// =======================================================
// CONTROLLER KHUSUS ADMIN (MANAJEMEN PEMESANAN & STATS)
// =======================================================

// [ADMIN] Menampilkan halaman dashboard utama admin
exports.adminGetDashboard = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    const cars = await Car.getAll();

    // Kalkulasi data statistik untuk Dashboard
    const totalCars = cars.length;
    const totalBookings = bookings.length;
    
    // Pendapatan dihitung dari booking yang berstatus 'Disetujui' atau 'Selesai'
    const totalRevenue = bookings
      .filter(b => b.status === 'Disetujui' || b.status === 'Selesai')
      .reduce((total, b) => total + parseFloat(b.total_harga), 0);

    // Hitung jumlah pelanggan aktif (unik berdasarkan user_id)
    const uniqueUsersCount = new Set(bookings.map(b => b.user_id)).size;

    const error = req.query.error || null;
    const success = req.query.success || null;

    return res.render('admin/dashboard', {
      bookings,
      stats: {
        totalCars,
        totalBookings,
        totalRevenue,
        uniqueUsers: uniqueUsersCount
      },
      error,
      success,
      user: req.session.user
    });
  } catch (err) {
    console.error('Error saat memuat dashboard admin:', err);
    return res.status(500).send('Gagal memuat halaman dashboard admin.');
  }
};

// [ADMIN] Memproses perubahan status pemesanan
exports.adminUpdateBookingStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body; // status baru: Pending, Disetujui, Ditolak, Selesai

  try {
    const booking = await Booking.getById(id);
    if (!booking) {
      return res.redirect('/admin?error=Pemesanan tidak ditemukan.');
    }

    // Ubah status booking di tabel bookings
    await Booking.updateStatus(id, status);

    // Aturan ketersediaan mobil otomatis berdasarkan status sewa
    if (status === 'Disetujui') {
      // Jika sewa disetujui, mobil menjadi "Tidak Tersedia"
      await Car.updateStatus(booking.car_id, 'Tidak Tersedia');
    } else if (status === 'Selesai' || status === 'Ditolak') {
      // Jika sewa selesai atau ditolak, mobil menjadi "Tersedia" kembali
      await Car.updateStatus(booking.car_id, 'Tersedia');
    }

    return res.redirect(`/admin?success=Status pemesanan #${id} berhasil diubah menjadi: ${status}.`);
  } catch (err) {
    console.error('Error saat mengubah status booking:', err);
    return res.redirect('/admin?error=Gagal mengubah status pemesanan.');
  }
};
