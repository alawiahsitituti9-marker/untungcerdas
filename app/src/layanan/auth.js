
// Layanan login UntungCerdas.
// Login siswa menggunakan ID siswa dan PIN.

import {
  validasiKode,
  kodeTampil,
  kodeKeEmail,
} from '../logika/kode.js';

import {
  konfigurasi as konfigurasiAktif,
  klien as klienAktif,
  KUNCI_PENYIMPANAN_AUTH,
} from './supabase.js';

const KUNCI_SESI_UJI = 'mathsave.sesi-uji';
const KUNCI_SESI = 'mathsave.sesi';

export const PESAN = {
  kodeSalah: 'ID siswa atau PIN salah. Periksa kembali.',
  terlaluBanyak: 'Terlalu banyak percobaan. Tunggu sebentar, lalu coba lagi.',
  server: 'Server sedang tidak aktif. Coba lagi nanti.',
  luring: 'Tidak ada koneksi internet. Periksa koneksi, lalu coba lagi.',
  akunBelumSiap: 'Akun siswa belum siap. Silakan coba lagi.',
  belumDiatur: 'Aplikasi belum diatur dengan benar. Hubungi pengelola.',
};

export const DETIK_TUNGGU = 30;

export function golongkanGalatMasuk(galat) {
  const status = Number(galat?.status ?? 0);
  const kode = galat?.code ?? '';

  if (status === 429 || kode === 'over_request_rate_limit') {
    return {
      pesan: PESAN.terlaluBanyak,
      tunggu: DETIK_TUNGGU,
    };
  }

  if (
    ['email_not_confirmed', 'user_banned', 'user_not_found'].includes(kode)
  ) {
    return { pesan: PESAN.akunBelumSiap };
  }

  if (
    status === 400 ||
    kode === 'invalid_credentials' ||
    kode === 'invalid_grant'
  ) {
    return { pesan: PESAN.kodeSalah };
  }

  if (status >= 500) {
    return { pesan: PESAN.server };
  }

  if (!status) {
    return { pesan: PESAN.luring };
  }

  return { pesan: PESAN.akunBelumSiap };
}

/**
 * Membuat layanan autentikasi siswa.
 */
export function buatAuth({
  konfigurasi,
  klien,
  kunciAuth = KUNCI_PENYIMPANAN_AUTH,
  penyimpanan = () => globalThis.localStorage,
}) {
  const mode = konfigurasi.mode;

  const baca = (kunci) => {
    try {
      const teks = penyimpanan().getItem(kunci);
      return teks ? JSON.parse(teks) : null;
    } catch {
      return null;
    }
  };

  const tulis = (kunci, nilai) => {
    try {
      penyimpanan().setItem(kunci, JSON.stringify(nilai));
    } catch {
      // Abaikan jika penyimpanan tidak tersedia.
    }
  };

  const hapus = (...kunci) => {
    for (const item of kunci) {
      try {
        penyimpanan().removeItem(item);
      } catch {
        // Abaikan jika penyimpanan tidak tersedia.
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

  function sesiSaatIni() {
    if (mode === 'uji') {
      return baca(KUNCI_SESI_UJI);
    }

    if (mode !== 'supabase') {
      return null;
    }

    const sesi = baca(KUNCI_SESI);

    if (sesi && adaTokenSupabase()) {
      return sesi;
    }

    if (sesi) {
      hapus(KUNCI_SESI);
    }

    return null;
  }

  /**
   * Login menggunakan ID siswa dan PIN.
   */
  async function masuk(teksIdentitas, teksPin) {
    let email;
    let password;

    // Login baru menggunakan ID siswa dan PIN.
    if (typeof teksPin === 'string') {
      const idSiswa = String(teksIdentitas ?? '')
        .trim()
        .toUpperCase();

      const pin = String(teksPin).trim();

      if (!/^UC-[A-F0-9]{8}$/.test(idSiswa)) {
        return {
          ok: false,
          pesan: 'Format ID siswa tidak benar.',
        };
      }

      if (!/^\d{6,12}$/.test(pin)) {
        return {
          ok: false,
          pesan: 'PIN harus terdiri dari 6–12 angka.',
        };
      }

      if (mode !== 'supabase' || !klien) {
        return {
          ok: false,
          pesan: PESAN.belumDiatur,
        };
      }

      email =
        `${idSiswa.toLowerCase().replaceAll('-', '')}@${konfigurasi.domain}`;

      password = pin;
    } else {
      // Mendukung kode lama agar akun sebelumnya tetap bisa digunakan.
      const hasilValidasi = validasiKode(teksIdentitas);

      if (!hasilValidasi.ok) {
        return hasilValidasi;
      }

      if (mode === 'uji') {
        const sesi = {
          kodeTampil: kodeTampil(hasilValidasi.kode),
        };

        tulis(KUNCI_SESI_UJI, sesi);

        return {
          ok: true,
          sesi,
        };
      }

      if (mode !== 'supabase' || !klien) {
        return {
          ok: false,
          pesan: PESAN.belumDiatur,
        };
      }

      email = kodeKeEmail(
        hasilValidasi.kode,
        konfigurasi.domain,
      );

      password = hasilValidasi.kode;
    }

    try {
      const { data, error } =
        await klien.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        return {
          ok: false,
          ...golongkanGalatMasuk(error),
        };
      }

      const { data: baris, error: galatSiswa } =
        await klien
          .from('siswa')
          .select(
            'kode_tampil, kelas, id_siswa, nama, asal_sekolah',
          )
          .maybeSingle();

      if (galatSiswa || !baris) {
        await klien.auth
          .signOut({ scope: 'local' })
          .catch(() => {});

        hapus(kunciAuth);

        if (
          galatSiswa &&
          /fetch|network/i.test(galatSiswa.message ?? '')
        ) {
          return {
            ok: false,
            pesan: PESAN.luring,
          };
        }

        return {
          ok: false,
          pesan: PESAN.akunBelumSiap,
        };
      }

      const sesi = {
  id: data.user.id,
  kodeTampil: baris.kode_tampil,
  kelas: baris.kelas ?? null,
};

      tulis(KUNCI_SESI, sesi);

      return {
        ok: true,
        sesi,
      };
    } catch {
      return {
        ok: false,
        pesan: PESAN.luring,
      };
    }
  }

  async function keluar() {
    if (mode === 'supabase' && klien) {
      await klien.auth
        .signOut({ scope: 'local' })
        .catch(() => {});

      hapus(kunciAuth);
    }

    hapus(KUNCI_SESI_UJI, KUNCI_SESI);
  }

  function pantauSesi(berubah) {
    if (mode !== 'supabase' || !klien) {
      return () => {};
    }

    const { data } = klien.auth.onAuthStateChange(
      (peristiwa, sesiAuth) => {
        if (
          !sesiAuth &&
          (peristiwa === 'SIGNED_OUT' ||
            peristiwa === 'INITIAL_SESSION')
        ) {
          hapus(KUNCI_SESI);
          berubah(null);
        }
      },
    );

    return () => data?.subscription?.unsubscribe();
  }

  return {
    mode,
    sesiSaatIni,
    masuk,
    keluar,
    pantauSesi,
  };
}

const auth = buatAuth({
  konfigurasi: konfigurasiAktif,
  klien: klienAktif,
});

export const modeUji = auth.mode === 'uji';

export const {
  sesiSaatIni,
  masuk,
  keluar,
  pantauSesi,
} = auth;
