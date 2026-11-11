# API — MathSave

Versi: 0.2 · Acuan: [architecture.md](architecture.md)

Riwayat: 0.1 disetujui 11 November 2026. **0.2 (disetujui 12 November 2026):** endpoint dan skema F14 Latihan Literasi Matematis (§1, §3.5–3.7, §4.1, §5.3, §7). Semua tambahan berstatus **[Usulan]** yang disetujui 12 November 2026.

MathSave **tidak** memiliki server API buatan sendiri. "API" di sini adalah:
1. **Supabase Auth** (`/auth/v1`) untuk login kode siswa.
2. **Supabase REST/PostgREST** (`/rest/v1`) untuk tabel dan fungsi RPC.
3. **File JSON statis** dari hosting frontend untuk konten.

Frontend memanggil endpoint ini melalui `@supabase/supabase-js`. Bentuk HTTP ditulis agar mudah diuji dan didokumentasikan. Semua permintaan ke Supabase menyertakan header:

```
apikey: <publishable key>                (VITE_SUPABASE_PUBLISHABLE_KEY; dulu disebut anon key)
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
| 11 | GET | `/data/literasi.json` | Soal, tahap, rubrik, umpan balik F14 **[Usulan]** | F14 |
| 12 | POST | `/rest/v1/rpc/simpan_evaluasi_literasi` | Menyimpan satu hasil F14 (ringkasan + 23 tahap) **[Usulan]** | F14 |
| 13 | GET | `/rest/v1/evaluasi_literasi` | Riwayat hasil F14 **[Usulan]** | F14, F13 |
| 14 | GET | `/rest/v1/jawaban_literasi?evaluasi_id=eq.<id>` | Jawaban per tahap untuk membuka ulang pembahasan **[Usulan]** | F14 |

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
  "durasi_detik": 74,
  "id_klien": "9b2e…-uuid dibuat di HP"
}
```

→ 201. `id_klien` adalah id item antrean luring (migrasi `003_id_klien.sql`, §4.2). Jika baris yang sama dikirim ulang, database menolaknya dengan **409** dan antrean menganggapnya sudah terkirim, sehingga tidak ada data ganda. Dikirim satu kali per jawaban akhir soal latihan Level 1–4 (bukan per langkah). Soal cek cepat di akhir submateri (`L0-Mx`) tidak dicatat di tabel ini; hasilnya cukup menandai `progres_materi` sebagai `selesai`.

### 3.5 Simpan hasil Latihan Literasi Matematis (F14) **[Usulan, KL-13]**

`POST /rest/v1/rpc/simpan_evaluasi_literasi`

Dikirim **sekali** setelah keempat soal selesai. Satu panggilan menyimpan ringkasan dan 23 jawaban tahap dalam satu transaksi, sehingga tidak ada hasil yang tersimpan setengah.

```json
{
  "p_hasil": {
    "id": "6f1c…-uuid dibuat di HP",
    "versi_rubrik": 1,
    "urutan": ["ML-3", "ML-4", "ML-2", "ML-1"],
    "skor": { "reasoning": 5, "formulating": 3, "employing": 6, "interpreting": 4 },
    "jumlah_bantuan": 3,
    "durasi_detik": 1260,
    "dimulai_pada": "2026-11-15T08:01:00+07:00",
    "jawaban": [
      { "soal_id": "ML-2", "tahap": 3, "jawaban": { "pilihan": 1 }, "skor": 0, "skor_maks": 1, "kode_umpan": "D1", "konsekuen": false, "jumlah_bantuan": 1 },
      { "soal_id": "ML-2", "tahap": 4, "jawaban": { "rupiah": 60000 }, "skor": 1, "skor_maks": 1, "kode_umpan": null, "konsekuen": true, "jumlah_bantuan": 0 }
    ]
  }
}
```

Response 200:

```json
{ "id": "6f1c…", "percobaan_ke": 2, "skor_total": 18 }
```

