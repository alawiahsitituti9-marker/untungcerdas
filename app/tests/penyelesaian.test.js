import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { penyelesaianSoal } from '../src/logika/penyelesaian.js';

const baca = (p) => readFileSync(new URL(p, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const soalJson = JSON.parse(baca('../public/data/soal.json'));
const materi = JSON.parse(baca('../public/data/materi.json'));
const D05 = baca('../../docs/konten/D-05_petunjuk_pembahasan.md');
const soal = (id) => soalJson.soal.find((s) => s.id === id);
const C = (id) => materi.contoh.find((c) => c.id === id).langkah;
const L123 = soalJson.soal.filter((s) => s.level <= 3);

// Tabel D-05 §5: | Soal | {HB} | {HJ} | {jenis} | a − b | {selisih} | {pecahan} | {persen} | …
const tabel5 = Object.fromEntries(
  [...D05.split('## 5. Tabel Nilai per Soal')[1].split('## 6.')[0].matchAll(/^\| (L\d-\d\d) \| (.+?) \| (.+?) \| (\w+) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \|/gm)]
    .map(([, id, hb, hj, jenis, , selisih, pecahan, persen]) => [id, { hb, hj, jenis, selisih, pecahan, persen }]),
);

describe('④ penyelesaian 7 langkah (D-05 §3.3)', () => {
  it('Level 1: langkah 2, 3, 4, 7 tanpa persen; Level 2: 2–7; Level 3: 1–7', () => {
    expect(penyelesaianSoal(soal('L1-01')).map((l) => l.no)).toEqual([2, 3, 4, 7]);
    expect(penyelesaianSoal(soal('L2-01')).map((l) => l.no)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(penyelesaianSoal(soal('L3-01')).map((l) => l.no)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    for (const s of L123.filter((x) => x.level === 1)) expect(JSON.stringify(penyelesaianSoal(s)), s.id).not.toContain('%');
  });

  it('teks penjelasan memakai kalimat C1 (untung) dan C2 (rugi) yang disetujui (D-03 §2)', () => {
    const teks = (s) => Object.fromEntries(penyelesaianSoal(s).map((l) => [l.no, l.teks]));
    const untung = teks(soal('L2-01'));
    const rugi = teks(soal('L2-02'));
    for (const no of [2, 3, 4, 5, 6]) expect(untung[no], `untung ${no}`).toBe(C('C1')[no - 1].teks);
    for (const no of [3, 4, 5]) expect(rugi[no], `rugi ${no}`).toBe(C('C2')[no - 1].teks);
    expect(teks(soal('L3-01'))[1]).toBe(C('C1')[0].teks);
    expect(untung[7]).toBe('Hitung balik: 25% dari harga beli. Hasilnya harus sama dengan untung.');
  });

  it.each(L123.map((s) => [s.id, s]))('%s: angka sesuai tabel D-05 §5', (id, s) => {
    const t = tabel5[id];
    const langkah = Object.fromEntries(penyelesaianSoal(s).map((l) => [l.no, l]));
    expect(langkah[2].hasil[0].teks).toBe(`HB = ${t.hb} · HJ = ${t.hj}`);
    expect(langkah[3].hasil[0].teks).toContain(t.jenis === 'untung' ? 'Untung' : 'Rugi');
    expect(langkah[4].hasil[0].teks).toContain(`= **${t.selisih}**`);
    if (s.level >= 2) {
      const r = langkah[6].hasil[0].rantai;
      const pecahan = r.filter((x) => typeof x === 'object');
      expect(pecahan[0].q).toBe(s.hb); // pembagi = harga beli
      expect(`${pecahan.at(-1).p}/${pecahan.at(-1).q}`).toBe(t.pecahan);
      expect(r.at(-1)).toBe(`× 100% = **${t.persen}**`);
      expect(langkah[7].hasil[0].teks).toBe(`${t.persen} × ${s.hb.toLocaleString('id-ID')} = ${s.kunci.besar.toLocaleString('id-ID')} ✓`);
    } else {
      expect(langkah[7].hasil[0].teks).toBe(`${s.hb.toLocaleString('id-ID')} ${s.kunci.jenis === 'untung' ? '+' : '−'} ${s.kunci.besar.toLocaleString('id-ID')} = ${s.hj.toLocaleString('id-ID')} ✓`);
    }
  });

  it('Level 3 langkah 1 menyebut yang ditanyakan', () => {
    expect(penyelesaianSoal(soal('L3-03'))[0].hasil[0].teks).toBe('Rp250.000 = HB · Rp200.000 = HJ · Ditanya: persen rugi');
  });
});
