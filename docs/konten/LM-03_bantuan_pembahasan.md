# LM-03 — Teks Bantuan dan Pembahasan F14 Latihan Literasi Matematis

Versi: 1.0 (**disetujui pemilik proyek, 12 November 2026**)
Acuan: [D-08](D-08_literasi_matematis.md) v1.0 (disetujui 12 November 2026) · [PRD](../PRD.md) §8.3–8.5, §13.1 · [design.md](../design.md) §17

| Label | Arti |
|---|---|
| **[Spesifikasi]** | Disalin persis dari soal dan kunci jawaban pemilik proyek (PRD §8.4). Tidak diubah |
| **[Usulan]** | Teks baru pengembang di dokumen ini, **disetujui 12 November 2026**. Label tetap dipakai untuk membedakan asal teks |

Semua teks di dokumen ini adalah **[Usulan]**, kecuali baris yang diberi label **[Spesifikasi]**.

---

## 1. Aturan Penulisan

| No | Aturan | Asal |
|---|---|---|
| A1 | 23 tahap dan bobotnya mengikuti D-08 §3.3 tanpa perubahan | [Spesifikasi] + KL-04 |
| A2 | Rumus persentase keuntungan dan kerugian selalu dibagi **harga beli** | [Spesifikasi] (AGENTS.md §4, PRD §8.3) |
| A3 | Setiap tahap punya 2 tingkat bantuan: **Bantuan 1 (awal)** mengarahkan ke informasi, **Bantuan 2 (lanjutan)** menunjukkan rumus atau konsep | KL-06, D-08 §6 |
| A4 | Bantuan **tidak** memuat hasil akhir tahap itu. Di tahap memilih rumus/model/alasan, Bantuan 2 berbentuk **pertanyaan penuntun**, supaya pilihan yang benar tidak langsung terlihat | [Usulan], ketentuan LM-03 no. 6 |
| A5 | Pembahasan tahap yang **perlu diperbaiki** memuat 5 bagian berurutan: Jawabanmu → Letak kesalahan → Konsep → Cara memperbaiki → Hasil yang benar | Unsur F10 (design.md §10.2) + design.md §17.5 |
| A6 | "Letak kesalahan" memakai umpan balik khusus per pengecoh di D-08 §5 bila kodenya cocok. Jika tidak cocok, dipakai teks "Letak kesalahan (umum)" di dokumen ini | D-08 §4.1 U7 |
| A7 | Tahap yang **sudah benar** hanya menampilkan satu kalimat penguat (baris "Jika sudah benar") | design.md §17.5 |
| A8 | Kalimat ≤ 15 kata; bahasa sederhana; format `Rp100.000`, koma desimal. Baris [Spesifikasi] tidak dihitung | AGENTS.md §4 |
| A9 | Setiap soal dibuka dengan satu kalimat pengantar yang menyebut indikatornya | Ketentuan LM-03 no. 7 |

### 1.1 Pesan umum

| Situasi | Teks |
|---|---|
| Tahap dinilai benar secara konsekuen (KL-05) | Hitunganmu benar dengan angkamu sendiri. Perbaiki angka di tahap {n}. |
| ML-1 tahap 3 skor 1, rumus benar | Rumusmu sudah benar. Periksa lagi hitungan persennya. |
| ML-1 tahap 3 skor 1, hitungan benar | Hitunganmu benar. Tetapi rumus yang kamu pilih belum tepat. |
| Bantuan dipakai di tahap itu | Kamu memakai {n} bantuan di tahap ini. |
| Tombol bantuan sudah habis | Bantuan sudah habis. Coba kerjakan dengan langkahmu sendiri. |

---

## 2. Soal 1 — Mathematical Reasoning (ML-1)

**Pengantar indikator:** Soal ini melatih bernalar. Kamu membandingkan tiga toko dan memberi alasan.

