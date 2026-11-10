# PRD — MathSave

**Product Requirements Document**
Versi: 0.1 (draf, menunggu persetujuan) · Tahap ADDIE: Analysis → Design

Dokumen terkait: [design.md](design.md) · [architecture.md](architecture.md) · [api.md](api.md) · [task.md](task.md) · [Catatan pemeriksaan wawancara](01_Analisis_Kebutuhan_MathSave.md)

Konvensi penandaan di seluruh dokumentasi:

| Label | Arti |
|---|---|
| **[Temuan]** | Isi yang diambil langsung dari dokumen wawancara (kutipan atau catatan) |
| **[Interpretasi]** | Penafsiran pengembang atas temuan |
| **[Rekomendasi]** | Keputusan desain atau fitur yang diusulkan |
| **[Spesifikasi]** | Ditetapkan oleh pemilik proyek, bukan dari wawancara |
| **[Asumsi]** | Belum ada bukti; perlu diuji atau dikonfirmasi |
| **[Konfirmasi]** | Belum diputuskan; menunggu persetujuan pemilik proyek |

Kode bukti: `E-xxx` = jawaban di Bagian E dokumen wawancara; `G-hh:mm` = kutipan di Bagian G; `H-n` = baris ke-n Matriks H.

---

## 1. Latar Belakang

Persentase Untung dan Rugi adalah bagian dari bab Aritmetika Sosial di Kelas VII. Materi ini berhubungan langsung dengan kegiatan jual beli sehari-hari. Siswa perlu memahami konsep harga beli dan harga jual, lalu menerapkan rumus persentase dengan pembagi yang tepat.

Pengembangan MathSave mengikuti model **ADDIE**. Tahap **Analysis** dilakukan melalui wawancara semiterstruktur yang disusun dari konstruk **Cognitive Load Theory** (CLT). Wawancara melibatkan satu informan (S01), siswa yang sudah mempelajari materi ini di Kelas VII Semester 2. Wawancara dilakukan pada 6 November 2026 selama 35 menit.

## 2. Permasalahan Pembelajaran

Berdasarkan wawancara, masalah utamanya bukan pada konsep dasar jual beli, melainkan pada:

1. **Langkah persentase:** memilih rumus dan menentukan **harga beli sebagai pembagi** (E-IL01, G-10:15, E-IL05).
2. **Membaca soal cerita:** menemukan harga beli, harga jual, dan apa yang ditanyakan ketika soal panjang dan banyak angka (E-IL04, E-EL01, E-EL05, G-15:30).
3. **Penyajian:** cepat lupa jika hanya membaca tulisan dan rumus, dan gambar hiasan tidak membantu (E-EL02, G-20:45).

## 3. Tujuan Aplikasi

1. Membantu siswa **menyelesaikan soal Persentase Untung dan Rugi secara bertahap dan mandiri**.
2. Mengurangi beban kognitif yang tidak perlu (extraneous) dalam membaca soal cerita dan tampilan aplikasi.
3. Mendukung peningkatan **Mathematical Literacy** melalui empat indikator (lihat Bagian 8).

## 4. Target Pengguna

| Aspek | Keterangan |
|---|---|
| Pengguna utama | Siswa SMP Kelas VIII atau IX yang sudah mempelajari Persentase Untung dan Rugi di Kelas VII **[Spesifikasi]** |
| Karakteristik (dari S01, siswa Kelas VIII*) | Masih ingat konsep harga beli, harga jual, untung, dan rugi. Bisa menghitung selisih. Ragu pada langkah persentase. Belajar dengan pola guru menjelaskan di papan tulis → contoh → mencatat → latihan (E-K02, E-K03, G-10:15) **[Temuan]** |
| Perangkat | HP Android melalui peramban **[Spesifikasi]**. Tidak ada data tentang jenis HP atau kuota internet siswa **[Asumsi]** |

\* Dokumen wawancara menulis Kelas VIII di Bagian C dan Kelas IX di Bagian B, G, dan J. Sesuai keputusan pemilik proyek (11 November 2026), dokumentasi ini memakai **Kelas VIII**. Perbedaan tersebut tetap dicatat sebagai ketidaksesuaian dokumen sumber.

