import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { periksaIsianContoh } from '../src/logika/contoh.js';
import { isiTemplat, nilaiTemplat } from '../src/logika/templat.js';
import { hitungTransaksi } from '../src/logika/hitung.js';
import { CONTOH_MATERI } from './data-soal.js';

const baca = (p) => readFileSync(new URL(p, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const materi = JSON.parse(baca('../public/data/materi.json'));
const pemb = JSON.parse(baca('../public/data/pembahasan.json'));
const D03 = baca('../../docs/konten/D-03_materi.md');
const D05 = baca('../../docs/konten/D-05_petunjuk_pembahasan.md');
const contoh = (id) => materi.contoh.find((c) => c.id === id);
const data = { ...pemb, kartuRumus: materi.kartuRumus };
const bagianD03 = (id) => D03.split(`### ${id} — `)[1].split(/\n### |\n---/)[0];

describe('materi.json: Contoh Bertahap sesuai D-03 §2', () => {
  it('ada C1–C4; C1 setelah M5, C2 setelah M6', () => {
    expect(materi.contoh.map((c) => c.id)).toEqual(['C1', 'C2', 'C3', 'C4']);
    expect(materi.materi.find((m) => m.id === 'M5').contoh).toBe('C1');
    expect(materi.materi.find((m) => m.id === 'M6').contoh).toBe('C2');
  });

  it.each(['C1', 'C2', 'C3', 'C4'])('%s: teks soal sama persis', (id) => {
    const kutipan = bagianD03(id).split('\n').find((l) => l.startsWith('> ')).slice(2);
    expect(contoh(id).segmen.map((s) => s.teks).join('')).toBe(kutipan);
  });

  it.each(['C1', 'C2', 'C3'])('%s: 7 langkah, judul dan teks penjelasan sama persis', (id) => {
    const baris = [...bagianD03(id).matchAll(/^\| (\d\. .+?) \| (.+?) \| .+ \|$/gm)].map(([, j, t]) => [j, t]);
    expect(baris).toHaveLength(7);
    expect(contoh(id).langkah.map((l) => [l.judul, l.teks])).toEqual(baris);
  });

  it('C4: langkah 1–3 dan 7 ditampilkan; 4–6 diisi siswa dengan kunci D-03', () => {
    const c = contoh('C4');
    expect(c.sebagian).toBe(true);
    expect(c.langkah.filter((l) => l.isian).map((l) => [l.no, l.isian.kunci])).toEqual([[4, 10000], [5, 'bagi_hb'], [6, 25]]);
    const t = bagianD03('C4');
    expect(t).toContain('| 4 | **Siswa mengisi:** Untung = 50.000 − 40.000 = … | Rp10.000 |');
    expect(t).toContain('| 6 | **Siswa mengisi:** 10.000/40.000 × 100% = … | 25% |');
    expect(c.langkah.find((l) => l.no === 4).isian.perintah).toBe('Untung = 50.000 − 40.000 = …');
    expect(c.langkah.find((l) => l.no === 6).isian.perintah).toBe('10.000/40.000 × 100% = …');
    expect(hitungTransaksi(c.hb, c.hj)).toMatchObject({ selisih: 10000, persen: 25 });
  });

  it('gambar berlabel harga sesuai D-03 §3', () => {
    const harap = { C1: ['baju', 100000, 120000], C2: ['sepeda', 600000, 450000], C3: ['jeruk', 150000, 18000], C4: ['payung', 40000, 50000] };
    for (const c of materi.contoh) expect([c.gambar.barang, c.gambar.hb, c.gambar.hj]).toEqual(harap[c.id]);
    expect([contoh('C3').gambar.ketHb, contoh('C3').gambar.ketHj]).toEqual(['(10 kg)', '/kg']);
  });

  it('angka di langkah 6 (pecahan) benar dan sesuai verifikasi D-03 §4', () => {
    const verif = Object.fromEntries(CONTOH_MATERI.map(([nama, hb, hj, , selisih, persen]) => [nama.split(' ')[0], { hb, hj, selisih, persen }]));
    for (const c of materi.contoh) {
      const l6 = c.langkah.find((l) => l.judul.startsWith('6'));
      const r = l6.hasil[0].rantai;
      const [p0] = r.filter((x) => typeof x === 'object');
      const akhir = r.at(-1).replace(/\*\*/g, '');
      const persen = Number(akhir.match(/= ([\d,]+)%$/)[1]);
      expect(p0.p / p0.q * 100).toBeCloseTo(persen, 6);
      expect([p0.p, persen]).toEqual([verif[c.id].selisih, verif[c.id].persen]);
      expect(p0.q).toBe(verif[c.id].hb); // pembagi = harga beli
      for (const f of r.filter((x) => typeof x === 'object')) expect(f.p / f.q).toBeCloseTo(p0.p / p0.q, 10);
    }
  });

  it('setiap contoh punya tujuan "berikut"', () => {
    expect(materi.contoh.map((c) => c.berikut.tautan)).toEqual(['/materi/M6', '/contoh/C3', '/simulasi', '/latihan']);
  });
});

describe('pembahasan.json sama persis dengan D-05', () => {
  it('templat D1–D5 = D-05 §3.3', () => {
    for (const kode of ['D1', 'D2', 'D3', 'D4', 'D5']) {
      const blok = D05.split(`**${kode} — `)[1].split('\n\n**')[0];
      const baris = [...blok.matchAll(/^\| [①②③] \w+ \| (.+) \|$/gm)].map((m) => m[1]);
      expect(pemb.templat[kode], kode).toEqual(baris);
    }
  });
  it('D6 ① sama dengan D-05; ② dan ③ merujuk Kartu Rumus dan petunjuk tingkat 3', () => {
    expect(D05).toContain(`| ① Bagian | ${pemb.templat.D6[0]} |`);
    expect(pemb.templat.D6.slice(1)).toEqual(['@kartuRumus', '@petunjuk3']);
  });
  it('petunjuk Level 2 = D-05 §2.2', () => {
    const blok = D05.split('### 2.2 Level 2')[1].split('###')[0];
    expect(pemb.petunjukLevel2).toEqual([...blok.matchAll(/^\| \d\. \w+ \| (.+) \|$/gm)].map((m) => m[1]));
  });
});

describe('isiTemplat (variabel D-05 §1)', () => {
  it('hasil sama dengan contoh D-05 §2.4 (L2-05, botol minum)', () => {
    const n = nilaiTemplat(25000, 35000);
    expect(isiTemplat(pemb.petunjukLevel2[0], n)).toBe('Harga beli Rp25.000. Harga jual Rp35.000. Bandingkan keduanya untuk tahu untung atau rugi.');
    expect(isiTemplat(pemb.petunjukLevel2[1], n)).toBe('**% Untung = Untung ÷ Harga Beli × 100%.** Ingat, pembaginya selalu harga beli.');
    expect(isiTemplat(pemb.petunjukLevel2[2], n)).toBe('Untungnya Rp10.000. Hitung Rp10.000 ÷ Rp25.000 dulu. Coret nol yang sama di atas dan di bawah.');
    expect(isiTemplat(pemb.petunjukLevel2[3], n)).toBe('Rp10.000 ÷ Rp25.000 = **2/5**. Sekarang kalikan 2/5 dengan 100%.');
  });
  it('variabel rugi dan ribuan', () => {
    const n = nilaiTemplat(600000, 450000);
    expect([n.jenis, n.Jenis, n.lebih, n.a, n.b, n.a_rb, n.b_rb, n.pecahan]).toEqual(['rugi', 'Rugi', 'lebih kecil', '600.000', '450.000', '600', '450', '1/4']);
  });
  it('variabel tak dikenal dibiarkan', () => {
    expect(isiTemplat('{tidakada} {HB}', nilaiTemplat(1000, 2000))).toBe('{tidakada} Rp1.000');
  });
});

describe('periksaIsianContoh (C4, langkah 4–6)', () => {
  const C4 = contoh('C4');
  const langkah = (no) => C4.langkah.find((l) => l.no === no);
  const periksa = (no, jawab) => periksaIsianContoh(C4, langkah(no), jawab, data);

  it('jawaban benar', () => {
    expect(periksa(4, 10000)).toEqual({ benar: true });
    expect(periksa(5, 'bagi_hb')).toEqual({ benar: true });
    expect(periksa(6, 25)).toEqual({ benar: true });
    expect(periksa(6, 25.004)).toEqual({ benar: true });
  });
  it('langkah 4 salah → D4', () => {
    expect(periksa(4, 9000)).toEqual({ benar: false, kode: 'D4', pembahasan: [
      'Besar untung belum tepat. Kamu menulis Rp9.000.',
      'Untung = HJ − HB. Rugi = HB − HJ. Yang besar dikurangi yang kecil.',
      'Hitung 50.000 − 40.000. Dalam ribuan: 50 − 40 = …',
    ] });
  });
  it('langkah 5: bagi HJ → D1; lainnya → D6 dengan Kartu Rumus dan petunjuk tingkat 3', () => {
    const d1 = periksa(5, 'bagi_hj');
    expect(d1.kode).toBe('D1');
    expect(d1.pembahasan[2]).toBe('Coba hitung Rp10.000 ÷ **Rp40.000** × 100%.');
    expect(periksa(5, 'kali_hb')).toEqual({ benar: false, kode: 'D6', pembahasan: [
      'Jawabanmu belum tepat di **Langkah 5**.',
      '% Untung = Untung ÷ **HB** × 100%',
      'Untungnya Rp10.000. Hitung Rp10.000 ÷ Rp40.000 dulu. Coret nol yang sama di atas dan di bawah.',
    ] });
  });
  it('langkah 6: D1 (20%), D2 (0,25), D6 (lainnya)', () => {
    const d1 = periksa(6, 20);
    expect([d1.kode, d1.pembahasan[0]]).toEqual(['D1', 'Kamu menulis 20%. Sepertinya kamu membagi dengan **harga jual** (Rp50.000).']);
    const d2 = periksa(6, 0.25);
    expect([d2.kode, d2.pembahasan[0], d2.pembahasan[2]]).toEqual(['D2', 'Kamu menulis 0,25. Itu baru hasil pembagian, belum persen.', 'Hitung 0,25 × 100% = …']);
    expect(periksa(6, 30).kode).toBe('D6');
  });
});