#### ML-1 · Tahap 1 — Identifikasi harga (bobot 1)
- **Bantuan 1:** Setiap toko punya dua harga. Cari kata "membeli" dan "menjual".
- **Bantuan 2:** Angka sesudah kata "membeli" adalah harga beli. Angka sesudah kata "menjualnya" adalah harga jual.
- **Jika sudah benar:** Kamu menemukan harga beli dan harga jual ketiga toko.
- **Letak kesalahan (umum):** Ada harga yang labelnya tertukar atau belum diberi label.
- **Konsep:** Harga beli adalah uang yang dikeluarkan toko. Harga jual adalah uang yang diterima toko.
- **Cara memperbaiki:** Baca satu toko dulu. Tandai harga belinya, lalu harga jualnya.
- **Hasil yang benar:** Toko A: HB Rp120.000, HJ Rp150.000. Toko B: HB Rp140.000, HJ Rp175.000. Toko C: HB Rp160.000, HJ Rp192.000.

#### ML-1 · Tahap 2 — Keuntungan setiap toko (bobot 1)
- **Bantuan 1:** Lihat harga beli dan harga jual setiap toko di ringkasan.
- **Bantuan 2:** Untung = HJ − HB. Hitung untuk Toko A, B, dan C satu per satu.
- **Jika sudah benar:** Kamu menghitung keuntungan ketiga toko dengan tepat.
- **Letak kesalahan (umum):** Ada keuntungan yang hitungannya belum tepat.
- **Konsep:** Keuntungan adalah selisih harga jual dan harga beli.
- **Cara memperbaiki:** Kurangi harga jual dengan harga beli. Hitung dalam ribuan agar mudah.
- **Hasil yang benar:** A: 150.000 − 120.000 = Rp30.000. B: 175.000 − 140.000 = Rp35.000. C: 192.000 − 160.000 = Rp32.000.

#### ML-1 · Tahap 3 — Rumus dan persentase (bobot 2)
- **Bantuan 1:** Persentase membandingkan untung dengan modal toko. Modal itu harga yang mana?
- **Bantuan 2:** Bagi untung dengan modal toko. Sederhanakan pecahannya, lalu kalikan 100%.
- **Jika sudah benar:** Kamu memilih pembagi yang tepat dan menghitung ketiga persen dengan benar.
- **Letak kesalahan (umum):** Rumus atau sebagian persen belum tepat.
- **Konsep:** Persentase keuntungan selalu dibagi harga beli. Harga beli adalah modal toko.
- **Cara memperbaiki:** Bagi keuntungan dengan harga beli. Sederhanakan, lalu kalikan 100%.
- **Hasil yang benar:** % Untung = Untung ÷ HB × 100%. A: 30.000 ÷ 120.000 × 100% = 25%. B: 35.000 ÷ 140.000 × 100% = 25%. C: 32.000 ÷ 160.000 × 100% = 20%.

#### ML-1 · Tahap 4 — Keputusan (bobot 1)
- **Bantuan 1:** Lihat lagi tiga persen yang sudah kamu hitung.
- **Bantuan 2:** Cari persen paling besar. Apakah ada dua toko dengan persen yang sama?
- **Jika sudah benar:** Kamu memutuskan berdasarkan persentase, bukan besar rupiahnya.
- **Letak kesalahan (umum):** Pilihanmu belum sesuai dengan persen paling besar.
- **Konsep:** Toko terbaik ditentukan dari persentase keuntungan, karena modal setiap toko berbeda.
- **Cara memperbaiki:** Urutkan persen ketiga toko. Pilih yang paling besar. Jika sama, pilih keduanya.
- **Hasil yang benar:** Toko A dan Toko B sama-sama 25%. Toko C hanya 20%.

#### ML-1 · Tahap 5 — Alasan (bobot 1)
- **Bantuan 1:** Alasan yang baik memakai hasil hitunganmu.
- **Bantuan 2:** Mana yang dibandingkan: rupiah keuntungan atau persentase keuntungan?
- **Jika sudah benar:** Alasanmu memakai persentase yang dihitung dari harga beli.
- **Letak kesalahan (umum):** Alasanmu belum memakai persentase dari harga beli.
- **Konsep:** Rupiah keuntungan tidak adil dibandingkan jika modalnya berbeda. Persentase membuatnya adil.
- **Cara memperbaiki:** Sebutkan persen setiap toko. Lalu jelaskan toko mana yang paling besar.
- **Hasil yang benar:** Persen untung A dan B sama-sama 25%, lebih besar dari C (20%).

### 2.1 Penyelesaian lengkap ML-1 (tombol "Lihat penyelesaian lengkap")

Satu baris tampil per ketukan.