Aturan:
- `siswa_id` tidak dikirim. Fungsi memakai `auth.uid()`.
- `percobaan_ke` dihitung di database (jumlah hasil sebelumnya + 1).
- `id` dibuat di HP. Jika paket yang sama dikirim ulang dari antrean luring, fungsi mengembalikan hasil yang sudah ada tanpa membuat data ganda.
- Fungsi menolak paket (400) jika jumlah tahap ≠ 23, ada skor di luar batas bobot, atau skor per indikator ≠ jumlah skor tahap soalnya.
- **RPC ini satu-satunya jalan menyimpan hasil** (migrasi `004_keamanan_literasi.sql`, §4.3). Insert langsung ke `evaluasi_literasi` atau `jawaban_literasi` lewat REST ditolak. Hanya siswa yang login (`authenticated`) yang boleh memanggil RPC; `anon` tidak.

Bentuk `jawaban` per jenis isian:

| Isian | Bentuk |
|---|---|
| Penanda Informasi | `{ "label": { "0": "HB", "2": "HJ" } }` (indeks segmen → label) |
| Pilihan | `{ "pilihan": 1 }` (indeks pada urutan asli di `literasi.json`, bukan urutan tampil) |
| Rupiah | `{ "rupiah": 50000 }` |
| Persen | `{ "persen": 25 }` |
| Gabungan (mis. ML-1 tahap 3) | `{ "pilihan": 1, "persen": [25, 25, 20] }` |

### 3.6 Riwayat hasil Literasi Matematis **[Usulan]**

`GET /rest/v1/evaluasi_literasi?select=id,percobaan_ke,skor_reasoning,skor_formulating,skor_employing,skor_interpreting,skor_total,jumlah_bantuan,selesai_pada&order=selesai_pada.desc` → 200

```json
[{ "id": "6f1c…", "percobaan_ke": 2, "skor_reasoning": 5, "skor_formulating": 3, "skor_employing": 6, "skor_interpreting": 4, "skor_total": 18, "jumlah_bantuan": 3, "selesai_pada": "2026-11-15T08:22:00+07:00" }]
```

`GET /rest/v1/jawaban_literasi?evaluasi_id=eq.<id>&select=soal_id,tahap,jawaban,skor,skor_maks,kode_umpan,konsekuen,jumlah_bantuan` → 200. Dipakai untuk membuka ulang pembahasan percobaan lama di P14.

### 3.7 Perluasan ringkasan progres **[Usulan]**

`rpc/ringkasan_progres` (§3.2) mendapat kunci tambahan:

```json
{
  "literasi": {
    "jumlah_percobaan": 2,
    "pertama": { "skor_total": 14, "selesai_pada": "2026-11-12T09:00:00+07:00" },
    "terakhir": { "skor_total": 18, "skor": [5, 3, 6, 4], "selesai_pada": "2026-11-15T08:22:00+07:00" },
    "terbaik": 18
  }
}
```

Jika siswa belum pernah mengerjakan, `literasi` bernilai `null`.

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

### 4.1 Usulan migrasi `002_literasi.sql` (F14) **[Usulan, KL-13]**

Ditambahkan dan **disetujui 12 November 2026 (KL-13)**. Sudah dibuat di tugas LM-09 sebagai `supabase/migrations/002_literasi.sql` (12 November 2026) dan lulus uji PGlite; belum dijalankan di proyek Supabase.

Pemeriksaan skema saat ini: tabel `percobaan_soal` **tidak** cukup untuk F14. Tabel itu menyimpan satu baris per soal Level 1–4 dengan kolom benar/salah, tanpa skor per tahap, skor per indikator, atau pengelompokan per percobaan. Karena itu diusulkan dua tabel baru. Tabel lama tidak diubah.

