# D-03 — Teks Materi dan Contoh Bertahap

Versi: 1.0 (**disetujui pemilik proyek, 11 November 2026**) · Acuan: [design.md](../design.md) §3, §8, §15 · [PRD.md](../PRD.md) §7

Aturan penulisan yang dipakai (AGENTS.md §4–5):
- Maksimal 3 kalimat per kartu, setiap kalimat ≤ 15 kata.
- Maksimal 1 gambar per kartu, dan gambar selalu memuat label harga.
- Rumus selalu ditampilkan dengan angka dari transaksi pada kartu yang sama.
- Format angka: Rp80.000; desimal memakai koma.

Keterangan kolom **Gambar**: `nama-barang [Beli Rp… | Jual Rp…]` = gambar 2D barang dengan label harga. `BatangBanding` = dua batang HB/HJ (design.md §7). `–` = tanpa gambar.

Semua angka sudah dihitung ulang (lihat Bagian 4).

---

## 1. Materi M0–M6

### M0 — Pemanasan (opsional)

Tujuan: mengingatkan prasyarat perkalian, pembagian, dan persen (T5, E-IL03).

| Kartu | Teks | Gambar | Rumus / angka |
|---|---|---|---|
| 1 | Persen artinya "per seratus". 25% sama dengan 25 dibagi 100. | – | 25% = 25/100 = 0,25 |
| 2 | Membagi angka ribuan bisa dibuat mudah. Coret angka nol yang sama di atas dan di bawah. | – | 20.000/80.000 = 2/8 = 1/4 |
| 3 | Untuk mengubah pecahan menjadi persen, kalikan dengan 100%. | – | 1/4 × 100% = 25% |

**Cek cepat (L0-M0):** Berapa hasil 10.000 ÷ 50.000 × 100%?
Pilihan: **20%** · 5% · 50% · 500%

### M1 — Harga Beli dan Harga Jual

| Kartu | Teks | Gambar | Rumus / angka |
|---|---|---|---|
| 1 | Pak Budi membeli tas di pasar grosir. Harga saat pedagang membeli disebut **harga beli**. | tas [Beli Rp80.000] | – |
| 2 | Pak Budi lalu menjual tas itu di tokonya. Harga saat pedagang menjual disebut **harga jual**. | tas [Beli Rp80.000 \| Jual Rp100.000] | – |
| 3 | Kita singkat: **HB** = harga beli, **HJ** = harga jual. Kata "membeli" atau "modal" menunjuk harga beli. Kata "menjual" atau "dijual" menunjuk harga jual. | – | HB = Rp80.000 · HJ = Rp100.000 |

**Cek cepat (L0-M1):** "Bu Sari membeli kue seharga Rp2.000. Kue itu dijual Rp2.500." Mana harga belinya?
Pilihan: **Rp2.000** · Rp2.500

### M2 — Untung atau Rugi?

| Kartu | Teks | Gambar | Rumus / angka |
|---|---|---|---|
| 1 | Jika harga jual **lebih besar** dari harga beli, pedagang **untung** ▲. | BatangBanding HB 80.000, HJ 100.000 | 100.000 > 80.000 → Untung |
| 2 | Jika harga jual **lebih kecil** dari harga beli, pedagang **rugi** ▼. | BatangBanding HB 50.000, HJ 40.000 | 40.000 < 50.000 → Rugi |
| 3 | Jika keduanya sama, pedagang tidak untung dan tidak rugi. Keadaan ini disebut **impas**. Jadi, selalu bandingkan HJ dengan HB dulu. | – | HJ = HB → Impas |

**Cek cepat (L0-M2):** HB = Rp15.000, HJ = Rp12.000. Pedagang untung atau rugi?
Pilihan: Untung · **Rugi**
Alasan: **Karena harga jual lebih kecil dari harga beli** · Karena harga jual lebih besar dari harga beli

### M3 — Menghitung Untung

| Kartu | Teks | Gambar | Rumus / angka |
|---|---|---|---|
| 1 | Besar untung adalah selisih harga jual dan harga beli. | – | **Untung = HJ − HB** |
| 2 | Tas Pak Budi dibeli Rp80.000 dan dijual Rp100.000. | tas [Beli Rp80.000 \| Jual Rp100.000] | Untung = 100.000 − 80.000 = **Rp20.000** |
| 3 | Untuk untung, harga jual dikurangi harga beli. Yang lebih besar dikurangi yang lebih kecil. | – | HJ − HB |

