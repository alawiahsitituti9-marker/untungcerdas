# D-08 — Latihan Literasi Matematis dan Evaluasi (F14)

Versi: 1.1 · 1.0 **disetujui pemilik proyek, 12 November 2026** (KL-01 sampai KL-15 di PRD §13.1)

**Revisi 1.1 (disetujui pemilik proyek, 12 November 2026):** hasil pemeriksaan LM-05/LM-06, keputusan A dan E. Yang berubah hanya redaksi U4 (§4.1) dan satu baris ML-2 tahap 4 (§4.2). Baris yang direvisi ditandai **[Revisi 1.1]**. Soal, kunci, bobot, 23 tahap, bantuan, dan pembahasan tidak berubah.
Acuan: [PRD.md](../PRD.md) §8.3–8.5, §9 (F14) · [design.md](../design.md) §17 · [architecture.md](../architecture.md) §10 · [api.md](../api.md) §3.5, §5.3

Penanda di dokumen ini:

| Label | Arti |
|---|---|
| **[Spesifikasi]** | Ditetapkan pemilik proyek pada 12 November 2026 (tugas tambahan perkuliahan). **Tidak boleh diubah** tanpa persetujuan |
| **[Usulan]** | Rancangan pengembang, **disetujui 12 November 2026**. Label tetap dipakai untuk membedakan asal rancangan dari [Spesifikasi] |
| **[KL-xx]** | Keputusan terkait (12 November 2026); daftar lengkap di PRD §13.1 |

Aturan bahasa untuk teks siswa (AGENTS.md §4) tetap berlaku untuk semua teks [Usulan]: kalimat ≤ 15 kata, istilah tetap, format `Rp100.000` dan koma desimal.

---

## 1. Empat Indikator **[Spesifikasi]**

Nama lengkap dan urutan dipertahankan.

| No | Indikator | Deskriptor |
|---|---|---|
| 1 | **Mathematical Reasoning** | Mengidentifikasi hubungan matematis · membandingkan beberapa alternatif · memberikan alasan berdasarkan hasil perhitungan · menentukan keputusan yang tepat |
| 2 | **Formulating Situations Mathematically** | Mengidentifikasi informasi yang diketahui dan ditanyakan · menentukan besaran matematika yang diperlukan · membuat model matematika berdasarkan permasalahan sehari-hari |
| 3 | **Employing Mathematical Concepts, Facts, and Procedures** | Memilih rumus yang sesuai · menggunakan operasi matematika dengan benar · menghitung besar keuntungan, kerugian, dan persentasenya |
| 4 | **Interpreting, Applying, and Evaluating Mathematical Outcomes** | Menafsirkan hasil perhitungan · memeriksa kewajaran hasil · mengevaluasi kebenaran suatu pernyataan berdasarkan konsep matematika |

Keterangan singkat berbahasa Indonesia untuk layar siswa **[Usulan, KL-12]**:

| No | Keterangan di bawah nama indikator |
|---|---|
| 1 | Bernalar: membandingkan dan memberi alasan |
| 2 | Merumuskan: mengubah cerita menjadi model matematika |
| 3 | Menggunakan: memilih rumus dan menghitung |
| 4 | Menafsirkan: memeriksa dan menilai hasil |

## 2. Empat Soal dan Kunci Jawaban **[Spesifikasi]**

Teks soal dan kunci disalin persis dari persyaratan pemilik proyek. ID internal `ML-1` sampai `ML-4` mengikuti nomor soal.

### ML-1 · Soal 1 – Mathematical Reasoning

> Toko A membeli sebuah tas seharga Rp120.000 dan menjualnya seharga Rp150.000. Toko B membeli tas sejenis seharga Rp140.000 dan menjualnya seharga Rp175.000. Toko C membeli tas seharga Rp160.000 dan menjualnya seharga Rp192.000.
>
> Toko manakah yang memperoleh persentase keuntungan paling besar? Tunjukkan perhitungan dan alasanmu.

**Kunci jawaban:**
- Toko A: keuntungan Rp30.000, persentase keuntungan 25%.
- Toko B: keuntungan Rp35.000, persentase keuntungan 25%.
- Toko C: keuntungan Rp32.000, persentase keuntungan 20%.
- Kesimpulan: Toko A dan Toko B memperoleh persentase keuntungan terbesar, yaitu sama-sama 25%.

