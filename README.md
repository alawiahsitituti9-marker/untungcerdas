# MathSave

Aplikasi web pembelajaran **Persentase Untung dan Rugi** untuk siswa SMP, nyaman digunakan melalui HP Android.

## Deskripsi

MathSave membantu siswa menyelesaikan soal persentase untung dan rugi secara bertahap: menandai informasi penting di soal cerita, menentukan untung atau rugi, menghitung besarnya, menghitung persentase terhadap **harga beli**, lalu memeriksa kembali hasilnya. Aplikasi juga menyediakan contoh bertahap, simulasi jual beli dengan visual 3D, latihan berjenjang dengan petunjuk yang berkurang secara bertahap, dan pembahasan yang menunjuk langkah yang keliru.

## Latar Belakang

Proyek ini adalah tugas Mata Kuliah Algoritma dan Pemrograman (Pendidikan Matematika). Wawancara tahap Analysis (ADDIE) dengan satu informan (S01) menunjukkan bahwa siswa masih ingat konsep harga beli, harga jual, untung, dan rugi. Namun siswa ragu saat memilih rumus persentase dan menentukan pembaginya, serta kesulitan memahami soal cerita yang panjang. Siswa juga meminta aplikasi yang sederhana, dengan sedikit tulisan, dan tanpa animasi yang tidak penting. Rinciannya ada di [docs/PRD.md](docs/PRD.md).

## Tujuan Pengembangan

1. Membantu siswa menyelesaikan soal persentase untung dan rugi secara bertahap dan mandiri.
2. Mengurangi beban kognitif yang tidak perlu dalam membaca soal dan memakai aplikasi (Cognitive Load Theory).
3. Mendukung peningkatan Mathematical Literacy: penalaran, merumuskan, menggunakan prosedur, dan menafsirkan hasil.

## Target Pengguna

Siswa SMP Kelas VIII atau IX yang sudah mempelajari materi ini di Kelas VII.

## Materi

Bab Aritmetika Sosial, khususnya Persentase Untung dan Rugi:

| Konsep | Rumus |
|---|---|
| Keuntungan | Harga Jual − Harga Beli |
| Kerugian | Harga Beli − Harga Jual |
| Persentase Keuntungan | (Keuntungan / Harga Beli) × 100% |
| Persentase Kerugian | (Kerugian / Harga Beli) × 100% |

## Teknologi

| Bagian | Teknologi | Status |
|---|---|---|
| Frontend | Vite + React (JavaScript) | Disepakati (K-01) |
| Visual 3D | Three.js (hanya di halaman Simulasi) | Disepakati |
| Database dan Auth | Supabase (tier gratis) | Disepakati |
| Hosting frontend | Netlify / Vercel (tier gratis) | Disepakati (K-02) |
| Login | Kode siswa melalui Supabase Auth | Disepakati (K-03) |

## Struktur Folder

Saat ini:

```text
mathsave/
├── README.md
├── AGENTS.md                       pedoman untuk AI dan pengembang
├── app/                            kode aplikasi (Vite + React), lihat architecture.md §8
├── supabase/                       migrasi database dan skrip (DV-02, DV-03)
├── referensi/                      tidak masuk git (kerahasiaan informan)
│   └── Instrumen_Wawancara_ADDIE_Persentase_untung_dan_rugi_PDF (1).docx
└── docs/
    ├── PRD.md                      kebutuhan, analisis wawancara, CLT, literasi, fitur
    ├── design.md                   halaman, alur, wireframe, komponen, warna, 3D
    ├── architecture.md             sistem, autentikasi, Three.js, folder, keamanan
    ├── api.md                      endpoint, data, validasi, kesalahan
    ├── task.md                     pekerjaan ADDIE, prioritas, pengujian
    ├── 01_Analisis_Kebutuhan_MathSave.md   catatan pemeriksaan Tahap 1
    └── konten/
        ├── D-03_materi.md          teks materi dan contoh bertahap (disetujui)
        ├── D-04_bank_soal.md       23 soal latihan Level 1–4 (disetujui)
        └── D-05_petunjuk_pembahasan.md  petunjuk dan pembahasan (disetujui)
```

Rencana folder aplikasi ada di [docs/architecture.md](docs/architecture.md) §8.

## Status Pengembangan

| Tahap ADDIE | Status |
|---|---|
| Analysis | Selesai dan disetujui (11 November 2026) |
| Design | Selesai dan disetujui (11 November 2026): dokumentasi, materi, bank soal, petunjuk, pembahasan. Validasi ahli (D-07) belum. **Tambahan 12 November 2026:** rancangan F14 Latihan Literasi Matematis (D-08) disetujui 12 November 2026 |
| Development | Berjalan: DV-01, DV-04, DV-06, DV-07, DV-08, DV-09, DV-14 selesai; DV-05 sebagian (login mode uji). F14 Literasi Matematis: LM-05 sampai LM-08 selesai (hasil masih di HP). DV-10, DV-11, DV-12 selesai (Latihan Level 1–4, Petunjuk Bertingkat, Pembahasan). DV-16 versi awal selesai (Progres dari data di HP). Berikutnya DV-15 (3D); DV-02/DV-03 dan LM-09 sampai LM-11 menunggu proyek Supabase |
| Implementation / Testing | Belum dimulai |
| Evaluation | Belum dimulai |

Rincian ada di [docs/task.md](docs/task.md).
