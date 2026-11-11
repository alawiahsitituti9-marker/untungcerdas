// Ringkasan progres belajar (F13; design.md §6 P02, P11, §17.6; api.md §3.2, §3.7). Fungsi murni.
// Bentuk hasil sama dengan RPC `ringkasan_progres`, agar sumber data bisa diganti ke Supabase (DV-13)
// tanpa mengubah halaman.

import { levelTerbuka, SYARAT_BUKA } from './panduan.js';

export const MATERI = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
const MATERI_WAJIB = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']; // M0 opsional (api.md §3.2)

/**
 * @param {{ materi: { [id]: 'dibuka'|'selesai' }, terbaik: { [level]: number }, literasi: object[] }} data
 *   literasi: riwayat hasil F14 urut waktu, tiap butir { selesai_pada, skor: [r, f, e, i], skor_total }
 */
export function ringkasProgres({ materi = {}, terbaik = {}, literasi = [] }) {
  const buka = levelTerbuka(terbaik);
  const pertama = literasi[0] ?? null;
  const terakhir = literasi.at(-1) ?? null;
  return {
    materi_selesai: MATERI.filter((m) => materi[m] === 'selesai').length,
    materi_total: MATERI.length,
    materi_berikutnya: MATERI_WAJIB.find((m) => materi[m] !== 'selesai') ?? null,
    level: [1, 2, 3, 4].map((n) => ({ level: n, terbuka: buka.includes(n), benar_terbaik: terbaik[n] ?? null, jumlah_soal: 5 })),
    literasi: literasi.length
      ? {
          jumlah_percobaan: literasi.length,
          pertama,
          terakhir,
          terbaik: Math.max(...literasi.map((h) => h.skor_total)),
          perubahan: literasi.length > 1 ? terakhir.skor_total - pertama.skor_total : null,
        }
      : null,
  };
}

/**
 * Satu saran "Berikutnya" untuk Beranda (design.md §4: P02 selalu menyarankan satu langkah).
 * Urutan: materi M1–M6 → Latihan Level 1–3 sampai lulus → Latihan Literasi Matematis (KL-09:
 * setelah M6 dan Level 3) → Level 4 → ulangi Literasi Matematis.
 * @returns {{ jenis: string, id?: string|number, tautan: string }}
 */
export function saranBerikutnya(ringkasan) {
  if (ringkasan.materi_berikutnya) {
    return { jenis: 'materi', id: ringkasan.materi_berikutnya, tautan: `/materi/${ringkasan.materi_berikutnya}` };
  }
  for (const l of ringkasan.level.slice(0, 3)) {
    if ((l.benar_terbaik ?? 0) < SYARAT_BUKA) return { jenis: 'latihan', id: l.level, tautan: `/latihan/level/${l.level}` };
  }
  if (!ringkasan.literasi) return { jenis: 'literasi', tautan: '/literasi' };
  const l4 = ringkasan.level[3];
  if ((l4.benar_terbaik ?? 0) < SYARAT_BUKA) return { jenis: 'latihan', id: 4, tautan: '/latihan/level/4' };
  return { jenis: 'literasi', tautan: '/literasi' };
}