### ML-2 · Soal 2 – Formulating Situations Mathematically

> Ibu membeli sebuah blender dengan harga Rp250.000. Ibu ingin menjual blender tersebut dengan memperoleh keuntungan sebesar 20% dari harga beli.
>
> Berapakah harga jual blender yang harus ditetapkan? Tuliskan model matematika dan langkah penyelesaiannya.

**Kunci jawaban:**
- Harga beli = Rp250.000.
- Persentase keuntungan = 20%.
- Keuntungan = 20% × Rp250.000 = Rp50.000.
- Harga jual = harga beli + keuntungan.
- Harga jual = Rp250.000 + Rp50.000 = Rp300.000.

### ML-3 · Soal 3 – Employing Mathematical Concepts, Facts, and Procedures

> Pak Rudi membeli sebuah sepeda seharga Rp800.000. Sepeda tersebut kemudian dijual seharga Rp920.000. Pada kesempatan lain, ia membeli sebuah kipas angin seharga Rp500.000, tetapi hanya terjual seharga Rp425.000.
>
> Hitunglah besar keuntungan atau kerugian serta persentasenya untuk masing-masing barang.

**Kunci jawaban:**
- Sepeda: keuntungan Rp120.000 dan persentase keuntungan 15%.
- Kipas angin: kerugian Rp75.000 dan persentase kerugian 15%.

### ML-4 · Soal 4 – Interpreting, Applying, and Evaluating Mathematical Outcomes

> Dina membeli sebuah jaket seharga Rp400.000. Karena sedang membutuhkan uang, jaket tersebut dijual kembali seharga Rp340.000. Teman Dina menyatakan bahwa persentase kerugian yang dialami Dina adalah 17,65% karena kerugian Rp60.000 dibagi dengan harga jual Rp340.000.
>
> Apakah pernyataan teman Dina benar? Evaluasilah dengan perhitungan matematika dan jelaskan alasanmu.

**Kunci jawaban:**
- Kerugian = Rp400.000 − Rp340.000 = Rp60.000.
- Persentase kerugian = (kerugian ÷ harga beli) × 100%.
- Persentase kerugian = (Rp60.000 ÷ Rp400.000) × 100% = 15%.
- Kesimpulan: Pernyataan teman Dina tidak benar. Persentase kerugian yang tepat adalah 15% karena perhitungan persentase kerugian menggunakan harga beli sebagai dasar perhitungan.

### 2.1 Verifikasi angka (dihitung ulang pengembang, 12 November 2026)

Semua kunci **sesuai** dengan rumus resmi (AGENTS.md §4). Tidak ada angka yang diubah.

| Transaksi | HB | HJ | Jenis | Selisih | Persen (÷ HB) | Hitung balik |
|---|---|---|---|---|---|---|
| ML-1 Toko A | 120.000 | 150.000 | Untung | 30.000 | 25% | 25% × 120.000 = 30.000 ✓ |
| ML-1 Toko B | 140.000 | 175.000 | Untung | 35.000 | 25% | 25% × 140.000 = 35.000 ✓ |
| ML-1 Toko C | 160.000 | 192.000 | Untung | 32.000 | 20% | 20% × 160.000 = 32.000 ✓ |
| ML-2 Blender | 250.000 | 300.000 | Untung | 50.000 | 20% | 20% × 250.000 = 50.000 ✓ |
| ML-3 Sepeda | 800.000 | 920.000 | Untung | 120.000 | 15% | 15% × 800.000 = 120.000 ✓ |
| ML-3 Kipas angin | 500.000 | 425.000 | Rugi | 75.000 | 15% | 15% × 500.000 = 75.000 ✓ |
| ML-4 Jaket | 400.000 | 340.000 | Rugi | 60.000 | 15% | 15% × 400.000 = 60.000 ✓ |

Catatan ML-4: 60.000 ÷ 340.000 × 100% = 17,647…% → dibulatkan 17,65%, sesuai pernyataan teman Dina di soal. Angka ini sama dengan pola kesalahan **D1** (membagi dengan harga jual) di [design.md](../design.md) §10.2.

Catatan ML-1: kesalahan D1 pada ML-1 menghasilkan A = 20%, B = 20%, C = 16,67%. Kesimpulannya tetap "A dan B", sehingga tahap keputusan tidak membedakan D1. D1 dikenali di tahap 3.

