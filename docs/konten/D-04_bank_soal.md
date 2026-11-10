# D-04 — Bank Soal Latihan Level 1–4

Versi: 1.0 (**disetujui pemilik proyek, 11 November 2026**) · Acuan: [design.md](../design.md) §8, §10 · [PRD.md](../PRD.md) §8 · [D-03_materi.md](D-03_materi.md)

Ringkasan: **23 soal** (Level 1: 6 · Level 2: 6 · Level 3: 6 · Level 4: 5). Setiap sesi latihan menampilkan 5 soal acak dari satu level.

Prinsip penyusunan:
- Konteks jual beli sehari-hari (T14, T15): pasar, warung, kantin, toko online, hewan kurban.
- Bentuk soal naik bertahap (T6): angka langsung (L1–L2) → cerita 2–3 kalimat (L3) → cerita lebih panjang dengan perkalian, angka pengecoh, perbandingan, dan evaluasi pernyataan (L4).
- Untung dan rugi seimbang di setiap level, agar siswa tidak menebak (T3).
- Persentase berupa bilangan bulat di L2–L3. Satu soal L4 memakai desimal (12,5%).
- Angka tidak sama dengan contoh di materi, agar siswa tidak menghafal jawaban.
- Semua angka diverifikasi dengan skrip (Bagian 6).

Notasi pada teks soal: `[[HB]]`, `[[HJ]]`, `[[DITANYA]]`, dan `[[PENGECOH]]` menandai segmen yang dapat diketuk pada fitur Penanda Informasi (F06). Tanda ini tidak tampil kepada siswa.

Kolom **D1** = jawaban yang muncul jika siswa membagi dengan harga jual. Kolom ini dipakai untuk diagnosis kesalahan (D-05, design.md §10.2).

---

## 1. Level 1 — Untung atau rugi, dan berapa besarnya?

Bentuk: tanpa cerita. Gambar barang dengan label harga beli dan harga jual.
Yang ditanya: **jenis** (untung/rugi) + **alasan** + **besar** (rupiah).
**Level 1 tidak memuat persentase sama sekali** (keputusan pemilik proyek, 11 November 2026): tidak ada pertanyaan, pilihan rumus, petunjuk, maupun pembahasan tentang persen.
Panduan: langkah 2, 3, 4, dan 7 (langkah 5–6 tentang persen tidak dipakai). Langkah 7 berupa hitung balik: HB + untung = HJ, atau HB − rugi = HJ.

| ID | Barang (gambar) | HB | HJ | Jenis | Besar | Hitung balik |
|---|---|---|---|---|---|---|
| L1-01 | Pisang 1 sisir | Rp20.000 | Rp25.000 | ▲ Untung | Rp5.000 | 20.000 + 5.000 = 25.000 ✓ |
| L1-02 | Voucer pulsa | Rp48.000 | Rp50.000 | ▲ Untung | Rp2.000 | 48.000 + 2.000 = 50.000 ✓ |
| L1-03 | Semangka | Rp30.000 | Rp24.000 | ▼ Rugi | Rp6.000 | 30.000 − 6.000 = 24.000 ✓ |
| L1-04 | Topi | Rp35.000 | Rp45.000 | ▲ Untung | Rp10.000 | 35.000 + 10.000 = 45.000 ✓ |
| L1-05 | Buku tulis 1 pak | Rp60.000 | Rp54.000 | ▼ Rugi | Rp6.000 | 60.000 − 6.000 = 54.000 ✓ |
| L1-06 | Mangga 1 kg | Rp18.000 | Rp15.000 | ▼ Rugi | Rp3.000 | 18.000 − 3.000 = 15.000 ✓ |

Teks pertanyaan (sama untuk semua soal Level 1):
> Pedagang membeli **[barang]** seharga **[HB]** dan menjualnya **[HJ]**.
> 1) Untung atau rugi? 2) Mengapa? 3) Berapa besarnya?

Pilihan alasan (sama untuk semua soal):
- "Karena harga jual lebih besar dari harga beli" (benar jika untung)
- "Karena harga jual lebih kecil dari harga beli" (benar jika rugi)

## 2. Level 2 — Berapa persennya?

Bentuk: tanpa cerita, gambar barang berlabel harga.
Yang ditanya: jenis + alasan + besar + **persen**.
Panduan: langkah 2–7 penuh.