| Langkah | Teks | Asal |
|---|---|---|
| 1 | Toko A: untung 150.000 − 120.000 = 30.000. Persen 30.000 ÷ 120.000 × 100% = 25%. | [Usulan] perhitungan |
| 2 | Toko B: untung 175.000 − 140.000 = 35.000. Persen 35.000 ÷ 140.000 × 100% = 25%. | [Usulan] perhitungan |
| 3 | Toko C: untung 192.000 − 160.000 = 32.000. Persen 32.000 ÷ 160.000 × 100% = 20%. | [Usulan] perhitungan |
| 4 | Toko A: keuntungan Rp30.000, persentase keuntungan 25%. | [Spesifikasi] |
| 5 | Toko B: keuntungan Rp35.000, persentase keuntungan 25%. | [Spesifikasi] |
| 6 | Toko C: keuntungan Rp32.000, persentase keuntungan 20%. | [Spesifikasi] |
| 7 | Kesimpulan: Toko A dan Toko B memperoleh persentase keuntungan terbesar, yaitu sama-sama 25%. | [Spesifikasi] |

---

## 3. Soal 2 — Formulating Situations Mathematically (ML-2)

**Pengantar indikator:** Soal ini melatih merumuskan. Kamu mengubah cerita menjadi model matematika.

#### ML-2 · Tahap 1 — Yang diketahui (bobot 1)
- **Bantuan 1:** Ada dua hal yang diketahui: satu harga dan satu persen.
- **Bantuan 2:** Harga yang dibayar Ibu saat membeli adalah harga beli. Angka bertanda % adalah persen untung.
- **Jika sudah benar:** Kamu menemukan harga beli dan persen keuntungan.
- **Letak kesalahan (umum):** Label harga beli atau persen untung belum tepat.
- **Konsep:** Di soal ini harga jual belum diketahui. Yang diketahui harga beli dan persen untung.
- **Cara memperbaiki:** Cari kata "membeli" untuk harga beli. Cari tanda % untuk persennya.
- **Hasil yang benar:** Harga beli = Rp250.000. Persentase keuntungan = 20%. **[Spesifikasi]**

#### ML-2 · Tahap 2 — Yang ditanyakan (bobot 1)
- **Bantuan 1:** Baca kalimat yang diakhiri tanda tanya.
- **Bantuan 2:** Kata sesudah "Berapakah" menunjukkan hal yang ditanyakan.
- **Jika sudah benar:** Kamu tahu bahwa yang dicari adalah harga jual.
- **Letak kesalahan (umum):** Hal yang ditanyakan belum tepat.
- **Konsep:** Mengetahui yang ditanyakan membantu memilih langkah berikutnya.
- **Cara memperbaiki:** Baca lagi kalimat tanya di akhir soal pelan-pelan.
- **Hasil yang benar:** Yang ditanyakan adalah harga jual blender.

#### ML-2 · Tahap 3 — Model keuntungan (bobot 1)
- **Bantuan 1:** Cari kalimat yang menyebut "keuntungan sebesar 20% dari …".
- **Bantuan 2:** "20% dari suatu harga" berarti dikali atau dibagi? Dari harga yang mana?
- **Jika sudah benar:** Kamu membuat model keuntungan dari harga beli dengan tepat.
- **Letak kesalahan (umum):** Model keuntungan belum tepat.
- **Konsep:** "20% dari harga beli" artinya 20/100 dikali harga beli.
- **Cara memperbaiki:** Ubah kata "dari" menjadi perkalian. Pakai harga beli, bukan harga jual.
- **Hasil yang benar:** Keuntungan = 20% × harga beli.

#### ML-2 · Tahap 4 — Hitung keuntungan (bobot 1)
- **Bantuan 1:** Pakai model dari tahap 3 dan harga beli blender.
- **Bantuan 2:** 20% sama dengan 20/100. Bagi harga beli dengan 100, lalu kalikan 20.
- **Jika sudah benar:** Kamu menghitung keuntungan 20% dengan tepat.
- **Letak kesalahan (umum):** Hasil keuntungan belum tepat.
- **Konsep:** Persen artinya per seratus.
- **Cara memperbaiki:** Hitung 250.000 ÷ 100 dulu. Lalu kalikan hasilnya dengan 20.
- **Hasil yang benar:** Keuntungan = 20% × Rp250.000 = Rp50.000. **[Spesifikasi]**

