import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { hitungTransaksi } from '../src/logika/hitung.js';
import { diagnosisLangkah } from '../src/logika/diagnosis.js';
import { BANK_SOAL } from './data-soal.js';

const baca = (nama) => JSON.parse(readFileSync(new URL(`../public/data/${nama}.json`, import.meta.url), 'utf8'));
const { soal } = baca('soal');
const { materi } = baca('materi');
const kunciD04 = Object.fromEntries(BANK_SOAL.map(([id, hb, hj, jenis, selisih, persen]) => [id, { hb, hj, jenis, selisih, persen }]));

describe('soal.json sesuai D-04', () => {
  it.each(soal.map((s) => [s.id, s]))('%s', (id, s) => {
    const d04 = kunciD04[id];
    expect(d04, `${id} tidak ada di D-04`).toBeDefined();
    expect([s.hb, s.hj]).toEqual([d04.hb, d04.hj]);

    const t = hitungTransaksi(s.hb, s.hj);
    expect(s.kunci).toEqual({ jenis: t.jenis, besar: t.selisih, persen: d04.persen });

    // Nilai pada segmen HB/HJ cocok dengan angka soal
    expect(s.segmen.find((x) => x.peran === 'HB').nilai).toBe(s.hb);
    expect(s.segmen.find((x) => x.peran === 'HJ').nilai).toBe(s.hj);
    expect(s.segmen.some((x) => x.peran === 'DITANYA')).toBe(true);

    // Menandai sesuai kunci dinilai benar oleh diagnosis langkah 1
    const label = Object.fromEntries(s.segmen.map((x, i) => [i, x.peran]).filter(([, p]) => p));
    expect(diagnosisLangkah(1, label, s).benar).toBe(true);
  });

  it('memuat 6 soal Level 3', () => {
    expect(soal.filter((s) => s.level === 3)).toHaveLength(6);
  });
});

describe('materi.json sesuai D-03', () => {
  it('M0–M6 berurutan', () => {
    expect(materi.map((m) => m.id)).toEqual(['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6']);
  });
});