## 5. Hasil Analisis Wawancara

### 5.1 Matriks temuan → interpretasi → rekomendasi

| No | [Temuan] kutipan S01 | Kode | [Interpretasi] | [Rekomendasi] fitur |
|---|---|---|---|---|
| T1 | "saya masih ingat tentang harga beli, harga jual, untung, dan rugi. Tapi kadang masih bingung menentukan rumus yang harus dipakai." | E-K03 | Konsep dasar sudah ada. Kesulitannya ada pada memilih rumus. | Materi dasar cukup ringkas (F03). Fokus pada pemilihan rumus (F04, F05) |
| T2 | "saya kadang lupa harus membagi dengan harga beli atau harga jual." / "saya kadang bingung harus membagi dengan harga yang mana." | E-IL01, G-10:15 | Titik kesalahan utama adalah pembagi pada rumus persentase (IL). | Penegasan "dibagi harga beli" di F04. Langkah "pilih rumus" di F05. Diagnosis kesalahan "membagi dengan harga jual" di F10 |
| T3 | "sulit membedakan rumus untung sama rugi, apalagi kalau soalnya panjang." | E-IL01 | Interaktivitas unsur tinggi: jenis transaksi, rumus, dan angka diproses bersamaan (IL). | Langkah "untung atau rugi?" dipisah sebelum menghitung (F05). Warna dan ikon yang konsisten untuk untung dan rugi |
| T4 | "Pertama saya harus tahu harga belinya berapa dan harga jualnya berapa. Terus saya lihat untung atau rugi, baru menghitung selisihnya dan mencari persentasenya." | E-IL02 | Siswa sudah memiliki urutan langkah yang benar. Urutan ini menjadi kerangka panduan. | Urutan F05 mengikuti urutan siswa ini |
| T5 | "Harus bisa perkalian dan pembagian, nanti dipakai untuk menghitung persentase." | E-IL03 | Prasyarat aritmetika (IL). | Kartu pemanasan prasyarat opsional (F03-M0) |
| T6 | "Kalau soalnya langsung memberikan harga beli dan harga jual, saya masih bisa. Tapi kalau bentuknya cerita panjang, saya agak susah memahami maksudnya" | E-IL04 | Kesulitan naik ketika bentuk soal berubah menjadi cerita (IL + EL). | Level latihan bertingkat: angka langsung → cerita pendek → cerita panjang (F09) |
| T7 | "Biasanya saya salah memilih rumus atau salah memasukkan angka ke rumusnya." | E-IL05 | Ada dua jenis kesalahan: pemilihan rumus dan substitusi angka. | Pembahasan menunjuk langkah yang salah (F10). Rumus yang terisi angka ditampilkan langkah demi langkah (F04, F12) |
| T8 | "kalau soalnya menggunakan kalimat yang sulit dimengerti, saya jadi bingung harus mulai dari mana." | E-EL01 | Bahasa soal menambah beban (EL). | Kalimat pendek dan bahasa sehari-hari. Langkah pertama selalu "Tandai informasi" (F06) |
| T9 | "Kalau soalnya terlalu panjang, saya suka bingung menentukan mana harga beli dan mana harga jual. Jadi harus baca berulang kali" | G-15:30 | Mencari informasi dalam teks panjang membebani memori kerja (EL). | Penanda Informasi Penting (F06) |
| T10 | "yang susah itu menentukan apa yang diketahui dan apa yang ditanyakan. Apalagi kalau banyak angka di dalam ceritanya." | E-EL05 | Sama dengan T9 (EL). | F06, termasuk penanda "Ditanya" |
| T11 | "Saya lebih suka kalau ada gambar dan contoh langsung. Kalau cuma tulisan dan rumus saja, kadang cepat lupa" | E-EL02 | Representasi visual yang terhubung dengan rumus membantu (EL/GL). | Gambar barang berlabel harga yang menyatu dengan rumus (F08, F12) |
| T12 | "gambar boleh saja, tapi jangan terlalu banyak. Yang penting penjelasannya jelas dan tidak terlalu ramai." | E-EL03 | Visual harus dibatasi (EL). | Maksimal satu gambar per layar. 3D hanya di Simulasi (F08) |
| T13 | "Kalau gambarnya cuma hiasan saja, menurut saya kurang membantu. Lebih baik gambarnya ada harga barangnya" | G-20:45 | Gambar dekoratif tidak membantu (EL). | Semua gambar wajib memuat data harga (F08) |
| T14 | "Saya lebih paham kalau guru memberikan contoh yang ada di kehidupan sehari-hari, misalnya pedagang membeli barang terus menjualnya lagi." | E-GL01 | Konteks nyata membantu membangun skema (GL). | Konteks jual beli di semua contoh dan soal. Simulasi Jual Beli (F07) |
| T15 | "Saya lebih paham kalau dikasih contoh jual beli langsung, Kak. Jadi bisa tahu mana harga beli, mana harga jual, terus kelihatan untung atau ruginya" | G-26:10 | Sama dengan T14 (GL). | F07, F12 |
| T16 | "Saya periksa lagi hitungannya, terus melihat apakah hasilnya masuk akal atau tidak." | E-GL02 | Siswa sudah punya kebiasaan memeriksa jawaban (GL). | Langkah "Periksa" di akhir panduan (F05) |
| T17 | "Biasanya saya butuh petunjuk rumus dan contoh soal yang mirip. Kalau sudah melihat caranya, saya jadi lebih berani mencoba." | E-GL03 | Contoh terurai dan petunjuk mendorong kemandirian (GL). | Contoh Bertahap (F12). Petunjuk Bertingkat (F11) |
| T18 | "dengan menjelaskan ke teman saya jadi lebih paham." | E-GL04 | Menjelaskan alasan memperkuat pemahaman (GL). | Pertanyaan "Mengapa?" berbentuk pilihan (F09, indikator Penalaran) |
| T19 | "Kalau sudah paham rumusnya, biasanya saya bisa mengerjakan soal lain. Tinggal melihat angka dan apa yang ditanyakan." | E-GL05 | Transfer terjadi jika struktur soal dikenali (GL). | Variasi konteks dengan struktur yang sama (F09) |
| T20 | "kalau bisa dijelaskan langkah-langkahnya dulu, Kak. Misalnya cari untungnya dulu, baru menghitung persentasenya. Kalau sudah dicontohkan, saya lebih mudah mengerjakan sendiri" | G-31:00 | Butuh contoh langkah sebelum latihan mandiri (GL). | F05, F12, lalu F09 |
| T21 | "Kalau bisa ada video penjelasan, contoh soal, sama latihan. Jadi kalau belum paham bisa belajar lagi lewat aplikasi." | E-DS01 | Butuh penjelasan yang bisa diulang. | Video **diganti** dengan Contoh Bertahap (F12) yang bisa diulang (keputusan 11 November 2026). F09 |
| T22 | "Bagian rumus dan cara menghitung persentase harus dijelaskan pelan-pelan. Kalau sudah ada contohnya, siswa bisa mencoba latihan sendiri." | E-DS02 | Tempo diatur siswa, dengan fokus pada persentase. | Tombol "Lanjut" yang dikendalikan siswa (F03, F12) |
| T23 | "[J]angan terlalu banyak tulisan dan animasi yang tidak penting. Aplikasinya dibuat sederhana saja supaya mudah digunakan." | E-DS03 | Kesederhanaan adalah syarat utama antarmuka (EL). | Prinsip desain di [design.md](design.md). Tanpa animasi dekoratif |

