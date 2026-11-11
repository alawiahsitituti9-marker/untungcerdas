// Pemeriksaan isian Contoh Sebagian C4 (F12, fading; D-03 §2 C4).
// Kode kesalahan dari diagnosisLangkah (langkah 4–6); teks dari templat D-05 §3.3;
// alur D-05 §3.1: salah pertama → unsur ①–③ lalu "Coba lagi"; salah kedua → hasil benar ditampilkan.

import { diagnosisLangkah } from './diagnosis.js';
import { formatRupiah, formatPersen, formatDesimal } from './format.js';
import { isiTemplat, nilaiTemplat } from './templat.js';

export const BATAS_PERCOBAAN = 2;

/** {jawab} ditulis seperti yang dimaksud siswa: rupiah, persen, atau desimal (D2: belum dikali 100). */
function teksJawab(jenis, nilai, kode) {
  if (jenis === 'rupiah') return formatRupiah(nilai);
  if (jenis === 'persen') return kode === 'D2' ? formatDesimal(nilai) : formatPersen(nilai);
  return String(nilai);
}

/**
 * @param {object} contoh   objek contoh C4 (punya hb, hj)
 * @param {object} langkah  langkah dengan `no` dan `isian`
 * @param {number|string} jawab  rupiah/persen (angka) atau nilai rumus ('bagi_hb' | 'bagi_hj' | 'kali_hb')
 * @param {object} data     { templat, petunjukLevel2, kartuRumus }
 * @returns {{ benar: true } | { benar: false, kode: string, pembahasan: string[] }}
 */
export function periksaIsianContoh(contoh, langkah, jawab, data) {
  const soal = { level: 2, hb: contoh.hb, hj: contoh.hj };
  const h = diagnosisLangkah(langkah.no, jawab, soal);
  if (h.benar) return { benar: true };

  const nilai = nilaiTemplat(contoh.hb, contoh.hj, {
    jawab: teksJawab(langkah.isian.jenis, jawab, h.kode),
    n: String(langkah.no),
  });
  const templat = data.templat[h.kode] ?? data.templat.D6;
  const rumusPersen = data.kartuRumus.rumus.find((r) => r.teks.startsWith(`% ${nilai.Jenis}`))?.teks;
  const pembahasan = templat.map((t) => {
    if (t === '@kartuRumus') return rumusPersen ?? '';
    if (t === '@petunjuk3') return isiTemplat(data.petunjukLevel2[2], nilai);
    return isiTemplat(t, nilai);
  });
  return { benar: false, kode: h.kode, pembahasan };
}
