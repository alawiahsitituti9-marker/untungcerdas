import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { petunjukSoal, jumlahTingkat, perluRingkas, layarUntuk, LAYAR_RINGKAS } from '../src/logika/petunjuk.js';
import { LAYAR, periksaLayar } from '../src/logika/panduan.js';

const baca = (p) => readFileSync(new URL(p, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const soalJson = JSON.parse(baca('../public/data/soal.json'));
const pemb = JSON.parse(baca('../public/data/pembahasan.json'));
const D05 = baca('../../docs/konten/D-05_petunjuk_pembahasan.md');
const data = { ...soalJson, ...pemb };
const soal = (id) => soalJson.soal.find((s) => s.id === id);

describe('jumlah tingkat petunjuk berkurang per level (KFN-14, design.md §8)', () => {
  it('Level 1–2: 4 · Level 3: 2 · Level 4: 0', () => {
    expect([1, 2, 3, 4].map((n) => jumlahTingkat(n, data))).toEqual([4, 4, 2, 0]);
    expect(petunjukSoal(soal('L4-01'), data)).toEqual([]);
  });
});

describe('isi petunjuk sesuai D-05 §2', () => {
  it('L2-05 sama persis dengan contoh hasil templat D-05 §2.4', () => {
    const contoh = [...D05.split('### 2.4')[1].split('##')[0].matchAll(/^\| \d \| (.+) \|$/gm)].map((m) => m[1]);
    expect(contoh).toHaveLength(4);
    expect(petunjukSoal(soal('L2-05'), data)).toEqual(contoh);
  });
  it('Level 1 memakai angka soal dan tanpa persen', () => {
    const p = petunjukSoal(soal('L1-03'), data);
    expect(p[2]).toBe('Rp24.000 lebih kecil dari Rp30.000, jadi pedagang **rugi**. Hitung 30.000 − 24.000.');
    expect(p[3]).toBe('Hitung dalam ribuan saja: 30 − 24 = … Lalu tambahkan "ribu" di belakangnya.');
    expect(p.join(' ')).not.toContain('%');
  });
  it('Level 3 memakai kata kunci setiap soal (D-05 §2.3)', () => {
    expect(petunjukSoal(soal('L3-01'), data)).toEqual([
      'Cari kata kunci di soal. "membeli … seharga" menunjuk harga beli. "mendapat (hasil semua air yang terjual)" menunjuk harga jual.',
      '**% Untung = Untung ÷ Harga Beli × 100%.** Ingat, pembaginya selalu harga beli.',
    ]);
  });
  it('tidak ada variabel templat yang tertinggal di soal mana pun', () => {
    for (const s of soalJson.soal) for (const t of petunjukSoal(s, data)) expect(t, s.id).not.toMatch(/\{\w+\}/);
  });
});

describe('fading per siswa [Asumsi] (design.md §8)', () => {
  const benarTanpa = { benar: true, petunjuk: 0 };
  it('3 soal berturut-turut benar tanpa petunjuk → panduan diringkas', () => {
    expect(perluRingkas(1, [benarTanpa, benarTanpa])).toBe(false);
    expect(perluRingkas(1, [benarTanpa, benarTanpa, benarTanpa])).toBe(true);
    expect(perluRingkas(2, [{ benar: false, petunjuk: 0 }, benarTanpa, benarTanpa, benarTanpa])).toBe(true);
  });
  it('memakai petunjuk atau salah memutus urutan', () => {
    expect(perluRingkas(1, [benarTanpa, { benar: true, petunjuk: 1 }, benarTanpa])).toBe(false);
    expect(perluRingkas(2, [benarTanpa, benarTanpa, { benar: false, petunjuk: 0 }])).toBe(false);
  });
  it('hanya Level 1–2; Level 3 sudah ringkas dan Level 4 tanpa panduan', () => {
    const tiga = [benarTanpa, benarTanpa, benarTanpa];
    expect(perluRingkas(3, tiga)).toBe(false);
    expect(layarUntuk(3, tiga)).toBe(LAYAR[3]);
    expect(layarUntuk(1, tiga)).toBe(LAYAR_RINGKAS[1]);
    expect(layarUntuk(1, [])).toBe(LAYAR[1]);
  });
  it('panduan ringkas memuat 3 tahap dan tetap memeriksa langkah yang sama kecuali pilihan rumus', () => {
    expect(LAYAR_RINGKAS[1].flat()).toEqual(LAYAR[1].flat());
    expect(LAYAR_RINGKAS[2].flat()).toEqual([2, 3, 4, 6, 7]);
    expect(LAYAR_RINGKAS[1]).toHaveLength(3);
    expect(LAYAR_RINGKAS[2]).toHaveLength(3);
  });
  it('jawaban kunci lulus semua layar ringkas', () => {
    for (const s of soalJson.soal.filter((x) => x.level <= 2)) {
      const isian = { hb: s.hb, hj: s.hj, jenis: s.kunci.jenis, alasan: s.kunci.jenis === 'untung' ? 0 : 1, besar: s.kunci.besar, persen: s.kunci.persen, balik: s.level === 1 ? s.hj : s.kunci.besar };
      for (const layar of LAYAR_RINGKAS[s.level]) expect(periksaLayar(s, layar, isian, data), s.id).toEqual({ benar: true });
    }
  });
});