Catatan: huruf "[J]" pada T23 ditambahkan karena sumber tertulis "angan".

### 5.2 Keterbatasan data

1. **Hanya satu informan (S01)**, padahal ketentuan instrumen meminta minimal 2 siswa. Pemilik proyek mengonfirmasi bahwa tidak ada data informan lain. Kebutuhan di dokumen ini **belum dapat digeneralisasi**.
2. Pedoman wawancara belum divalidasi ahli dan belum diuji keterbacaan (Bagian A dan I dokumen sumber).
3. Jawaban EL04 (tempo penjelasan) identik dengan EL03, sehingga data tentang tempo tidak tersedia.
4. Hasil pengerjaan soal pemicu (Rp100.000 → Rp120.000) tidak dicatat.
5. Kutipan di Bagian G berbeda dengan jawaban di Bagian E untuk kode yang sama. Keduanya dipakai sebagai bukti karena isinya saling menguatkan.
6. Pertanyaan KO menyebut "Persentase Diskon (Rabat)", dan GL01 masih memuat "[materi X]". Diskon **tidak** termasuk ruang lingkup MathSave.
7. Tidak ada data tentang perangkat dan akses internet siswa.

## 6. Kebutuhan Siswa

### 6.1 Kebutuhan pembelajaran

| Kode | Kebutuhan | Bukti |
|---|---|---|
| KP1 | Penyelesaian bertahap: HB dan HJ → untung atau rugi → selisih → persentase | T4, T20, T22 |
| KP2 | Contoh soal terurai sebelum latihan mandiri | T17, T20, T22 |
| KP3 | Kesempatan mencoba latihan sendiri setelah melihat contoh | T17, T22 |
| KP4 | Dapat belajar ulang saat belum paham | T21 |
| KP5 | Membiasakan pemeriksaan kewajaran hasil | T16 |
| KP6 | Menjelaskan alasan penyelesaian | T18 |

