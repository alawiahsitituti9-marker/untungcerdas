// Penilaian soal cek cepat di akhir submateri (D-03, D-05 §6).
// Hasilnya tidak dicatat sebagai percobaan latihan (api.md §3.4).

/**
 * @param {object} cek  objek `cek` dari materi.json
 * @param {{ pilihan?: object, alasan?: object, rupiah?: number }} jawab
 *   `pilihan` dan `alasan` adalah objek pilihan yang dipilih siswa.
 * @returns {{ benar: boolean, umpan?: string }}
 */
export function nilaiCekCepat(cek, jawab) {
  if (cek.tipe === 'rupiah') {
    return jawab.rupiah === cek.kunci ? { benar: true } : { benar: false, umpan: cek.umpanSalah };
  }
  if (!jawab.pilihan?.benar) {
    return { benar: false, umpan: jawab.pilihan?.umpan ?? cek.umpanSalah };
  }
  if (cek.alasan && !jawab.alasan?.benar) {
    return { benar: false, umpan: jawab.alasan?.umpan ?? cek.umpanSalah };
  }
  return { benar: true };
}

/** Mengacak urutan pilihan (Fisher–Yates) agar jawaban benar tidak selalu di posisi yang sama. */
export function acakUrutan(daftar, acak = Math.random) {
  const hasil = [...daftar];
  for (let i = hasil.length - 1; i > 0; i--) {
    const j = Math.floor(acak() * (i + 1));
    [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
  }
  return hasil;
}
