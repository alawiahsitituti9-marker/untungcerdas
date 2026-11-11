-- 003_id_klien.sql — mencegah percobaan soal tercatat ganda dari antrean luring (DV-13)
-- Disetujui pemilik proyek 12 November 2026 (opsi A). Sumber: docs/api.md §3.4 dan §4.
--
-- Masalah: percobaan_soal.id dibuat database, sehingga HP tidak bisa menandai kirimannya.
-- Jika server sudah menyimpan baris tetapi balasannya tidak sampai ke HP (sinyal hilang),
-- antrean luring mengirim ulang dan baris yang sama tercatat dua kali.
--
-- Perbaikan: HP mengirim id item antrean sebagai `id_klien`. Kiriman ulang dengan id_klien
-- yang sama ditolak oleh batasan UNIQUE (kode 23505 → HTTP 409); antrean memperlakukan 409
-- sebagai "sudah terkirim" lalu menghapus itemnya (app/src/layanan/antrean.js).
--
-- Hanya menambah satu kolom. Kolom lama, RLS, trigger, dan ringkasan_progres tidak berubah.
-- Kolom boleh kosong (NULL) agar aman untuk baris yang sudah ada; beberapa NULL tidak bentrok.
-- Jalankan setelah 001 dan 002, satu kali. Pembatalan: alter table percobaan_soal drop column id_klien;

alter table percobaan_soal add column id_klien uuid;

alter table percobaan_soal
  add constraint percobaan_soal_id_klien_unik unique (id_klien);

comment on column percobaan_soal.id_klien is
  'Id buatan HP (item antrean luring). UNIQUE: kiriman ulang yang sama ditolak (409), bukan disimpan dua kali.';
