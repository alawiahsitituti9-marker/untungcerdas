// Kode siswa: MS-XXXX-XXXX (architecture.md §5).
// 8 karakter acak dari 31 huruf/angka yang tidak mirip (tanpa I, L, O, 0, 1).

export const POLA_KODE = /^MS[A-HJKMNP-Z2-9]{8}$/;

/** " ms-7k4p-q2xr " → "MS7K4PQ2XR" */
export function normalisasiKode(teks) {
  return String(teks ?? '').toUpperCase().replace(/[\s-]/g, '');
}

/** @returns {{ ok: true, kode: string } | { ok: false, pesan: string }} */
export function validasiKode(teks) {
  const kode = normalisasiKode(teks);
  if (!POLA_KODE.test(kode)) {
    return { ok: false, pesan: 'Kode terdiri dari MS dan 8 huruf/angka.' };
  }
  return { ok: true, kode };
}

/** "MS7K4PQ2XR" → "MS-7K4P" (kode lengkap tidak ditampilkan di layar, api.md §3.1) */
export function kodeTampil(kode) {
  return `MS-${normalisasiKode(kode).slice(2, 6)}`;
}

/** Email sintetis untuk Supabase Auth. Domain masih [Konfirmasi] (architecture.md §5). */
export function kodeKeEmail(kode, domain) {
  return `${normalisasiKode(kode).toLowerCase()}@${domain}`;
}
