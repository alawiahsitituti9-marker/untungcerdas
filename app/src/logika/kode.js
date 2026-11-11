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

/** 31 huruf/angka yang tidak mirip (tanpa I, L, O, 0, 1), sesuai POLA_KODE. */
export const HURUF_KODE = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/**
 * Membuat kode siswa acak, mis. "MS7K4PQ2XR" (DV-03, dipakai skrip buat-akun-siswa.js).
 * @param {(n: number) => number} acakInt fungsi bilangan acak 0..n-1 (gunakan crypto.randomInt)
 */
export function buatKode(acakInt) {
  let isi = '';
  for (let i = 0; i < 8; i++) isi += HURUF_KODE[acakInt(HURUF_KODE.length)];
  return `MS${isi}`;
}

/** "MS7K4PQ2XR" → "MS-7K4P-Q2XR" (format yang dibagikan guru) */
export function formatKode(kode) {
  const k = normalisasiKode(kode);
  return `${k.slice(0, 2)}-${k.slice(2, 6)}-${k.slice(6, 10)}`;
}