| ID | Barang (gambar) | HB | HJ | Jenis | Besar | Persen | D1 | Hitung balik |
|---|---|---|---|---|---|---|---|---|
| L2-01 | Kaos | Rp40.000 | Rp50.000 | ▲ Untung | Rp10.000 | **25%** | 20% | 25% × 40.000 = 10.000 ✓ |
| L2-02 | Jam dinding | Rp75.000 | Rp60.000 | ▼ Rugi | Rp15.000 | **20%** | 25% | 20% × 75.000 = 15.000 ✓ |
| L2-03 | Kipas angin | Rp150.000 | Rp180.000 | ▲ Untung | Rp30.000 | **20%** | 16,67% | 20% × 150.000 = 30.000 ✓ |
| L2-04 | Celana panjang | Rp120.000 | Rp90.000 | ▼ Rugi | Rp30.000 | **25%** | 33,33% | 25% × 120.000 = 30.000 ✓ |
| L2-05 | Botol minum | Rp25.000 | Rp35.000 | ▲ Untung | Rp10.000 | **40%** | 28,57% | 40% × 25.000 = 10.000 ✓ |
| L2-06 | Tas selempang | Rp200.000 | Rp180.000 | ▼ Rugi | Rp20.000 | **10%** | 11,11% | 10% × 200.000 = 20.000 ✓ |

Teks pertanyaan:
> Pedagang membeli **[barang]** seharga **[HB]** dan menjualnya **[HJ]**. Berapa persen keuntungan atau kerugiannya?

Pilihan rumus pada langkah 5 (sama untuk Level 2–3):
- **Untung (atau Rugi) ÷ Harga Beli × 100%** ✓
- Untung (atau Rugi) ÷ Harga Jual × 100%
- Untung (atau Rugi) × Harga Beli ÷ 100

## 3. Level 3 — Soal cerita pendek

Bentuk: cerita 2–3 kalimat; siswa menandai informasi (F06).
Panduan diringkas menjadi 3 tahap: Tandai → Hitung → Periksa. Petunjuk tersedia 2 tingkat.

**L3-01** · Kantin · ▲ Untung
> Mas Andi membeli 1 dus air mineral seharga [[HB]]Rp48.000[[/]]. Air itu habis terjual, dan ia mendapat [[HJ]]Rp60.000[[/]]. [[DITANYA]]Berapa persen keuntungan Mas Andi?[[/]]

Kunci: untung Rp12.000 · **25%** · D1: 20%

**L3-02** · Toko tas · ▲ Untung
> Bu Rina membeli 1 tas seharga [[HB]]Rp60.000[[/]]. Tas itu dijual [[HJ]]Rp78.000[[/]]. [[DITANYA]]Berapa persen keuntungan Bu Rina?[[/]]

Kunci: untung Rp18.000 · **30%** · D1: 23,08%

**L3-03** · Toko online · ▼ Rugi
> Kak Rani membeli sepatu di toko online seharga [[HB]]Rp250.000[[/]]. Ukurannya kekecilan, jadi sepatu itu dijual lagi [[HJ]]Rp200.000[[/]]. [[DITANYA]]Berapa persen kerugian Kak Rani?[[/]]

Kunci: rugi Rp50.000 · **20%** · D1: 25%

**L3-04** · Hewan kurban · ▲ Untung
> Pak Dodi membeli seekor kambing seharga [[HB]]Rp2.500.000[[/]]. Menjelang Iduladha, kambing itu dijual [[HJ]]Rp3.000.000[[/]]. [[DITANYA]]Berapa persen keuntungan Pak Dodi?[[/]]

Kunci: untung Rp500.000 · **20%** · D1: 16,67%

**L3-05** · Pasar sayur · ▼ Rugi
> Bu Ida membeli 1 keranjang tomat seharga [[HB]]Rp160.000[[/]]. Sebagian tomat busuk, sehingga hasil penjualannya hanya [[HJ]]Rp112.000[[/]]. [[DITANYA]]Berapa persen kerugian Bu Ida?[[/]]

Kunci: rugi Rp48.000 · **30%** · D1: 42,86%

**L3-06** · HP bekas · ▼ Rugi
> Dimas membeli HP bekas seharga [[HB]]Rp1.500.000[[/]]. Setahun kemudian, HP itu dijual [[HJ]]Rp1.050.000[[/]]. [[DITANYA]]Berapa persen kerugian Dimas?[[/]]

Kunci: rugi Rp450.000 · **30%** · D1: 42,86%

## 4. Level 4 — Soal cerita penerapan

