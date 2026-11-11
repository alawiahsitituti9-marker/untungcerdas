// Membaca konfigurasi Supabase dari variabel environment Vite (DV-05; supabase/README.md §4).
// Fungsi murni agar bisa diuji tanpa Vite.
//
//   VITE_SUPABASE_URL              Project URL (https://….supabase.co)
//   VITE_SUPABASE_PUBLISHABLE_KEY  kunci publik; cadangan: VITE_SUPABASE_ANON_KEY (nama lama)
//   VITE_SISWA_DOMAIN              domain email sintetis; bawaan siswa.mathsave.app [Konfirmasi]
//                                  Harus sama dengan SISWA_DOMAIN di supabase/scripts/.env.
//
// mode 'uji'      : URL dan kunci kosong → login mode uji (hanya untuk pengembangan tampilan)
// mode 'supabase' : URL dan kunci publik terisi
// mode 'salah'    : konfigurasi tidak lengkap/berbahaya → login ditolak, alasan di `masalah`

/** Domain email sintetis usulan sementara (12 November 2026; architecture.md §5 [Konfirmasi]). */
export const DOMAIN_BAWAAN = 'siswa.mathsave.app';

/** true bila kunci adalah kunci rahasia (secret / service_role) yang tidak boleh ada di frontend. */
export function kunciRahasia(kunci) {
  if (kunci.startsWith('sb_secret_')) return true;
  const bagian = kunci.split('.');
  if (bagian.length !== 3) return false;
  try {
    const isi = JSON.parse(atob(bagian[1].replace(/-/g, '+').replace(/_/g, '/')));
    return isi?.role === 'service_role';
  } catch {
    return false;
  }
}

const bersih = (x) => String(x ?? '').trim();

/**
 * @param {Record<string, string|undefined>} env biasanya import.meta.env
 * @returns {{ mode: 'uji'|'supabase'|'salah', url?: string, kunci?: string, domain: string, masalah: string|null }}
 */
export function bacaKonfigurasi(env = {}) {
  const url = bersih(env.VITE_SUPABASE_URL);
  const kunci = bersih(env.VITE_SUPABASE_PUBLISHABLE_KEY) || bersih(env.VITE_SUPABASE_ANON_KEY);
  const domain = bersih(env.VITE_SISWA_DOMAIN) || DOMAIN_BAWAAN;
  const salah = (masalah) => ({ mode: 'salah', domain, masalah });

  if (!url && !kunci) return { mode: 'uji', domain, masalah: null };
  if (!url) return salah('VITE_SUPABASE_URL belum diisi di app/.env.');
  if (!kunci) return salah('VITE_SUPABASE_PUBLISHABLE_KEY belum diisi di app/.env.');
  if (kunciRahasia(kunci)) {
    return salah('Kunci rahasia (secret / service_role) tidak boleh dipakai di frontend. Pakai publishable key.');
  }
  if (!/^https:\/\//.test(url) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(url)) {
    return salah('VITE_SUPABASE_URL harus diawali https://.');
  }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) return salah('VITE_SISWA_DOMAIN bukan nama domain yang sah.');
  return { mode: 'supabase', url, kunci, domain, masalah: null };
}
