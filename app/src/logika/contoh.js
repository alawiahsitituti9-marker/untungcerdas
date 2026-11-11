// Pemeriksaan isian Contoh Sebagian C4 (F12, fading; D-03 §2 C4).
// Kode kesalahan dari diagnosisLangkah (langkah 4–6); teks dari templat D-05 §3.3 lewat pembahasanLangkah;
// alur D-05 §3.1: salah pertama → unsur ①–③ lalu "Coba lagi"; salah kedua → hasil benar ditampilkan.

import { diagnosisLangkah } from './diagnosis.js';
import { hitungTransaksi } from './hitung.js';
import { pembahasanLangkah } from './panduan.js';

export const BATAS_PERCOBAAN = 2;

/**
 * @param {object} contoh   objek contoh C4 (punya hb, hj)
 * @param {object} langkah  langkah dengan `no` dan `isian`
 * @param {number|string} jawab  rupiah/persen (angka) atau nilai rumus ('bagi_hb' | 'bagi_hj' | 'kali_hb')
 * @param {object} data     { templat, templatKhusus, petunjukLevel1, petunjukLevel2, kartuRumus }
 * @returns {{ benar: true } | { benar: false, kode: string, pembahasan: string[] }}
 */
export function periksaIsianContoh(contoh, langkah, jawab, data) {
  const t = hitungTransaksi(contoh.hb, contoh.hj);
  const soal = { level: 2, hb: contoh.hb, hj: contoh.hj, kunci: { jenis: t.jenis, persen: t.persen } };
  const h = diagnosisLangkah(langkah.no, jawab, soal);
  if (h.benar) return { benar: true };
  const isian = langkah.no === 4 ? { besar: jawab } : langkah.no === 6 ? { persen: jawab } : {};
  return { benar: false, kode: h.kode, pembahasan: pembahasanLangkah(soal, { langkah: langkah.no, kode: h.kode }, isian, data) };
}
