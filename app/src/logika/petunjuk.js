// Petunjuk Bertingkat (F11; design.md §9; D-05 §2) dan fading per siswa (design.md §8). Fungsi murni.
//   Level 1–2: 4 tingkat (identifikasi, rumus, operasi, penyelesaian) · Level 3: 2 tingkat · Level 4: tidak ada.
//   Fading per siswa [Asumsi]: di Level 1–2, jika 3 soal berturut-turut benar tanpa petunjuk,
//   panduan soal berikutnya diringkas menjadi 3 tahap seperti Level 3.

import { isiTemplat, nilaiTemplat } from './templat.js';
import { LAYAR } from './panduan.js';

export const BERTURUT_UNTUK_RINGKAS = 3;

/** Layar panduan ringkas (3 tahap: HB dan HJ → Hitung → Periksa) untuk Level 1–2. */
export const LAYAR_RINGKAS = {
  1: [[2], [3, 4], [7]],
  2: [[2], [3, 4, 6], [7]],
};

/** Templat petunjuk per level (D-05 §2.1–2.3); Level 4 tanpa petunjuk. */
function templatLevel(level, data) {
  return { 1: data.petunjukLevel1, 2: data.petunjukLevel2, 3: data.petunjukLevel3 }[level] ?? [];
}

/** Jumlah tingkat petunjuk per level (KFN-14: berkurang per level). */
export const jumlahTingkat = (level, data) => templatLevel(level, data).length;

/** Teks petunjuk untuk satu soal, sudah diisi angka soal itu. */
export function petunjukSoal(soal, data) {
  const templat = templatLevel(soal.level, data);
  if (templat.length === 0) return []; // Level 4: tanpa petunjuk (L4-02 juga tidak punya satu HB/HJ)
  const nilai = nilaiTemplat(soal.hb, soal.hj, {
    kata_HB: soal.kataKunci?.HB ?? 'membeli',
    kata_HJ: soal.kataKunci?.HJ ?? 'dijual',
  });
  return templat.map((t) => isiTemplat(t, nilai));
}

/**
 * Apakah panduan soal berikutnya diringkas?
 * @param {number} level
 * @param {{ benar: boolean, petunjuk: number }[]} riwayat hasil soal sebelumnya dalam sesi ini
 */
export function perluRingkas(level, riwayat) {
  if (!LAYAR_RINGKAS[level] || riwayat.length < BERTURUT_UNTUK_RINGKAS) return false;
  return riwayat.slice(-BERTURUT_UNTUK_RINGKAS).every((h) => h.benar && h.petunjuk === 0);
}

/** Layar panduan untuk soal berikutnya. */
export function layarUntuk(level, riwayat) {
  return perluRingkas(level, riwayat) ? LAYAR_RINGKAS[level] : LAYAR[level];
}
