// Pemeriksaan Latihan Level 4 (F09; design.md §8; D-05 §3.2, §4). Fungsi murni.
// Tanpa panduan dan tanpa petunjuk. Bentuk jawaban:
//   umum       (L4-01, L4-03, L4-04): HB, HJ → jenis → persen → alasan
//   bandingkan (L4-02): persen kedua barang → pilih barang → alasan
//   evaluasi   (L4-05): Benar/Salah → jenis → persen → alasan
// Pembahasan: baris khusus D-05 §4 bila cocok; selain itu templat umum D-05 §3.3.

import { diagnosisAkhir, diagnosisPersen } from './diagnosis.js';
import { formatPersen, formatDesimal } from './format.js';
import { isiTemplat, nilaiTemplat } from './templat.js';

export const BENTUK = ['umum', 'bandingkan', 'evaluasi'];
const JENIS_INDEKS = { untung: 0, rugi: 1 };

function khusus(data, soal, kondisi) {
  return data.level4Khusus.find((k) =>
    k.soal === soal.id && Object.entries(kondisi).every(([kunci, nilai]) => k[kunci] === nilai),
  );
}

function templatUmum(data, kode, hb, hj, tambahan) {
  const nilai = nilaiTemplat(hb, hj, { n: '6', ...tambahan });
  return (data.templat[kode] ?? data.templat.D6).map((t) => {
    if (t === '@kartuRumus') return data.kartuRumus.rumus.find((r) => r.teks.startsWith(`% ${nilai.Jenis}`))?.teks ?? '';
    if (t === '@petunjuk3') return isiTemplat(data.petunjukLevel2[2], nilai); // D-05 §3.3: Level 4 memakai §2.2 tingkat 3
    return isiTemplat(t, nilai);
  });
}

const teksPersen = (kode, persen) => (kode === 'D2' ? formatDesimal(persen) : formatPersen(persen));
const salah = (kode, pembahasan) => ({ benar: false, kode, pembahasan });

function periksaUmum(soal, j, data) {
  const d = diagnosisAkhir({ hb: j.hb, hj: j.hj, jenis: j.jenis, persen: j.persen }, soal);
  if (!d.benar) {
    const k = d.kode === 'D5' ? khusus(data, soal, { kode: 'D5', sebab: d.sebab }) : null;
    if (k) return salah(d.kode, k.teks);
    return salah(d.kode, templatUmum(data, d.kode, soal.hb, soal.hj, {
      jawab: teksPersen(d.kode, j.persen), jenis_siswa: j.jenis, persen: formatPersen(soal.kunci.persen),
    }));
  }
  if (j.alasan !== JENIS_INDEKS[soal.kunci.jenis]) {
    return salah('D3', templatUmum(data, 'D3', soal.hb, soal.hj, { jenis_siswa: j.jenis }));
  }
  return { benar: true };
}

function periksaBandingkan(soal, j, data) {
  const isian = [j.persen0, j.persen1];
  for (let i = 0; i < soal.transaksi.length; i++) {
    const t = soal.transaksi[i];
    const d = diagnosisPersen(isian[i], t.hb, t.hj);
    if (!d.benar) {
      return salah(d.kode, templatUmum(data, d.kode, t.hb, t.hj, { jawab: teksPersen(d.kode, isian[i]), persen: formatPersen(t.kunci.persen) }));
    }
  }
  const pilih = soal.transaksi[j.pilihan]?.nama;
  if (pilih !== soal.kunci.pilihan || j.alasan !== soal.alasan.benar) {
    // Memilih setrika atau alasan "rupiah lebih besar" = kekeliruan yang sama (D-05 §4, D-04 L4-02).
    return salah('D6', khusus(data, soal, { kode: 'D6' }).teks);
  }
  return { benar: true };
}

function periksaEvaluasi(soal, j, data) {
  if (j.pernyataan === 0) return salah('D3', khusus(data, soal, { kode: 'D3', pernyataan: 'Benar' }).teks);
  if (j.jenis !== soal.kunci.jenis) {
    return salah('D3', templatUmum(data, 'D3', soal.hb, soal.hj, { jenis_siswa: j.jenis }));
  }
  const d = diagnosisPersen(j.persen, soal.hb, soal.hj);
  if (!d.benar) {
    if (d.kode === 'D1') return salah('D1', khusus(data, soal, { kode: 'D1', jenisBenar: true }).teks);
    return salah(d.kode, templatUmum(data, d.kode, soal.hb, soal.hj, { jawab: teksPersen(d.kode, j.persen), persen: formatPersen(soal.kunci.persen) }));
  }
  if (j.alasan !== soal.alasan.benar) {
    // Alasan "dibagi 60.000" = membagi harga jual (D1), sama dengan baris khusus D-05 §4.
    return salah('D1', khusus(data, soal, { kode: 'D1', jenisBenar: true }).teks);
  }
  return { benar: true };
}

/**
 * @param {object} soal  soal Level 4 dari soal.json
 * @param {object} jawab sudah berupa angka/indeks:
 *   umum: { hb, hj, jenis, persen, alasan } · bandingkan: { persen0, persen1, pilihan, alasan }
 *   evaluasi: { pernyataan (0 = Benar, 1 = Salah), jenis, persen, alasan }
 * @param {object} data  { templat, petunjukLevel2, level4Khusus, kartuRumus }
 * @returns {{ benar: true, tambahan?: string[] } | { benar: false, kode: string, pembahasan: string[] }}
 */
export function periksaLevel4(soal, jawab, data) {
  const h = { umum: periksaUmum, bandingkan: periksaBandingkan, evaluasi: periksaEvaluasi }[soal.bentuk](soal, jawab, data);
  if (!h.benar) return h;
  const tambahan = khusus(data, soal, { kode: 'BENAR' });
  return tambahan ? { benar: true, tambahan: tambahan.teks } : { benar: true };
}
