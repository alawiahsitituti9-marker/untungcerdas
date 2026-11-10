# API — MathSave

Versi: 0.1 (draf, menunggu persetujuan) · Acuan: [architecture.md](architecture.md)

MathSave **tidak** memiliki server API buatan sendiri. "API" di sini adalah:
1. **Supabase Auth** (`/auth/v1`) untuk login kode siswa.
2. **Supabase REST/PostgREST** (`/rest/v1`) untuk tabel dan fungsi RPC.
3. **File JSON statis** dari hosting frontend untuk konten.

Frontend memanggil endpoint ini melalui `@supabase/supabase-js`. Bentuk HTTP ditulis agar mudah diuji dan didokumentasikan. Semua permintaan ke Supabase menyertakan header:

```
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <access_token>      (setelah login)
Content-Type: application/json
```

Bergantung pada **[Keputusan K-03]** (mekanisme login). Jika K-03 berubah, Bagian 2 akan direvisi.

---

## 1. Ringkasan Endpoint

| No | Metode | Endpoint | Fungsi | Fitur |
|---|---|---|---|---|
| 1 | POST | `/auth/v1/token?grant_type=password` | Masuk dengan kode | F01 |
| 2 | POST | `/auth/v1/token?grant_type=refresh_token` | Memperbarui sesi (otomatis) | F01 |
| 3 | POST | `/auth/v1/logout` | Keluar | F01 |
| 4 | GET | `/rest/v1/siswa?select=kode_tampil,kelas` | Identitas siswa | F02 |
| 5 | POST | `/rest/v1/rpc/ringkasan_progres` | Ringkasan untuk Beranda dan Progres | F02, F13 |
| 6 | GET | `/rest/v1/progres_materi?select=materi_id,status` | Status tiap submateri | F03, F13 |
| 7 | POST | `/rest/v1/progres_materi` (upsert) | Menandai submateri dibuka/selesai | F03 |
| 8 | POST | `/rest/v1/percobaan_soal` | Mencatat satu jawaban soal | F09, F10, F11 |
| 9 | GET | `/data/materi.json` | Konten materi dan contoh | F03, F04, F12 |
| 10 | GET | `/data/soal.json` | Bank soal | F09 |

## 2. Autentikasi Kode Siswa

### 2.1 Masuk

`POST /auth/v1/token?grant_type=password`

Request (dibentuk oleh frontend dari kode yang diketik siswa):

```json
{
  "email": "ms7k4pq2xr@siswa.mathsave.app",
  "password": "MS7K4PQ2XR"
}
```

Normalisasi di frontend sebelum dikirim: huruf besar, hapus spasi dan "-", lalu validasi pola `^MS[A-HJKMNP-Z2-9]{8}$`.

Response 200 (dipangkas):

```json
{
  "access_token": "eyJ...",
  "refresh_token": "abc...",
  "expires_in": 3600,
  "user": { "id": "0b6c...-uuid" }
}
```

Response 400: kode tidak cocok → tampilkan "Kode tidak ditemukan. Periksa lagi hurufnya."
Response 429: terlalu banyak percobaan → tampilkan "Terlalu banyak percobaan. Tunggu sebentar, lalu coba lagi."

### 2.2 Keluar

`POST /auth/v1/logout` → 204. Frontend menghapus sesi lokal dan kembali ke P01.

## 3. Endpoint Data

### 3.1 Identitas siswa

`GET /rest/v1/siswa?select=kode_tampil,kelas` → 200

```json
[{ "kode_tampil": "MS-7K4P", "kelas": "VIII" }]
```

`kode_tampil` hanya memuat 4 karakter pertama kode, agar kode lengkap tidak terlihat di layar.

### 3.2 Ringkasan progres

`POST /rest/v1/rpc/ringkasan_progres` dengan body `{}` → 200

```json
{
  "materi_selesai": 4,
  "materi_total": 7,
  "materi_berikutnya": "M5",
  "level": [
    { "level": 1, "terbuka": true,  "benar_terbaik": 5, "jumlah_soal": 5 },
    { "level": 2, "terbuka": true,  "benar_terbaik": 2, "jumlah_soal": 5 },
    { "level": 3, "terbuka": false, "benar_terbaik": 0, "jumlah_soal": 5 },
    { "level": 4, "terbuka": false, "benar_terbaik": 0, "jumlah_soal": 5 }
  ],
  "rata_petunjuk_per_level": { "1": 1.4, "2": 0.8 }
}
```

