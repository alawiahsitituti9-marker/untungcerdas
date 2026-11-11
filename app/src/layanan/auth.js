// Layanan login kode siswa (F01; KFN-01, KFN-02; architecture.md §5; api.md §2, §7).
//
// MODE SUPABASE (DV-05): kode → email sintetis → signInWithPassword. Identitas tampilan diambil
// dari tabel `siswa` (RLS: hanya baris sendiri). Sesi disimpan supabase-js dan diperbarui otomatis.
//
// MODE UJI (sementara): aktif bila app/.env belum berisi URL dan kunci Supabase. Kode yang formatnya
// sah langsung diterima dan sesi disimpan di HP ini. HANYA untuk pengembangan tampilan; tidak boleh
// dipakai untuk uji siswa.

import { validasiKode, kodeTampil, kodeKeEmail } from '../logika/kode.js';
import { konfigurasi as konfigurasiAktif, klien as klienAktif, KUNCI_PENYIMPANAN_AUTH } from './supabase.js';

const KUNCI_SESI_UJI = 'mathsave.sesi-uji';
const KUNCI_SESI = 'mathsave.sesi';

/** Pesan untuk siswa. Yang bertanda [Usulan] belum ada di api.md §7 sebelum DV-05. */
export const PESAN = {
  kodeSalah: 'Kode tidak ditemukan. Periksa lagi hurufnya.',
  terlaluBanyak: 'Terlalu banyak percobaan. Tunggu sebentar, lalu coba lagi.',
  server: 'Server sedang tidak aktif. Coba lagi nanti.',
  luring: 'Tidak ada koneksi internet. Periksa koneksi, lalu coba lagi.', // [Usulan]
  akunBelumSiap: 'Akun belum siap. Tanyakan kepada guru.', // [Usulan]
  belumDiatur: 'Aplikasi belum diatur dengan benar. Beri tahu guru.', // [Usulan]
};

/** Lama tombol Masuk dinonaktifkan setelah 429 (api.md §7). */
export const DETIK_TUNGGU = 30;

/**
 * Menerjemahkan galat supabase-js menjadi pesan siswa.
 * @returns {{ pesan: string, tunggu?: number }}
 */
export function golongkanGalatMasuk(galat) {
  const status = Number(galat?.status ?? 0);
  const kode = galat?.code ?? '';
  if (status === 429 || kode === 'over_request_rate_limit') return { pesan: PESAN.terlaluBanyak, tunggu: DETIK_TUNGGU };
  if (['email_not_confirmed', 'user_banned', 'user_not_found'].includes(kode)) return { pesan: PESAN.akunBelumSiap };
  if (status === 400 || kode === 'invalid_credentials' || kode === 'invalid_grant') return { pesan: PESAN.kodeSalah };
  if (status >= 500) return { pesan: PESAN.server };
  if (!status) return { pesan: PESAN.luring };
  return { pesan: PESAN.akunBelumSiap };
}

/**
 * Membuat layanan auth. Dipisah agar bisa diuji dengan klien tiruan.
 * @param {{ konfigurasi: object, klien: object|null, kunciAuth?: string, penyimpanan?: () => Storage }} opsi
 */
export function buatAuth({ konfigurasi, klien, kunciAuth = KUNCI_PENYIMPANAN_AUTH, penyimpanan = () => globalThis.localStorage }) {
  const mode = konfigurasi.mode;
  const baca = (k) => {
    try {
      const t = penyimpanan().getItem(k);
      return t ? JSON.parse(t) : null;
    } catch {
      return null;
    }
  };
  const tulis = (k, v) => {
    try {
      penyimpanan().setItem(k, JSON.stringify(v));
    } catch {
      // Penyimpanan diblokir: sesi tetap berlaku sampai halaman ditutup.
    }
  };
  const hapus = (...kunci) => {
    for (const k of kunci) {
      try {
        penyimpanan().removeItem(k);
      } catch {
        // abaikan
      }
    }
  };
  const adaTokenSupabase = () => {
    try {
      return !!penyimpanan().getItem(kunciAuth);
    } catch {
      return false;
    }
  };

  /** @returns {{ kodeTampil: string, id?: string, kelas?: string|null } | null} */
  function sesiSaatIni() {
    if (mode === 'uji') return baca(KUNCI_SESI_UJI);
    if (mode !== 'supabase') return null;
    const sesi = baca(KUNCI_SESI);
    if (sesi && adaTokenSupabase()) return sesi;
    if (sesi) hapus(KUNCI_SESI);
    return null;
  }

  /** @returns {Promise<{ ok: true, sesi: object } | { ok: false, pesan: string, tunggu?: number }>} */
  async function masuk(teksKode) {
    const v = validasiKode(teksKode);
    if (!v.ok) return v;

    if (mode === 'uji') {
      const sesi = { kodeTampil: kodeTampil(v.kode) };
      tulis(KUNCI_SESI_UJI, sesi);
      return { ok: true, sesi };
    }
    if (mode !== 'supabase' || !klien) return { ok: false, pesan: PESAN.belumDiatur };

    try {
      const { data, error } = await klien.auth.signInWithPassword({
        email: kodeKeEmail(v.kode, konfigurasi.domain),
        password: v.kode,
      });
      if (error) return { ok: false, ...golongkanGalatMasuk(error) };

      const { data: baris, error: galatSiswa } = await klien.from('siswa').select('kode_tampil, kelas').maybeSingle();
      if (galatSiswa || !baris) {
        // Akun Auth ada tetapi baris `siswa` belum dibuat skrip: jangan biarkan sesi setengah jadi.
        await klien.auth.signOut({ scope: 'local' }).catch(() => {});
        hapus(kunciAuth);
        if (galatSiswa && /fetch|network/i.test(galatSiswa.message ?? '')) return { ok: false, pesan: PESAN.luring };
        return { ok: false, pesan: PESAN.akunBelumSiap };
      }
      const sesi = { id: data.user.id, kodeTampil: baris.kode_tampil, kelas: baris.kelas ?? null };
      tulis(KUNCI_SESI, sesi);
      return { ok: true, sesi };
    } catch {
      return { ok: false, pesan: PESAN.luring };
    }
  }

  async function keluar() {
    if (mode === 'supabase' && klien) {
      // scope 'local': hanya sesi di HP ini. Tetap bersih walau sedang luring.
      await klien.auth.signOut({ scope: 'local' }).catch(() => {});
      hapus(kunciAuth);
    }
    hapus(KUNCI_SESI_UJI, KUNCI_SESI);
  }

  /**
   * Memanggil `berubah(null)` bila Supabase mengakhiri sesi (keluar, atau refresh token ditolak).
   * Saat luring sesi TIDAK diakhiri, sehingga siswa tetap bisa belajar.
   * @returns {() => void} berhenti memantau
   */
  function pantauSesi(berubah) {
    if (mode !== 'supabase' || !klien) return () => {};
    const { data } = klien.auth.onAuthStateChange((peristiwa, sesiAuth) => {
      if (!sesiAuth && (peristiwa === 'SIGNED_OUT' || peristiwa === 'INITIAL_SESSION')) {
        hapus(KUNCI_SESI);
        berubah(null);
      }
    });
    return () => data?.subscription?.unsubscribe();
  }

  return { mode, sesiSaatIni, masuk, keluar, pantauSesi };
}

const auth = buatAuth({ konfigurasi: konfigurasiAktif, klien: klienAktif });

export const modeUji = auth.mode === 'uji';
export const { sesiSaatIni, masuk, keluar, pantauSesi } = auth;
