// Hasil terbaik per level di HP siswa, untuk membuka level berikutnya (KFN-11).
// Sementara sampai penyimpanan percobaan ke Supabase dibuat di DV-13.

const kunci = (kodeSiswa) => `mathsave.latihan.${kodeSiswa ?? 'anonim'}`;

/** @returns {{ [level]: number }} jumlah benar terbaik per level */
export function bacaTerbaik(kodeSiswa) {
  try {
    const d = JSON.parse(localStorage.getItem(kunci(kodeSiswa)) ?? '{}');
    return d && typeof d === 'object' ? d : {};
  } catch {
    return {};
  }
}

/** Menyimpan hasil sesi bila lebih baik dari sebelumnya. */
export function catatSesi(kodeSiswa, level, jumlahBenar) {
  const d = bacaTerbaik(kodeSiswa);
  if ((d[level] ?? -1) >= jumlahBenar) return d;
  const baru = { ...d, [level]: jumlahBenar };
  try {
    localStorage.setItem(kunci(kodeSiswa), JSON.stringify(baru));
  } catch {
    // penyimpanan diblokir: hasil tetap berlaku selama halaman terbuka
  }
  return baru;
}