Catatan ML-2: soal ini mencari harga jual dari persentase keuntungan ("soal kebalikan"). Jenis soal ini sebelumnya tertulis **di luar ruang lingkup** PRD §9 dan tidak dibahas di M0–M6. Lihat **KL-02**.

## 3. Rancangan Alur Pengerjaan **[Usulan]**

### 3.1 Prinsip umum

1. **Satu layar, satu tahap.** Setiap tahap rubrik menjadi satu layar dengan satu tugas. Contohnya tahap "pilih rumus" atau "isi besar keuntungan".
2. **Jawaban dikunci per tahap.** Setelah menekan "Simpan & lanjut", siswa tidak bisa kembali mengubah tahap itu. Aturan ini membuat skor tahap tidak berubah oleh bantuan dari tahap berikutnya.
3. **Tanpa tanda benar/salah selama pengerjaan [KL-08].** Semua umpan balik muncul di Hasil Evaluasi (P14).
4. **Penjelasan berbentuk pilihan [KL-07].** Permintaan "tunjukkan alasanmu" dan "tuliskan model matematika" dijawab dengan memilih model atau alasan. Siswa tidak menulis bebas. Alasannya:
   - isian bebas tidak dapat dinilai otomatis dengan andal;
   - tidak ada halaman guru untuk menilainya (K-08);
   - isian bebas berisiko memuat data pribadi (KNF-07).
5. **Soal dengan tanda buatan siswa selalu bisa dilihat.** Di atas setiap tahap ada panel "Soal" yang bisa dibuka-tutup. Panel ini menampilkan teks soal dengan tanda HB/HJ dari tahap 1 buatan siswa sendiri (signaling, T9, T10).
6. **Bantuan bertahap: 2 tingkat per tahap [KL-06].** Bantuan tidak memberikan jawaban dan tidak mengurangi skor. Pemakaiannya dicatat dan ditampilkan di hasil.
7. **Kartu Rumus** (F04) bisa dibuka sebagai lembar bawah di setiap tahap.
8. **Jawaban sementara tersimpan di HP.** Jika halaman tertutup, siswa melanjutkan dari tahap terakhir.

### 3.2 Urutan pengerjaan [KL-03]

| Pilihan | Urutan | Alasan |
|---|---|---|
| A. Urutan asli | Soal 1 → 2 → 3 → 4 | Sama dengan kisi-kisi tugas |
| **B. Dari yang sederhana (disarankan)** | Soal 3 → 4 → 2 → 1 | Sesuai ketentuan CLT bagian E1: soal disusun dari yang sederhana ke yang bertahap banyak. Soal 3 mirip Latihan Level 2. Soal 4 satu transaksi ditambah evaluasi. Soal 2 jenis soal baru (kebalikan). Soal 1 memuat tiga transaksi |

Pada kedua pilihan, laporan skor tetap disusun menurut urutan indikator 1–4. Nama soal di layar tetap "Soal 1" sampai "Soal 4" agar sesuai kisi-kisi. Urutan disimpan sebagai data (`urutan` di `literasi.json`), sehingga bisa diganti tanpa mengubah kode.

### 3.3 Tahapan per soal

Kolom **Kriteria C** merujuk ke enam aspek penilaian pada persyaratan bagian C:
**I** = identifikasi informasi · **M** = model matematika · **R** = memilih rumus · **H** = proses perhitungan · **T** = menafsirkan hasil · **K** = kesimpulan.

#### ML-1 (5 tahap, bobot 1, 1, 2, 1, 1 **[Spesifikasi]**)

| Tahap | Bobot | Kriteria C | Tugas di layar | Bentuk isian | Kunci |
|---|---|---|---|---|---|
| 1 | 1 | I | "Tandai harga beli dan harga jual setiap toko." | Penanda Informasi (F06), label HB / HJ pada 6 harga | A: HB 120.000, HJ 150.000 · B: HB 140.000, HJ 175.000 · C: HB 160.000, HJ 192.000 |
| 2 | 1 | H | "Hitung keuntungan setiap toko." | 3 × `InputRupiah` | 30.000 · 35.000 · 32.000 |
| 3 | 2 | R + H | "Pilih rumus persentase keuntungan. Lalu hitung untuk setiap toko." | `TombolPilihan` (3 rumus) + 3 × `InputPersen` | Untung ÷ HB × 100% · 25 · 25 · 20 |
| 4 | 1 | T | "Toko mana yang persentase keuntungannya paling besar?" | `TombolPilihan` | "Toko A dan Toko B (sama besar)" |
| 5 | 1 | K | "Pilih alasan yang tepat." | `TombolPilihan` | Alasan ✓ di §5 |

