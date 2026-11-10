# D-05 — Petunjuk Bertingkat dan Pembahasan

Versi: 1.0 (**disetujui pemilik proyek, 11 November 2026**) · Acuan: [design.md](../design.md) §8–10 · [D-04_bank_soal.md](D-04_bank_soal.md) · [D-03_materi.md](D-03_materi.md)

Dokumen ini berisi:
1. **Templat** petunjuk dan pembahasan. Teksnya sama untuk semua soal; hanya angkanya yang diganti (`{HB}`, `{HJ}`, dan seterusnya). Templat dipilih supaya bahasa konsisten di semua soal (mengurangi extraneous load) dan aplikasi bisa mengisi angkanya otomatis.
2. **Tabel nilai per soal** untuk mengisi templat, yang sudah diverifikasi dengan skrip.
3. **Pembahasan khusus** untuk soal Level 4 dan soal cek cepat materi.

Aturan penulisan: maksimal 3 kalimat per kotak, kalimat pendek, angka memakai format Rp60.000 dan koma desimal.

---

## 1. Variabel Templat

| Variabel | Arti | Contoh (L2-01) |
|---|---|---|
| `{HB}` / `{HJ}` | Harga beli / harga jual | Rp40.000 / Rp50.000 |
| `{jenis}` / `{Jenis}` | untung / rugi (huruf kecil / kapital) | untung / Untung |
| `{lebih}` | "lebih besar" jika untung, "lebih kecil" jika rugi | lebih besar |
| `{a} − {b}` | HJ − HB jika untung; HB − HJ jika rugi | 50.000 − 40.000 |
| `{a_rb} − {b_rb}` | Sama, dalam ribuan | 50 − 40 |
| `{selisih}` | Besar untung/rugi | Rp10.000 |
| `{pecahan}` | selisih ÷ HB, disederhanakan | 1/4 |
| `{persen}` | Jawaban persen | 25% |
| `{jawab}` | Jawaban siswa | 20% |

## 2. Petunjuk Bertingkat (F11)

Petunjuk dibuka satu per satu. Jumlah tingkat yang tersedia mengikuti level (design.md §8): **Level 1–2: 4 tingkat · Level 3: 2 tingkat · Level 4: tidak ada.**

### 2.1 Level 1 — tanpa persen

| Tingkat | Teks |
|---|---|
| 1. Identifikasi | Lihat label pada gambar. Label **Beli** adalah harga beli. Label **Jual** adalah harga jual. |
| 2. Rumus | Bandingkan harga jual dengan harga beli dulu. Jika untung: **HJ − HB**. Jika rugi: **HB − HJ**. |
| 3. Operasi | {HJ} {lebih} dari {HB}, jadi pedagang **{jenis}**. Hitung {a} − {b}. |
| 4. Penyelesaian | Hitung dalam ribuan saja: {a_rb} − {b_rb} = … Lalu tambahkan "ribu" di belakangnya. |

### 2.2 Level 2

| Tingkat | Teks |
|---|---|
| 1. Identifikasi | Harga beli {HB}. Harga jual {HJ}. Bandingkan keduanya untuk tahu untung atau rugi. |
| 2. Rumus | **% {Jenis} = {Jenis} ÷ Harga Beli × 100%.** Ingat, pembaginya selalu harga beli. |
| 3. Operasi | {Jenis}nya {selisih}. Hitung {selisih} ÷ {HB} dulu. Coret nol yang sama di atas dan di bawah. |
| 4. Penyelesaian | {selisih} ÷ {HB} = **{pecahan}**. Sekarang kalikan {pecahan} dengan 100%. |

### 2.3 Level 3 (2 tingkat)

| Tingkat | Teks |
|---|---|
| 1. Identifikasi | Cari kata kunci di soal. "{kata_HB}" menunjuk harga beli. "{kata_HJ}" menunjuk harga jual. |
| 2. Rumus | **% {Jenis} = {Jenis} ÷ Harga Beli × 100%.** Ingat, pembaginya selalu harga beli. |

Kata kunci per soal Level 3:

| Soal | `{kata_HB}` | `{kata_HJ}` |
|---|---|---|
| L3-01 | membeli … seharga | mendapat (hasil semua air yang terjual) |
| L3-02 | membeli … seharga | dijual |
| L3-03 | membeli … seharga | dijual lagi |
| L3-04 | membeli … seharga | dijual |
| L3-05 | membeli … seharga | hasil penjualannya |
| L3-06 | membeli … seharga | dijual |

### 2.4 Contoh hasil templat (L2-05, botol minum)

| Tingkat | Teks yang tampil |
|---|---|
| 1 | Harga beli Rp25.000. Harga jual Rp35.000. Bandingkan keduanya untuk tahu untung atau rugi. |
| 2 | **% Untung = Untung ÷ Harga Beli × 100%.** Ingat, pembaginya selalu harga beli. |
| 3 | Untungnya Rp10.000. Hitung Rp10.000 ÷ Rp25.000 dulu. Coret nol yang sama di atas dan di bawah. |
| 4 | Rp10.000 ÷ Rp25.000 = **2/5**. Sekarang kalikan 2/5 dengan 100%. |

## 3. Pembahasan Jawaban Salah (F10)

### 3.1 Alur

1. **Salah pertama:** tampil unsur ① Bagian yang belum tepat, ② Konsep, ③ Petunjuk, lalu tombol **"Coba lagi"**.
2. **Salah kedua:** tampil unsur ④ Penyelesaian benar (format 7 langkah seperti Contoh Bertahap), lalu tombol **"Soal berikutnya"**.
3. Pembahasan tidak pernah hanya berisi "Salah" (sesuai prompt Bagian B.4 no. 10).

### 3.2 Cara aplikasi mengenali kesalahan

Pada Level 1–3, siswa menjawab per langkah, sehingga langkah yang salah langsung diketahui. Pada Level 4, aplikasi membandingkan jawaban akhir dengan pola kesalahan berikut, dengan urutan pemeriksaan dari atas:

| Urutan | Kode | Kondisi | Toleransi |
|---|---|---|---|
| 1 | D5 | HB atau HJ yang diisi siswa tertukar, sama dengan angka pengecoh, atau belum dikalikan jumlah barang | tepat |
| 2 | D3 | Jenis (untung/rugi) salah | – |
| 3 | D4 | Besar selisih ≠ \|HJ − HB\| | tepat |
| 4 | D1 | Persen ≈ selisih ÷ HJ × 100 | ±0,5 (karena siswa bisa membulatkan) |
| 5 | D2 | Persen ≈ selisih ÷ HB (lupa × 100) | ±0,005 |
| 6 | D6 | Tidak cocok dengan pola mana pun | – |

**Usulan perubahan kecil pada design.md §8:** agar D5 bisa dikenali di Level 4, bentuk jawaban Level 4 menjadi **isi HB dan HJ → pilih jenis → isi persen → pilih alasan**. Mengisi HB dan HJ sekaligus melatih indikator *Merumuskan*. **Disetujui 11 November 2026; design.md §8 sudah diperbarui.**

### 3.3 Templat pembahasan D1–D6

**D1 — Membagi dengan harga jual**

| Unsur | Teks |
|---|---|
| ① Bagian | Kamu menulis {jawab}. Sepertinya kamu membagi dengan **harga jual** ({HJ}). |
| ② Konsep | Persen {jenis} dibandingkan dengan **modal**, yaitu harga beli. Jadi pembaginya harga beli. |
| ③ Petunjuk | Coba hitung {selisih} ÷ **{HB}** × 100%. |

**D2 — Lupa mengalikan 100%**

| Unsur | Teks |
|---|---|
| ① Bagian | Kamu menulis {jawab}. Itu baru hasil pembagian, belum persen. |
| ② Konsep | Persen artinya per seratus. Hasil bagi harus dikalikan 100%. |
| ③ Petunjuk | Hitung {jawab} × 100% = … |

**D3 — Untung dan rugi tertukar**

| Unsur | Teks |
|---|---|
| ① Bagian | Kamu memilih **{jenis_siswa}**. Coba bandingkan lagi kedua harga. |
| ② Konsep | Harga jual lebih besar dari harga beli → **untung** ▲. Harga jual lebih kecil → **rugi** ▼. |
| ③ Petunjuk | Harga jual {HJ}. Harga beli {HB}. Mana yang lebih besar? |

**D4 — Besar untung/rugi salah**

