# Pertemuan-Pemrograman-web
# Daftar Kegiatan

Aplikasi pengelola tugas sederhana berbasis HTML, CSS, dan JavaScript murni (tanpa framework dan tanpa instalasi). Data tersimpan otomatis di peramban.

## Fitur

- Tambah tugas dengan nama, kategori, prioritas, dan tenggat waktu
- Tandai tugas selesai dengan kotak centang
- Hapus satu tugas, atau hapus semua tugas yang sudah selesai
- Cari tugas berdasarkan nama atau kategori
- Filter: Semua, Belum selesai, Selesai, Terlambat
- Urutan otomatis: belum selesai di atas, lalu tenggat terdekat, lalu prioritas
- Penanda merah untuk tugas yang melewati tenggat
- Ringkasan statistik dan bar progres penyelesaian
- Data tersimpan di `localStorage`, jadi tidak hilang saat halaman di-refresh
- Tampilan responsif untuk layar ponsel dan desktop

## Struktur Proyek

```
daftar-kegiatan/
├── index.html   # Struktur halaman
├── style.css    # Tampilan
├── script.js    # Logika aplikasi
└── README.md    # Dokumentasi
```

## Cara Menjalankan

1. Ekstrak file zip (jangan membuka `index.html` langsung dari dalam zip).
2. Pastikan `index.html`, `style.css`, dan `script.js` berada di folder yang sama.
3. Buka `index.html` di peramban (Chrome, Edge, Firefox, dll.).

## Cara Pakai

1. Isi formulir **Tambah Tugas**, lalu klik **+ Tambahkan Tugas**.
2. Centang kotak di kiri tugas untuk menandainya selesai.
3. Klik **Hapus** untuk menghapus satu tugas.
4. Gunakan kolom pencarian dan menu filter untuk menemukan tugas tertentu.

## Pemecahan Masalah

**Tugas tidak masuk ke daftar**
- Pastikan file JavaScript bernama `script.js` dan satu folder dengan `index.html`.
- Tekan `F12`, buka tab **Console**, lalu refresh dengan `Ctrl+F5`. Pesan error merah menunjukkan file yang gagal dimuat.

**Data hilang**
- Data disimpan per peramban. Menghapus data situs (cache/cookies), memakai mode penyamaran, atau berganti peramban akan membuat data tidak terlihat.

## Teknologi

- HTML5
- CSS3 (CSS Variables, Grid, Flexbox)
- JavaScript (ES6+)
- `localStorage` untuk penyimpanan data
- Font Inter dari Google Fonts (perlu internet; jika offline, font bawaan sistem dipakai)

## Pengembangan Lanjutan

- Edit tugas
- Mode gelap
- Ekspor dan impor data
- Pengingat tenggat waktu

