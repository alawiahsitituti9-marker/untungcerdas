# MathSave — Tahap Analysis (ADDIE)

**Materi:** Persentase Untung dan Rugi (Aritmetika Sosial)
**Sumber data:** `referensi/Instrumen_Wawancara_ADDIE_Persentase_untung_dan_rugi_PDF (1).docx` (dipindah dari folder utama pada 11 November 2026)
**Status:** Catatan kerja Tahap 1. **Acuan resmi kini adalah [PRD.md](PRD.md).** Jika ada perbedaan, PRD yang berlaku.

**Keputusan pemilik proyek (11 November 2026):**
1. Analisis memakai data S01 saja; kekurangan informan dicatat sebagai keterbatasan.
2. S01 ditulis sebagai siswa Kelas VIII; perbedaan dengan Bagian B, G, dan J tetap dicatat.
3. Video penjelasan diganti dengan Contoh Bertahap.
4. Three.js/3D hanya dipakai di Simulasi Jual Beli.

Kode bukti mengikuti dokumen wawancara:
- **E-xxx** = jawaban S01 pada Panduan Wawancara (Bagian E), misalnya E-IL01.
- **G-hh:mm** = kutipan pada Format Pencatatan (Bagian G), misalnya G-10:15.
- **H-n** = baris ke-n pada Matriks Analisis (Bagian H).

---

## 1. Pemeriksaan File dan Dokumen

### 1.1 Struktur folder proyek

```
c:\mathsave\
├── Instrumen_Wawancara_ADDIE_Persentase_untung_dan_rugi_PDF (1).docx   (satu-satunya file awal)
└── docs\01_Analisis_Kebutuhan_MathSave.md                              (dokumen ini)
```

Belum ada kode aplikasi, konfigurasi Supabase, atau aset lain. Folder `referensi` belum ada. File wawancara berada langsung di folder utama.

### 1.2 Ringkasan isi dokumen wawancara

| Aspek | Isi dokumen |
|---|---|
| Tujuan wawancara | Merekonstruksi pengalaman belajar: bagian yang sulit secara konsep, penyajian yang membingungkan, dan aktivitas yang membantu. Temuan dipakai untuk keputusan desain, **bukan** untuk menyimpulkan tingkat beban kognitif secara numerik (Bagian A). |
| Status instrumen | Dokumen sendiri menyatakan pedoman **belum tervalidasi secara empiris**. Validasi ahli dan uji keterbacaan dianjurkan sebelum dipakai (Bagian A dan I). |
| Informan | S01, wawancara daring (foto panggilan video), 6 November 2026, 35 menit, persetujuan lisan dan formulir. |
| Bukti pernah belajar | Bab Aritmetika Sosial, Kelas VII Semester 2. |
| Artefak pemicu | Harga barang di Shopee, halaman buku paket kelas VII, soal pemicu (beli Rp100.000, jual Rp120.000). |
| Struktur pertanyaan | K01–K03 (konteks), IL01–IL05, EL01–EL05, GL01–GL05, DS01–DS03 (rekomendasi desain). |
| Hasil analisis | Format pencatatan dengan 5 kutipan berkode (G) dan matriks 5 baris dari data ke fitur (H). |

### 1.3 Ketidaksesuaian yang ditemukan (tidak diubah, hanya dilaporkan)