`materi_total` = 7 (M0–M6). M0 opsional dan tidak menghalangi "materi berikutnya". Aturan "level terbuka" sama dengan [design.md](design.md) §4. Fungsi berjalan sebagai `SECURITY INVOKER`, sehingga RLS tetap berlaku.

### 3.3 Status submateri

`GET /rest/v1/progres_materi?select=materi_id,status` → 200

```json
[{ "materi_id": "M1", "status": "selesai" }, { "materi_id": "M5", "status": "dibuka" }]
```

`POST /rest/v1/progres_materi` dengan header `Prefer: resolution=merge-duplicates`

```json
{ "siswa_id": "<auth.uid()>", "materi_id": "M5", "status": "selesai" }
```

→ 201. Status tidak boleh turun dari `selesai` menjadi `dibuka`. Hal ini dijaga oleh trigger database.

### 3.4 Catat percobaan soal

`POST /rest/v1/percobaan_soal`

```json
{
  "siswa_id": "<auth.uid()>",
  "soal_id": "L3-02",
  "level": 3,
  "benar": false,
  "kode_kesalahan": "D1",
  "langkah_salah": 6,
  "jumlah_petunjuk": 1,
  "percobaan_ke": 1,
  "durasi_detik": 74
}
```

→ 201. Dikirim satu kali per jawaban akhir soal latihan Level 1–4 (bukan per langkah). Soal cek cepat di akhir submateri (`L0-Mx`) tidak dicatat di tabel ini; hasilnya cukup menandai `progres_materi` sebagai `selesai`.

## 4. Struktur Data dan Kebijakan Database

```sql
create table siswa (
  id uuid primary key references auth.users(id) on delete cascade,
  kode_tampil text not null check (kode_tampil ~ '^MS-[A-Z0-9]{4}$'),
  kelas text check (kelas in ('VIII','IX')),
  dibuat_pada timestamptz not null default now()
);

create table progres_materi (
  siswa_id uuid references siswa(id) on delete cascade,
  materi_id text not null check (materi_id ~ '^(M[0-6]|C[0-9]{1,2}|SIM)$'),
  status text not null check (status in ('dibuka','selesai')),
  diperbarui_pada timestamptz not null default now(),
  primary key (siswa_id, materi_id)
);

create table percobaan_soal (
  id bigint generated always as identity primary key,
  siswa_id uuid not null references siswa(id) on delete cascade,
  soal_id text not null check (soal_id ~ '^L[1-4]-[0-9]{2}$'),
  level smallint not null check (level between 1 and 4),
  benar boolean not null,
  kode_kesalahan text check (kode_kesalahan in ('D1','D2','D3','D4','D5','D6')),
  langkah_salah smallint check (langkah_salah between 1 and 7),
  jumlah_petunjuk smallint not null default 0 check (jumlah_petunjuk between 0 and 4),
  percobaan_ke smallint not null default 1 check (percobaan_ke in (1,2)),
  durasi_detik integer check (durasi_detik between 0 and 3600),
  dibuat_pada timestamptz not null default now()
);

alter table siswa enable row level security;
alter table progres_materi enable row level security;
alter table percobaan_soal enable row level security;

create policy "baca diri sendiri" on siswa for select using (id = auth.uid());
create policy "kelola progres sendiri" on progres_materi for all
  using (siswa_id = auth.uid()) with check (siswa_id = auth.uid());
create policy "baca percobaan sendiri" on percobaan_soal for select using (siswa_id = auth.uid());
create policy "tambah percobaan sendiri" on percobaan_soal for insert with check (siswa_id = auth.uid());
```

Siswa tidak dapat mengubah atau menghapus `percobaan_soal` (tidak ada kebijakan update/delete). Baris `siswa` hanya dibuat oleh skrip pengembang.

## 5. Struktur Konten Statis

### 5.1 `materi.json` (potongan)

```json
{
  "versi": 1,
  "materi": [
    {
      "id": "M5",
      "judul": "Persentase Untung",
      "kartu": [
        {
          "gambar": "tas",
          "hb": 80000, "hj": 100000,
          "teks": ["Persentase dihitung dari HARGA BELI.", "Harga beli adalah uang yang dikeluarkan pedagang."],
          "rumus": { "jenis": "persen_untung", "pembilang": 20000, "penyebut": 80000, "hasil": 25 }
        }
      ],
      "cek_cepat": "L0-M5"
    }
  ]
}
```