#### ML-2 · Tahap 5 — Model harga jual (bobot 1)
- **Bantuan 1:** Ibu ingin untung. Jadi harga jual lebih besar atau lebih kecil dari harga beli?
- **Bantuan 2:** Untung = HJ − HB. Jadi HJ = HB + untung. *(teks ini ditetapkan di D-08 §5 dan KL-02; lihat §6 butir 1)*
- **Jika sudah benar:** Kamu tahu harga jual sama dengan harga beli ditambah keuntungan.
- **Letak kesalahan (umum):** Model harga jual belum tepat.
- **Konsep:** Untung = HJ − HB. Jadi harga jual = harga beli + untung.
- **Cara memperbaiki:** Jika ingin untung, tambahkan keuntungan ke harga beli.
- **Hasil yang benar:** Harga jual = harga beli + keuntungan. **[Spesifikasi]**

#### ML-2 · Tahap 6 — Harga jual (bobot 1)
- **Bantuan 1:** Pakai model dari tahap 5 dan keuntungan dari tahap 4.
- **Bantuan 2:** Jumlahkan harga beli dengan keuntungan. Harga jual harus lebih besar dari harga beli.
- **Jika sudah benar:** Kamu menemukan harga jual yang memberi untung 20%.
- **Letak kesalahan (umum):** Harga jual belum tepat.
- **Konsep:** Harga jual yang benar memberi keuntungan tepat 20% dari harga beli.
- **Cara memperbaiki:** Tambahkan keuntungan ke harga beli. Lalu periksa dengan hitung balik.
- **Hasil yang benar:** Harga jual = Rp250.000 + Rp50.000 = Rp300.000. **[Spesifikasi]** Periksa: 50.000 ÷ 250.000 × 100% = 20%. **[Usulan]**

### 3.1 Penyelesaian lengkap ML-2

| Langkah | Teks | Asal |
|---|---|---|
| 1 | Harga beli = Rp250.000. | [Spesifikasi] |
| 2 | Persentase keuntungan = 20%. | [Spesifikasi] |
| 3 | Keuntungan = 20% × Rp250.000 = Rp50.000. | [Spesifikasi] |
| 4 | Harga jual = harga beli + keuntungan. | [Spesifikasi] |
| 5 | Harga jual = Rp250.000 + Rp50.000 = Rp300.000. | [Spesifikasi] |
| 6 | Periksa: 50.000 ÷ 250.000 × 100% = 20%. Sesuai keinginan Ibu. | [Usulan] hitung balik |

---

## 4. Soal 3 — Employing Mathematical Concepts, Facts, and Procedures (ML-3)

**Pengantar indikator:** Soal ini melatih memakai rumus. Kamu menghitung untung, rugi, dan persennya.

#### ML-3 · Tahap 1 — Untung atau rugi (bobot 1)
- **Bantuan 1:** Bandingkan harga jual dengan harga beli untuk setiap barang.
- **Bantuan 2:** Harga jual lebih besar berarti untung. Harga jual lebih kecil berarti rugi.
- **Jika sudah benar:** Kamu menentukan jenis transaksi kedua barang dengan tepat.
- **Letak kesalahan (umum):** Jenis untung atau rugi tertukar.
- **Konsep:** Selalu bandingkan harga jual dengan harga beli sebelum menghitung.
- **Cara memperbaiki:** Sepeda: bandingkan 920.000 dengan 800.000. Kipas: bandingkan 425.000 dengan 500.000.
- **Hasil yang benar:** Sepeda ▲ untung, karena 920.000 > 800.000. Kipas angin ▼ rugi, karena 425.000 < 500.000.

#### ML-3 · Tahap 2 — Keuntungan sepeda (bobot 1)
- **Bantuan 1:** Pakai harga beli dan harga jual sepeda saja.
- **Bantuan 2:** Untung = HJ − HB. Hitung dalam ribuan agar mudah.
- **Jika sudah benar:** Kamu menghitung keuntungan sepeda dengan tepat.
- **Letak kesalahan (umum):** Keuntungan sepeda belum tepat.
- **Konsep:** Untung = harga jual − harga beli.
- **Cara memperbaiki:** Kurangi 920.000 dengan 800.000. Dalam ribuan: 920 − 800.
- **Hasil yang benar:** Untung sepeda = 920.000 − 800.000 = Rp120.000.