### 6.2 Kebutuhan materi

| Kode | Kebutuhan | Bukti |
|---|---|---|
| KM1 | Pengingat konsep HB, HJ, untung, rugi (ringkas, bukan dari nol) | T1 |
| KM2 | Penegasan bahwa persentase **dibagi harga beli** | T2 |
| KM3 | Pembedaan rumus untung dan rugi | T3, T7 |
| KM4 | Pengingat prasyarat perkalian dan pembagian | T5 |
| KM5 | Soal bertingkat: angka langsung → cerita pendek → cerita panjang | T6 |
| KM6 | Konteks jual beli sehari-hari | T14, T15 |
| KM7 | Variasi cerita dengan struktur sama | T19 |

### 6.3 Kebutuhan tampilan

| Kode | Kebutuhan | Bukti |
|---|---|---|
| KT1 | Sederhana, tidak ramai | T12, T23 |
| KT2 | Sedikit tulisan | T11, T23 |
| KT3 | Gambar memuat informasi harga, bukan hiasan | T13 |
| KT4 | Jumlah gambar terbatas | T12 |
| KT5 | Tanpa animasi yang tidak penting | T23 |
| KT6 | Bahasa mudah dipahami | T8 |

### 6.4 Kebutuhan fitur

| Kode | Kebutuhan | Bukti |
|---|---|---|
| KF1 | Panduan langkah | H-1, T20 |
| KF2 | Penanda informasi penting | H-2, T9, T10 |
| KF3 | Simulasi jual beli | H-4, T15 |
| KF4 | Petunjuk bertingkat | H-5, T17 |
| KF5 | Contoh soal dan latihan | T21 |

### 6.5 Kebutuhan penggunaan melalui Android

| Kode | Kebutuhan | Bukti / status |
|---|---|---|
| KA1 | Mudah digunakan, navigasi sederhana | T23 **[Temuan]** |
| KA2 | Dapat dibuka kembali untuk belajar ulang | T21 **[Temuan]** |
| KA3 | Nyaman di layar kecil, ringan di koneksi terbatas | **[Asumsi]**, karena tidak ada data perangkat |

## 7. Analisis Cognitive Load Theory

### 7.1 Intrinsic load