#### ML-2 (6 tahap, masing-masing 1 poin **[Spesifikasi]**)

| Tahap | Kriteria C | Tugas | Bentuk isian | Kunci |
|---|---|---|---|---|
| 1 | I | "Tandai harga beli dan persen keuntungan." | Penanda, label HB / Persen untung | Rp250.000 = HB · 20% = Persen untung |
| 2 | I | "Apa yang ditanyakan soal?" | `TombolPilihan` | Harga jual |
| 3 | M | "Pilih model untuk menghitung keuntungan." | `TombolPilihan` | Keuntungan = 20% × harga beli |
| 4 | H | "Hitung keuntungannya." | `InputRupiah` | 50.000 |
| 5 | M | "Pilih model untuk harga jual." | `TombolPilihan` | Harga jual = harga beli + keuntungan |
| 6 | H + K | "Berapa harga jual yang harus ditetapkan?" | `InputRupiah` | 300.000 |

#### ML-3 (6 tahap, masing-masing 1 poin **[Spesifikasi]**)

| Tahap | Kriteria C | Tugas | Bentuk isian | Kunci |
|---|---|---|---|---|
| 1 | I + T | "Untung atau rugi? Pilih untuk setiap barang." | 2 × `TombolPilihan` (▲ Untung / ▼ Rugi) | Sepeda ▲ Untung · Kipas angin ▼ Rugi |
| 2 | H | "Hitung keuntungan sepeda." | `InputRupiah` | 120.000 |
| 3 | H | "Hitung kerugian kipas angin." | `InputRupiah` | 75.000 |
| 4 | R | "Pilih rumus persentasenya." | `TombolPilihan` | Selisih ÷ harga beli × 100% |
| 5 | H | "Hitung persentase keuntungan sepeda." | `InputPersen` | 15 |
| 6 | H | "Hitung persentase kerugian kipas angin." | `InputPersen` | 15 |

#### ML-4 (6 tahap, masing-masing 1 poin **[Spesifikasi]**)

| Tahap | Kriteria C | Tugas | Bentuk isian | Kunci |
|---|---|---|---|---|
| 1 | I | "Tandai harga beli dan harga jual jaket." | Penanda, label HB / HJ | Rp400.000 = HB · Rp340.000 (kalimat ke-2) = HJ |
| 2 | H | "Hitung kerugian Dina." | `InputRupiah` | 60.000 |
| 3 | R | "Pilih rumus persentase kerugian yang benar." | `TombolPilihan` | (kerugian ÷ harga beli) × 100% |
| 4 | H | "Hitung persentase kerugian Dina." | `InputPersen` | 15 |
| 5 | T | "Apakah pernyataan teman Dina benar?" | `TombolPilihan` (Benar / Tidak benar) | Tidak benar |
| 6 | K | "Pilih alasan yang tepat." | `TombolPilihan` | Alasan ✓ di §5 |

Rangkuman jumlah: 5 + 6 + 6 + 6 = **23 tahap**, dengan skor 6 + 6 + 6 + 6 = **24** **[Spesifikasi]**.

## 4. Rubrik Analitik

Bagian **[Spesifikasi]**: skor maksimal per soal 6, total 24; jumlah tahap dan bobot per soal; enam aspek penilaian C.
Bagian **[Usulan, KL-04 dan KL-05]**: kriteria rinci setiap tahap di bawah ini.

### 4.1 Aturan umum [Usulan]

