-- 001_skema.sql — skema awal MathSave (DV-02)
-- Sumber: docs/api.md §3.2–3.4 dan §4 (disetujui 11 November 2026); architecture.md §4.
-- Semua tabel memakai RLS (AGENTS.md §7). Siswa hanya bisa membaca dan menulis datanya sendiri.
-- Baris `siswa` hanya dibuat oleh skrip pengembang (supabase/scripts/buat-akun-siswa.js) dengan kunci service_role.

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

create index percobaan_soal_siswa_level on percobaan_soal (siswa_id, level);

alter table siswa enable row level security;
alter table progres_materi enable row level security;
alter table percobaan_soal enable row level security;

create policy "baca diri sendiri" on siswa for select using (id = auth.uid());
create policy "kelola progres sendiri" on progres_materi for all
  using (siswa_id = auth.uid()) with check (siswa_id = auth.uid());
create policy "baca percobaan sendiri" on percobaan_soal for select using (siswa_id = auth.uid());
create policy "tambah percobaan sendiri" on percobaan_soal for insert with check (siswa_id = auth.uid());
-- Tidak ada kebijakan update/delete untuk percobaan_soal: catatan percobaan tidak bisa diubah siswa.

-- Status submateri tidak boleh turun dari 'selesai' menjadi 'dibuka' (api.md §3.3).
create function jaga_status_materi() returns trigger
language plpgsql as $$
begin
  if old.status = 'selesai' and new.status = 'dibuka' then
    new.status := 'selesai';
  end if;
  new.diperbarui_pada := now();
  return new;
end;
$$;

create trigger progres_materi_tidak_turun
  before update on progres_materi
  for each row execute function jaga_status_materi();

-- Ringkasan untuk Beranda dan Progres (api.md §3.2). SECURITY INVOKER: RLS tetap berlaku.
--
-- [Konfirmasi] Aturan buka level (design.md §4) berbunyi "4 dari 5 soal Level n benar" per sesi,
-- tetapi tabel percobaan_soal (api.md §4) tidak menyimpan pengelompokan sesi. Sementara,
-- `benar_terbaik` dihitung sebagai banyaknya soal BERBEDA di level itu yang pernah dijawab benar
-- (maksimal 5). Lihat laporan DV-02 untuk pilihan penggantinya.
create function ringkasan_progres() returns jsonb
language sql stable security invoker as $$
  with
  selesai as (
    select materi_id from progres_materi where siswa_id = auth.uid() and status = 'selesai'
  ),
  per_level as (
    select n as level,
           least(5, (select count(distinct p.soal_id) from percobaan_soal p
                     where p.siswa_id = auth.uid() and p.level = n and p.benar))::int as benar_terbaik
    from generate_series(1, 4) as n
  ),
  terbuka as (
    -- Level 1 selalu terbuka; Level n+1 terbuka bila Level n terbuka dan benar_terbaik ≥ 4.
    select level, benar_terbaik,
           bool_and(level = 1 or prev_ok) over (order by level) as terbuka
    from (
      select level, benar_terbaik,
             coalesce(lag(benar_terbaik >= 4) over (order by level), true) as prev_ok
      from per_level
    ) x
  ),
  petunjuk as (
    select level, round(avg(jumlah_petunjuk)::numeric, 1) as rata
    from percobaan_soal where siswa_id = auth.uid()
    group by level
  )
  select jsonb_build_object(
    'materi_selesai', (select count(*) from selesai where materi_id ~ '^M[0-6]$'),
    'materi_total', 7,
    -- M0 opsional dan tidak menghalangi "materi berikutnya".
    'materi_berikutnya', (select m from unnest(array['M1','M2','M3','M4','M5','M6']) with ordinality as u(m, i)
                          where m not in (select materi_id from selesai) order by i limit 1),
    'level', (select jsonb_agg(jsonb_build_object(
                'level', level, 'terbuka', terbuka, 'benar_terbaik', benar_terbaik, 'jumlah_soal', 5) order by level)
              from terbuka),
    'rata_petunjuk_per_level', coalesce((select jsonb_object_agg(level::text, rata) from petunjuk), '{}'::jsonb)
  );
$$;