```sql
create table evaluasi_literasi (
  id uuid primary key,                         -- dibuat di HP; mencegah data ganda dari antrean luring
  siswa_id uuid not null default auth.uid() references siswa(id) on delete cascade,
  percobaan_ke smallint not null check (percobaan_ke >= 1),
  versi_rubrik smallint not null check (versi_rubrik >= 1),
  urutan text[] not null,
  skor_reasoning    smallint not null check (skor_reasoning    between 0 and 6),
  skor_formulating  smallint not null check (skor_formulating  between 0 and 6),
  skor_employing    smallint not null check (skor_employing    between 0 and 6),
  skor_interpreting smallint not null check (skor_interpreting between 0 and 6),
  skor_total smallint generated always as
    (skor_reasoning + skor_formulating + skor_employing + skor_interpreting) stored,
  jumlah_bantuan smallint not null default 0 check (jumlah_bantuan between 0 and 46),
  durasi_detik integer check (durasi_detik between 0 and 14400),
  dimulai_pada timestamptz,
  selesai_pada timestamptz not null default now(),
  unique (siswa_id, percobaan_ke)
);

create table jawaban_literasi (
  evaluasi_id uuid not null references evaluasi_literasi(id) on delete cascade,
  siswa_id uuid not null default auth.uid() references siswa(id) on delete cascade,
  soal_id text not null check (soal_id in ('ML-1','ML-2','ML-3','ML-4')),
  tahap smallint not null check (tahap between 1 and 6),
  jawaban jsonb not null check (jsonb_typeof(jawaban) = 'object' and pg_column_size(jawaban) <= 1024),
  skor smallint not null check (skor between 0 and 2),
  skor_maks smallint not null check (skor_maks between 1 and 2 and skor <= skor_maks),
  kode_umpan text check (kode_umpan ~ '^[A-Z0-9-]{1,20}$'),
  konsekuen boolean not null default false,
  jumlah_bantuan smallint not null default 0 check (jumlah_bantuan between 0 and 2),
  primary key (evaluasi_id, soal_id, tahap)
);

alter table evaluasi_literasi enable row level security;
alter table jawaban_literasi enable row level security;

create policy "baca evaluasi sendiri" on evaluasi_literasi for select using (siswa_id = auth.uid());
create policy "tambah evaluasi sendiri" on evaluasi_literasi for insert with check (siswa_id = auth.uid());
create policy "baca jawaban sendiri" on jawaban_literasi for select using (siswa_id = auth.uid());
create policy "tambah jawaban sendiri" on jawaban_literasi for insert with check (siswa_id = auth.uid());
-- Tidak ada kebijakan update/delete: hasil yang sudah tersimpan tidak bisa diubah siswa.
```

Kedua kebijakan `tambah … sendiri` di atas **dihapus oleh migrasi 004** (§4.3); kebijakan baca tetap.

Fungsi `simpan_evaluasi_literasi(p_hasil jsonb)` di 002 ditulis sebagai `SECURITY INVOKER`. Sejak 004 fungsi ini `SECURITY DEFINER` dengan pengaman (§4.3). Isinya:
1. Jika `id` sudah ada untuk `auth.uid()`, kembalikan baris itu (idempoten).
2. Validasi: tepat 23 tahap; pasangan soal–tahap sesuai daftar (ML-1 tahap 1–5, ML-2 sampai ML-4 tahap 1–6); `skor_maks` ML-1 tahap 3 = 2 dan lainnya 1; jumlah skor tahap per soal = skor indikatornya.
3. Hitung `percobaan_ke`, lalu insert ke kedua tabel dalam satu transaksi.

Kode lengkap fungsi ada di `supabase/migrations/002_literasi.sql`. Migrasi itu juga mengganti nama `ringkasan_progres` lama menjadi `ringkasan_progres_dasar` dan membuat `ringkasan_progres` baru dengan kunci `literasi` (§3.7).

### 4.2 Migrasi `003_id_klien.sql`: mencegah percobaan soal tercatat ganda

Disetujui pemilik proyek 12 November 2026 (opsi A). Jalankan setelah 001 dan 002.

Masalah: `percobaan_soal.id` dibuat database. Jika server sudah menyimpan baris tetapi balasannya tidak sampai ke HP, antrean luring mengirim ulang dan baris yang sama tercatat dua kali. Baris ganda tidak bisa dibedakan dari percobaan ulang yang sungguhan, sehingga data penelitian terdistorsi.

```sql
alter table percobaan_soal add column id_klien uuid;
alter table percobaan_soal add constraint percobaan_soal_id_klien_unik unique (id_klien);
```

- HP mengirim id item antrean sebagai `id_klien` (§3.4). Kiriman ulang dengan `id_klien` yang sama melanggar UNIQUE (kode `23505`), PostgREST membalas 409, dan antrean menghapus item itu (§7).
- Kolom boleh kosong agar aman untuk baris yang sudah ada. Beberapa baris tanpa `id_klien` tidak bentrok.
- Kolom lama, RLS, trigger, dan `ringkasan_progres` tidak berubah. Pembatalan: `alter table percobaan_soal drop column id_klien;`