| No | Aturan |
|---|---|
| U1 | Tahap berbobot 1 dinilai **0 atau 1**. Skor 1 hanya jika **semua** isian di tahap itu benar |
| U2 | Tahap berbobot 2 (ML-1 tahap 3) dinilai **0, 1, atau 2**: 1 poin untuk rumus, 1 poin untuk ketiga persentase |
| U3 | Isian persen dianggap benar dengan toleransi ±0,01 (api.md §6). Contoh: 25 dan 25,00 benar |
| U4 | **Penilaian konsekuen [KL-05] [Revisi 1.1].** Tahap **perhitungan** (H) tetap dinilai benar jika angkanya salah hanya karena memakai **hasil angka** salah siswa di tahap sebelumnya, tetapi dihitung dengan benar. Hal yang sama berlaku untuk **ML-1 tahap 4**: keputusan dinilai benar jika sesuai persen terbesar dari hasil persentase siswa sendiri di tahap 3. Tujuannya agar satu kesalahan tidak dihukum berulang kali. Aturan ini **tidak** berlaku untuk tahap memilih rumus atau model (R, M), tahap evaluasi pernyataan (ML-4 tahap 5), dan tahap alasan. Penilaian konsekuen juga **tidak** boleh bersumber dari pilihan rumus atau model yang salah |
| U5 | Isian kosong atau format tidak terbaca = 0. Tombol "Simpan & lanjut" tidak aktif sebelum semua isian terisi |
| U6 | Bantuan tidak mengurangi skor [KL-06]. Jumlah bantuan per tahap dicatat |
| U7 | Setiap tahap yang belum tepat diberi **kode umpan balik**. Kode ini dipakai untuk memilih pembahasan dan saran materi (§5, §6) |

### 4.2 Kriteria rinci per tahap [Usulan]

#### ML-1 — Mathematical Reasoning (maks. 6)

| Tahap | Skor 0 | Skor 1 | Skor 2 |
|---|---|---|---|
| 1 Identifikasi | Ada label HB/HJ yang salah atau belum diberi | Keenam harga berlabel benar | – |
| 2 Keuntungan | Ada keuntungan yang salah dan tidak konsekuen | Ketiga keuntungan benar, atau konsekuen dengan label di tahap 1 (U4) | – |
| 3 Persentase | Rumus salah **dan** ada persen yang salah | Rumus benar tetapi ada persen salah, **atau** rumus salah tetapi ketiga persen benar | Rumus benar **dan** ketiga persen benar (atau konsekuen dengan tahap 2) |
| 4 Keputusan | Pilihan tidak sesuai dengan persen terbesar | Memilih "Toko A dan Toko B", atau pilihan sesuai persen terbesar dari hasil siswa sendiri (U4) | – |
| 5 Alasan | Alasan membandingkan rupiah, harga jual, atau memakai pembagi yang salah | Alasan membandingkan persentase yang dihitung dari harga beli | – |

#### ML-2 — Formulating Situations Mathematically (maks. 6)

| Tahap | Skor 0 | Skor 1 |
|---|---|---|
| 1 Diketahui | Rp250.000 tidak berlabel HB, atau 20% tidak berlabel Persen untung | Keduanya berlabel benar |
| 2 Ditanya | Memilih keuntungan atau persentase | Memilih harga jual |
| 3 Model keuntungan | Memilih × harga jual, × 20 (tanpa %), atau ÷ 20% | Keuntungan = 20% × harga beli |
| 4 Hitung keuntungan **[Revisi 1.1]** | Selain 50.000, termasuk hasil yang konsisten dengan model salah di tahap 3 | 50.000 (tanpa penilaian konsekuen, karena tahap 3 adalah pemilihan model) |
| 5 Model harga jual | HB − keuntungan, atau harga jual = keuntungan | Harga jual = harga beli + keuntungan |
| 6 Harga jual | Selain 300.000 (dan tidak konsekuen) | 300.000, atau 250.000 + keuntungan dari tahap 4 siswa (U4) |

#### ML-3 — Employing Mathematical Concepts, Facts, and Procedures (maks. 6)

| Tahap | Skor 0 | Skor 1 |
|---|---|---|
| 1 Jenis | Salah satu jenis tertukar | Sepeda untung **dan** kipas angin rugi |
| 2 Untung sepeda | Selain 120.000 | 120.000 |
| 3 Rugi kipas | Selain 75.000 | 75.000 |
| 4 Rumus persen | Membagi dengan harga jual, atau tanpa × 100% | Selisih ÷ harga beli × 100% |
| 5 Persen sepeda | Selain 15 (dan tidak konsekuen) | 15, atau (tahap 2 siswa ÷ 800.000) × 100 (U4) |
| 6 Persen kipas | Selain 15 (dan tidak konsekuen) | 15, atau (tahap 3 siswa ÷ 500.000) × 100 (U4) |

