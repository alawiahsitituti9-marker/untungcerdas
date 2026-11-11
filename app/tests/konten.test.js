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
  const satuTransaksi = soal.filter((s) => s.id !== 'L4-02');
  it.each(satuTransaksi.map((s) => [s.id, s]))('%s', (id, s) => {
    const d04 = kunciD04[id];
    expect(d04, `${id} tidak ada di D-04`).toBeDefined();
    expect([s.hb, s.hj]).toEqual([d04.hb, d04.hj]);

    const t = hitungTransaksi(s.hb, s.hj);
    expect(s.kunci).toMatchObject({ jenis: t.jenis, besar: t.selisih, persen: d04.persen });

    if (s.level <= 2) {
      expect(s.barang).toBeTruthy(); // Level 1–2 tanpa cerita (D-04 §1–2)
      return;
    }
    if (s.level === 4) {
      // Level 4 memakai harga satuan/pengecoh; teks soal diuji terhadap D-04 di bawah.
      expect(s.segmen.some((x) => x.peran === 'DITANYA')).toBe(true);
      return;
    }
    // Nilai pada segmen HB/HJ cocok dengan angka soal
    expect(s.segmen.find((x) => x.peran === 'HB').nilai).toBe(s.hb);
    expect(s.segmen.find((x) => x.peran === 'HJ').nilai).toBe(s.hj);
    expect(s.segmen.some((x) => x.peran === 'DITANYA')).toBe(true);

    // Menandai sesuai kunci dinilai benar oleh diagnosis langkah 1
    const label = Object.fromEntries(s.segmen.map((x, i) => [i, x.peran]).filter(([, p]) => p));
    expect(diagnosisLangkah(1, label, s).benar).toBe(true);
  });

  it('23 soal: Level 1–3 masing-masing 6, Level 4 berisi 5 (D-04)', () => {
    expect([1, 2, 3, 4].map((n) => soal.filter((s) => s.level === n).length)).toEqual([6, 6, 6, 5]);
  });
  it('L4-02: dua transaksi sesuai D-04', () => {
    const s = soal.find((x) => x.id === 'L4-02');
    for (const t of s.transaksi) {
      const d04 = kunciD04[`L4-02 ${t.nama === 'Kipas angin' ? 'kipas' : 'setrika'}`];
      expect([t.hb, t.hj, t.kunci.besar, t.kunci.persen]).toEqual([d04.hb, d04.hj, d04.selisih, d04.persen]);
    }
    expect(s.kunci.pilihan).toBe('Kipas angin');
  });
  it('teks soal Level 3–4 sama persis dengan D-04 (tanpa penanda [[…]])', () => {
    const D04 = readFileSync(new URL('../../docs/konten/D-04_bank_soal.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
    for (const s of soal.filter((x) => x.level >= 3)) {
      const blok = D04.split(`**${s.id}**`)[1];
      const kalimat = blok.split('\n').find((l) => l.startsWith('> ')).slice(2).replace(/\[\[\/?\w*\]\]/g, '');
      expect(s.segmen.map((x) => x.teks).join(''), s.id).toBe(kalimat);
    }
  });
  it('barang dan harga Level 1–2 sama dengan tabel D-04', () => {
    const D04 = readFileSync(new URL('../../docs/konten/D-04_bank_soal.md', import.meta.url), 'utf8');
    for (const s of soal.filter((x) => x.level <= 2)) {
      const rp = (n) => `Rp${n.toLocaleString('id-ID')}`;
      expect(D04).toContain(`| ${s.id} | ${s.barang} | ${rp(s.hb)} | ${rp(s.hj)} |`);
    }
  });
});

describe('materi.json sesuai D-03', () => {
  it('M0–M6 berurutan', () => {
    expect(materi.map((m) => m.id)).toEqual(['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6']);
  });
});
