// Antrean luring (DV-13; KFN-16, KFN-24; api.md §7; architecture.md §7).
// Data yang gagal dikirim disimpan di HP (localStorage), lalu dikirim ulang saat koneksi kembali.
// Siswa tetap bisa belajar selama luring.
//
// - Antrean dipisah per pemilik (id akun), agar data siswa A tidak terkirim dengan sesi siswa B
//   bila satu HP dipakai bergantian.
// - Setiap item punya `id` buatan HP. Item dengan id sama tidak digandakan di antrean; server memakai
//   id yang sama untuk menolak data ganda (evaluasi_literasi, api.md §3.5).
// - Dikirim berurutan (FIFO). Bila satu item gagal karena jaringan/server/sesi, pengiriman berhenti
//   dan sisanya menunggu kesempatan berikutnya, sehingga urutan tetap terjaga.
//
// Fungsi `kirim(item)` disediakan pemanggil (penghubung Supabase di DV-13): selesai = berhasil;
// gagal = melempar galat yang memuat `status` HTTP (tanpa `status` berarti jaringan putus).

const KUNCI = (pemilik) => `mathsave.antrean.${pemilik}`;

/** Jenis data yang boleh masuk antrean (tabel/RPC di api.md §3). */
export const JENIS_ANTREAN = ['progres_materi', 'percobaan_soal', 'evaluasi_literasi'];

function baca(pemilik) {
  try {
    const isi = JSON.parse(localStorage.getItem(KUNCI(pemilik)) ?? '[]');
    return Array.isArray(isi) ? isi : [];
  } catch {
    return [];
  }
}

function tulis(pemilik, daftar) {
  try {
    if (daftar.length) localStorage.setItem(KUNCI(pemilik), JSON.stringify(daftar));
    else localStorage.removeItem(KUNCI(pemilik));
    return true;
  } catch {
    return false;
  }
}

const buatId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Menambah data ke antrean.
 * @returns {object|null} item yang disimpan, atau null jika penyimpanan HP penuh/diblokir
 */
export function tambahAntrean(pemilik, jenis, data, { id = buatId(), sekarang = new Date().toISOString() } = {}) {
  if (!JENIS_ANTREAN.includes(jenis)) throw new Error(`Jenis antrean tidak dikenal: ${jenis}`);
  const item = { id, jenis, data, dibuat_pada: sekarang, upaya: 0 };
  const daftar = baca(pemilik);
  const i = daftar.findIndex((x) => x.id === id);
  if (i >= 0) daftar[i] = { ...item, dibuat_pada: daftar[i].dibuat_pada, upaya: daftar[i].upaya };
  else daftar.push(item);
  return tulis(pemilik, daftar) ? item : null;
}

export const bacaAntrean = (pemilik) => baca(pemilik);
export const jumlahAntrean = (pemilik) => baca(pemilik).length;

/**
 * Menggolongkan galat kiriman (api.md §7).
 * @returns {'ulang'|'sesi'|'sudah_ada'|'tolak'}
 *   ulang     : jaringan putus, timeout, 429, atau 5xx (proyek dijeda) → simpan, kirim lagi nanti
 *   sesi      : 401 → simpan; dikirim lagi setelah siswa masuk kembali
 *   sudah_ada : 409 → data sudah ada di server → hapus dari antrean
 *   tolak     : 400/403/4xx lain (RLS/constraint) → hapus, catat di konsol, tidak diulang
 */
export function golongkanGalat(galat) {
  const status = Number(galat?.status ?? 0);
  if (!status || status === 408 || status === 429 || status >= 500) return 'ulang';
  if (status === 401) return 'sesi';
  if (status === 409) return 'sudah_ada';
  return 'tolak';
}

function hapus(pemilik, id) {
  tulis(pemilik, baca(pemilik).filter((x) => x.id !== id));
}

function tambahUpaya(pemilik, id) {
  tulis(pemilik, baca(pemilik).map((x) => (x.id === id ? { ...x, upaya: (x.upaya ?? 0) + 1 } : x)));
}

const sedangKirim = new Map();

/**
 * Mengirim isi antrean secara berurutan. Panggilan bersamaan untuk pemilik yang sama
 * memakai proses yang sama (tidak ada item terkirim dua kali dari HP ini).
 * @returns {Promise<{ terkirim: number, ditolak: number, tersisa: number, berhenti: null|'ulang'|'sesi' }>}
 */
export function kirimAntrean(pemilik, kirim) {
  if (sedangKirim.has(pemilik)) return sedangKirim.get(pemilik);
  const proses = (async () => {
    const hasil = { terkirim: 0, ditolak: 0, tersisa: 0, berhenti: null };
    const dicoba = new Set();
    for (;;) {
      // Dibaca ulang setiap putaran: item baru yang masuk selama mengirim ikut terkirim.
      const item = baca(pemilik).find((x) => !dicoba.has(x.id));
      if (!item) break;
      dicoba.add(item.id);
      try {
        await kirim(item);
        hapus(pemilik, item.id);
        hasil.terkirim += 1;
      } catch (galat) {
        const golongan = golongkanGalat(galat);
        if (golongan === 'sudah_ada') {
          hapus(pemilik, item.id);
          hasil.terkirim += 1;
        } else if (golongan === 'tolak') {
          console.warn('Data antrean ditolak server dan tidak dikirim ulang.', item.jenis, galat?.status);
          hapus(pemilik, item.id);
          hasil.ditolak += 1;
        } else {
          tambahUpaya(pemilik, item.id);
          hasil.berhenti = golongan;
          break;
        }
      }
    }
    hasil.tersisa = baca(pemilik).length;
    return hasil;
  })().finally(() => sedangKirim.delete(pemilik));
  sedangKirim.set(pemilik, proses);
  return proses;
}

/**
 * Mengirim antrean sekarang, lalu setiap kali koneksi kembali (`online`) atau aplikasi
 * dibuka lagi (`visibilitychange`). Mengembalikan fungsi untuk berhenti (saat keluar).
 */
export function mulaiKirimOtomatis(pemilik, kirim, { jendela = globalThis.window, dokumen = globalThis.document } = {}) {
  let aktif = true;
  let lagi = false; // pemicu yang datang saat sedang mengirim → coba sekali lagi setelah selesai
  const coba = () => {
    if (!aktif || dokumen?.visibilityState === 'hidden' || !jumlahAntrean(pemilik)) return;
    if (sedangKirim.has(pemilik)) {
      lagi = true;
      return;
    }
    kirimAntrean(pemilik, kirim)
      .catch(() => {})
      .finally(() => {
        if (lagi) {
          lagi = false;
          coba();
        }
      });
  };
  coba();
  jendela?.addEventListener('online', coba);
  dokumen?.addEventListener('visibilitychange', coba);
  return () => {
    aktif = false;
    jendela?.removeEventListener('online', coba);
    dokumen?.removeEventListener('visibilitychange', coba);
  };
}