#### ML-4 — Interpreting, Applying, and Evaluating Mathematical Outcomes (maks. 6)

| Tahap | Skor 0 | Skor 1 |
|---|---|---|
| 1 Identifikasi | Rp400.000 bukan HB, atau Rp340.000 di kalimat ke-2 bukan HJ, atau angka lain diberi label HB/HJ (kecuali Rp340.000 di kalimat ke-3 yang memang harga jual) | HB dan HJ berlabel benar |
| 2 Kerugian | Selain 60.000 | 60.000 |
| 3 Rumus | Memilih pembagi harga jual (cara teman Dina) atau tanpa × 100% | (kerugian ÷ harga beli) × 100% |
| 4 Persen | Selain 15 (dan tidak konsekuen) | 15, atau (tahap 2 siswa ÷ 400.000) × 100 (U4) |
| 5 Evaluasi | "Benar" | "Tidak benar" |
| 6 Alasan | Alasan yang membenarkan pembagi harga jual, atau alasan yang salah konsep | "Tidak benar. Persentase kerugian dihitung dari harga beli, jadi 15%." |

### 4.3 Kemampuan rubrik terhadap ketentuan bagian C

| Aspek bagian C | Tahap yang menilai |
|---|---|
| Ketepatan mengidentifikasi informasi | ML-1 t1 · ML-2 t1, t2 · ML-3 t1 · ML-4 t1 |
| Ketepatan menentukan model matematika | ML-2 t3, t5 |
| Ketepatan memilih rumus | ML-1 t3 · ML-3 t4 · ML-4 t3 |
| Ketepatan proses perhitungan | ML-1 t2, t3 · ML-2 t4, t6 · ML-3 t2, t3, t5, t6 · ML-4 t2, t4 |
| Ketepatan menafsirkan hasil | ML-1 t4 · ML-3 t1 · ML-4 t5 |
| Ketepatan memberikan kesimpulan | ML-1 t5 · ML-2 t6 · ML-4 t6 |

Semua aspek dinilai di lebih dari satu tahap. Skor setiap indikator = skor soal yang mewakilinya (Soal n → Indikator n).

## 5. Pilihan Jawaban, Pengecoh, dan Umpan Balik [Usulan]

Pengecoh disusun dari pola kesalahan yang sudah tercatat (design.md §10.2; T2, T3, T7). Umpan balik mengikuti 4 unsur pembahasan F10: bagian yang belum tepat → konsep → cara memperbaiki → contoh benar.

### ML-1

**Tahap 3, pilihan rumus**

| Pilihan | Kode | Umpan balik |
|---|---|---|
| ✓ Untung ÷ harga beli × 100% | – | – |
| Untung ÷ harga jual × 100% | D1 | Persentase keuntungan dihitung dari **harga beli**, bukan harga jual. |
| Untung × harga beli ÷ 100 | R-SALAH | Untung dibagi harga beli, lalu dikali 100%. |

**Tahap 3, isian persen.** Jika isian sesuai pola D1 (A 20, B 20, C 16,67): "Sepertinya kamu membagi dengan harga jual. Coba bagi dengan harga beli." Jika sesuai pola D2 (0,25 / 0,25 / 0,2): "Kamu lupa mengalikan dengan 100%."

**Tahap 4, keputusan:** Toko A · Toko B · Toko C · ✓ Toko A dan Toko B (sama besar)

| Pilihan salah | Umpan balik |
|---|---|
| Toko B | Toko B untung paling banyak dalam rupiah. Tetapi persennya sama dengan Toko A. |
| Toko A | Persen Toko A memang 25%. Toko B juga 25%, jadi keduanya sama besar. |
| Toko C | Toko C hanya 20%. Toko A dan Toko B 25%. |

**Tahap 5, alasan**

| Pilihan | Kode | Umpan balik |
|---|---|---|
| ✓ Persen untung A dan B sama-sama 25%, lebih besar dari C (20%). | – | – |
| Toko B, karena besar keuntungannya paling banyak, yaitu Rp35.000. | ALASAN-RUPIAH | Bandingkan persennya, bukan rupiahnya. Modal setiap toko berbeda. |
| Toko C, karena harga jualnya paling tinggi. | ALASAN-HJ | Harga jual tinggi belum tentu untungnya besar. Hitung persen dari harga beli. |
| Semua sama, karena keuntungan dibagi harga jual. | D1 | Persentase keuntungan selalu dibagi **harga beli**. |