| Unsur materi | Beban | Bukti | Perlakuan |
|---|---|---|---|
| Konsep HB dan HJ | Rendah (sudah dikuasai) | T1 | Pengingat singkat |
| Hubungan HB, HJ, untung, rugi | Sedang | T3, T4 | Visual perbandingan HB dan HJ |
| Menentukan untung atau rugi | Sedang | T3, T15 | Langkah terpisah dengan pilihan "Untung" atau "Rugi" |
| Menghitung besar untung atau rugi | Rendah (sudah bisa) | G-10:15 | Satu langkah, tanpa penjelasan panjang |
| Rumus persentase untung dan rugi | **Tinggi** | T1, T2, T7, T22 | **Dijelaskan pelan-pelan**: satu unsur per layar, simbol dijelaskan |
| HB sebagai dasar persentase | **Tinggi (titik kesalahan utama)** | T2 | Penegasan berulang, alasan konseptual, diagnosis kesalahan |
| Hubungan informasi dalam soal cerita | Tinggi | T6, T9, T10 | Penanda informasi; panjang cerita dinaikkan bertahap |
| Perkalian dan pembagian | Prasyarat | T5 | Kartu pemanasan opsional |

**Bagian yang perlu penjelasan paling bertahap:** rumus persentase dan alasan pembaginya harga beli (submateri M5 dan M6), serta membaca soal cerita.

### 7.2 Extraneous load

| Hambatan | Bukti | Solusi desain |
|---|---|---|
| Soal cerita terlalu panjang | T6, T9 | Kalimat pendek; satu kalimat satu informasi; panjang dinaikkan per level |
| Bahasa atau instruksi sulit | T8 | Bahasa sehari-hari; instruksi berbentuk perintah pendek |
| Sulit menemukan informasi penting | T9, T10 | Penanda Informasi (F06) dengan warna dan label tetap |
| Gambar hiasan | T13 | Setiap gambar wajib memuat data harga |
| Tampilan ramai | T12, T23 | Satu layar satu tugas; maksimal satu gambar per layar |
| Tulisan dan animasi berlebihan | T23 | Teks maksimal 3 kalimat per kartu; tanpa animasi dekoratif |
| Teks dan rumus terpisah (split attention) | T11 | Rumus terisi angka diletakkan tepat di bawah gambar transaksi yang sama |
| Penyajian tidak sistematis | T4, T20 | Urutan langkah yang sama di semua contoh dan soal |
| Tempo terlalu cepat | T22 (EL04 tidak ada data) | Tempo dikendalikan siswa (tombol "Lanjut" dan "Kembali") |

### 7.3 Germane load

| Aktivitas | Bukti | Cara MathSave membantu |
|---|---|---|
| Contoh jual beli sehari-hari | T14, T15 | Konteks warung, pedagang, dan toko online di semua soal |
| Contoh soal dengan penjelasan | T17, T22 | Contoh Bertahap (F12) |
| Petunjuk langkah demi langkah | T20 | Panduan Langkah (F05) |
| Pemeriksaan kembali | T16 | Langkah "Periksa": hitung balik untung = persen × HB ÷ 100 |
| Latihan bervariasi | T19 | Konteks berbeda dengan struktur sama (F09) |
| Petunjuk rumus dan contoh sejenis | T17 | Petunjuk Bertingkat (F11) dan Kartu Rumus (F04) |
| Mandiri setelah contoh | T17, T20, T22 | **Fading**: contoh penuh → contoh sebagian → latihan berpetunjuk → latihan mandiri |
| Menjelaskan alasan | T18 | Pertanyaan "Mengapa?" berbentuk pilihan |

**Alur transfer ke masalah baru:** Contoh Bertahap → Simulasi (eksplorasi bebas) → Latihan Level 1–2 dengan panduan penuh → Level 3 dengan panduan diringkas → Level 4 soal cerita baru tanpa petunjuk, ditambah perbandingan dua transaksi.

## 8. Tujuan Pembelajaran dan Mathematical Literacy

> Indikator Mathematical Literacy adalah **[Spesifikasi]** pemilik proyek, bukan temuan wawancara. Kolom "Bukti pendukung" menunjukkan kaitannya dengan wawancara jika ada.

### 8.1 Tujuan pembelajaran

Setelah menggunakan MathSave, siswa dapat:

- **TP1** Mengidentifikasi harga beli, harga jual, dan hal yang ditanyakan dari soal cerita jual beli.
- **TP2** Menentukan apakah suatu transaksi mengalami untung atau rugi beserta alasannya.
- **TP3** Menghitung besar keuntungan atau kerugian.
- **TP4** Menghitung persentase keuntungan atau kerugian terhadap harga beli.
- **TP5** Menafsirkan dan memeriksa kewajaran hasil sesuai konteks jual beli.
- **TP6** Membandingkan dua situasi jual beli berdasarkan persentase keuntungan atau kerugian.

### 8.2 Tabel hubungan Mathematical Literacy

| Indikator ML | Tujuan | Aktivitas siswa | Materi | Fitur | Latihan / evaluasi | Bukti pendukung |
|---|---|---|---|---|---|---|
| **1. Mathematical Reasoning** (Penalaran Matematis) | TP2, TP6 | Memilih untung atau rugi dan memilih alasannya. Membandingkan dua transaksi: "Mana yang persentase untungnya lebih besar? Mengapa?" | M2, M5, M6 | F05 (langkah 3), F07, F09 (Level 4), F10 | Soal pilihan jenis + alasan (pilihan ganda); soal perbandingan dua transaksi | T3, T18 |
| **2. Formulating Situations Mathematically** (Merumuskan) | TP1 | Menandai HB, HJ, dan Ditanya pada soal cerita; menuliskan model "Untung = HJ − HB" dengan angka | M1, M2 | F06, F05 (langkah 1–2) | Tugas menandai informasi; mengisi kotak HB dan HJ | T6, T9, T10 |
| **3. Employing Concepts, Facts, and Procedures** (Menggunakan) | TP3, TP4 | Memilih rumus persentase yang benar dan menghitung | M3–M6 | F04, F05 (langkah 4–6), F11, F12 | Isian besar untung/rugi dan persentase; pilihan rumus | T1, T2, T7 |
| **4. Interpreting, Applying, and Evaluating** (Menafsirkan) | TP5 | Langkah "Periksa": apakah hasilnya masuk akal? Hitung balik. Menafsirkan arti "untung 25%" dalam kalimat | M5, M6 | F05 (langkah 7), F07, F10 | Pertanyaan kewajaran (benar/salah dengan alasan); kalimat kesimpulan pilihan | T16 |

## 9. Daftar Fitur dan Prioritas

Kriteria prioritas:
- **P1 (Wajib):** didukung bukti wawancara dan dibutuhkan agar alur belajar inti berjalan.
- **P2 (Penting):** didukung spesifikasi atau bukti, tetapi bisa disederhanakan atau dibuat setelah P1.
- **P3 (Opsional):** dibuat jika waktu tersisa.

| ID | Fitur | Prioritas | Dasar | Catatan ruang lingkup |
|---|---|---|---|---|
| F01 | Login Kode Siswa | P1 | [Spesifikasi] | Diperlukan untuk menyimpan progres |
| F02 | Dashboard Siswa | P1 | [Spesifikasi], KT1 | Kode siswa, materi, progres ringkas, tombol "Lanjut belajar", akses latihan |
| F03 | Materi Pembelajaran bertahap | P1 | KM1–KM4, T22 | M0 pemanasan (opsional) + M1–M6 |
| F04 | Penjelasan Rumus (Kartu Rumus) | P1 | T1, T2, T7 | Arti simbol + contoh. Bisa dibuka dari halaman soal |
| F05 | Panduan Langkah demi Langkah | P1 | H-1, T4, T20 | 7 langkah sesuai prompt |
| F06 | Penanda Informasi Penting | P1 | H-2, T9, T10 | HB, HJ, besar untung/rugi, Ditanya |
| F07 | Simulasi Jual Beli | P1 | H-4, T14, T15 | Versi 2D wajib berjalan, sebagai cadangan jika 3D gagal |
| F08 | Ilustrasi Visual dan 3D | 2D: P1 · 3D: P2 | T11–T13, [Spesifikasi] Three.js | 3D **hanya** di Simulasi (keputusan 11 November 2026) |
| F09 | Latihan Soal bertahap | P1 | KM5–KM7, T6, T19 | Level 1–4 |
| F10 | Pembahasan Jawaban | P1 | T7, H-5 | Bagian yang salah, konsep, petunjuk, contoh benar |
| F11 | Petunjuk Bertingkat (Fading Hints) | P1 | H-5, T17 | 4 tingkat; berkurang per level |
| F12 | Contoh Bertahap (pengganti video) | P1 | T17, T20, T21, T22 | Keputusan 11 November 2026: video tidak dibuat |
| F13 | Progres Belajar | P2 | [Spesifikasi], KA2 | Versi sederhana: status submateri + hasil per level |

