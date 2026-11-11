# Supabase — panduan menyiapkan proyek MathSave

Untuk pemilik proyek atau pengembang. Langkah ini dilakukan sekali, sebelum uji coba dengan siswa (task.md DV-02, DV-03).

> **Jangan pernah menempelkan kunci (publishable maupun secret) ke chat, dokumen, atau kode.** Kunci hanya diisi di file `.env` yang tidak masuk git.

## 1. Buat proyek (tier gratis)

1. Masuk ke [supabase.com](https://supabase.com) → **New project**.
2. Isi nama proyek (bebas), kata sandi database (simpan di pengelola kata sandi), dan region terdekat (mis. Singapore).
3. Tunggu sampai proyek siap.

## 2. Atur login

Di **Authentication → Sign In / Providers → Email**:

- **Allow new users to sign up: matikan.** Akun siswa hanya dibuat oleh skrip pengembang (Keputusan K-04).
- **Confirm email:** boleh dibiarkan. Skrip membuat akun dengan email yang sudah dikonfirmasi.

## 3. Jalankan migrasi

Di **SQL Editor**, tempel lalu jalankan isi file berikut **berurutan**:

1. `supabase/migrations/001_skema.sql`
2. `supabase/migrations/002_literasi.sql`
3. `supabase/migrations/003_id_klien.sql` (mencegah percobaan soal tercatat ganda dari antrean luring; api.md §4.2)
4. `supabase/migrations/004_keamanan_literasi.sql` (hasil Literasi Matematis hanya bisa disimpan lewat RPC tervalidasi; api.md §4.3)

Jalankan **masing-masing tepat satu kali, sesuai urutan**. File-file ini tidak dirancang untuk dijalankan ulang (misalnya `create table` akan gagal dan 002 mengganti nama fungsi). Jika muncul galat, berhenti dan catat pesannya; jangan menjalankan ulang. Jalankan 003 dan 004 sebelum siswa mulai memakai aplikasi.

Keempatnya sudah diuji pada PostgreSQL (PGlite) dengan tiruan Supabase Auth (peran `anon`, `authenticated`, `service_role`, dan pemilik non-superuser):

| Uji | Isi | Hasil |
|---|---|---|
| Rangkaian lengkap | 001 → 002 → uji → 003 dan 004 pada tabel yang sudah berisi → uji; antrean luring aplikasi terhadap database | 44 lulus |
| Database kosong | 001 → 002 → 003 → 004 berturut-turut; objek, RLS, hak akses | 16 lulus |
| Keamanan lintas akun | Siswa A dan B tidak bisa membaca, mengubah, atau menulis atas nama siswa lain | 27 lulus |
| Migrasi 004 | Tulis langsung ditutup, RPC `SECURITY DEFINER` aman (termasuk uji pembajakan `search_path`), validasi paket, antrean luring | 39 lulus |

Setelah dijalankan di Supabase, lakukan uji RLS sungguhan (task.md T-07).

## 4. Isi file `.env` (di komputer sendiri)

Ambil nilai dari **Project Settings → API Keys** (Project URL ada di **Project Settings → Data API**).

| File | Isi | Asal |
|---|---|---|
| `app/.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SISWA_DOMAIN` | Project URL, kunci **publishable** (`sb_publishable_…`), domain email sintetis |
| `supabase/scripts/.env` | `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SISWA_DOMAIN` | Project URL, kunci **secret** (`sb_secret_…`), domain email sintetis |

- Nama lama masih diterima sebagai cadangan: `VITE_SUPABASE_ANON_KEY` dan `SUPABASE_SERVICE_ROLE_KEY`.
- `VITE_SISWA_DOMAIN` dan `SISWA_DOMAIN` **harus sama** (usulan sementara: `siswa.mathsave.app`). Jika berbeda, siswa tidak bisa masuk.
- Kunci secret **tidak boleh** diisi di `app/.env`. Aplikasi menolak login jika itu terjadi.
- Selama `app/.env` belum ada, aplikasi berjalan dalam mode uji. Setelah diisi, mulai ulang `npm run dev`.

Contoh isi ada di `app/.env.example` dan `supabase/scripts/.env.example`.

## 5. Buat akun siswa

```bash
node supabase/scripts/buat-akun-siswa.js --jumlah 30 --kelas VIII
```

Daftar kode tersimpan di `supabase/scripts/keluaran/` (tidak masuk git). Bagikan kode kepada siswa melalui guru. Kode berfungsi sebagai kata sandi, jadi jangan diunggah ke tempat umum.

Mode coba tanpa Supabase: tambahkan `--coba`.

## Catatan terbuka

- **Domain email sintetis** masih [Konfirmasi] (architecture.md §5). Contoh di dokumen: `siswa.mathsave.app`.
- **Aturan buka level** di `ringkasan_progres`: lihat komentar [Konfirmasi] di `001_skema.sql`.
