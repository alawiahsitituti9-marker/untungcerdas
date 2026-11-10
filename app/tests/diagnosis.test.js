import { describe, it, expect } from 'vitest';
import { diagnosisLangkah, diagnosisAkhir, diagnosisPersen, cekHbHj, RUMUS } from '../src/logika/diagnosis.js';

// L2-01 kaos: HB 40.000, HJ 50.000 → untung 10.000, 25% (D1 = 20%, D2 = 0,25)
const L2_01 = { level: 2, hb: 40000, hj: 50000 };

describe('diagnosis persen (langkah 6)', () => {
  it('benar', () => expect(diagnosisPersen(25, 40000, 50000)).toEqual({ benar: true, kode: null }));
  it('D1: membagi harga jual', () => expect(diagnosisPersen(20, 40000, 50000).kode).toBe('D1'));
  it('D1: tetap dikenali walau dibulatkan (16,67 → 17)', () => expect(diagnosisPersen(17, 150000, 180000).kode).toBe('D1'));
  it('D2: lupa × 100', () => expect(diagnosisPersen(0.25, 40000, 50000).kode).toBe('D2'));
  it('D6: lainnya', () => expect(diagnosisPersen(40, 40000, 50000).kode).toBe('D6'));
});

describe('diagnosis per langkah (Level 1–3)', () => {
  it('langkah 2: HB dan HJ tertukar → D5', () => {
    expect(diagnosisLangkah(2, { hb: 50000, hj: 40000 }, L2_01)).toMatchObject({ kode: 'D5', sebab: 'tertukar', langkah: 2 });
  });

  it('langkah 3: jenis salah → D3', () => {
    expect(diagnosisLangkah(3, { jenis: 'rugi', alasanBenar: false }, L2_01)).toMatchObject({ kode: 'D3', jenisSiswa: 'rugi' });
  });

  it('langkah 3: jenis benar tapi alasan salah → D3 bagian alasan', () => {
    expect(diagnosisLangkah(3, { jenis: 'untung', alasanBenar: false }, L2_01)).toMatchObject({ kode: 'D3', bagian: 'alasan' });
  });

  it('langkah 4: selisih salah → D4', () => {
    expect(diagnosisLangkah(4, 90000, L2_01)).toMatchObject({ kode: 'D4', langkah: 4 });
    expect(diagnosisLangkah(4, 10000, L2_01).benar).toBe(true);
  });

  it('langkah 5: pilih rumus ÷ HJ → D1, × HB → D6', () => {
    expect(diagnosisLangkah(5, RUMUS.BAGI_HB, L2_01).benar).toBe(true);
    expect(diagnosisLangkah(5, RUMUS.BAGI_HJ, L2_01).kode).toBe('D1');
    expect(diagnosisLangkah(5, RUMUS.KALI_HB, L2_01).kode).toBe('D6');
  });

  it('langkah 7 Level 2–3: 25% × 40.000 = 10.000', () => {
    expect(diagnosisLangkah(7, 10000, L2_01).benar).toBe(true);
    expect(diagnosisLangkah(7, 12500, L2_01)).toMatchObject({ kode: 'D6', langkah: 7 });
  });

  it('langkah 7 Level 1: HB + untung = HJ (tanpa persen)', () => {
    const L1_01 = { level: 1, hb: 20000, hj: 25000 };
    expect(diagnosisLangkah(7, 25000, L1_01).benar).toBe(true);
    expect(diagnosisLangkah(7, 5000, L1_01).kode).toBe('D6');
  });

  it('langkah di luar 1–7 ditolak', () => {
    expect(() => diagnosisLangkah(8, 0, L2_01)).toThrow(RangeError);
  });
});