Pencegahan data ganda untuk semua kiriman antrean (`app/src/layanan/pengirimAntrean.js`):

| Data | Penanda dari HP | Kiriman ulang |
|---|---|---|
| `percobaan_soal` | `id_klien` (UNIQUE) | Ditolak 409 → dianggap terkirim |
| `evaluasi_literasi` | `p_hasil.id` | RPC mengembalikan hasil yang sudah ada |
| `progres_materi` | Kunci (`siswa_id`, `materi_id`) | Upsert; tetap satu baris |

### 4.3 Migrasi `004_keamanan_literasi.sql`: hasil literasi hanya lewat RPC tervalidasi

Disetujui pemilik proyek 12 November 2026. Jalankan setelah 003. Menutup dua temuan pemeriksaan keamanan:
- **A.** Siswa bisa menambah baris `jawaban_literasi` miliknya yang menunjuk `evaluasi_id` siswa lain (slot kosong seperti ML-1 tahap 6).
- **B.** Siswa bisa menyimpan hasil langsung lewat REST tanpa validasi RPC.

| Lapisan | Isi |
|---|---|
| Tulis langsung ditutup | Kebijakan INSERT kedua tabel dihapus; hak `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE` dicabut dari `anon` dan `authenticated`. Kebijakan SELECT (baca data sendiri) tetap |
| RPC aman | `simpan_evaluasi_literasi` menjadi `SECURITY DEFINER` dengan `set search_path = ''`, semua nama berkualifikasi skema (`public.…`, `auth.uid()`), wajib `auth.uid()`, dan `siswa_id` selalu `auth.uid()` (nilai dari paket diabaikan). `EXECUTE` dicabut dari `PUBLIC` dan `anon`, hanya untuk `authenticated` |
| Validasi tambahan | `id` wajib ada; `urutan` harus memuat ML-1..ML-4 tepat sekali; skor tiap tahap 0..`skor_maks`; paket harus objek. Validasi lama (23 tahap, pasangan soal–tahap, bobot, skor indikator) tetap |
| Skema | Foreign key `(evaluasi_id, siswa_id)` → `evaluasi_literasi (id, siswa_id)`: baris jawaban selalu milik siswa yang sama dengan evaluasinya, bahkan untuk kunci secret. Batasan `soal_id <> 'ML-1' or tahap <= 5` |

Pemilik fungsi adalah pemilik tabel, sehingga fungsi dapat menulis walau tanpa kebijakan INSERT (RLS tidak berlaku untuk pemilik tabel selama tidak `FORCE ROW LEVEL SECURITY`). Antrean luring tidak berubah: kiriman ulang dengan `id` yang sama tetap mengembalikan hasil yang ada; paket tidak valid dibalas 400 dan dibuang (§7).

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

### 5.3 `literasi.json` (F14, potongan) **[Usulan]**

Teks soal dan kunci **[Spesifikasi]** disalin persis dari PRD §8.4. Uji unit membandingkan teks gabungan `segmen` dengan teks PRD, agar perubahan tidak sengaja terdeteksi.

```json
{
  "versi_rubrik": 1,
  "urutan": ["ML-3", "ML-4", "ML-2", "ML-1"],
  "indikator": [
    { "no": 1, "kunci": "reasoning", "nama": "Mathematical Reasoning", "keterangan": "Bernalar: membandingkan dan memberi alasan", "soal": "ML-1" }
  ],
  "soal": [
    {
      "id": "ML-2",
      "nomor": 2,
      "indikator": 2,
      "segmen": [
        { "teks": "Ibu membeli sebuah blender dengan harga " },
        { "teks": "Rp250.000", "peran": "HB", "nilai": 250000 },
        { "teks": ". Ibu ingin menjual blender tersebut dengan memperoleh keuntungan sebesar " },
        { "teks": "20%", "peran": "PERSEN", "nilai": 20 },
        { "teks": " dari harga beli." }
      ],
      "pertanyaan": "Berapakah harga jual blender yang harus ditetapkan? Tuliskan model matematika dan langkah penyelesaiannya.",
      "kunci_teks": ["Harga beli = Rp250.000.", "…"],
      "tahap": [
        {
          "no": 3,
          "bobot": 1,
          "kriteria": ["M"],
          "perintah": "Pilih model untuk menghitung keuntungan.",
          "isian": { "jenis": "pilihan", "pilihan": [
            { "teks": "Keuntungan = 20% × harga beli", "benar": true },
            { "teks": "Keuntungan = 20% × harga jual", "kode": "D1" }
          ] },
          "umpan": { "D1": "Soal menyebut \"20% dari harga beli\". Jadi dikali harga beli." },
          "bantuan": ["Cari kata \"dari harga beli\" di soal.", "20% dari suatu harga = 20/100 × harga itu."],
          "saran": { "D1": "M5" }
        }
      ]
    }
  ]
}
```