**Cek cepat (L0-M3):** HB = Rp30.000, HJ = Rp36.000. Berapa untungnya? *(isian rupiah)*
Kunci: **Rp6.000**

### M4 — Menghitung Rugi

| Kartu | Teks | Gambar | Rumus / angka |
|---|---|---|---|
| 1 | Besar rugi adalah selisih harga beli dan harga jual. Urutannya dibalik supaya hasilnya tidak negatif. | – | **Rugi = HB − HJ** |
| 2 | Bu Tini membeli sepatu Rp50.000. Sepatu itu hanya laku Rp40.000. | sepatu [Beli Rp50.000 \| Jual Rp40.000] | Rugi = 50.000 − 40.000 = **Rp10.000** |
| 3 | Bedakan kedua rumus ini. Yang lebih besar selalu dikurangi yang lebih kecil. | – | ▲ Untung = HJ − HB · ▼ Rugi = HB − HJ |

**Cek cepat (L0-M4):** HB = Rp25.000, HJ = Rp20.000. Berapa ruginya? *(isian rupiah)*
Kunci: **Rp5.000**

### M5 — Persentase Untung

Submateri ini dijelaskan paling pelan (T2, T22). Kartu 3 dan 5 menjawab langsung kebingungan "dibagi harga beli atau harga jual?" (E-IL01, G-10:15).

| Kartu | Teks | Gambar | Rumus / angka |
|---|---|---|---|
| 1 | Untung Rp20.000 itu banyak atau sedikit? Jawabannya bergantung pada modal pedagang. Persentase membantu kita membandingkannya. | tas [Beli Rp80.000 \| Jual Rp100.000] | Untung = Rp20.000 |
| 2 | Ini rumus persentase untung. | – | **% Untung = Untung ÷ HB × 100%** |
| 3 | Mengapa dibagi **harga beli**? Harga beli adalah modal, yaitu uang yang dikeluarkan pedagang. Untung selalu dibandingkan dengan modal. | tas [Beli Rp80.000] | penyebut = HB = 80.000 |
| 4 | Sekarang kita hitung persentase untung tas Pak Budi. | tas [Beli Rp80.000 \| Jual Rp100.000] | 20.000/80.000 × 100% = 1/4 × 100% = **25%** |
| 5 | Hati-hati, jangan membagi dengan harga jual. Hasilnya menjadi salah. | – | ✗ 20.000/100.000 × 100% = 20% · ✓ 20.000/80.000 × 100% = 25% |

**Cek cepat (L0-M5):** HB = Rp50.000, HJ = Rp60.000. Berapa persen untungnya?
Pilihan: **20%** · 16,67% · 10% · 2%
*(16,67% = D1 membagi HJ; 10% = menulis besar untung Rp10.000 sebagai persen; 2% = salah menggeser koma dari 0,2. Diagnosis rinci di D-05.)*

### M6 — Persentase Rugi

| Kartu | Teks | Gambar | Rumus / angka |
|---|---|---|---|
| 1 | Rumus persentase rugi mirip dengan persentase untung. Pembaginya tetap **harga beli**. | – | **% Rugi = Rugi ÷ HB × 100%** |
| 2 | Kita hitung persentase rugi sepatu Bu Tini. | sepatu [Beli Rp50.000 \| Jual Rp40.000] | 10.000/50.000 × 100% = 1/5 × 100% = **20%** |
| 3 | Bandingkan kedua rumus. Yang berbeda hanya kata untung dan rugi. Pembaginya sama-sama harga beli. | – | ▲ Untung ÷ **HB** × 100% · ▼ Rugi ÷ **HB** × 100% |
| 4 | Periksa jawabanmu dengan hitung balik. Hasilnya harus sama dengan besar rugi. | – | 20% × 50.000 = 10.000 ✓ |

