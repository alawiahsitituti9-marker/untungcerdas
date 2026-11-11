// Pengirim item antrean luring ke Supabase (DV-13; api.md §3.3–3.5, §7).
// Dipakai sebagai fungsi `kirim` untuk kirimAntrean/mulaiKirimOtomatis di layanan/antrean.js.
//
// `klien` adalah klien supabase-js (dibuat di layanan/supabase.js pada DV-05). Modul ini tidak
// mengimpor supabase-js sendiri, sehingga bisa diuji dengan klien tiruan.
//
// Pencegahan data ganda (id buatan HP = id item antrean):
//   percobaan_soal    → kolom `id_klien` UNIQUE (migrasi 003); kiriman ulang → 409
//   evaluasi_literasi → `p_hasil.id`; RPC mengembalikan hasil yang sudah ada (idempoten)
//   progres_materi    → upsert pada (siswa_id, materi_id); kiriman ulang tidak menambah baris
//
// Galat dilempar dengan `status` HTTP agar golongkanGalat() di antrean.js bisa memilih tindakan.
// supabase-js tidak melempar galat; ia mengembalikan { error, status } (status 0 = jaringan putus).

/** Kode PostgreSQL untuk pelanggaran UNIQUE. PostgREST memetakannya ke HTTP 409. */
const UNIK_DILANGGAR = '23505';

function galatKiriman(hasil) {
  const { error, status } = hasil;
  const kode = error?.code;
  const statusAkhir = status || (kode === UNIK_DILANGGAR ? 409 : 0);
  return Object.assign(new Error(error?.message ?? 'Kiriman gagal'), { status: statusAkhir, kode });
}

/**
 * Membuat fungsi kirim(item) untuk antrean.
 * @param {object} klien klien supabase-js
 */
export function buatPengirim(klien) {
  return async function kirim(item) {
    let hasil;
    switch (item.jenis) {
      case 'percobaan_soal':
        hasil = await klien.from('percobaan_soal').insert({ ...item.data, id_klien: item.id });
        break;
      case 'progres_materi':
        hasil = await klien.from('progres_materi').upsert(item.data, { onConflict: 'siswa_id,materi_id' });
        break;
      case 'evaluasi_literasi':
        hasil = await klien.rpc('simpan_evaluasi_literasi', { p_hasil: { ...item.data, id: item.id } });
        break;
      default:
        // Jenis tidak dikenal tidak akan pernah berhasil dikirim: dibuang seperti 400.
        throw Object.assign(new Error(`Jenis antrean tidak dikenal: ${item.jenis}`), { status: 400 });
    }
    if (hasil?.error) throw galatKiriman(hasil);
    return hasil?.data ?? null;
  };
}
