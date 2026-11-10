// Layanan login kode siswa.
//
// MODE UJI (sementara): aktif bila VITE_SUPABASE_URL belum diisi. Kode yang formatnya
// sah langsung diterima dan sesi disimpan di localStorage HP ini. Mode ini HANYA untuk
// pengembangan tampilan sebelum proyek Supabase siap. Tidak boleh dipakai untuk uji siswa.
//
// MODE SUPABASE: dibuat di DV-05 (architecture.md §5).

import { validasiKode, kodeTampil } from '../logika/kode.js';

const KUNCI_SESI = 'mathsave.sesi-uji';

export const modeUji = !import.meta.env.VITE_SUPABASE_URL;

function bacaSesiTersimpan() {
  try {
    const teks = localStorage.getItem(KUNCI_SESI);
    return teks ? JSON.parse(teks) : null;
  } catch {
    return null;
  }
}

/** @returns {{ kodeTampil: string } | null} */
export function sesiSaatIni() {
  return modeUji ? bacaSesiTersimpan() : null;
}

/** @returns {Promise<{ ok: true, sesi: object } | { ok: false, pesan: string }>} */
export async function masuk(teksKode) {
  const v = validasiKode(teksKode);
  if (!v.ok) return v;
  if (!modeUji) {
    return { ok: false, pesan: 'Login ke server belum tersedia (DV-05).' };
  }
  const sesi = { kodeTampil: kodeTampil(v.kode) };
  try {
    localStorage.setItem(KUNCI_SESI, JSON.stringify(sesi));
  } catch {
    // Penyimpanan diblokir: sesi tetap berlaku sampai halaman ditutup.
  }
  return { ok: true, sesi };
}

export async function keluar() {
  try {
    localStorage.removeItem(KUNCI_SESI);
  } catch {
    // abaikan
  }
}
