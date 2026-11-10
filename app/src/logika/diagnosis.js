// Pengenalan kesalahan D1–D6 (design.md §10.2, D-05 §3.2).
//   D1 membagi dengan harga jual        D4 besar untung/rugi salah
//   D2 lupa mengalikan 100%             D5 HB/HJ salah ditentukan
//   D3 untung dan rugi tertukar         D6 kesalahan lain
// Modul ini hanya menentukan kode dan sebab; teks pembahasan diambil dari konten (D-05).

import { hitungTransaksi, hampirSama, TOLERANSI_BENAR } from './hitung.js';

export const TOLERANSI_D1 = 0.5;   // siswa bisa membulatkan, misalnya 16,67 → 17
export const TOLERANSI_D2 = 0.005;

/** Pilihan rumus pada langkah 5 (D-04 §2). */
export const RUMUS = Object.freeze({
  BAGI_HB: 'bagi_hb', // benar
  BAGI_HJ: 'bagi_hj', // D1
  KALI_HB: 'kali_hb', // D6
});

const BENAR = Object.freeze({ benar: true, kode: null });
const salah = (kode, tambahan = {}) => ({ benar: false, kode, ...tambahan });

/**
 * Kesalahan penentuan HB/HJ (D5) dan sebabnya.
 * @param {{hb:number, hj:number}} isian   HB dan HJ yang diisi siswa
 * @param {{hb:number, hj:number, hbSatuan?:number, hjSatuan?:number, pengecoh?:number[]}} soal
 * @returns {null | {kode:'D5', sebab:'tertukar'|'pengecoh'|'satuan'|'lain', nilai?:number}}
 */
export function cekHbHj(isian, soal) {
  if (isian.hb === soal.hb && isian.hj === soal.hj) return null;
  if (isian.hb === soal.hj && isian.hj === soal.hb) return { kode: 'D5', sebab: 'tertukar' };
  const pengecoh = soal.pengecoh ?? [];
  for (const angka of [isian.hb, isian.hj]) {
    if (pengecoh.includes(angka)) return { kode: 'D5', sebab: 'pengecoh', nilai: angka };
  }
  const satuan = [soal.hbSatuan, soal.hjSatuan].filter((x) => x != null);
  for (const angka of [isian.hb, isian.hj]) {
    if (satuan.includes(angka)) return { kode: 'D5', sebab: 'satuan', nilai: angka };
  }
  return { kode: 'D5', sebab: 'lain' };
}

/** Mengenali kesalahan pada isian persen (dipakai di langkah 6 dan Level 4). */
export function diagnosisPersen(jawab, hb, hj) {
  const t = hitungTransaksi(hb, hj);
  if (hampirSama(jawab, t.persen, TOLERANSI_BENAR)) return BENAR;
  if (t.nilaiD1 != null && hampirSama(jawab, t.nilaiD1, TOLERANSI_D1)) return salah('D1');
  if (hampirSama(jawab, t.nilaiD2, TOLERANSI_D2)) return salah('D2');
  return salah('D6');
}

/**
 * Diagnosis per langkah untuk Level 1–3 (panduan 7 langkah, design.md §8).
 * @param {number} langkah 1–7
 * @param {*} jawab bentuknya bergantung pada langkah:
 *   1: { [indeksSegmen]: 'HB'|'HJ'|'DITANYA'|... } label dari siswa
 *   2: { hb, hj }        3: { jenis, alasanBenar: boolean }
 *   4: number (rupiah)   5: RUMUS.*      6: number (persen)
 *   7: number (hasil hitung balik dalam rupiah: HJ di Level 1, besar untung/rugi di Level 2–3)
 * @param {object} soal  { level, hb, hj, segmen? } dengan hb/hj nilai total
 */
export function diagnosisLangkah(langkah, jawab, soal) {
  const t = hitungTransaksi(soal.hb, soal.hj);
  const hasil = (() => {
    switch (langkah) {
      case 1: {
        // Segmen tanpa peran tidak perlu ditandai. Segmen PENGECOH benar jika
        // dibiarkan kosong. Salah menandai HB/HJ → D5; salah lainnya → D6.
        const segmen = soal.segmen ?? [];
        const harga = (p) => p === 'HB' || p === 'HJ';
        let sebabD5 = null;
        let keliruLain = false;
        segmen.forEach((s, i) => {
          const label = jawab[i] ?? null;
          const kunci = s.peran && s.peran !== 'PENGECOH' ? s.peran : null;
          if (label === kunci) return;
          if (harga(kunci) && harga(label)) sebabD5 ??= 'tertukar';
          else if (s.peran === 'PENGECOH' && harga(label)) sebabD5 ??= 'pengecoh';
          else if (harga(kunci) || harga(label)) sebabD5 ??= 'lain';
          else keliruLain = true;
        });
        if (sebabD5) return salah('D5', { sebab: sebabD5 });
        if (keliruLain) return salah('D6');
        return BENAR;
      }
      case 2: {
        const d5 = cekHbHj(jawab, soal);
        return d5 ? salah('D5', { sebab: d5.sebab, nilai: d5.nilai }) : BENAR;
      }
      case 3:
        if (jawab.jenis !== t.jenis) return salah('D3', { jenisSiswa: jawab.jenis });
        if (!jawab.alasanBenar) return salah('D3', { jenisSiswa: jawab.jenis, bagian: 'alasan' });
        return BENAR;
      case 4:
        return jawab === t.selisih ? BENAR : salah('D4');
      case 5:
        if (jawab === RUMUS.BAGI_HB) return BENAR;
        return salah(jawab === RUMUS.BAGI_HJ ? 'D1' : 'D6');
      case 6:
        return diagnosisPersen(jawab, soal.hb, soal.hj);
      case 7: {
        // Level 1: HB ± besar = HJ. Level 2–3: persen × HB ÷ 100 = besar (D-05 §3.3).
        const harapan = soal.level === 1 ? soal.hj : t.selisih;
        return hampirSama(jawab, harapan, 0.5) ? BENAR : salah('D6');
      }
      default:
        throw new RangeError(`Langkah ${langkah} tidak dikenal (1–7).`);
    }
  })();
  return hasil.benar ? hasil : { ...hasil, langkah };
}

/**
 * Diagnosis jawaban akhir Level 4 (D-05 §3.2). Urutan: D5 → D3 → D4 → D1 → D2 → D6.
 * @param {{hb:number, hj:number, jenis:string, persen:number, besar?:number}} jawab
 * @param {object} soal { hb, hj, hbSatuan?, hjSatuan?, pengecoh? }
 */
export function diagnosisAkhir(jawab, soal) {
  const d5 = cekHbHj(jawab, soal);
  if (d5) return salah('D5', { sebab: d5.sebab, nilai: d5.nilai });
  const t = hitungTransaksi(soal.hb, soal.hj);
  if (jawab.jenis !== t.jenis) return salah('D3', { jenisSiswa: jawab.jenis });
  if (jawab.besar != null && jawab.besar !== t.selisih) return salah('D4');
  return diagnosisPersen(jawab.persen, soal.hb, soal.hj);
}