#### ML-3 · Tahap 3 — Kerugian kipas angin (bobot 1)
- **Bantuan 1:** Pakai harga beli dan harga jual kipas angin saja.
- **Bantuan 2:** Rugi = HB − HJ. Yang lebih besar dikurangi yang lebih kecil.
- **Jika sudah benar:** Kamu menghitung kerugian kipas angin dengan tepat.
- **Letak kesalahan (umum):** Kerugian kipas angin belum tepat.
- **Konsep:** Rugi = harga beli − harga jual. Hasilnya tidak negatif.
- **Cara memperbaiki:** Kurangi 500.000 dengan 425.000. Dalam ribuan: 500 − 425.
- **Hasil yang benar:** Rugi kipas angin = 500.000 − 425.000 = Rp75.000.

#### ML-3 · Tahap 4 — Rumus persentase (bobot 1)
- **Bantuan 1:** Persen untung dan rugi dibandingkan dengan sesuatu. Dengan apa?
- **Bantuan 2:** Uang yang dikeluarkan pedagang di awal disebut modal. Modal itu harga beli atau harga jual?
- **Jika sudah benar:** Kamu memilih rumus persen dengan pembagi harga beli.
- **Letak kesalahan (umum):** Rumus persen belum tepat.
- **Konsep:** Persen untung dan persen rugi sama-sama dibagi harga beli, lalu dikali 100%.
- **Cara memperbaiki:** Pilih rumus yang membagi selisih dengan harga beli dan mengalikan 100%.
- **Hasil yang benar:** Persentase = selisih ÷ harga beli × 100%.

#### ML-3 · Tahap 5 — Persentase keuntungan sepeda (bobot 1)
- **Bantuan 1:** Pakai keuntungan sepeda dari tahap 2 dan harga beli sepeda.
- **Bantuan 2:** Bagi keuntungan dengan harga beli. Sederhanakan pecahannya, lalu kalikan 100%.
- **Jika sudah benar:** Kamu menghitung persentase keuntungan sepeda dengan tepat.
- **Letak kesalahan (umum):** Persentase keuntungan sepeda belum tepat.
- **Konsep:** Persentase keuntungan = keuntungan ÷ harga beli × 100%.
- **Cara memperbaiki:** Coret nol yang sama: 120.000/800.000 = 12/80. Lalu sederhanakan.
- **Hasil yang benar:** 120.000 ÷ 800.000 × 100% = 3/20 × 100% = 15%.

#### ML-3 · Tahap 6 — Persentase kerugian kipas angin (bobot 1)
- **Bantuan 1:** Pakai kerugian kipas dari tahap 3 dan harga beli kipas.
- **Bantuan 2:** Bagi kerugian dengan harga beli, bukan harga jual. Lalu kalikan 100%.
- **Jika sudah benar:** Kamu menghitung persentase kerugian kipas angin dengan tepat.
- **Letak kesalahan (umum):** Persentase kerugian kipas angin belum tepat.
- **Konsep:** Persentase kerugian = kerugian ÷ harga beli × 100%.
- **Cara memperbaiki:** Coret nol yang sama: 75.000/500.000 = 75/500. Lalu sederhanakan.
- **Hasil yang benar:** 75.000 ÷ 500.000 × 100% = 3/20 × 100% = 15%. Persennya sama, tetapi sepeda untung dan kipas rugi.

### 4.1 Penyelesaian lengkap ML-3

| Langkah | Teks | Asal |
|---|---|---|
| 1 | Sepeda: 920.000 > 800.000, jadi untung. Untung = 920.000 − 800.000 = 120.000. | [Usulan] perhitungan |
| 2 | Persen untung sepeda = 120.000 ÷ 800.000 × 100% = 15%. | [Usulan] perhitungan |
| 3 | Kipas angin: 425.000 < 500.000, jadi rugi. Rugi = 500.000 − 425.000 = 75.000. | [Usulan] perhitungan |
| 4 | Persen rugi kipas angin = 75.000 ÷ 500.000 × 100% = 15%. | [Usulan] perhitungan |
| 5 | Sepeda: keuntungan Rp120.000 dan persentase keuntungan 15%. | [Spesifikasi] |
| 6 | Kipas angin: kerugian Rp75.000 dan persentase kerugian 15%. | [Spesifikasi] |

