import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { periksaLevel4 } from '../src/logika/level4.js';
import { pilihSoalSesi } from '../src/logika/panduan.js';

const baca = (p) => readFileSync(new URL(p, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const soalJson = JSON.parse(baca('../public/data/soal.json'));
const pemb = JSON.parse(baca('../public/data/pembahasan.json'));
const materi = JSON.parse(baca('../public/data/materi.json'));
const D04 = baca('../../docs/konten/D-04_bank_soal.md');
const D05 = baca('../../docs/konten/D-05_petunjuk_pembahasan.md');
const data = { ...soalJson, ...pemb, kartuRumus: materi.kartuRumus };
const soal = (id) => soalJson.soal.find((s) => s.id === id);
const khusus = (id, kode, i = 0) => pemb.level4Khusus.filter((k) => k.soal === id && k.kode === kode)[i].teks;

const KUNCI = {
  'L4-01': { hb: 96000, hj: 120000, jenis: 'untung', persen: 25, alasan: 0 },
  'L4-02': { persen0: 25, persen1: 20, pilihan: 0, alasan: 0 },
  'L4-03': { hb: 60000, hj: 45000, jenis: 'rugi', persen: 25, alasan: 1 },
  'L4-04': { hb: 600000, hj: 675000, jenis: 'untung', persen: 12.5, alasan: 0 },
  'L4-05': { pernyataan: 1, jenis: 'rugi', persen: 20, alasan: 0 },
};
const periksa = (id, ubah = {}) => periksaLevel4(soal(id), { ...KUNCI[id], ...ubah }, data);

describe('data Level 4 sama dengan dokumen', () => {
  it('penyelesaian setiap soal = baris "Penyelesaian:" D-04', () => {
    for (const s of soalJson.soal.filter((x) => x.level === 4)) {
      expect(D04, s.id).toContain(`Penyelesaian: ${s.penyelesaian}\n`);
    }
  });
  it('baris khusus = tabel D-05 §4 (8 baris, teks persis)', () => {
    expect(pemb.level4Khusus).toHaveLength(8);
    for (const k of pemb.level4Khusus) for (const t of k.teks) expect(D05, `${k.soal} ${k.kode}`).toContain(t);
  });
  it('bentuk jawaban sesuai D-04 / D-05 §3.2', () => {
    expect(soalJson.soal.filter((s) => s.level === 4).map((s) => s.bentuk)).toEqual(['umum', 'bandingkan', 'umum', 'umum', 'evaluasi']);
  });
  it('sesi Level 4 memuat kelima soal', () => {
    expect(pilihSoalSesi(soalJson.soal, 4).map((s) => s.id).sort()).toEqual(['L4-01', 'L4-02', 'L4-03', 'L4-04', 'L4-05']);
  });
});

describe('jawaban kunci benar', () => {
  it.each(Object.keys(KUNCI))('%s', (id) => {
    expect(periksa(id).benar).toBe(true);
  });
  it('L4-04: tambahan cara per kg di layar benar (D-05 §4)', () => {
    expect(periksa('L4-04').tambahan).toEqual(['Cara cepatmu juga benar: untung per kg Rp1.500, lalu 1.500 ÷ 12.000 × 100% = 12,5%.']);
    expect(periksa('L4-01').tambahan).toBeUndefined();
  });
  it('persen 12,5 diterima dengan toleransi', () => {
    expect(periksa('L4-04', { persen: 12.5 }).benar).toBe(true);
  });
});

describe('kesalahan bentuk umum (L4-01, L4-03, L4-04)', () => {
  it('angka pengecoh sebagai harga beli → baris khusus', () => {
    expect(periksa('L4-01', { hb: 150000 })).toEqual({ benar: false, kode: 'D5', pembahasan: khusus('L4-01', 'D5', 0) });
    expect(periksa('L4-04', { hb: 1000000 })).toEqual({ benar: false, kode: 'D5', pembahasan: khusus('L4-04', 'D5') });
  });
  it('harga satuan belum dikalikan → baris khusus', () => {
    expect(periksa('L4-01', { hj: 10000 }).pembahasan).toEqual(khusus('L4-01', 'D5', 1));
    expect(periksa('L4-03', { hb: 3000 }).pembahasan).toEqual(khusus('L4-03', 'D5'));
  });
  it('HB/HJ tertukar → templat D5 umum', () => {
    expect(periksa('L4-03', { hb: 45000, hj: 60000 }).pembahasan[0]).toBe('Harga beli dan harga jual yang kamu tulis belum tepat.');
  });
  it('jenis, persen, dan alasan salah → templat D3, D1, D2, D6', () => {
    expect(periksa('L4-03', { jenis: 'untung' }).pembahasan[0]).toBe('Kamu memilih **untung**. Coba bandingkan lagi kedua harga.');
    expect(periksa('L4-01', { persen: 20 }).pembahasan[0]).toBe('Kamu menulis 20%. Sepertinya kamu membagi dengan **harga jual** (Rp120.000).');
    expect(periksa('L4-01', { persen: 0.25 }).pembahasan[0]).toBe('Kamu menulis 0,25. Itu baru hasil pembagian, belum persen.');
    const d6 = periksa('L4-03', { persen: 40 });
    expect(d6.kode).toBe('D6');
    expect(d6.pembahasan[2]).toBe('Ruginya Rp15.000. Hitung Rp15.000 ÷ Rp60.000 dulu. Coret nol yang sama di atas dan di bawah.');
    expect(periksa('L4-01', { alasan: 1 }).kode).toBe('D3');
  });
});

describe('L4-02 membandingkan dua barang', () => {
  it('memilih setrika atau alasan rupiah → baris khusus D6', () => {
    expect(periksa('L4-02', { pilihan: 1 })).toEqual({ benar: false, kode: 'D6', pembahasan: khusus('L4-02', 'D6') });
    expect(periksa('L4-02', { alasan: 1 }).pembahasan).toEqual(khusus('L4-02', 'D6'));
  });
  it('persen salah memakai nilai barang yang bersangkutan', () => {
    expect(periksa('L4-02', { persen0: 20 }).pembahasan[0]).toBe('Kamu menulis 20%. Sepertinya kamu membagi dengan **harga jual** (Rp125.000).');
    expect(periksa('L4-02', { persen1: 16.67 }).pembahasan[0]).toBe('Kamu menulis 16,67%. Sepertinya kamu membagi dengan **harga jual** (Rp240.000).');
  });
});

describe('L4-05 mengevaluasi pernyataan Rina', () => {
  it('memilih "Benar" → baris khusus D3', () => {
    expect(periksa('L4-05', { pernyataan: 0 })).toEqual({ benar: false, kode: 'D3', pembahasan: khusus('L4-05', 'D3') });
  });
  it('jenis benar tetapi 25% → baris khusus D1; alasan "dibagi 60.000" → baris yang sama', () => {
    expect(periksa('L4-05', { persen: 25 }).pembahasan).toEqual(khusus('L4-05', 'D1'));
    expect(periksa('L4-05', { alasan: 1 }).pembahasan).toEqual(khusus('L4-05', 'D1'));
  });
  it('memilih untung → templat D3; lupa × 100 → templat D2', () => {
    expect(periksa('L4-05', { jenis: 'untung' }).pembahasan[0]).toBe('Kamu memilih **untung**. Coba bandingkan lagi kedua harga.');
    expect(periksa('L4-05', { persen: 0.2 }).kode).toBe('D2');
  });
});