| Unsur | Teks |
|---|---|
| ① Bagian | Besar {jenis} belum tepat. Kamu menulis {jawab}. |
| ② Konsep | Untung = HJ − HB. Rugi = HB − HJ. Yang besar dikurangi yang kecil. |
| ③ Petunjuk | Hitung {a} − {b}. Dalam ribuan: {a_rb} − {b_rb} = … |

**D5 — Harga beli/harga jual salah ditentukan** (templat umum; teks khusus Level 4 ada di §4)

| Unsur | Teks |
|---|---|
| ① Bagian | Harga beli dan harga jual yang kamu tulis belum tepat. |
| ② Konsep | Harga saat **membeli** adalah harga beli. Harga saat **menjual** adalah harga jual. |
| ③ Petunjuk | Baca lagi soalnya. Cari kata "membeli" dan "dijual". |

**D5 pada Langkah 1 (Penanda Informasi)**: unsur ① memakai kata "tandai": *"Harga beli dan harga jual yang kamu tandai belum tepat."* Unsur ③ memakai kata kunci per soal (§2.3): *"Cari kata kunci di soal. "{kata_HB}" menunjuk harga beli. "{kata_HJ}" menunjuk harga jual."* (disetujui 11 November 2026)

**D6 — Kesalahan lain**

| Unsur | Teks |
|---|---|
| ① Bagian | Jawabanmu belum tepat di **Langkah {n}**. |
| ② Konsep | (Kartu Rumus yang sesuai dengan langkah tersebut) |
| ③ Petunjuk | (Petunjuk tingkat 3 untuk langkah tersebut; di Level 4 memakai teks §2.2 tingkat 3) |

**D6 pada Langkah 1: hanya "Ditanya" yang belum tepat** (disetujui 11 November 2026)

| Unsur | Teks |
|---|---|
| ① Bagian | Jawabanmu belum tepat di Langkah 1. |
| ② Konsep | Tandai juga kalimat yang ditanyakan. |
| ③ Petunjuk | Kalimat tanya biasanya ada di akhir soal. |

**Langkah 7 (Periksa) salah, Level 1–3**

| Unsur | Teks |
|---|---|
| ① Bagian | Hitung balikmu belum cocok. |
| ② Konsep | Level 1: harga beli ditambah untung (atau dikurangi rugi) harus sama dengan harga jual. Level 2–3: {persen} dari harga beli harus sama dengan {jenis}. |
| ③ Petunjuk | Level 1: {HB} + {selisih} = … (untung) atau {HB} − {selisih} = … (rugi). Level 2–3: {persen} × {HB} = … |

**④ Penyelesaian benar** (semua kode) memakai format 7 langkah yang sama dengan Contoh Bertahap C1 di D-03, diisi dengan nilai di §5. Pada Level 1, hanya langkah 2, 3, 4, dan 7 yang ditampilkan.

## 4. Pembahasan Khusus Level 4

| Soal | Kesalahan | Kode | ① Bagian | ② Konsep | ③ Petunjuk |
|---|---|---|---|---|---|
| L4-01 | Memakai Rp150.000 sebagai harga beli | D5 | Rp150.000 adalah uang yang dibawa Bu Wati, bukan harga beli. | Harga beli adalah harga barang yang dibeli. | Harga 1 lusin gelas = Rp96.000. |
| L4-01 | HJ tidak dikalikan 12 | D5 | Rp10.000 adalah harga **per buah**. | Harga jual seluruhnya = harga per buah × banyak barang. | 1 lusin = 12 buah. Hitung 12 × 10.000. |
| L4-02 | Memilih setrika | D6 | Untung setrika memang lebih besar dalam **rupiah**. Tetapi yang ditanya adalah **persentase**. | Persen dihitung dari harga beli masing-masing barang. | Hitung persen kipas: 25.000 ÷ 100.000 × 100%. Lalu hitung persen setrika. |
| L4-03 | HB tidak dikalikan 20 (Rp3.000 dipakai sebagai harga beli, hasilnya "untung") | D5 | Rp3.000 adalah harga **per donat**. | Harga beli seluruhnya = harga per buah × banyak donat. | Hitung 20 × 3.000. |
| L4-04 | Memakai Rp1.000.000 sebagai harga beli | D5 | Rp1.000.000 adalah uang yang dibawa, bukan harga beli. | Harga beli = harga per kg × banyak kg. | Hitung 50 × 12.000. |
| L4-04 | Menjawab benar dengan cara per kg | – (benar) | — | Tambahan di layar benar: "Cara cepatmu juga benar: untung per kg Rp1.500, lalu 1.500 ÷ 12.000 × 100% = 12,5%." | — |
| L4-05 | Memilih "Benar" | D3 | Coba periksa dulu: Rina untung atau rugi? | Harga jual lebih kecil dari harga beli → rugi. | Harga jual Rp60.000, harga beli Rp75.000. |
| L4-05 | Jenis benar (rugi), tetapi menjawab 25% | D1 | 25% adalah hasil 15.000 ÷ 60.000. Itu dibagi harga jual. | Persen rugi dibagi harga beli. | Hitung 15.000 ÷ 75.000 × 100%. |

