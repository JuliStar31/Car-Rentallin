Halo! Ini file website Sistem Penyewaan Mobil (Node.js + Express + MySQL) untuk tugas kita. 

Berikut cara pasang dan menjalankannya di laptop kamu:

*1. Ekstrak File Proyek*
Ekstrak file ZIP ini ke folder `www` Laragon kamu. 
Lokasi standarnya di:
👉 `C:\laragon\www\car-rental-system`

*2. Setup Database (MySQL)*
- Buka aplikasi Laragon, lalu klik *"Start All"*.
- Buka database phpMyAdmin di browser: `http://localhost/phpmyadmin`
- Buat database baru dengan nama: `car_rental`
- Klik database `car_rental`, pilih menu *"Import"* di atas.
- Klik *"Choose File"*, pilih file SQL skema yang ada di folder proyek:
  `C:\laragon\www\car-rental-system\database\schema.sql`
- Scroll ke bawah, klik *"Import"* / *"Go"* / *"Kirim"*.

*3. Jalankan Aplikasi Node.js*
- Di aplikasi Laragon, klik tombol *"Terminal"*.
- Masuk ke folder proyek dengan mengetik perintah berikut (lalu Enter):
  `cd C:\laragon\www\car-rental-system`
- Instal library pendukung dengan mengetik perintah (lalu Enter):
  `npm install`
  (Tunggu download selesai sekitar 10-20 detik)
- Jalankan website dengan mengetik perintah (lalu Enter):
  `npm run dev`

*4. Buka di Browser*
Buka browser kamu lalu akses alamat:
👉 `http://localhost:3000`

---
*🔑 AKUN UJI COBA (LOGIN):*
* Akun Admin (Bisa CRUD Mobil & Ubah Status Sewa)
  - Username: `admin`
  - Password: `admin123`
* Akun User (Penyewa Mobil)
  - Username: `user`
  - Password: `user123`
---

Petunjuk lengkap ini juga ada di dalam file *README.txt* di folder proyek. Selamat mencoba!