**Cek cepat (L0-M6):** HB = Rp80.000, HJ = Rp60.000. Berapa persen ruginya?
Pilihan: **25%** · 33,33% · 20% · 75%
*(33,33% = D1 membagi HJ; 75% = HJ ÷ HB; 20% = menulis besar rugi Rp20.000 sebagai persen. Teks pembahasan di D-05 §6.)*

---

## 2. Contoh Bertahap (F12)

Setiap ketukan "Lanjut" membuka satu langkah baru (design.md §6, P06). Langkah mengikuti panduan 7 langkah (design.md §8).

### C1 — Persentase untung (setelah M5)

Soal ini adalah **soal pemicu dari dokumen wawancara** (Bagian C).

> Seorang pedagang membeli sebuah baju dengan harga Rp100.000. Baju itu dijual lagi dengan harga Rp120.000. Untung atau rugi? Berapa persen?

Gambar: baju [Beli Rp100.000 | Jual Rp120.000]

| Langkah | Teks penjelasan | Hasil |
|---|---|---|
| 1. Tandai | Cari kata "membeli" dan "dijual". Lalu cari yang ditanyakan. | Rp100.000 = HB · Rp120.000 = HJ · Ditanya: untung/rugi dan persennya |
| 2. HB dan HJ | Tulis harga beli dan harga jual. | HB = Rp100.000 · HJ = Rp120.000 |
| 3. Untung atau rugi? | Harga jual lebih besar dari harga beli. | ▲ **Untung** |
| 4. Besar untung | Harga jual dikurangi harga beli. | 120.000 − 100.000 = **Rp20.000** |
| 5. Pilih rumus | Persentase untung dibagi harga beli. | % Untung = Untung ÷ HB × 100% |
| 6. Hitung | Masukkan angkanya. | 20.000/100.000 × 100% = **20%** |
| 7. Periksa | Hitung balik: 20% dari harga beli. Hasilnya harus sama dengan untung. | 20% × 100.000 = 20.000 ✓ |

### C2 — Persentase rugi (setelah M6)

> Kak Dina membeli sepeda bekas seharga Rp600.000. Karena butuh uang, sepeda itu dijual Rp450.000. Berapa persen kerugian Kak Dina?

Gambar: sepeda [Beli Rp600.000 | Jual Rp450.000]

| Langkah | Teks penjelasan | Hasil |
|---|---|---|
| 1. Tandai | Cari harga saat membeli dan saat menjual. | Rp600.000 = HB · Rp450.000 = HJ · Ditanya: persen rugi |
| 2. HB dan HJ | Tulis keduanya. | HB = Rp600.000 · HJ = Rp450.000 |
| 3. Untung atau rugi? | Harga jual lebih kecil dari harga beli. | ▼ **Rugi** |
| 4. Besar rugi | Harga beli dikurangi harga jual. | 600.000 − 450.000 = **Rp150.000** |
| 5. Pilih rumus | Persentase rugi juga dibagi harga beli. | % Rugi = Rugi ÷ HB × 100% |
| 6. Hitung | Coret nol yang sama, lalu sederhanakan. | 150.000/600.000 × 100% = 1/4 × 100% = **25%** |
| 7. Periksa | Hitung balik 25% dari harga beli. | 25% × 600.000 = 150.000 ✓ |

### C3 — Soal cerita dengan perkalian (setelah C2, sebelum Latihan Level 3)

> Pak Joko membeli 10 kg jeruk seharga Rp150.000. Semua jeruk laku dijual Rp18.000 per kg. Berapa persen keuntungan Pak Joko?

Gambar: jeruk [Beli Rp150.000 (10 kg) | Jual Rp18.000/kg]

| Langkah | Teks penjelasan | Hasil |
|---|---|---|
| 1. Tandai | Perhatikan: harga jual ditulis **per kg**. | Rp150.000 = HB (10 kg) · Rp18.000/kg = harga jual per kg · Ditanya: persen untung |
| 2. HB dan HJ | Harga jual seluruhnya = harga per kg × banyak kg. | HB = Rp150.000 · HJ = 18.000 × 10 = **Rp180.000** |
| 3. Untung atau rugi? | Rp180.000 lebih besar dari Rp150.000. | ▲ **Untung** |
| 4. Besar untung | Harga jual dikurangi harga beli. | 180.000 − 150.000 = **Rp30.000** |
| 5. Pilih rumus | Dibagi harga beli. | % Untung = Untung ÷ HB × 100% |
| 6. Hitung | Sederhanakan dulu. | 30.000/150.000 × 100% = 1/5 × 100% = **20%** |
| 7. Periksa | Hitung balik. | 20% × 150.000 = 30.000 ✓ |