## 5. Tabel Nilai per Soal (pengisi templat)

Diverifikasi dengan skrip Python (pecahan disederhanakan dengan FPB).

| Soal | {HB} | {HJ} | {jenis} | {a_rb} − {b_rb} | {selisih} | {pecahan} | {persen} | D1 | D2 |
|---|---|---|---|---|---|---|---|---|---|
| L1-01 | Rp20.000 | Rp25.000 | untung | 25 − 20 | Rp5.000 | – | – | – | – |
| L1-02 | Rp48.000 | Rp50.000 | untung | 50 − 48 | Rp2.000 | – | – | – | – |
| L1-03 | Rp30.000 | Rp24.000 | rugi | 30 − 24 | Rp6.000 | – | – | – | – |
| L1-04 | Rp35.000 | Rp45.000 | untung | 45 − 35 | Rp10.000 | – | – | – | – |
| L1-05 | Rp60.000 | Rp54.000 | rugi | 60 − 54 | Rp6.000 | – | – | – | – |
| L1-06 | Rp18.000 | Rp15.000 | rugi | 18 − 15 | Rp3.000 | – | – | – | – |
| L2-01 | Rp40.000 | Rp50.000 | untung | 50 − 40 | Rp10.000 | 1/4 | 25% | 20% | 0,25 |
| L2-02 | Rp75.000 | Rp60.000 | rugi | 75 − 60 | Rp15.000 | 1/5 | 20% | 25% | 0,2 |
| L2-03 | Rp150.000 | Rp180.000 | untung | 180 − 150 | Rp30.000 | 1/5 | 20% | 16,67% | 0,2 |
| L2-04 | Rp120.000 | Rp90.000 | rugi | 120 − 90 | Rp30.000 | 1/4 | 25% | 33,33% | 0,25 |
| L2-05 | Rp25.000 | Rp35.000 | untung | 35 − 25 | Rp10.000 | 2/5 | 40% | 28,57% | 0,4 |
| L2-06 | Rp200.000 | Rp180.000 | rugi | 200 − 180 | Rp20.000 | 1/10 | 10% | 11,11% | 0,1 |
| L3-01 | Rp48.000 | Rp60.000 | untung | 60 − 48 | Rp12.000 | 1/4 | 25% | 20% | 0,25 |
| L3-02 | Rp60.000 | Rp78.000 | untung | 78 − 60 | Rp18.000 | 3/10 | 30% | 23,08% | 0,3 |
| L3-03 | Rp250.000 | Rp200.000 | rugi | 250 − 200 | Rp50.000 | 1/5 | 20% | 25% | 0,2 |
| L3-04 | Rp2.500.000 | Rp3.000.000 | untung | 3.000 − 2.500 | Rp500.000 | 1/5 | 20% | 16,67% | 0,2 |
| L3-05 | Rp160.000 | Rp112.000 | rugi | 160 − 112 | Rp48.000 | 3/10 | 30% | 42,86% | 0,3 |
| L3-06 | Rp1.500.000 | Rp1.050.000 | rugi | 1.500 − 1.050 | Rp450.000 | 3/10 | 30% | 42,86% | 0,3 |
| L4-01 | Rp96.000 | Rp120.000 | untung | 120 − 96 | Rp24.000 | 1/4 | 25% | 20% | 0,25 |
| L4-02 kipas | Rp100.000 | Rp125.000 | untung | 125 − 100 | Rp25.000 | 1/4 | 25% | 20% | 0,25 |
| L4-02 setrika | Rp200.000 | Rp240.000 | untung | 240 − 200 | Rp40.000 | 1/5 | 20% | 16,67% | 0,2 |
| L4-03 | Rp60.000 | Rp45.000 | rugi | 60 − 45 | Rp15.000 | 1/4 | 25% | 33,33% | 0,25 |
| L4-04 | Rp600.000 | Rp675.000 | untung | 675 − 600 | Rp75.000 | 1/8 | 12,5% | 11,11% | 0,125 |
| L4-05 | Rp75.000 | Rp60.000 | rugi | 75 − 60 | Rp15.000 | 1/5 | 20% | 25% | 0,2 |