Nilai `peran` baru: `PERSEN` (persen yang diketahui di soal, ML-2). Nilai `kriteria` mengikuti aspek bagian C: `I`, `M`, `R`, `H`, `T`, `K` (D-08 §3.3).

## 6. Validasi Input

| Input | Aturan | Pesan jika salah |
|---|---|---|
| Kode siswa | 10 karakter setelah normalisasi; pola §2.1 | "Kode terdiri dari MS dan 8 huruf/angka." |
| Rupiah | Bilangan bulat ≥ 0; titik ribuan diabaikan; maksimal 10.000.000 | "Tulis angka saja, contoh 20000." |
| Persen | Angka 0–10.000 (persen untung bisa lebih dari 100%, dan kesalahan seperti 1.400% di L4-03 harus tetap terbaca untuk diagnosis); koma atau titik desimal; maksimal 4 angka desimal; toleransi benar ±0,01 | "Tulis angka persennya, contoh 25 atau 12,5." |
| Pilihan | Harus salah satu pilihan | (tombol tidak aktif sebelum memilih) |

Validasi format dilakukan di frontend. Validasi tipe dan rentang diulang oleh constraint database (§4).

## 7. Penanganan Kesalahan

| Kondisi | Sumber | Tindakan frontend | Pesan untuk siswa |
|---|---|---|---|
| Kode salah | Auth 400 | Tetap di P01 | "Kode tidak ditemukan. Periksa lagi hurufnya." |
| Login tanpa internet | Jaringan | Tetap di P01 | "Tidak ada koneksi internet. Periksa koneksi, lalu coba lagi." **[Usulan, DV-05]** |
| Akun Auth ada tetapi baris `siswa` belum ada | Data | Keluar lagi; tetap di P01 | "Akun belum siap. Tanyakan kepada guru." **[Usulan, DV-05]** |
| `app/.env` tidak lengkap atau berisi kunci rahasia | Konfigurasi | Login ditolak; alasan di konsol | "Aplikasi belum diatur dengan benar. Beri tahu guru." **[Usulan, DV-05]** |
| Terlalu banyak percobaan | Auth 429 | Nonaktifkan tombol 30 detik | "Terlalu banyak percobaan. Tunggu sebentar, lalu coba lagi." |
| Sesi kedaluwarsa | 401 | Coba refresh; jika gagal, kembali ke P01 | "Silakan masuk lagi dengan kodemu." |
| Tidak ada internet saat menyimpan | Jaringan | Simpan di antrean lokal; kirim ulang nanti | "Jawabanmu disimpan sementara di HP ini." |
| Data kiriman ulang sudah ada di server | 409 (UNIQUE, §4.2) | Dianggap terkirim; hapus dari antrean | – (tanpa pesan) |
| Proyek Supabase dijeda | 5xx / timeout | Tampilkan pesan; materi tetap bisa dibaca dari cache | "Server sedang tidak aktif. Kamu tetap bisa membaca materi." |
| Ditolak RLS / constraint | 403 / 400 | Catat di konsol; tidak diulang | "Ada kesalahan. Coba muat ulang halaman." |
| `materi.json` gagal dimuat | Hosting | Tombol "Coba lagi" | "Materi belum termuat. Periksa koneksi internet." |
| F14: hasil gagal dikirim | Jaringan / 5xx | Hasil tetap tampil di P14; paket masuk antrean | "Hasilmu disimpan sementara di HP ini." **[Usulan]** |
| F14: paket ditolak validasi RPC | 400 | Catat di konsol; hasil tetap tampil | "Hasil belum bisa disimpan. Coba muat ulang halaman." **[Usulan]** |