### ML-2

**Tahap 2, ditanya:** ✓ Harga jual · Besar keuntungan · Persentase keuntungan
Umpan balik jika salah: "Baca lagi kalimat tanya: *Berapakah harga jual …?*"

**Tahap 3, model keuntungan**

| Pilihan | Kode | Umpan balik |
|---|---|---|
| ✓ Keuntungan = 20% × harga beli | – | – |
| Keuntungan = 20% × harga jual | D1 | Soal menyebut "20% dari harga beli". Jadi dikali harga beli. |
| Keuntungan = 20 × harga beli | D2 | 20% artinya 20 per seratus. Jadi 20% × 250.000 = 20/100 × 250.000. |
| Keuntungan = harga beli ÷ 20% | M-SALAH | Untuk mencari 20% dari suatu harga, kalikan, jangan dibagi. |

**Tahap 4, isian.** Jika 5.000.000 (lupa ÷ 100): kode D2, "20% sama dengan 20/100. Bagi dengan 100."

**Tahap 5, model harga jual**

| Pilihan | Kode | Umpan balik |
|---|---|---|
| ✓ Harga jual = harga beli + keuntungan | – | – |
| Harga jual = harga beli − keuntungan | D3 | Ibu ingin untung. Jadi harga jual lebih besar dari harga beli. |
| Harga jual = keuntungan | M-SALAH | Keuntungan hanya tambahannya. Harga beli harus ikut dijumlahkan. |

**Tahap 6, isian.** Jika 200.000: kode D3, "Kamu mengurangi. Untung berarti harga jual lebih besar." Jika 50.000: kode M-SALAH, "Itu besar keuntungannya. Harga jual = 250.000 + keuntungan."

**Bantuan khusus soal kebalikan [KL-02].** Soal ini tidak dibahas di M0–M6. Karena itu bantuan tingkat 2 di tahap 5 memuat pengingat: "Untung = HJ − HB. Jadi HJ = HB + untung." Pengingat ini diturunkan dari rumus resmi, tanpa mengubah materi.

### ML-3

**Tahap 1:** sepeda dan kipas masing-masing ▲ Untung / ▼ Rugi. Umpan balik jika tertukar: "Bandingkan harga jual dengan harga beli. Kipas dijual lebih murah, jadi rugi." (D3)

**Tahap 2–3, isian.** Jika siswa menulis selisih bertanda negatif atau angka yang salah: kode D4, "Rugi = HB − HJ = 500.000 − 425.000."

**Tahap 4, rumus persen**

| Pilihan | Kode | Umpan balik |
|---|---|---|
| ✓ Selisih ÷ harga beli × 100% | – | – |
| Selisih ÷ harga jual × 100% | D1 | Untung dan rugi sama-sama dibagi **harga beli**. |
| Selisih ÷ harga beli | D2 | Hasil bagi masih perlu dikali 100%. |

**Tahap 5–6, isian.** D1: sepeda 13,04 / kipas 17,65. D2: 0,15. Umpan balik sama dengan tahap 4.

### ML-4

**Tahap 3, rumus**

| Pilihan | Kode | Umpan balik |
|---|---|---|
| ✓ (kerugian ÷ harga beli) × 100% | – | – |
| (kerugian ÷ harga jual) × 100% | D1 | Itu cara teman Dina. Persentase kerugian dibagi **harga beli**. |
| kerugian ÷ harga beli | D2 | Hasil bagi masih perlu dikali 100%. |

**Tahap 4, isian.** Jika 17,65: kode D1, "Kamu memakai cara teman Dina. Bagi dengan 400.000."

**Tahap 5:** Benar · ✓ Tidak benar. Umpan balik jika "Benar": "Teman Dina membagi dengan harga jual. Itu tidak sesuai rumus."

**Tahap 6, alasan**

| Pilihan | Kode | Umpan balik |
|---|---|---|
| ✓ Tidak benar. Persentase kerugian dihitung dari harga beli, jadi 15%. | – | – |
| Benar, karena 60.000 ÷ 340.000 × 100% = 17,65%. | D1 | Hitungannya tepat, tetapi pembaginya salah. Seharusnya harga beli. |
| Tidak benar, karena kerugiannya bukan Rp60.000. | ALASAN-SELISIH | Kerugiannya memang Rp60.000. Yang salah adalah pembaginya. |
| Tidak benar, karena harus dibagi harga jual lalu dikali 2. | ALASAN-ACAK | Tidak ada aturan dikali 2. Bagi kerugian dengan harga beli. |