**Di luar ruang lingkup:** persentase diskon, rabat, bruto/neto/tara, pajak, bunga; soal kebalikan (mencari HJ dari persentase); video; halaman guru/admin **[Keputusan K-08]**; mode luring.

## 10. Kebutuhan Fungsional

| ID | Kebutuhan | Fitur |
|---|---|---|
| KFN-01 | Siswa dapat masuk dengan kode siswa yang valid, dan mendapat pesan yang jelas jika kode salah | F01 |
| KFN-02 | Sesi tetap tersimpan sehingga siswa tidak perlu memasukkan kode setiap membuka aplikasi; siswa dapat keluar | F01 |
| KFN-03 | Dashboard menampilkan kode siswa, daftar materi, progres, dan tombol lanjut ke langkah berikutnya | F02, F13 |
| KFN-04 | Materi M1–M6 tampil berupa kartu, satu konsep per kartu, dengan navigasi "Lanjut" dan "Kembali" | F03 |
| KFN-05 | Setiap submateri diakhiri satu soal cek cepat | F03 |
| KFN-06 | Kartu Rumus menampilkan 4 rumus, arti simbol, dan satu contoh; dapat dibuka dari halaman soal tanpa kehilangan jawaban | F04 |
| KFN-07 | Panduan Langkah menampilkan langkah satu per satu dan memeriksa setiap langkah sebelum lanjut | F05 |
| KFN-08 | Siswa dapat mengetuk bagian soal untuk memberi label HB, HJ, Untung/Rugi, atau Ditanya; aplikasi memberi tahu jika label salah | F06 |
| KFN-09 | Simulasi: siswa mengubah HB dan HJ; aplikasi menampilkan jenis transaksi, besar selisih, dan rumus persentase yang terisi angka | F07 |
| KFN-10 | Simulasi menampilkan barang 3D berlabel harga jika WebGL tersedia; jika tidak, menampilkan versi 2D | F07, F08 |
| KFN-11 | Latihan terdiri dari Level 1–4; Level berikutnya terbuka setelah syarat Level sebelumnya terpenuhi | F09 |
| KFN-12 | Jawaban salah memicu pembahasan dengan 4 unsur (bagian yang salah, konsep, petunjuk, contoh benar) | F10 |
| KFN-13 | Aplikasi mengenali kesalahan umum: membagi dengan HJ, lupa ×100, tertukar untung/rugi, salah selisih, HB/HJ tertukar | F10 |
| KFN-14 | Petunjuk dibuka satu tingkat per ketukan; jumlah petunjuk yang tersedia berkurang per level | F11 |
| KFN-15 | Contoh Bertahap menampilkan penyelesaian satu langkah per ketukan dan dapat diulang | F12 |
| KFN-16 | Setiap percobaan soal (benar/salah, jenis kesalahan, jumlah petunjuk) disimpan ke database | F09, F13 |
| KFN-17 | Halaman Progres menampilkan status submateri dan hasil per level | F13 |

## 11. Kebutuhan Nonfungsional