### 5.2 `soal.json` (satu soal)

```json
{
  "id": "L3-02",
  "level": 3,
  "gambar": "tas",
  "segmen": [
    { "teks": "Bu Rina membeli 1 tas seharga " },
    { "teks": "Rp60.000", "peran": "HB", "nilai": 60000 },
    { "teks": ". Tas itu dijual " },
    { "teks": "Rp78.000", "peran": "HJ", "nilai": 78000 },
    { "teks": ". " },
    { "teks": "Berapa persen keuntungan Bu Rina?", "peran": "DITANYA" }
  ],
  "ditanya": "persen",
  "kunci": { "jenis": "untung", "besar": 18000, "persen": 30 },
  "alasan": {
    "pilihan": ["Karena harga jual lebih besar dari harga beli", "Karena harga beli lebih besar dari harga jual"],
    "benar": 0
  }
}
```

Nilai `peran` yang dipakai: `HB`, `HJ`, `SELISIH` (besar untung/rugi yang sudah disebut di soal), `DITANYA`, dan `PENGECOH` (angka yang tidak dipakai, Level 4).

Nilai `ditanya` yang dipakai (sesuai [D-04_bank_soal.md](konten/D-04_bank_soal.md)):

| Nilai | Arti | Level |
|---|---|---|
| `jenis_besar` | Untung/rugi + alasan + besar rupiah (**tanpa persen**) | 1 |
| `persen` | Jenis + alasan + besar + persen | 2, 3, 4 |
| `bandingkan` | Persen dua transaksi + pilih yang lebih besar + alasan (L4-02) | 4 |
| `evaluasi` | Menilai pernyataan Benar/Salah + jenis + persen + alasan (L4-05) | 4 |

Untuk soal dengan harga satuan (L4-01, L4-03, L4-04), segmen HB/HJ menyimpan `nilai` total, `harga_satuan`, dan `jumlah` (misalnya `{ "nilai": 120000, "harga_satuan": 10000, "jumlah": 12 }`).

## 6. Validasi Input

| Input | Aturan | Pesan jika salah |
|---|---|---|
| Kode siswa | 10 karakter setelah normalisasi; pola §2.1 | "Kode terdiri dari MS dan 8 huruf/angka." |
| Rupiah | Bilangan bulat ≥ 0; titik ribuan diabaikan; maksimal 10.000.000 | "Tulis angka saja, contoh 20000." |
| Persen | Angka 0–100; koma atau titik desimal; maksimal 2 angka desimal; toleransi ±0,01 | "Tulis angka persennya, contoh 25 atau 12,5." |
| Pilihan | Harus salah satu pilihan | (tombol tidak aktif sebelum memilih) |

Validasi format dilakukan di frontend. Validasi tipe dan rentang diulang oleh constraint database (§4).

## 7. Penanganan Kesalahan

| Kondisi | Sumber | Tindakan frontend | Pesan untuk siswa |
|---|---|---|---|
| Kode salah | Auth 400 | Tetap di P01 | "Kode tidak ditemukan. Periksa lagi hurufnya." |
| Terlalu banyak percobaan | Auth 429 | Nonaktifkan tombol 30 detik | "Terlalu banyak percobaan. Tunggu sebentar, lalu coba lagi." |
| Sesi kedaluwarsa | 401 | Coba refresh; jika gagal, kembali ke P01 | "Silakan masuk lagi dengan kodemu." |
| Tidak ada internet saat menyimpan | Jaringan | Simpan di antrean lokal; kirim ulang nanti | "Jawabanmu disimpan sementara di HP ini." |
| Proyek Supabase dijeda | 5xx / timeout | Tampilkan pesan; materi tetap bisa dibaca dari cache | "Server sedang tidak aktif. Kamu tetap bisa membaca materi." |
| Ditolak RLS / constraint | 403 / 400 | Catat di konsol; tidak diulang | "Ada kesalahan. Coba muat ulang halaman." |
| `materi.json` gagal dimuat | Hosting | Tombol "Coba lagi" | "Materi belum termuat. Periksa koneksi internet." |