---

## 5. Soal 4 — Interpreting, Applying, and Evaluating Mathematical Outcomes (ML-4)

**Pengantar indikator:** Soal ini melatih menafsirkan. Kamu memeriksa apakah pernyataan teman Dina benar.

#### ML-4 · Tahap 1 — Identifikasi harga (bobot 1)
- **Bantuan 1:** Lihat dua kalimat pertama. Di sana ada harga beli dan harga jual.
- **Bantuan 2:** Harga beli adalah uang yang Dina bayar. Harga jual adalah uang yang Dina terima.
- **Jika sudah benar:** Kamu menemukan harga beli dan harga jual jaket.
- **Letak kesalahan (umum):** Label harga beli atau harga jual belum tepat.
- **Konsep:** Angka di kalimat teman Dina adalah hasil hitungannya, bukan harga beli.
- **Cara memperbaiki:** Tandai angka sesudah "membeli … seharga" dan sesudah "dijual kembali seharga".
- **Hasil yang benar:** Harga beli = Rp400.000. Harga jual = Rp340.000.

#### ML-4 · Tahap 2 — Kerugian (bobot 1)
- **Bantuan 1:** Harga jual lebih kecil dari harga beli. Jadi Dina rugi.
- **Bantuan 2:** Rugi = HB − HJ. Hitung dalam ribuan agar mudah.
- **Jika sudah benar:** Kamu menghitung kerugian Dina dengan tepat.
- **Letak kesalahan (umum):** Kerugian Dina belum tepat.
- **Konsep:** Rugi = harga beli − harga jual.
- **Cara memperbaiki:** Kurangi 400.000 dengan 340.000. Dalam ribuan: 400 − 340.
- **Hasil yang benar:** Kerugian = Rp400.000 − Rp340.000 = Rp60.000. **[Spesifikasi]**

#### ML-4 · Tahap 3 — Rumus persentase kerugian (bobot 1)
- **Bantuan 1:** Teman Dina memakai satu pembagi. Apakah pembagi itu sesuai rumus?
- **Bantuan 2:** Persen rugi dibandingkan dengan modal Dina. Modal itu harga yang mana?
- **Jika sudah benar:** Kamu memilih rumus yang membagi dengan harga beli.
- **Letak kesalahan (umum):** Rumus persentase kerugian belum tepat.
- **Konsep:** Persentase kerugian dihitung dari harga beli, yaitu modal Dina.
- **Cara memperbaiki:** Pilih rumus dengan pembagi harga beli dan dikali 100%.
- **Hasil yang benar:** Persentase kerugian = (kerugian ÷ harga beli) × 100%. **[Spesifikasi]**

#### ML-4 · Tahap 4 — Persentase kerugian (bobot 1)
- **Bantuan 1:** Pakai kerugian dari tahap 2 dan harga beli jaket.
- **Bantuan 2:** % Rugi = Rugi ÷ HB × 100%.
- **Jika sudah benar:** Kamu menghitung persentase kerugian dengan tepat.
- **Letak kesalahan (umum):** Persentase kerugian belum tepat.
- **Konsep:** Pembaginya harga beli, yaitu Rp400.000, bukan harga jual.
- **Cara memperbaiki:** Coret nol yang sama: 60.000/400.000 = 6/40. Lalu sederhanakan.
- **Hasil yang benar:** Persentase kerugian = (Rp60.000 ÷ Rp400.000) × 100% = 15%. **[Spesifikasi]**

#### ML-4 · Tahap 5 — Menilai pernyataan (bobot 1)
- **Bantuan 1:** Bandingkan hasil hitunganmu dengan angka teman Dina.
- **Bantuan 2:** Apakah teman Dina memakai pembagi yang sama dengan rumus?
- **Jika sudah benar:** Kamu menilai pernyataan teman Dina dengan tepat.
- **Letak kesalahan (umum):** Penilaianmu terhadap pernyataan teman Dina belum tepat.
- **Konsep:** Pernyataan benar hanya jika rumus dan hitungannya benar.
- **Cara memperbaiki:** Hitung ulang dengan pembagi harga beli. Lalu bandingkan dengan 17,65%.
- **Hasil yang benar:** Pernyataan teman Dina tidak benar. Hasil yang tepat 15%, bukan 17,65%.

