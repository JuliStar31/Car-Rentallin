document.addEventListener('DOMContentLoaded', () => {
  // Ambil elemen untuk kalkulator harga sewa otomatis di halaman detail mobil
  const tglMulaiInput = document.getElementById('tanggal_mulai');
  const tglSelesaiInput = document.getElementById('tanggal_selesai');
  const durationText = document.getElementById('duration-text');
  const totalHargaText = document.getElementById('total-harga-text');
  const bookingSubmitBtn = document.getElementById('booking-submit-btn');
  const hargaPerHariInput = document.getElementById('harga_per_hari');

  if (tglMulaiInput && tglSelesaiInput && durationText && totalHargaText && hargaPerHariInput) {
    const hargaPerHari = parseFloat(hargaPerHariInput.value);

    // Batasi tanggal minimal input adalah hari ini
    const hariIni = new Date().toISOString().split('T')[0];
    tglMulaiInput.setAttribute('min', hariIni);
    tglSelesaiInput.setAttribute('min', hariIni);

    function kalkulasiTotalSewa() {
      const startVal = tglMulaiInput.value;
      const endVal = tglSelesaiInput.value;

      if (startVal && endVal) {
        const start = new Date(startVal);
        const end = new Date(endVal);

        // Validasi: tanggal selesai tidak boleh mendahului tanggal mulai
        if (end < start) {
          durationText.innerHTML = '<span class="text-danger font-weight-bold">Tanggal selesai tidak valid!</span>';
          totalHargaText.innerText = 'Rp 0';
          if (bookingSubmitBtn) bookingSubmitBtn.disabled = true;
          return;
        }

        // Hitung durasi hari
        const timeDiff = end.getTime() - start.getTime();
        const dayDiff = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24))); // Minimal sewa 1 hari

        // Hitung total biaya
        const totalBiaya = dayDiff * hargaPerHari;

        // Format mata uang Rupiah (IDR)
        const formattedBiaya = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(totalBiaya);

        durationText.innerHTML = `Durasi sewa: <strong class="text-info">${dayDiff} Hari</strong>`;
        totalHargaText.innerText = formattedBiaya;
        if (bookingSubmitBtn) bookingSubmitBtn.disabled = false;
      } else {
        durationText.innerHTML = 'Durasi sewa: -';
        totalHargaText.innerText = 'Rp 0';
        if (bookingSubmitBtn) bookingSubmitBtn.disabled = true;
      }
    }

    // Saat tanggal mulai diubah, ubah juga batas minimal tanggal selesai
    tglMulaiInput.addEventListener('change', () => {
      tglSelesaiInput.setAttribute('min', tglMulaiInput.value);
      kalkulasiTotalSewa();
    });

    tglSelesaiInput.addEventListener('change', kalkulasiTotalSewa);
  }

  // Efek Auto-close Alert (Flash Messages) setelah 5 detik
  const alerts = document.querySelectorAll('.alert-dismissible');
  alerts.forEach(alert => {
    setTimeout(() => {
      // Pastikan class bootstrap Alert aktif
      const bsAlert = bootstrap.Alert.getInstance(alert) || new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  });
});
