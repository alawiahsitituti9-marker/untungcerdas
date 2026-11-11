-- 002_literasi.sql — penyimpanan F14 Latihan Literasi Matematis (LM-09)
-- Sumber: docs/api.md §3.5–3.7 dan §4.1; architecture.md §10 (disetujui 12 November 2026, KL-13).
-- Tabel lama tidak diubah.

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

-- Menyimpan satu hasil F14 (ringkasan + 23 tahap) dalam satu transaksi (api.md §3.5).
-- SECURITY INVOKER: RLS tetap berlaku. Idempoten terhadap `id` yang sama (antrean luring).
create function simpan_evaluasi_literasi(p_hasil jsonb) returns jsonb
language plpgsql security invoker as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid := (p_hasil->>'id')::uuid;
  v_ada evaluasi_literasi%rowtype;
  v_ke smallint;
  v_jawaban jsonb := p_hasil->'jawaban';
  v_skor jsonb := p_hasil->'skor';
  v_soal record;
begin
  if v_uid is null then
    raise exception 'Belum masuk' using errcode = '28000';
  end if;

  -- 1. Kiriman ulang dari antrean: kembalikan baris yang sudah ada.
  select * into v_ada from evaluasi_literasi where id = v_id and siswa_id = v_uid;
  if found then
    return jsonb_build_object('id', v_ada.id, 'percobaan_ke', v_ada.percobaan_ke, 'skor_total', v_ada.skor_total);
  end if;

  -- 2. Validasi: tepat 23 tahap dengan pasangan soal–tahap yang benar dan skor_maks sesuai bobot.
  if jsonb_typeof(v_jawaban) <> 'array' or jsonb_array_length(v_jawaban) <> 23 then
    raise exception 'Jumlah tahap harus 23' using errcode = '22023';
  end if;
  if (select count(distinct (j->>'soal_id', (j->>'tahap')::int)) from jsonb_array_elements(v_jawaban) j) <> 23
     or exists (
       select 1 from jsonb_array_elements(v_jawaban) j
       where not (
         (j->>'soal_id' = 'ML-1' and (j->>'tahap')::int between 1 and 5)
         or (j->>'soal_id' in ('ML-2','ML-3','ML-4') and (j->>'tahap')::int between 1 and 6)
       )
       or (j->>'skor_maks')::int <> case when j->>'soal_id' = 'ML-1' and (j->>'tahap')::int = 3 then 2 else 1 end
     ) then
    raise exception 'Pasangan soal–tahap atau bobot tidak valid' using errcode = '22023';
  end if;

  -- Skor per indikator = jumlah skor tahap soalnya (ML-1 reasoning, ML-2 formulating, ML-3 employing, ML-4 interpreting).
  for v_soal in
    select s.soal_id, s.kunci,
           coalesce((select sum((j->>'skor')::int) from jsonb_array_elements(v_jawaban) j where j->>'soal_id' = s.soal_id), 0) as jumlah
    from (values ('ML-1','reasoning'), ('ML-2','formulating'), ('ML-3','employing'), ('ML-4','interpreting')) as s(soal_id, kunci)
  loop
    if (v_skor->>v_soal.kunci)::int is distinct from v_soal.jumlah then
      raise exception 'Skor % tidak sama dengan jumlah skor tahap', v_soal.kunci using errcode = '22023';
    end if;
  end loop;

  -- 3. Percobaan ke-n, lalu simpan ringkasan dan 23 tahap.
  select coalesce(max(percobaan_ke), 0) + 1 into v_ke from evaluasi_literasi where siswa_id = v_uid;

  insert into evaluasi_literasi (id, siswa_id, percobaan_ke, versi_rubrik, urutan,
      skor_reasoning, skor_formulating, skor_employing, skor_interpreting,
      jumlah_bantuan, durasi_detik, dimulai_pada)
  values (v_id, v_uid, v_ke, (p_hasil->>'versi_rubrik')::smallint,
      array(select jsonb_array_elements_text(p_hasil->'urutan')),
      (v_skor->>'reasoning')::smallint, (v_skor->>'formulating')::smallint,
      (v_skor->>'employing')::smallint, (v_skor->>'interpreting')::smallint,
      coalesce((p_hasil->>'jumlah_bantuan')::smallint, 0), (p_hasil->>'durasi_detik')::int,
      (p_hasil->>'dimulai_pada')::timestamptz);

  insert into jawaban_literasi (evaluasi_id, siswa_id, soal_id, tahap, jawaban, skor, skor_maks, kode_umpan, konsekuen, jumlah_bantuan)
  select v_id, v_uid, j->>'soal_id', (j->>'tahap')::smallint, j->'jawaban', (j->>'skor')::smallint,
         (j->>'skor_maks')::smallint, nullif(j->>'kode_umpan', ''), coalesce((j->>'konsekuen')::boolean, false),
         coalesce((j->>'jumlah_bantuan')::smallint, 0)
  from jsonb_array_elements(v_jawaban) j;

  return jsonb_build_object('id', v_id, 'percobaan_ke', v_ke,
    'skor_total', (select skor_total from evaluasi_literasi where id = v_id));
end;
$$;

-- Perluasan ringkasan_progres dengan kunci `literasi` (api.md §3.7). Bagian lama tidak berubah.
alter function ringkasan_progres() rename to ringkasan_progres_dasar;

create function ringkasan_progres() returns jsonb
language sql stable security invoker as $$
  select ringkasan_progres_dasar() || jsonb_build_object('literasi', (
    select case when count(*) = 0 then null else jsonb_build_object(
      'jumlah_percobaan', count(*),
      'pertama', (select jsonb_build_object('skor_total', skor_total, 'selesai_pada', selesai_pada)
                  from evaluasi_literasi where siswa_id = auth.uid() order by percobaan_ke asc limit 1),
      'terakhir', (select jsonb_build_object('skor_total', skor_total,
                     'skor', jsonb_build_array(skor_reasoning, skor_formulating, skor_employing, skor_interpreting),
                     'selesai_pada', selesai_pada)
                   from evaluasi_literasi where siswa_id = auth.uid() order by percobaan_ke desc limit 1),
      'terbaik', max(skor_total)
    ) end
    from evaluasi_literasi where siswa_id = auth.uid()
  ));
$$;
