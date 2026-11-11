# Supabase — panduan menyiapkan proyek MathSave

Untuk pemilik proyek atau pengembang. Langkah ini dilakukan sekali, sebelum uji coba dengan siswa (task.md DV-02, DV-03).

> **Jangan pernah menempelkan kunci (anon maupun service_role) ke chat, dokumen, atau kode.** Kunci hanya diisi di file `.env` yang tidak masuk git.

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

Keduanya sudah diuji pada PostgreSQL (PGlite) dengan tiruan Supabase Auth: RLS antar-siswa, trigger status materi, `ringkasan_progres`, dan `simpan_evaluasi_literasi` (24 pemeriksaan lulus). Setelah dijalankan di Supabase, lakukan uji RLS sungguhan (task.md T-07).

## 4. Isi file `.env` (di komputer sendiri)

Ambil nilai dari **Project Settings → API**.

| File | Isi | Asal |
|---|---|---|
| `app/.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Project URL dan kunci **anon / publishable** |
| `supabase/scripts/.env` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SISWA_DOMAIN` | Project URL, kunci **service_role / secret**, domain email sintetis |

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