| ID | Kebutuhan |
|---|---|
| KNF-01 | Seluruh teks antarmuka dan konten dalam Bahasa Indonesia sederhana untuk siswa SMP |
| KNF-02 | Mobile-first: tampil baik mulai lebar layar 360 px, tanpa gulir horizontal |
| KNF-03 | Area sentuh minimal 44 × 44 px; ukuran teks isi minimal 16 px |
| KNF-04 | Halaman awal (tanpa Three.js) ringan; Three.js hanya dimuat di halaman Simulasi **[Asumsi]**: target muat < 3 detik di 4G, akan diuji |
| KNF-05 | Animasi hanya untuk menunjukkan perubahan bermakna; menghormati pengaturan `prefers-reduced-motion` |
| KNF-06 | Warna tidak menjadi satu-satunya penanda (selalu disertai ikon atau teks); kontras minimal WCAG AA |
| KNF-07 | Privasi: tidak menyimpan nama asli, foto, atau data pribadi siswa; hanya kode |
| KNF-08 | Keamanan: Row Level Security aktif di semua tabel; kunci `service_role` tidak pernah ada di frontend |
| KNF-09 | Biaya: hanya memakai layanan tier gratis selama pengembangan (sekitar 2 bulan) |
| KNF-10 | Format angka Indonesia: Rp100.000; desimal memakai koma (16,67%) |

## 12. Kriteria Keberhasilan

Kriteria uji kualitatif mengikuti kolom "Cara menguji fitur" pada Matriks H dokumen wawancara. Target angka adalah **[Asumsi]** dan perlu persetujuan **[Keputusan K-09]**.

| No | Kriteria | Fitur | Cara uji (Matriks H) | Target usulan |
|---|---|---|---|---|
| KK1 | Siswa dapat mengikuti setiap tahap panduan dengan benar | F05 | Siswa mengerjakan soal dengan panduan, lalu diamati (H-1) | ≥ 80% langkah benar pada percobaan pertama atau kedua |
| KK2 | Siswa menemukan informasi penting tanpa banyak bantuan | F06 | Siswa diberi soal cerita, lalu diamati (H-2) | ≥ 3 dari 4 penanda benar tanpa petunjuk di Level 3 |
| KK3 | Tampilan mudah dipahami dan membantu belajar | Semua | Tanya jawab setelah penggunaan (H-3) | Tanggapan siswa uji positif; tidak ada keluhan "ramai" |
| KK4 | Siswa dapat menjelaskan proses menentukan untung/rugi dan persentasenya | F07 | Siswa menjelaskan aktivitas simulasi (H-4) | Penjelasan menyebut "dibagi harga beli" |
| KK5 | Siswa semakin mampu tanpa petunjuk | F11 | Penggunaan petunjuk dicatat (H-5) | Rata-rata petunjuk per soal turun dari Level 1 ke Level 3 |
| KK6 | Aplikasi berjalan di HP Android | Semua | Uji perangkat | Berjalan di Chrome Android pada minimal 2 HP berbeda |

## 13. Keputusan Teknis

Semua butir di bawah ini **disetujui pemilik proyek pada 11 November 2026** sesuai kolom rekomendasi. Butir bertanda [Konfirmasi] tanpa nomor (domain email sintetis, pemeriksaan jawaban di server) masih terbuka.

| ID | Hal | Keputusan |
|---|---|---|
| K-01 | Framework frontend | Vite + React (JavaScript) |
| K-02 | Hosting frontend (Supabase tidak ditujukan untuk hosting web statis) | Netlify atau Vercel (tier gratis) |
| K-03 | Mekanisme login kode siswa | Supabase Auth dengan akun per siswa (lihat [architecture.md](architecture.md) §5) |
| K-04 | Siapa yang membuat dan membagikan kode siswa | Pengembang, melalui skrip; guru membagikan |
| K-05 | Data siswa selain kode (kelas? nama?) | Hanya kode + kelas, tanpa nama |
| K-06 | Barang 3D di Simulasi | Tas sekolah sederhana (low-poly, dibuat dari bentuk dasar) |
| K-07 | Versi minimum peramban Android | Chrome Android versi terbaru dan dua versi sebelumnya |
| K-08 | Halaman guru (melihat progres kelas) | Tidak dibuat di versi ini |
| K-09 | Target angka kriteria keberhasilan | Seperti Bagian 12 |
| K-10 | Memindahkan file wawancara ke folder `referensi/` | Ya, agar sesuai struktur proyek |
