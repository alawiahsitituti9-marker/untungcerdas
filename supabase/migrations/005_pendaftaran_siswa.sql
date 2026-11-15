-- 005_pendaftaran_siswa.sql
-- Penambahan data untuk pendaftaran mandiri UntungCerdas.

alter table public.siswa
  add column nama text not null default 'Siswa lama',
  add column asal_sekolah text not null default 'Belum diisi',
  add column id_siswa text;

create unique index siswa_id_siswa_unik
  on public.siswa (id_siswa)
  where id_siswa is not null;

comment on column public.siswa.id_siswa is
  'ID login siswa yang dibuat otomatis oleh fungsi pendaftaran.';
