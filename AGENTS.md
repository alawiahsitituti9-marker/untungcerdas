# AGENTS.md — Pedoman untuk AI dan Pengembang MathSave

Baca file ini sebelum mengubah apa pun di repositori.

## 1. Gambaran Umum Proyek

MathSave adalah aplikasi web responsif (nyaman di HP Android) untuk siswa SMP Kelas VIII–IX. Aplikasi ini membantu siswa mempelajari ulang **Persentase Untung dan Rugi** (Aritmetika Sosial). Desain pembelajarannya berbasis **Cognitive Load Theory** dan bertujuan meningkatkan **Mathematical Literacy**. Model pengembangan: **ADDIE**.

Sumber kebenaran:

| Hal | File |
|---|---|
| Kebutuhan, fitur, prioritas | [docs/PRD.md](docs/PRD.md) |
| Antarmuka, alur, komponen | [docs/design.md](docs/design.md) |
| Sistem, folder, keamanan | [docs/architecture.md](docs/architecture.md) |
| Endpoint dan data | [docs/api.md](docs/api.md) |
| Pekerjaan dan status | [docs/task.md](docs/task.md) |
| Soal, rubrik, dan alur F14 Literasi Matematis | [docs/konten/D-08_literasi_matematis.md](docs/konten/D-08_literasi_matematis.md) |
| Data wawancara (sumber primer) | `referensi/Instrumen_Wawancara_ADDIE_Persentase_untung_dan_rugi_PDF (1).docx` |

## 2. Status dan Gerbang Persetujuan

- Dokumentasi disetujui pada 11 November 2026 (task.md A-05, D-01, D-02, D-06). Coding hanya dimulai setelah pemilik proyek memberi perintah untuk memulai Development.
- Keputusan K-01 sampai K-10 ada di PRD §13. Butir bertanda **[Konfirmasi]** tanpa nomor belum diputuskan; jangan menganggapnya sudah disepakati.
- **F14 Latihan Literasi Matematis (12 November 2026):** soal, kunci, indikator, dan bobot di PRD §8.3–8.5 adalah [Spesifikasi] dan tidak boleh diubah. Rancangan lainnya ([Usulan], KL-01 sampai KL-15 di PRD §13.1) disetujui 12 November 2026. Coding F14 dimulai setelah pemilik proyek memberi perintah.

## 3. Aturan Data Penelitian

1. Jangan mengarang jawaban siswa atau membuat kutipan wawancara baru.
2. Kutipan harus disalin persis dari dokumen sumber, beserta kodenya (E-xxx / G-hh:mm).
3. Bedakan **[Temuan]**, **[Interpretasi]**, **[Rekomendasi]**, **[Spesifikasi]**, dan **[Asumsi]**.
4. Informan hanya **S01**. Jangan menulis seolah-olah ketentuan minimal 2 siswa sudah terpenuhi.
5. Jangan memperbaiki ketidaksesuaian dokumen sumber secara sepihak. Catat di PRD §5.2.
6. **Kerahasiaan informan:** jangan memuat nama, foto, atau ciri pengenal informan di kode, konten, atau dokumentasi. Gunakan kode S01.

## 4. Standar Bahasa Aplikasi

- Semua teks antarmuka dan konten memakai **Bahasa Indonesia** sederhana untuk siswa SMP.
- Kalimat ≤ 15 kata, maksimal 3 kalimat per kartu, instruksi berupa perintah pendek.
- Istilah tetap: **harga beli**, **harga jual**, **untung**, **rugi**, **persentase untung**, **persentase rugi**. Singkatan HB/HJ hanya dipakai setelah diperkenalkan di M1.
- Format angka: `Rp100.000`; desimal memakai koma (`12,5%`).
- Rumus resmi (jangan diubah):
  - Keuntungan = Harga Jual − Harga Beli
  - Kerugian = Harga Beli − Harga Jual
  - Persentase Keuntungan = (Keuntungan / Harga Beli) × 100%
  - Persentase Kerugian = (Kerugian / Harga Beli) × 100%

## 5. Aturan Desain Antarmuka

- Satu layar, satu langkah. Maksimal satu gambar per layar.
- Setiap gambar wajib memuat informasi harga. **Dilarang** gambar dekoratif, maskot, atau latar bergambar.
- Tanpa animasi dekoratif. Animasi hanya untuk perubahan yang bermakna, dan menghormati `prefers-reduced-motion`.
- Gunakan token warna di design.md §11. Warna HB/HJ/Untung/Rugi/Ditanya selalu disertai teks atau ikon.
- Mobile-first 360 px; area sentuh ≥ 44 px; teks isi ≥ 16 px.

## 6. Aturan Pengembangan Fitur

- Setiap fitur harus dapat ditelusuri ke ID di PRD §9 dan ke bukti wawancara atau spesifikasi.
- Kerjakan P1 sebelum P2. Fitur di luar PRD (misalnya diskon, video, leaderboard, halaman guru) **tidak boleh ditambahkan** tanpa persetujuan.
- Logika matematika (rumus, diagnosis, fading) berada di `src/logika/`, terpisah dari komponen, dan wajib memiliki uji unit.
- Konten (materi, soal, petunjuk, pembahasan) berada di `public/data/*.json`, bukan ditulis langsung di komponen.

## 7. Aturan Penulisan Kode

- JavaScript modern (ES modules). Nama file, variabel, dan fungsi domain dalam Bahasa Indonesia (`hitungPersenUntung`, `KartuMateri`). Istilah teknis umum boleh dalam bahasa Inggris (`props`, `state`).
- Komponen kecil dengan satu tanggung jawab.
- Jangan menyimpan rahasia di repositori. `.env` wajib masuk `.gitignore`; sediakan `.env.example`.
- Kunci `service_role` Supabase **hanya** dipakai di skrip lokal `supabase/scripts/`.
- Semua tabel wajib memakai RLS. Setiap perubahan skema harus berupa file migrasi baru.

## 8. Ketentuan Teknologi

| Teknologi | Ketentuan |
|---|---|
| Supabase | Auth + PostgreSQL + RLS; tier gratis |
| Three.js | **Hanya di halaman Simulasi (P07)**; dimuat dengan `import()` dinamis; wajib ada cadangan 2D; render on-demand |
| Hosting frontend | Layanan statis gratis [Keputusan K-02] |
| Framework | [Keputusan K-01] |
| Pustaka baru | Wajib ada alasan dan persetujuan; utamakan tanpa pustaka tambahan |

## 9. Menjaga Konsistensi Dokumentasi

- Jika satu dokumen berubah, periksa dan perbarui dokumen yang memakai ID yang sama (F, KFN, KNF, P, M, D, K).
- Perbarui status di task.md setiap kali tugas selesai.
- Tulis keputusan baru beserta tanggalnya di PRD (dan hapus dari daftar konfirmasi jika sudah diputuskan).
- README.md bagian "Status Pengembangan" harus selalu sesuai dengan task.md.

## 10. Tidak Boleh Diubah Tanpa Persetujuan Pemilik Proyek

1. Materi target (Persentase Untung dan Rugi) dan rumus resmi di §4.
2. Target pengguna dan bahasa aplikasi.
3. Daftar fitur, prioritas, dan ruang lingkup di PRD §9.
4. Keputusan 11 November 2026: data S01 saja; S01 ditulis Kelas VIII; video diganti Contoh Bertahap; 3D hanya di Simulasi.
5. Kutipan dan kode bukti wawancara.
6. Skema database dan mekanisme login.
7. Isi dokumen wawancara sumber.
