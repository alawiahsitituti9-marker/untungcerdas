-- 004_keamanan_literasi.sql — hasil Literasi Matematis hanya bisa disimpan lewat RPC tervalidasi (LM-09)
-- Disetujui pemilik proyek 12 November 2026. Menutup dua temuan pemeriksaan keamanan:
--   A. Siswa bisa menambah baris jawaban_literasi miliknya yang menunjuk evaluasi_id siswa lain
--      (mis. slot ML-1 tahap 6 yang tidak dipakai).
--   B. Siswa bisa menyimpan evaluasi_literasi/jawaban_literasi langsung lewat REST tanpa validasi RPC.
-- Migrasi 001–003 tidak diubah. Jalankan setelah 003, satu kali.
--
-- Rancangan:
--   1. Tulis langsung ditutup: kebijakan INSERT kedua tabel dihapus dan hak INSERT/UPDATE/DELETE/TRUNCATE
--      dicabut dari anon dan authenticated. Kebijakan SELECT (baca data sendiri) tetap.
--   2. simpan_evaluasi_literasi menjadi SECURITY DEFINER dengan search_path kosong, nama berkualifikasi
--      skema, wajib auth.uid(), siswa_id selalu = auth.uid(), dan EXECUTE hanya untuk authenticated.
--      Pemilik fungsi = pemilik tabel, sehingga fungsi dapat menulis walau tanpa kebijakan INSERT.
--   3. Lapisan skema: (evaluasi_id, siswa_id) jawaban harus sama dengan (id, siswa_id) evaluasinya,
--      dan ML-1 hanya tahap 1–5.
--   Antrean luring tetap: kiriman ulang dengan id yang sama mengembalikan hasil yang sudah ada.

-- 1. Tutup penulisan langsung ----------------------------------------------------------------------
drop policy "tambah evaluasi sendiri" on public.evaluasi_literasi;
drop policy "tambah jawaban sendiri" on public.jawaban_literasi;

revoke insert, update, delete, truncate on table public.evaluasi_literasi from anon, authenticated;
revoke insert, update, delete, truncate on table public.jawaban_literasi from anon, authenticated;

-- 2. Lapisan skema --------------------------------------------------------------------------------
-- Baris jawaban selalu milik siswa yang sama dengan evaluasinya (temuan A).
alter table public.evaluasi_literasi
  add constraint evaluasi_literasi_id_siswa_unik unique (id, siswa_id);
alter table public.jawaban_literasi
  add constraint jawaban_literasi_milik_evaluasi
  foreign key (evaluasi_id, siswa_id) references public.evaluasi_literasi (id, siswa_id) on delete cascade;

-- ML-1 hanya punya tahap 1–5; ML-2 sampai ML-4 tahap 1–6 (batasan lama tetap berlaku).
alter table public.jawaban_literasi
  add constraint jawaban_literasi_tahap_ml1 check (soal_id <> 'ML-1' or tahap <= 5);

-- 3. RPC satu-satunya jalan menyimpan hasil -------------------------------------------------------
create or replace function public.simpan_evaluasi_literasi(p_hasil jsonb) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_ada public.evaluasi_literasi%rowtype;
  v_ke smallint;
  v_jawaban jsonb;
  v_skor jsonb;
  v_soal record;
