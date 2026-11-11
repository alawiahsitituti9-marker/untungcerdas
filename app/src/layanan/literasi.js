// Draf jawaban F14 di HP siswa (KFN-26, architecture.md §10.3).
// Disimpan per siswa di localStorage. Pengiriman ke Supabase dibuat di LM-10.
//
// Bentuk draf:
// { versi_rubrik, dimulai_pada, posisi, selesai, jawaban: { [idSoal]: { [noTahap]: { isian, bantuan } } } }
//   posisi = indeks langkah berikutnya pada daftarLangkah(konten) (0..23)

const awalan = 'mathsave.literasi.';
const kunci = (kodeSiswa) => `${awalan}${kodeSiswa ?? 'anonim'}`;

export function drafBaru(versiRubrik) {
  return { versi_rubrik: versiRubrik, dimulai_pada: new Date().toISOString(), posisi: 0, selesai: false, jawaban: {} };
}

/** Membaca draf. Draf dengan versi rubrik lain diabaikan agar tidak dinilai dengan rubrik yang salah. */
export function bacaDraf(kodeSiswa, versiRubrik) {
  try {
    const teks = localStorage.getItem(kunci(kodeSiswa));
    if (!teks) return null;
    const d = JSON.parse(teks);
    if (d?.versi_rubrik !== versiRubrik || typeof d.posisi !== 'number' || typeof d.jawaban !== 'object') return null;
    return d;
  } catch {
    return null;
  }
}

/** @returns {boolean} false bila penyimpanan diblokir (jawaban tetap ada selama halaman terbuka). */
export function simpanDraf(kodeSiswa, draf) {
  try {
    localStorage.setItem(kunci(kodeSiswa), JSON.stringify(draf));
    return true;
  } catch {
    return false;
  }
}

export function hapusDraf(kodeSiswa) {
  try {
    localStorage.removeItem(kunci(kodeSiswa));
  } catch {
    // abaikan
  }
}

/** Draf baru dengan isian satu tahap dikunci dan posisi maju satu langkah. */
export function kunciTahap(draf, idSoal, noTahap, isian) {
  const soal = { ...(draf.jawaban[idSoal] ?? {}) };
  soal[noTahap] = { ...(soal[noTahap] ?? {}), isian };
  return { ...draf, posisi: draf.posisi + 1, jawaban: { ...draf.jawaban, [idSoal]: soal } };
}

/** Draf baru dengan jumlah bantuan yang sudah dibuka di satu tahap (dicatat sebelum jawaban dikunci). */
export function catatBantuan(draf, idSoal, noTahap, jumlah) {
  const soal = { ...(draf.jawaban[idSoal] ?? {}) };
  soal[noTahap] = { ...(soal[noTahap] ?? {}), bantuan: jumlah };
  return { ...draf, jawaban: { ...draf.jawaban, [idSoal]: soal } };
}
