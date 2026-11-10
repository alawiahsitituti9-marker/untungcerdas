import { describe, it, expect } from 'vitest';
import { formatAngka, formatRupiah, formatPersen, formatDesimal, bacaRupiah, bacaPersen } from '../src/logika/format.js';

describe('format tampilan', () => {
  it('rupiah dengan titik ribuan', () => {
    expect(formatRupiah(100000)).toBe('Rp100.000');
    expect(formatRupiah(1050000)).toBe('Rp1.050.000');
    expect(formatRupiah(500)).toBe('Rp500');
    expect(formatAngka(0)).toBe('0');
  });

  it('persen dengan koma desimal, tanpa nol berlebih', () => {
    expect(formatPersen(25)).toBe('25%');
    expect(formatPersen(12.5)).toBe('12,5%');
    expect(formatPersen(100 / 6)).toBe('16,67%');
    expect(formatDesimal(0.25)).toBe('0,25');
  });
});

describe('membaca isian rupiah', () => {
  it.each([
    ['20000', 20000],
    ['20.000', 20000],
    ['Rp20.000', 20000],
    ['Rp 20.000', 20000],
    ['  1.500.000 ', 1500000],
    ['0', 0],
  ])('"%s" → %d', (teks, nilai) => {
    expect(bacaRupiah(teks)).toEqual({ ok: true, nilai });
  });

  it.each(['', 'dua puluh ribu', '20,5', '-5000', '20.00', '1.0000', '20000000'])('menolak "%s"', (teks) => {
    const hasil = bacaRupiah(teks);
    expect(hasil.ok).toBe(false);
    expect(hasil.pesan).toBe('Tulis angka saja, contoh 20000.');
  });
});

describe('membaca isian persen', () => {
  it.each([
    ['25', 25],
    ['25%', 25],
    ['12,5', 12.5],
    ['12.5', 12.5],
    ['16,67', 16.67],
    ['0,25', 0.25],
    ['1400', 1400], // persen untung bisa > 100% (kesalahan L4-03 harus tetap terbaca)
  ])('"%s" → %d', (teks, nilai) => {
    expect(bacaPersen(teks)).toEqual({ ok: true, nilai });
  });

  it.each(['', 'dua lima', '-10', '25,5,1', '20000'])('menolak "%s"', (teks) => {
    expect(bacaPersen(teks).ok).toBe(false);
  });
});