#### ML-4 · Tahap 6 — Alasan dan kesimpulan (bobot 1)
- **Bantuan 1:** Alasan yang baik menyebut bagian yang salah dari cara teman Dina.
- **Bantuan 2:** Apa yang salah: besar kerugiannya atau pembaginya?
- **Jika sudah benar:** Alasanmu tepat: pembaginya harus harga beli.
- **Letak kesalahan (umum):** Alasanmu belum menunjuk letak kesalahan teman Dina.
- **Konsep:** Hitungan teman Dina tepat, tetapi pembaginya salah. Seharusnya harga beli.
- **Cara memperbaiki:** Sebutkan pembagi yang benar dan hasil yang benar.
- **Hasil yang benar:** Kesimpulan: Pernyataan teman Dina tidak benar. Persentase kerugian yang tepat adalah 15% karena perhitungan persentase kerugian menggunakan harga beli sebagai dasar perhitungan. **[Spesifikasi]**

### 5.1 Penyelesaian lengkap ML-4

| Langkah | Teks | Asal |
|---|---|---|
| 1 | Kerugian = Rp400.000 − Rp340.000 = Rp60.000. | [Spesifikasi] |
| 2 | Persentase kerugian = (kerugian ÷ harga beli) × 100%. | [Spesifikasi] |
| 3 | Persentase kerugian = (Rp60.000 ÷ Rp400.000) × 100% = 15%. | [Spesifikasi] |
| 4 | Teman Dina menghitung 60.000 ÷ 340.000 × 100% = 17,65%. Pembaginya harga jual. | [Usulan] tafsir |
| 5 | Periksa: 15% × 400.000 = 60.000. Hasil ini sama dengan kerugian Dina. | [Usulan] hitung balik |
| 6 | Kesimpulan: Pernyataan teman Dina tidak benar. Persentase kerugian yang tepat adalah 15% karena perhitungan persentase kerugian menggunakan harga beli sebagai dasar perhitungan. | [Spesifikasi] |

---

## 6. Catatan Tinjauan dan Keputusan (12 November 2026)

1. **ML-2 tahap 5, Bantuan 2.** Teks "Untung = HJ − HB. Jadi HJ = HB + untung." sudah ditetapkan di D-08 §5 dan keputusan KL-02. Teks ini hampir sama dengan pilihan yang benar, sehingga **bertentangan dengan ketentuan LM-03 no. 6** (bantuan tidak memberikan jawaban). Teks ini tidak saya ubah karena sudah disetujui. Pilihan untuk Anda:
   - (a) Tetap seperti keputusan KL-02. Bantuan 2 hanya dibuka setelah Bantuan 1, dan pemakaiannya tercatat.
   - (b) Bantuan 2 tahap 5 diganti pertanyaan penuntun, dan pengingat dipindah ke tahap 6.

   **Keputusan 12 November 2026: opsi (a).** Teks dipertahankan sesuai KL-02 dan D-08 §5.
   **Keputusan 12 November 2026 (ML-1 tahap 3, Bantuan 2):** istilah "modal toko" tetap dipakai, agar siswa menghubungkan modal dengan harga beli melalui proses berpikirnya sendiri.

2. **Bantuan tahap identifikasi** (ML-1 t1, ML-2 t1, ML-4 t1) menjelaskan arti harga beli dan harga jual. Isinya konsep dari M1, bukan label untuk angka tertentu, jadi tidak memberikan jawaban langsung.
3. **ML-4 tahap 4, Bantuan 2** menampilkan rumus "% Rugi = Rugi ÷ HB × 100%". Ini sesuai contoh di D-08 §6. Bantuan ini muncul **setelah** tahap 3 (memilih rumus) dikunci, sehingga tidak membocorkan jawaban tahap 3.
4. Baris **[Usulan] perhitungan** dan **hitung balik** di tabel penyelesaian lengkap menambah langkah antara agar pembahasan bertahap. Kunci [Spesifikasi] tetap tampil utuh dan tidak diubah.