describe('langkah 1: penanda informasi (L3-02)', () => {
  const soal = {
    level: 3, hb: 60000, hj: 78000,
    segmen: [
      { teks: 'Bu Rina membeli 1 tas seharga ' },
      { teks: 'Rp60.000', peran: 'HB' },
      { teks: '. Tas itu dijual ' },
      { teks: 'Rp78.000', peran: 'HJ' },
      { teks: '. ' },
      { teks: 'Berapa persen keuntungan Bu Rina?', peran: 'DITANYA' },
    ],
  };

  it('semua benar', () => {
    expect(diagnosisLangkah(1, { 1: 'HB', 3: 'HJ', 5: 'DITANYA' }, soal).benar).toBe(true);
  });
  it('HB dan HJ tertukar → D5', () => {
    expect(diagnosisLangkah(1, { 1: 'HJ', 3: 'HB', 5: 'DITANYA' }, soal)).toMatchObject({ kode: 'D5', sebab: 'tertukar' });
  });
  it('HB tidak ditandai → D5', () => {
    expect(diagnosisLangkah(1, { 3: 'HJ', 5: 'DITANYA' }, soal)).toMatchObject({ kode: 'D5', sebab: 'lain' });
  });
  it('hanya "Ditanya" yang terlewat → D6, bukan D5', () => {
    expect(diagnosisLangkah(1, { 1: 'HB', 3: 'HJ' }, soal)).toMatchObject({ kode: 'D6', langkah: 1 });
  });
});

describe('diagnosis jawaban akhir Level 4 (D-05 §4)', () => {
  const L4_01 = { hb: 96000, hj: 120000, hjSatuan: 10000, pengecoh: [150000] };
  const L4_03 = { hb: 60000, hj: 45000, hbSatuan: 3000 };
  const L4_04 = { hb: 600000, hj: 675000, hbSatuan: 12000, hjSatuan: 13500, pengecoh: [1000000] };
  const L4_05 = { hb: 75000, hj: 60000 };

  it('L4-01 benar: 25%', () => {
    expect(diagnosisAkhir({ hb: 96000, hj: 120000, jenis: 'untung', persen: 25 }, L4_01).benar).toBe(true);
  });
  it('L4-01 memakai Rp150.000 (uang yang dibawa) → D5 pengecoh', () => {
    expect(diagnosisAkhir({ hb: 150000, hj: 120000, jenis: 'rugi', persen: 20 }, L4_01)).toMatchObject({ kode: 'D5', sebab: 'pengecoh', nilai: 150000 });
  });
  it('L4-01 HJ tidak dikali 12 → D5 satuan', () => {
    expect(diagnosisAkhir({ hb: 96000, hj: 10000, jenis: 'rugi', persen: 89.58 }, L4_01)).toMatchObject({ kode: 'D5', sebab: 'satuan' });
  });
  it('L4-03 HB tidak dikali 20 (hasil 1.400%) → D5 satuan', () => {
    expect(diagnosisAkhir({ hb: 3000, hj: 45000, jenis: 'untung', persen: 1400 }, L4_03)).toMatchObject({ kode: 'D5', sebab: 'satuan' });
  });
  it('L4-04 memakai Rp1.000.000 → D5 pengecoh', () => {
    expect(diagnosisAkhir({ hb: 1000000, hj: 675000, jenis: 'rugi', persen: 32.5 }, L4_04)).toMatchObject({ kode: 'D5', sebab: 'pengecoh' });
  });
  it('L4-04 desimal 12,5% benar', () => {
    expect(diagnosisAkhir({ hb: 600000, hj: 675000, jenis: 'untung', persen: 12.5 }, L4_04).benar).toBe(true);
  });
  it('L4-05 memilih "untung" seperti Rina → D3', () => {
    expect(diagnosisAkhir({ hb: 75000, hj: 60000, jenis: 'untung', persen: 25 }, L4_05)).toMatchObject({ kode: 'D3', jenisSiswa: 'untung' });
  });
  it('L4-05 jenis rugi tetapi 25% → D1', () => {
    expect(diagnosisAkhir({ hb: 75000, hj: 60000, jenis: 'rugi', persen: 25 }, L4_05).kode).toBe('D1');
  });
  it('besar diisi salah → D4', () => {
    expect(diagnosisAkhir({ hb: 75000, hj: 60000, jenis: 'rugi', besar: 135000, persen: 20 }, L4_05).kode).toBe('D4');
  });
});

describe('cekHbHj', () => {
  it('null jika benar', () => expect(cekHbHj({ hb: 1, hj: 2 }, { hb: 1, hj: 2 })).toBeNull());
});