### C4 — Contoh sebagian (sebelum Latihan Level 2)

Langkah 1–3 dan 7 ditampilkan. Langkah 4–6 diisi siswa (fading, design.md §6 P06).

> Bu Ani membeli payung seharga Rp40.000. Payung itu dijual Rp50.000. Berapa persen keuntungan Bu Ani?

Gambar: payung [Beli Rp40.000 | Jual Rp50.000]

| Langkah | Ditampilkan / diisi siswa | Kunci |
|---|---|---|
| 1–2 | Ditampilkan: HB = Rp40.000 · HJ = Rp50.000 | – |
| 3 | Ditampilkan: ▲ Untung, karena HJ lebih besar dari HB | – |
| 4 | **Siswa mengisi:** Untung = 50.000 − 40.000 = … | Rp10.000 |
| 5 | **Siswa memilih rumus** | Untung ÷ HB × 100% |
| 6 | **Siswa mengisi:** 10.000/40.000 × 100% = … | 25% |
| 7 | Ditampilkan: 25% × 40.000 = 10.000 ✓ | – |

---

## 3. Daftar Gambar 2D yang Dibutuhkan

| ID gambar | Dipakai di | Label harga |
|---|---|---|
| tas | M1, M3, M5 | Beli Rp80.000 · Jual Rp100.000 |
| sepatu | M4, M6 | Beli Rp50.000 · Jual Rp40.000 |
| baju | C1 | Beli Rp100.000 · Jual Rp120.000 |
| sepeda | C2 | Beli Rp600.000 · Jual Rp450.000 |
| jeruk | C3 | Beli Rp150.000 (10 kg) · Jual Rp18.000/kg |
| payung | C4 | Beli Rp40.000 · Jual Rp50.000 |

Label harga ditulis sebagai teks HTML di atas gambar, bukan bagian dari file gambar, sehingga angkanya bisa dipakai ulang.

## 4. Verifikasi Angka

| Transaksi | HB | HJ | Jenis | Selisih | Persen | Hitung balik |
|---|---|---|---|---|---|---|
| Tas (M3, M5) | 80.000 | 100.000 | Untung | 20.000 | 25% | 25% × 80.000 = 20.000 ✓ |
| Sepatu (M4, M6) | 50.000 | 40.000 | Rugi | 10.000 | 20% | 20% × 50.000 = 10.000 ✓ |
| Cek M5 | 50.000 | 60.000 | Untung | 10.000 | 20% | 20% × 50.000 = 10.000 ✓ |
| Cek M6 | 80.000 | 60.000 | Rugi | 20.000 | 25% | 25% × 80.000 = 20.000 ✓ |
| C1 baju | 100.000 | 120.000 | Untung | 20.000 | 20% | 20% × 100.000 = 20.000 ✓ |
| C2 sepeda | 600.000 | 450.000 | Rugi | 150.000 | 25% | 25% × 600.000 = 150.000 ✓ |
| C3 jeruk | 150.000 | 180.000 | Untung | 30.000 | 20% | 20% × 150.000 = 30.000 ✓ |
| C4 payung | 40.000 | 50.000 | Untung | 10.000 | 25% | 25% × 40.000 = 10.000 ✓ |
| Cek M3 | 30.000 | 36.000 | Untung | 6.000 | – | – |
| Cek M4 | 25.000 | 20.000 | Rugi | 5.000 | – | – |

## 5. Keputusan Pemilik Proyek (11 November 2026)

1. Istilah **"impas"** dipakai (M2 kartu 3).
2. Kata kunci **"modal"** untuk harga beli dipakai.
3. **Contoh cara yang salah** (membagi harga jual) ditampilkan di M5 kartu 5.
4. **Soal pemicu wawancara** dipakai sebagai C1.
5. **C3 (jeruk per kg)** tetap sebagai contoh bertahap.