## 6. Bantuan Bertahap per Tahap [Usulan, KL-06]

Setiap tahap punya 2 tingkat bantuan, mengikuti F11 (design.md §9) tetapi tanpa tingkat 3–4 yang hampir memberi jawaban.

| Tingkat | Isi | Contoh (ML-4 tahap 4) |
|---|---|---|
| 1. Arah | Menunjukkan informasi yang dipakai | "Pakai kerugian dari tahap 2 dan harga beli jaket." |
| 2. Rumus | Menunjukkan rumus tanpa hasil | "% Rugi = Rugi ÷ HB × 100%." |

Teks bantuan dan pembahasan lengkap untuk 23 tahap ada di [LM-03_bantuan_pembahasan.md](LM-03_bantuan_pembahasan.md) (tugas LM-03), lalu dipindah ke `literasi.json` di LM-05.

## 7. Saran Materi dari Hasil [Usulan]

Saran disusun dari kode umpan balik pada tahap yang belum tepat. Paling banyak 3 saran, diurutkan menurut banyaknya tahap yang terkait.

| Kode / tahap yang belum tepat | Saran yang ditampilkan | Tautan |
|---|---|---|
| Tahap identifikasi (label HB/HJ) | "Ulangi: Harga Beli dan Harga Jual" | M1 |
| D3, tahap jenis | "Ulangi: Untung atau Rugi?" | M2 |
| D4, isian selisih | "Ulangi: Menghitung Untung / Menghitung Rugi" | M3 / M4 |
| D1, D2, R-SALAH | "Ulangi: Persentase Untung (mengapa dibagi harga beli)" | M5 (kartu 3 dan 5) |
| D1 pada soal rugi | "Ulangi: Persentase Rugi" | M6 |
| M-SALAH, ML-2 tahap 3–6 | "Lihat lagi: Kartu Rumus dan pembahasan Soal 2" | P05 + P14 |
| ALASAN-* | "Lihat lagi: contoh cara yang salah dan benar" | M5 kartu 5 |
| Semua tahap benar | "Hebat! Coba latihan Level 4 untuk soal cerita lain." | P08 |

**Aturan prioritas [Revisi 1.1, disetujui 12 November 2026]** untuk baris yang tumpang tindih:
1. Baris khusus **ML-2 tahap 3–6** didahulukan untuk tahap-tahap tersebut (semua kode → Kartu Rumus dan pembahasan Soal 2).
2. **D1 pada tahap alasan** (ML-1 tahap 5, ML-4 tahap 6) → M5 kartu 5. Aturan ini didahulukan dari aturan 3.
3. **D1 pada soal rugi** → M6. ML-3 (untung dan rugi sekaligus) tahap 4 tetap → M5.
4. **D2** → M5 di mana pun, kecuali tahap yang terkena aturan 1.
5. **ALASAN-*** → M5 kartu 5.
6. Kode tambahan: `KEPUTUSAN` (ML-1 tahap 4) → M5; `PERSEN` (isian/rumus persen tanpa pola) → M5 untuk untung, M6 untuk rugi; `IDENTIFIKASI` → M1; `KOSONG` (belum dijawab) → topik tahap.
7. D4 memakai satu saran gabungan dengan teks persis "Ulangi: Menghitung Untung / Menghitung Rugi", bertaut ke M3 (siswa lanjut ke M4 lewat navigasi materi), dan dihitung sebagai satu slot.

## 8. Pesan Hasil per Indikator [Usulan, KL-11]

Pesan memakai rentang skor, tanpa kata nilai atau peringkat (design.md §6 P11: progres tanpa ranking).

| Skor indikator | Pesan |
|---|---|
| 6 | Semua tahap sudah tepat. |
| 4–5 | Hampir semua tepat. Lihat tahap yang perlu diperbaiki. |
| 2–3 | Sebagian sudah tepat. Pelajari pembahasannya pelan-pelan. |
| 0–1 | Ayo ulangi materinya dulu, lalu coba lagi. |