Tanpa panduan dan tanpa petunjuk. Siswa mengisi jawaban akhir dan alasan, lalu pembahasan muncul setelah menjawab (design.md §8).

**L4-01** · Perkalian + angka pengecoh · ▲ Untung
> Bu Wati pergi ke pasar membawa uang [[PENGECOH]]Rp150.000[[/]]. Ia membeli 1 lusin gelas seharga [[HB]]Rp96.000[[/]]. Di rumah, semua gelas itu terjual dengan harga [[HJ]]Rp10.000 per buah[[/]]. [[DITANYA]]Berapa persen keuntungan Bu Wati?[[/]]

Penyelesaian: 1 lusin = 12 buah → HJ = 12 × 10.000 = Rp120.000 · untung = Rp24.000 · 24.000/96.000 × 100% = **25%**
D1: 20% · Kesalahan khusus: memakai Rp150.000 sebagai harga beli → 120.000 − 150.000 (rugi), yaitu salah identifikasi (D5).

**L4-02** · Membandingkan dua transaksi (Penalaran) · ▲ Untung
> Pak Ahmad menjual dua barang. Kipas angin dibeli [[HB]]Rp100.000[[/]] dan dijual [[HJ]]Rp125.000[[/]]. Setrika dibeli [[HB]]Rp200.000[[/]] dan dijual [[HJ]]Rp240.000[[/]]. [[DITANYA]]Barang mana yang persentase keuntungannya lebih besar?[[/]]

Penyelesaian: kipas untung Rp25.000 → **25%** · setrika untung Rp40.000 → **20%** → jawaban: **kipas angin**.
Bentuk jawaban: isi persen kedua barang + pilih barang + pilih alasan:
- **"Karena persentase dihitung dari harga beli masing-masing"** ✓
- "Karena untung setrika dalam rupiah lebih besar" (jebakan: membandingkan rupiah, bukan persen)

**L4-03** · Perkalian · ▼ Rugi
> Kak Sinta membeli 20 donat dengan harga [[HB]]Rp3.000 per buah[[/]]. Hari itu hujan deras. Semua donat akhirnya terjual, tetapi uang yang didapat hanya [[HJ]]Rp45.000[[/]]. [[DITANYA]]Berapa persen kerugian Kak Sinta?[[/]]

Penyelesaian: HB = 20 × 3.000 = Rp60.000 · rugi = Rp15.000 · 15.000/60.000 × 100% = **25%**
D1: 33,33%

**L4-04** · Per kg + pengecoh + desimal · ▲ Untung
> Pak Rudi membawa uang [[PENGECOH]]Rp1.000.000[[/]] ke agen beras. Ia membeli 50 kg beras dengan harga [[HB]]Rp12.000 per kg[[/]]. Beras itu ia jual di warungnya [[HJ]]Rp13.500 per kg[[/]] sampai habis. [[DITANYA]]Berapa persen keuntungan Pak Rudi?[[/]]

Penyelesaian: HB = 50 × 12.000 = Rp600.000 · HJ = 50 × 13.500 = Rp675.000 · untung = Rp75.000 · 75.000/600.000 × 100% = **12,5%**
Cara singkat (petunjuk di pembahasan): untung per kg Rp1.500 → 1.500/12.000 × 100% = 12,5%.
D1: 11,11%

**L4-05** · Mengevaluasi pernyataan (Menafsirkan) · ▼ Rugi
> Rina membeli boneka seharga [[HB]]Rp75.000[[/]]. Boneka itu ia jual kepada temannya [[HJ]]Rp60.000[[/]]. Rina berkata, "Aku untung 25%." [[DITANYA]]Apakah perkataan Rina benar?[[/]]

Penyelesaian: HJ < HB → **rugi**, bukan untung · rugi Rp15.000 · 15.000/75.000 × 100% = **rugi 20%** → perkataan Rina **salah**.
Catatan: angka 25% milik Rina = 15.000/60.000 × 100%. Artinya Rina tertukar untung/rugi (D3) **dan** membagi harga jual (D1).
Bentuk jawaban: pilih Benar/Salah → pilih jenis → isi persen → pilih alasan:
- **"Harga jual lebih kecil dari harga beli, jadi rugi. Persen dihitung dari harga beli."** ✓
- "Harga jual Rp60.000, jadi 15.000 dibagi 60.000."

## 5. Pemetaan ke Mathematical Literacy

