import { describe, it, expect } from 'vitest';
import {
  jenisTransaksi, besarSelisih, persenSelisih, sederhanakan, hitungBalik, hitungTransaksi, fpb,
} from '../src/logika/hitung.js';
import { BANK_SOAL, PECAHAN, CONTOH_MATERI } from './data-soal.js';

describe('rumus resmi', () => {
  it('untung = HJ − HB', () => {
    expect(jenisTransaksi(80000, 100000)).toBe('untung');
    expect(besarSelisih(80000, 100000)).toBe(20000);
  });

  it('rugi = HB − HJ, hasilnya tidak negatif', () => {
    expect(jenisTransaksi(50000, 40000)).toBe('rugi');
    expect(besarSelisih(50000, 40000)).toBe(10000);
  });

  it('impas jika HJ = HB', () => {
    expect(jenisTransaksi(50000, 50000)).toBe('impas');
    expect(persenSelisih(50000, 50000)).toBe(0);
  });

  it('persen selalu dibagi harga beli, bukan harga jual', () => {
    expect(persenSelisih(80000, 100000)).toBe(25); // bukan 20
    expect(persenSelisih(80000, 60000)).toBe(25); // bukan 33,33
  });

  it('menolak harga beli 0 atau negatif', () => {
    expect(() => jenisTransaksi(0, 1000)).toThrow(RangeError);
    expect(() => persenSelisih(-1, 1000)).toThrow(RangeError);
    expect(() => besarSelisih(1000, -5)).toThrow(RangeError);
  });
});

describe('bank soal D-04 sesuai kunci yang disetujui', () => {
  it.each(BANK_SOAL)('%s', (id, hb, hj, jenis, selisih, persen, d1) => {
    const t = hitungTransaksi(hb, hj);
    expect(t.jenis).toBe(jenis);
    expect(t.selisih).toBe(selisih);
    if (persen != null) {
      expect(t.persen).toBeCloseTo(persen, 2);
      expect(t.nilaiD1).toBeCloseTo(d1, 2);
      expect(hitungBalik(t.persen, hb)).toBeCloseTo(selisih, 6);
    }
    if (PECAHAN[id]) {
      expect([t.pecahan.pembilang, t.pecahan.penyebut]).toEqual(PECAHAN[id]);
    }
  });
});

describe('contoh materi D-03 sesuai', () => {
  it.each(CONTOH_MATERI)('%s', (_, hb, hj, jenis, selisih, persen) => {
    const t = hitungTransaksi(hb, hj);
    expect([t.jenis, t.selisih]).toEqual([jenis, selisih]);
    expect(t.persen).toBeCloseTo(persen, 6);
  });
});

describe('alat bantu', () => {
  it('fpb dan penyederhanaan pecahan', () => {
    expect(fpb(20000, 80000)).toBe(20000);
    expect(sederhanakan(450000, 1500000)).toEqual({ pembilang: 3, penyebut: 10 });
  });

  it('nilai D2 (lupa × 100)', () => {
    expect(hitungTransaksi(40000, 50000).nilaiD2).toBe(0.25);
  });
});