Nilai yang muncul jika siswa terkecoh di Level 4 (untuk menguji diagnosis D5):
- L4-01 dengan HB = Rp150.000 → rugi Rp30.000 → 20%.
- L4-03 dengan HB = Rp3.000 → "untung" Rp42.000 → 1.400%.
- L4-04 dengan HB = Rp1.000.000 → rugi Rp325.000 → 32,5%.

Catatan L3-04: dalam ribuan, {a_rb} − {b_rb} = 3.000 − 2.500. Petunjuk tingkat 4 tidak dipakai di Level 3, jadi baris ini hanya untuk pembahasan D4.

## 6. Pembahasan Soal Cek Cepat Materi (D-03)

Soal cek cepat hanya memberi satu pembahasan singkat, lalu siswa boleh mencoba lagi. Hasilnya tidak dicatat sebagai percobaan latihan (api.md §3.4).

| Soal | Pilihan salah | Teks pembahasan |
|---|---|---|
| L0-M0 | 5% / 50% / 500% | 10.000 ÷ 50.000 = 1/5. Lalu 1/5 × 100% = 20%. |
| L0-M1 | Rp2.500 | Rp2.500 adalah harga saat kue **dijual**. Harga beli adalah harga saat Bu Sari **membeli**. |
| L0-M2 | Untung | Harga jual Rp12.000 lebih kecil dari harga beli Rp15.000. Jadi pedagang rugi. |
| L0-M2 (alasan) | "lebih besar" | Bandingkan lagi: 12.000 lebih kecil dari 15.000. |
| L0-M3 | jawaban ≠ Rp6.000 | Untung = HJ − HB = 36.000 − 30.000. Dalam ribuan: 36 − 30. |
| L0-M4 | jawaban ≠ Rp5.000 | Rugi = HB − HJ = 25.000 − 20.000. Dalam ribuan: 25 − 20. |
| L0-M5 | 16,67% | Kamu membagi dengan harga jual (60.000). Persen untung dibagi **harga beli**: 10.000 ÷ 50.000 × 100%. |
| L0-M5 | 10% | Rp10.000 adalah besar untungnya, bukan persennya. Hitung 10.000 ÷ 50.000 × 100%. |
| L0-M5 | 2% | Periksa lagi: 10.000 ÷ 50.000 = 0,2. Lalu 0,2 × 100% = 20%. |
| L0-M6 | 33,33% | Kamu membagi dengan harga jual (60.000). Persen rugi dibagi **harga beli**: 20.000 ÷ 80.000 × 100%. |
| L0-M6 | 75% | 75% adalah harga jual dibagi harga beli. Hitung dulu ruginya: 80.000 − 60.000. |
| L0-M6 | 20% | Rugi Rp20.000 bukan 20%. Hitung 20.000 ÷ 80.000 × 100%. |

## 7. Keputusan Pemilik Proyek (11 November 2026)

1. Level 4: siswa mengisi HB dan HJ sebelum jenis dan persen. **Disetujui.**
2. Petunjuk dan pembahasan berbentuk templat dengan angka otomatis. **Disetujui.**
3. Alur dua kali kesempatan (petunjuk → coba lagi → penyelesaian lengkap). **Disetujui.**
4. Tidak ada kalimat yang diminta diubah.
5. Tambahan teks pembahasan Langkah 1 (D5 "tandai" dan D6 "Ditanya"). **Disetujui** 11 November 2026.