| Indikator (PRD §8.2) | Soal yang melatih |
|---|---|
| Penalaran | Pilihan alasan di semua level; **L4-02** perbandingan |
| Merumuskan | Penandaan L3; **L4-01, L4-03, L4-04** (menyusun HB/HJ dari harga satuan; mengabaikan pengecoh) |
| Menggunakan | Isian besar dan persen L1–L4 |
| Menafsirkan | Langkah Periksa (hitung balik) L1–L3; **L4-05** evaluasi pernyataan |

Struktur data `soal.json` (api.md §5.2) perlu menambah dua nilai `ditanya`: `bandingkan` (L4-02) dan `evaluasi` (L4-05). Pembaruan ini akan dicatat di api.md setelah D-04 disetujui.

## 6. Verifikasi Angka

Dihitung dengan skrip Python (persen = selisih ÷ HB × 100; hitung balik = persen × HB ÷ 100).

| ID | HB | HJ | Jenis | Selisih | Persen | D1 (÷HJ) | Hitung balik |
|---|---|---|---|---|---|---|---|
| L1-01 | 20.000 | 25.000 | Untung | 5.000 | – | – | ✓ |
| L1-02 | 48.000 | 50.000 | Untung | 2.000 | – | – | ✓ |
| L1-03 | 30.000 | 24.000 | Rugi | 6.000 | – | – | ✓ |
| L1-04 | 35.000 | 45.000 | Untung | 10.000 | – | – | ✓ |
| L1-05 | 60.000 | 54.000 | Rugi | 6.000 | – | – | ✓ |
| L1-06 | 18.000 | 15.000 | Rugi | 3.000 | – | – | ✓ |
| L2-01 | 40.000 | 50.000 | Untung | 10.000 | 25 | 20 | 10.000 ✓ |
| L2-02 | 75.000 | 60.000 | Rugi | 15.000 | 20 | 25 | 15.000 ✓ |
| L2-03 | 150.000 | 180.000 | Untung | 30.000 | 20 | 16,67 | 30.000 ✓ |
| L2-04 | 120.000 | 90.000 | Rugi | 30.000 | 25 | 33,33 | 30.000 ✓ |
| L2-05 | 25.000 | 35.000 | Untung | 10.000 | 40 | 28,57 | 10.000 ✓ |
| L2-06 | 200.000 | 180.000 | Rugi | 20.000 | 10 | 11,11 | 20.000 ✓ |
| L3-01 | 48.000 | 60.000 | Untung | 12.000 | 25 | 20 | 12.000 ✓ |
| L3-02 | 60.000 | 78.000 | Untung | 18.000 | 30 | 23,08 | 18.000 ✓ |
| L3-03 | 250.000 | 200.000 | Rugi | 50.000 | 20 | 25 | 50.000 ✓ |
| L3-04 | 2.500.000 | 3.000.000 | Untung | 500.000 | 20 | 16,67 | 500.000 ✓ |
| L3-05 | 160.000 | 112.000 | Rugi | 48.000 | 30 | 42,86 | 48.000 ✓ |
| L3-06 | 1.500.000 | 1.050.000 | Rugi | 450.000 | 30 | 42,86 | 450.000 ✓ |
| L4-01 | 96.000 | 120.000 | Untung | 24.000 | 25 | 20 | 24.000 ✓ |
| L4-02 kipas | 100.000 | 125.000 | Untung | 25.000 | 25 | 20 | 25.000 ✓ |
| L4-02 setrika | 200.000 | 240.000 | Untung | 40.000 | 20 | 16,67 | 40.000 ✓ |
| L4-03 | 60.000 | 45.000 | Rugi | 15.000 | 25 | 33,33 | 15.000 ✓ |
| L4-04 | 600.000 | 675.000 | Untung | 75.000 | 12,5 | 11,11 | 75.000 ✓ |
| L4-05 | 75.000 | 60.000 | Rugi | 15.000 | 20 | 25 | 15.000 ✓ |

Rekap jenis: L1 3 untung/3 rugi · L2 3/3 · L3 3/3 · L4 3 untung/2 rugi.

## 7. Keputusan Pemilik Proyek (11 November 2026)

1. Konteks kambing menjelang Iduladha (L3-04) **tetap**.
2. L4-04 dengan hasil desimal 12,5% **tetap**.
3. **Level 1 tanpa persentase sama sekali.** Contoh C4 dipindah ke sebelum Level 2.
4. Soal evaluasi pernyataan Rina (L4-05) **tetap**.