begin
  -- Wajib login. Fungsi ini juga tidak bisa dieksekusi anon (lihat GRANT di bawah).
  if v_uid is null then
    raise exception 'Belum masuk' using errcode = '28000';
  end if;
  if p_hasil is null or jsonb_typeof(p_hasil) <> 'object' then
    raise exception 'Paket hasil tidak valid' using errcode = '22023';
  end if;

  v_id := (p_hasil->>'id')::uuid;
  v_jawaban := p_hasil->'jawaban';
  v_skor := p_hasil->'skor';
  if v_id is null then
    raise exception 'id hasil wajib diisi' using errcode = '22023';
  end if;

  -- 1. Kiriman ulang dari antrean: kembalikan baris milik siswa ini yang sudah ada.
  --    id milik siswa lain tidak ditemukan di sini dan akan ditolak kunci utama saat insert.
  select * into v_ada from public.evaluasi_literasi where id = v_id and siswa_id = v_uid;
  if found then
    return jsonb_build_object('id', v_ada.id, 'percobaan_ke', v_ada.percobaan_ke, 'skor_total', v_ada.skor_total);
  end if;

  -- 2. Validasi: tepat 23 tahap dengan pasangan soal–tahap yang benar dan skor_maks sesuai bobot.
  if jsonb_typeof(v_jawaban) is distinct from 'array' or jsonb_array_length(v_jawaban) <> 23 then
    raise exception 'Jumlah tahap harus 23' using errcode = '22023';
  end if;
  if (select count(distinct (j->>'soal_id', (j->>'tahap')::int)) from jsonb_array_elements(v_jawaban) j) <> 23
     or exists (
       select 1 from jsonb_array_elements(v_jawaban) j
       where jsonb_typeof(j) <> 'object'
         or not (
           (j->>'soal_id' = 'ML-1' and (j->>'tahap')::int between 1 and 5)
           or (j->>'soal_id' in ('ML-2','ML-3','ML-4') and (j->>'tahap')::int between 1 and 6)
         )
         or (j->>'skor_maks')::int is distinct from
            case when j->>'soal_id' = 'ML-1' and (j->>'tahap')::int = 3 then 2 else 1 end
         or (j->>'skor')::int is null
         or (j->>'skor')::int not between 0 and (j->>'skor_maks')::int
     ) then
    raise exception 'Pasangan soal–tahap, bobot, atau skor tahap tidak valid' using errcode = '22023';
  end if;

  -- Urutan soal harus memuat keempat soal tepat sekali.
  if jsonb_typeof(p_hasil->'urutan') is distinct from 'array'
     or jsonb_array_length(p_hasil->'urutan') <> 4
     or (select count(distinct u) from jsonb_array_elements_text(p_hasil->'urutan') u
         where u in ('ML-1','ML-2','ML-3','ML-4')) <> 4 then
    raise exception 'Urutan soal tidak valid' using errcode = '22023';
  end if;

  -- Skor per indikator = jumlah skor tahap soalnya (ML-1 reasoning, ML-2 formulating, ML-3 employing, ML-4 interpreting).
  if jsonb_typeof(v_skor) is distinct from 'object' then
    raise exception 'Skor indikator tidak valid' using errcode = '22023';
  end if;
  for v_soal in
    select s.soal_id, s.kunci,
           coalesce((select sum((j->>'skor')::int) from jsonb_array_elements(v_jawaban) j where j->>'soal_id' = s.soal_id), 0) as jumlah
    from (values ('ML-1','reasoning'), ('ML-2','formulating'), ('ML-3','employing'), ('ML-4','interpreting')) as s(soal_id, kunci)
  loop
    if (v_skor->>v_soal.kunci)::int is distinct from v_soal.jumlah then
      raise exception 'Skor % tidak sama dengan jumlah skor tahap', v_soal.kunci using errcode = '22023';
    end if;
  end loop;

  -- 3. Percobaan ke-n, lalu simpan ringkasan dan 23 tahap. siswa_id selalu auth.uid().
  select coalesce(max(e.percobaan_ke), 0) + 1 into v_ke from public.evaluasi_literasi e where e.siswa_id = v_uid;

  insert into public.evaluasi_literasi (id, siswa_id, percobaan_ke, versi_rubrik, urutan,
      skor_reasoning, skor_formulating, skor_employing, skor_interpreting,
      jumlah_bantuan, durasi_detik, dimulai_pada)
  values (v_id, v_uid, v_ke, (p_hasil->>'versi_rubrik')::smallint,
      array(select jsonb_array_elements_text(p_hasil->'urutan')),
      (v_skor->>'reasoning')::smallint, (v_skor->>'formulating')::smallint,
      (v_skor->>'employing')::smallint, (v_skor->>'interpreting')::smallint,
      coalesce((p_hasil->>'jumlah_bantuan')::smallint, 0), (p_hasil->>'durasi_detik')::int,
      (p_hasil->>'dimulai_pada')::timestamptz);

  insert into public.jawaban_literasi (evaluasi_id, siswa_id, soal_id, tahap, jawaban, skor, skor_maks, kode_umpan, konsekuen, jumlah_bantuan)
  select v_id, v_uid, j->>'soal_id', (j->>'tahap')::smallint, j->'jawaban', (j->>'skor')::smallint,
         (j->>'skor_maks')::smallint, nullif(j->>'kode_umpan', ''), coalesce((j->>'konsekuen')::boolean, false),
         coalesce((j->>'jumlah_bantuan')::smallint, 0)
  from jsonb_array_elements(v_jawaban) j;

  return jsonb_build_object('id', v_id, 'percobaan_ke', v_ke,
    'skor_total', (select e.skor_total from public.evaluasi_literasi e where e.id = v_id));
end;
$$;

comment on function public.simpan_evaluasi_literasi(jsonb) is
  'Satu-satunya jalan menyimpan hasil F14 (migrasi 004). SECURITY DEFINER, search_path kosong, wajib auth.uid().';

-- Hanya siswa yang login yang boleh memanggil. PUBLIC dan anon dicabut.
revoke all on function public.simpan_evaluasi_literasi(jsonb) from public;
revoke all on function public.simpan_evaluasi_literasi(jsonb) from anon;
grant execute on function public.simpan_evaluasi_literasi(jsonb) to authenticated;