| No | Temuan | Lokasi | Pengaruh pada perancangan |
|---|---|---|---|
| 1 | Pertanyaan konteks KO menyebut **"Persentase Diskon (Rabat) dan Potongan Harga"**, padahal materi target adalah Persentase Untung dan Rugi. | Kisi-kisi D, baris KO | Rendah. Pertanyaan yang benar-benar diajukan (K01–K03) sudah menyebut untung dan rugi. Diskon **tidak** dimasukkan ke materi MathSave. |
| 2 | GL01 masih berisi placeholder **"[materi X]"**. | Bagian E4, GL01 | Rendah. Jawaban S01 tetap membahas jual beli. |
| 3 | Kelas informan berbeda: **Kelas VIII** (Bagian C) dan **Kelas IX** (Bagian B, G, J). Contoh pada ketentuan operasional juga menyebut "wawancara siswa kelas VIII". | B, C, G, J | Sedang. Mempengaruhi deskripsi target pengguna dalam laporan, tetapi tidak mengubah fitur. **Perlu konfirmasi.** |
| 4 | Ketentuan meminta **minimal 2 siswa**, tetapi hanya **S01** yang tercatat. | Ketentuan Operasional, Bagian G | Tinggi untuk validitas laporan. Semua kebutuhan di bawah ini hanya bersumber dari **satu informan** dan tidak bisa dianggap mewakili siswa secara umum. |
| 5 | Jawaban **EL04** (kecepatan dan urutan penjelasan) **identik kata per kata** dengan jawaban EL03 (tampilan). | Bagian E3 | Sedang. Tidak ada data langsung tentang tempo atau navigasi (indikator EL3). Satu-satunya bukti terkait tempo berasal dari E-DS02 ("dijelaskan pelan-pelan"). |
| 6 | Kutipan pada Bagian G untuk kode yang sama **berbeda** dengan jawaban di Bagian E (contoh: G-15:30/EL01 dan G-20:45/EL03 tidak sama dengan E-EL01 dan E-EL03). | Bagian E vs G | Rendah untuk fitur, karena isinya saling mendukung. Untuk laporan, perlu dijelaskan apakah G adalah transkrip asli dan E adalah ringkasan, atau sebaliknya. |
| 7 | **Hasil pengerjaan soal pemicu** (Rp100.000 → Rp120.000) tidak dicatat: langkah, jawaban, dan kesalahan S01 tidak tersedia. | Bagian C, G | Sedang. Klaim "bingung membagi dengan harga apa" hanya berupa pernyataan siswa, belum didukung bukti pengerjaan. |
| 8 | S01 meminta **video penjelasan** (E-DS01), tetapi juga meminta **tidak ada animasi yang tidak penting** (E-DS03). | Bagian E5 | Sedang. **Perlu keputusan** apakah video masuk ruang lingkup. |
| 9 | **Ilustrasi 3D (Three.js)** ada di spesifikasi proyek, tetapi **tidak didukung data wawancara**. S01 menginginkan gambar yang sedikit dan aplikasi yang sederhana (E-EL03, E-DS03), dan gambar yang memuat harga (G-20:45). | Spesifikasi vs E/G | Tinggi. 3D berisiko menambah beban ekstraneus. **Perlu keputusan.** |
| 10 | Judul dokumen menyebut "Aplikasi Android", sedangkan spesifikasi proyek adalah **web responsif**. | Halaman judul, Bagian H | Rendah. Web responsif tetap bisa dipakai di Android. |
| 11 | Tahap validasi pedoman (Bagian I) tidak memiliki bukti pelaksanaan. | Bagian I | Rendah untuk fitur, tetapi relevan untuk keterbatasan penelitian. |
| 12 | Foto wawancara (Bagian J) memperlihatkan **wajah informan** dan **label nama panggilan** dari aplikasi panggilan video, padahal Bagian C menyatakan identitas disamarkan dengan kode S01. | Bagian J | Tidak memengaruhi fitur. Relevan untuk etika (aturan "jaga kerahasiaan identitas informan"). Foto dan nama tersebut **tidak akan** dikutip di dokumentasi MathSave. |
| 13 | Prompt menyebut file wawancara ada di "folder referensi", tetapi folder tersebut tidak ada. File berada langsung di `c:\mathsave\`. | Struktur folder | Rendah. |

Login kode siswa, Supabase, dan hosting gratis adalah keputusan teknis pengembang. Ketiganya **tidak berasal dari wawancara**, jadi tidak dicantumkan sebagai kebutuhan siswa.

---

## 2. Identifikasi Kebutuhan Siswa

Setiap kebutuhan dicocokkan dengan bukti. Temuan dari daftar prompt yang **tidak** didukung bukti akan ditandai.

### 2.1 Pencocokan temuan dengan bukti

| Temuan | Bukti | Status |
|---|---|---|
| Masih ingat harga beli, harga jual, untung, rugi | E-K03 | Didukung |
| Kadang bingung menentukan rumus | E-K03, E-IL05, H-1 | Didukung |
| Bingung membagi dengan harga beli atau harga jual | E-IL01, G-10:15 | Didukung |
| Sulit membedakan rumus untung dan rugi | E-IL01 | Didukung |
| Soal cerita panjang sulit dipahami | E-IL04, E-EL01, G-15:30 | Didukung |
| Butuh bantuan menentukan diketahui dan ditanyakan | E-EL05, G-15:30 | Didukung |
| Perkalian dan pembagian sebagai prasyarat | E-IL03 | Didukung |
| Lebih mudah dengan gambar dan contoh jual beli | E-EL02, E-GL01, G-26:10 | Didukung |
| Rumus dan perhitungan dijelaskan perlahan | E-DS02 | Didukung |
| Butuh contoh soal dan latihan | E-DS01, E-GL03 | Didukung |
| Sederhana, sedikit tulisan, tanpa animasi tidak penting | E-EL03, E-DS03 | Didukung |

Semua temuan pada prompt didukung data, dengan catatan bahwa seluruhnya berasal dari satu informan.

### 2.2 Kebutuhan pembelajaran

| Kode | Kebutuhan | Bukti |
|---|---|---|
| KP1 | Penjelasan bertahap: harga beli dan jual → untung atau rugi → selisih → persentase | E-IL02, G-31:00, E-DS02 |
| KP2 | Contoh soal yang sudah dikerjakan **sebelum** latihan mandiri | E-GL03, G-31:00, E-DS02 |
| KP3 | Kesempatan mencoba latihan sendiri setelah melihat contoh | E-DS02, E-GL03 |
| KP4 | Bisa belajar ulang saat belum paham | E-DS01 |
| KP5 | Kebiasaan memeriksa apakah hasil masuk akal | E-GL02 |
| KP6 | Menjelaskan cara penyelesaian membantu pemahaman | E-GL04 |

### 2.3 Kebutuhan materi

| Kode | Kebutuhan | Bukti |
|---|---|---|
| KM1 | Konsep harga beli, harga jual, untung, rugi (sebagai pengingat, bukan pengajaran dari awal) | E-K03 |
| KM2 | Penegasan bahwa persentase untung atau rugi **dibagi harga beli** | E-IL01, G-10:15 |
| KM3 | Pembedaan yang jelas antara rumus untung dan rugi | E-IL01, E-IL05 |
| KM4 | Pengingat prasyarat perkalian dan pembagian (termasuk pembagian dan perkalian dengan 100) | E-IL03 |
| KM5 | Soal bertingkat: harga beli dan jual diberikan langsung → soal cerita pendek → soal cerita panjang | E-IL04 |
| KM6 | Konteks jual beli sehari-hari (pedagang membeli lalu menjual lagi) | E-GL01, G-26:10 |
| KM7 | Variasi soal dengan cerita berbeda tetapi struktur sama | E-GL05 |

Isi rumus diambil dari kurikulum, karena dokumen tidak menuliskan rumusnya:
- Untung = Harga Jual − Harga Beli (jika HJ > HB)
- Rugi = Harga Beli − Harga Jual (jika HB > HJ)
- % Untung = (Untung ÷ Harga Beli) × 100%
- % Rugi = (Rugi ÷ Harga Beli) × 100%

### 2.4 Kebutuhan tampilan aplikasi

| Kode | Kebutuhan | Bukti |
|---|---|---|
| KT1 | Tampilan sederhana dan tidak ramai | E-EL03, E-DS03 |
| KT2 | Sedikit tulisan | E-DS03, E-EL02 |
| KT3 | Gambar yang memuat informasi (barang **dengan label harga**), bukan hiasan | G-20:45, H-3 |
| KT4 | Jumlah gambar terbatas | E-EL03 |
| KT5 | Tidak ada animasi yang tidak penting | E-DS03 |
| KT6 | Bahasa soal yang mudah dipahami | E-EL01 |

### 2.5 Kebutuhan fitur

| Kode | Kebutuhan | Bukti |
|---|---|---|
| KF1 | Panduan langkah penyelesaian | H-1, G-31:00 |
| KF2 | Penanda informasi penting (harga beli, harga jual, pertanyaan) | H-2, E-EL05, G-15:30 |
| KF3 | Simulasi transaksi jual beli | H-4, G-26:10 |
| KF4 | Petunjuk bertingkat (fading hints) | H-5, E-GL03 |
| KF5 | Contoh soal dan latihan | E-DS01 |
| KF6 | Penjelasan yang dapat diulang (diminta dalam bentuk video) | E-DS01 → **diputuskan: Contoh Bertahap, tanpa video** |

### 2.6 Kebutuhan penggunaan melalui Android

Bukti wawancara tentang perangkat sangat terbatas. Yang dapat ditarik hanya:

| Kode | Kebutuhan | Bukti |
|---|---|---|
| KA1 | Aplikasi mudah digunakan (navigasi sederhana) | E-DS03 |
| KA2 | Bisa dibuka kembali kapan saja untuk belajar ulang | E-DS01 |

Dokumen **tidak** memuat data tentang jenis HP, kualitas internet, atau kebiasaan memakai HP. Kebutuhan seperti ukuran layar kecil dan internet terbatas adalah **asumsi teknis pengembang**, bukan temuan wawancara. Asumsi ini tetap dipakai sebagai batasan desain (lihat Bagian 4.3), tetapi diberi label terpisah.

---

## 3. Analisis Cognitive Load Theory

### 3.1 Intrinsic Cognitive Load (kerumitan materi)

| Unsur materi | Tingkat interaktivitas unsur | Bukti | Perlu bertahap? |
|---|---|---|---|
| Konsep harga beli dan harga jual | Rendah, sudah dikuasai | E-K03 | Tidak, cukup pengingat |
| Menentukan untung atau rugi (membandingkan HJ dan HB) | Rendah–sedang | E-IL02, G-26:10 | Ya, singkat |
| Menghitung besar untung atau rugi | Rendah, sudah bisa | G-10:15 ("menghitung untungnya saya masih bisa") | Tidak |
| **Memilih rumus yang tepat** | **Tinggi**: siswa harus memadukan jenis transaksi, rumus, dan angka sekaligus | E-K03, E-IL01, E-IL05 | **Ya** |
| **Menentukan pembagi (harga beli)** | **Tinggi**: titik kesalahan utama | E-IL01, G-10:15 | **Ya, paling penting** |
| Memasukkan angka ke rumus | Sedang | E-IL05 | Ya |
| Menghubungkan informasi dalam soal cerita | Tinggi: makin banyak angka, makin berat | E-IL04, E-EL05 | Ya |
| Perkalian dan pembagian | Prasyarat | E-IL03 | Pengingat singkat |

**Kesimpulan:** Beban intrinsik tertinggi ada pada **langkah persentase**, yaitu memilih rumus dan menentukan harga beli sebagai pembagi. Siswa sudah mampu mengenali konsep dan menghitung selisih. Karena itu, MathSave sebaiknya **tidak mengajarkan ulang dari awal**. Penjelasan yang lambat difokuskan pada langkah 3 (persentase), sesuai E-DS02.

Strategi: memecah satu soal menjadi 4 langkah kecil (KP1), dan menaikkan kerumitan soal sedikit demi sedikit (KM5).

### 3.2 Extraneous Cognitive Load (cara penyajian)

| Hambatan | Bukti | Solusi desain |
|---|---|---|
| Soal cerita terlalu panjang, harus dibaca berulang | E-IL04, G-15:30 | Soal dipendekkan; satu kalimat satu informasi; tingkat panjang dinaikkan bertahap |
| Kalimat sulit dimengerti, bingung mulai dari mana | E-EL01 | Bahasa sehari-hari; instruksi berupa perintah pendek ("Tentukan harga beli") |
| Sulit menemukan informasi penting, banyak angka | E-EL05, G-15:30 | Penanda informasi: siswa mengetuk angka lalu memberi label HB, HJ, atau Ditanya |
| Gambar hiasan tidak membantu | G-20:45, H-3 | Setiap gambar wajib memuat data soal (barang + label harga). Tidak ada gambar dekoratif |
| Tampilan ramai | E-EL03, E-DS03 | Satu layar satu tugas; palet warna terbatas; warna dipakai untuk makna (misalnya hijau = untung, merah = rugi) |
| Tulisan dan animasi berlebihan | E-DS03 | Maksimal beberapa kalimat per layar; animasi hanya untuk transisi yang bermakna (misalnya uang bertambah atau berkurang) |
| Hanya tulisan dan rumus, cepat lupa | E-EL02 | Rumus ditampilkan **menyatu** dengan gambar transaksi (prinsip *split attention*), bukan di halaman terpisah |
| Penyajian tidak sistematis | E-IL02, G-31:00 | Urutan langkah tetap dan sama di semua soal |

Catatan: data tentang tempo (EL3) tidak tersedia karena jawaban EL04 sama dengan EL03 (lihat 1.3 no. 5). Kontrol tempo ("Lanjut" ditekan oleh siswa, bisa kembali ke langkah sebelumnya) tetap disarankan berdasarkan E-DS02 dan E-DS01.

### 3.3 Germane Cognitive Load (membangun pemahaman)

| Aktivitas | Bukti | Penerapan di MathSave |
|---|---|---|
| Contoh jual beli sehari-hari | E-GL01, G-26:10 | Semua soal memakai konteks pedagang, warung, atau toko online |
| Contoh soal dengan penjelasan | E-GL03, E-DS02 | **Contoh Terurai** sebelum latihan |
| Petunjuk langkah demi langkah | G-31:00, H-1 | **Panduan Langkah** 4 tahap |
| Memeriksa kembali hasil | E-GL02 | Langkah "Periksa": apakah HJ > HB sesuai dengan hasil untung? Apakah persentasenya masuk akal? |
| Latihan bervariasi | E-GL05 | Bank soal dengan konteks berbeda tetapi struktur sama |
| Petunjuk rumus dan contoh sejenis | E-GL03 | Tombol petunjuk yang menampilkan rumus atau contoh mirip |
| Mandiri setelah memahami contoh | E-DS02, E-GL03, H-5 | **Fading**: contoh lengkap → contoh sebagian → latihan dengan petunjuk → latihan tanpa petunjuk |
| Menjelaskan kepada orang lain | E-GL04 | Pertanyaan refleksi singkat berupa pilihan ganda: "Mengapa dibagi harga beli?" (bukan esai, supaya tidak menambah tulisan) |

**Alur transfer:** siswa melihat contoh terurai, lalu melengkapi contoh yang sebagian kosong, lalu mengerjakan latihan dengan petunjuk yang makin sedikit, lalu mengerjakan soal cerita baru tanpa petunjuk. Langkah ini sesuai dengan pengalaman S01: "Kalau sudah melihat caranya, saya jadi lebih berani mencoba" (E-GL03) dan "Tinggal melihat angka dan apa yang ditanyakan" (E-GL05).

---

## 4. Penentuan Fitur (Draf)

> Catatan: bagian ini masih draf awal. Daftar fitur lengkap (13 fitur yang diminta), prioritasnya, dan tabel Mathematical Literacy akan disusun di `docs/PRD.md` pada Tahap 2–4, setelah pertanyaan konfirmasi terjawab.

### 4.1 Fitur inti (didukung wawancara)

| No | Fitur | Fungsi | Dasar |
|---|---|---|---|
| 1 | Login Kode Siswa | Masuk dengan kode dari guru | Spesifikasi proyek |
| 2 | Dashboard | Menampilkan langkah belajar berikutnya dan kemajuan. Satu tombol utama "Lanjut belajar" | Spesifikasi proyek, KT1 |
| 3 | Pengingat Prasyarat | Kartu singkat tentang perkalian, pembagian, dan persen, serta HB, HJ, untung, rugi | KM1, KM4, E-IL03 |
| 4 | Contoh Terurai | Contoh soal yang dikerjakan langkah demi langkah dengan gambar barang berlabel harga | KP2, KT3, E-DS02 |
| 5 | Panduan Langkah | 4 tahap tetap: (1) tentukan HB dan HJ, (2) untung atau rugi?, (3) hitung selisih, (4) hitung persentase (bagi harga beli). Ditambah langkah Periksa | H-1, KP1, KP5 |
| 6 | Penanda Informasi Penting | Siswa mengetuk angka di soal cerita untuk memberi label HB, HJ, atau Ditanya | H-2, KF2 |
| 7 | Simulasi Jual Beli | Siswa mengatur harga beli dan harga jual, lalu melihat hasil untung atau rugi dan persentasenya | H-4, KF3 |
| 8 | Latihan dengan Petunjuk Bertingkat | Petunjuk 1: apa yang diketahui → Petunjuk 2: rumus → Petunjuk 3: perhitungan. Jumlah petunjuk berkurang di level berikutnya | H-5, KF4 |
| 9 | Umpan Balik Langkah | Jika salah, aplikasi menunjukkan **langkah mana** yang keliru (misalnya "Kamu membagi dengan harga jual") | E-IL05, G-10:15 |
| 10 | Riwayat dan Ulang Materi | Siswa bisa membuka kembali contoh dan latihan | E-DS01, KA2 |

### 4.2 Fitur yang sudah diputuskan

| Fitur | Keputusan (11 November 2026) |
|---|---|
| Video penjelasan | Tidak dibuat; diganti Contoh Bertahap |
| Ilustrasi 3D Three.js | Hanya di Simulasi Jual Beli: satu barang berlabel harga yang bisa diputar |
| Halaman guru atau admin | Masih terbuka; lihat PRD §13 (K-08) |

### 4.3 Batasan desain Android (asumsi pengembang, bukan temuan wawancara)

- Desain dimulai dari layar HP kecil (lebar sekitar 360 px), tombol minimal 44 px.
- Halaman ringan; aset 3D dimuat hanya saat dibutuhkan.
- Input angka memakai keyboard numerik dengan pemisah ribuan (Rp100.000).

---

## 5. Keterbatasan Analisis

1. Hanya satu informan (S01), sehingga belum memenuhi ketentuan minimal 2 siswa.
2. Pedoman wawancara belum tervalidasi (diakui oleh dokumen sendiri).
3. Tidak ada catatan pengerjaan soal pemicu.
4. Data tentang tempo dan navigasi (EL04) tidak tersedia.
5. Tidak ada data tentang perangkat dan akses internet siswa.
