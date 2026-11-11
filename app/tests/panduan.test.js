import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  LAYAR, pilihSoalSesi, levelTerbuka, periksaLayar, pembahasanLangkah, jawabanBenarLangkah,
  teksSoalLangsung, perintahHitungBalik, SYARAT_BUKA,
} from '../src/logika/panduan.js';

const baca = (p) => readFileSync(new URL(p, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const soalJson = JSON.parse(baca('../public/data/soal.json'));
const pemb = JSON.parse(baca('../public/data/pembahasan.json'));
const materi = JSON.parse(baca('../public/data/materi.json'));
const D05 = baca('../../docs/konten/D-05_petunjuk_pembahasan.md');
const data = { ...soalJson, ...pemb, kartuRumus: materi.kartuRumus };
const soal = (id) => soalJson.soal.find((s) => s.id === id);

/** Isian kunci untuk semua langkah satu soal. */
function isianKunci(s) {
  const tandai = Object.fromEntries((s.segmen ?? []).map((x, i) => [i, x.peran]).filter(([, p]) => p));
  return {
    tandai, hb: s.hb, hj: s.hj, jenis: s.kunci.jenis, alasan: s.kunci.jenis === 'untung' ? 0 : 1,
    besar: s.kunci.besar, rumus: 0, persen: s.kunci.persen, balik: s.level === 1 ? s.hj : s.kunci.besar,
  };
}
const periksa = (id, langkah, ubah) => periksaLayar(soal(id), langkah, { ...isianKunci(soal(id)), ...ubah }, data);
const bahas = (id, langkah, ubah) => {
  const isian = { ...isianKunci(soal(id)), ...ubah };
  return pembahasanLangkah(soal(id), periksaLayar(soal(id), langkah, isian, data), isian, data);
};

describe('layar panduan per level (design.md §8, D-04)', () => {
  it('Level 1 = langkah 2, 3, 4, 7; Level 2 = 2–7; Level 3 = Tandai → Hitung (3, 4, 6) → Periksa', () => {
    expect(LAYAR[1].flat()).toEqual([2, 3, 4, 7]);
    expect(LAYAR[2].flat()).toEqual([2, 3, 4, 5, 6, 7]);
    expect(LAYAR[3]).toEqual([[1], [3, 4, 6], [7]]);
  });
  it.each(soalJson.soal.filter((s) => s.level <= 3).map((s) => [s.id, s]))('%s: jawaban kunci lulus semua layar', (_, s) => {
    for (const layar of LAYAR[s.level]) expect(periksaLayar(s, layar, isianKunci(s), data)).toEqual({ benar: true });
  });
});

describe('sesi dan kunci level', () => {
  it('5 soal acak berbeda dari satu level', () => {
    const sesi = pilihSoalSesi(soalJson.soal, 2);
    expect(sesi).toHaveLength(5);
    expect(new Set(sesi.map((s) => s.id)).size).toBe(5);
    expect(sesi.every((s) => s.level === 2)).toBe(true);
  });
  it(`level berikutnya terbuka setelah ${SYARAT_BUKA} dari 5 benar, berurutan`, () => {
    expect(levelTerbuka({})).toEqual([1]);
    expect(levelTerbuka({ 1: 3 })).toEqual([1]);
    expect(levelTerbuka({ 1: 4 })).toEqual([1, 2]);
    expect(levelTerbuka({ 1: 5, 2: 4, 3: 4 })).toEqual([1, 2, 3, 4]);
    expect(levelTerbuka({ 1: 5, 3: 5 })).toEqual([1, 2]);
  });
});

describe('pembahasan per langkah (templat D-05 §3.3)', () => {
  it('langkah 1: D5 memakai kata kunci soal; D6 jika hanya Ditanya yang kurang', () => {
    expect(bahas('L3-02', [1], { tandai: { 1: 'HJ', 3: 'HB', 5: 'DITANYA' } })).toEqual([
      'Harga beli dan harga jual yang kamu tandai belum tepat.',
      'Harga saat **membeli** adalah harga beli. Harga saat **menjual** adalah harga jual.',
      'Cari kata kunci di soal. "membeli … seharga" menunjuk harga beli. "dijual" menunjuk harga jual.',
    ]);
    expect(bahas('L3-02', [1], { tandai: { 1: 'HB', 3: 'HJ' } })).toEqual(pemb.templatKhusus.D6_ditanya);
  });
  it('langkah 2 (HB/HJ tertukar) → D5', () => {
    expect(periksa('L2-01', [2], { hb: 50000, hj: 40000 }).kode).toBe('D5');
  });
  it('langkah 3: jenis salah → D3 dengan jenis pilihan siswa', () => {
    expect(bahas('L1-03', [3], { jenis: 'untung' })[0]).toBe('Kamu memilih **untung**. Coba bandingkan lagi kedua harga.');
    expect(periksa('L1-03', [3], { alasan: 0 }).kode).toBe('D3'); // jenis benar, alasan salah
  });
  it('langkah 4 → D4', () => {
    expect(bahas('L1-01', [4], { besar: 45000 })).toEqual([
      'Besar untung belum tepat. Kamu menulis Rp45.000.',
      'Untung = HJ − HB. Rugi = HB − HJ. Yang besar dikurangi yang kecil.',
      'Hitung 25.000 − 20.000. Dalam ribuan: 25 − 20 = …',
    ]);
  });
  it('langkah 5: ÷ HJ → D1; × HB ÷ 100 → D6 dengan Kartu Rumus jenis yang sesuai', () => {
    expect(periksa('L2-02', [5], { rumus: 1 }).kode).toBe('D1');
    expect(bahas('L2-02', [5], { rumus: 2 })).toEqual([
      'Jawabanmu belum tepat di **Langkah 5**.',
      '% Rugi = Rugi ÷ **HB** × 100%',
      'Ruginya Rp15.000. Hitung Rp15.000 ÷ Rp75.000 dulu. Coret nol yang sama di atas dan di bawah.',
    ]);
  });
  it('langkah 6: D1, D2, D6', () => {
    expect(bahas('L2-01', [6], { persen: 20 })[0]).toBe('Kamu menulis 20%. Sepertinya kamu membagi dengan **harga jual** (Rp50.000).');
    expect(bahas('L2-01', [6], { persen: 0.25 })[0]).toBe('Kamu menulis 0,25. Itu baru hasil pembagian, belum persen.');
    expect(periksa('L2-01', [6], { persen: 30 }).kode).toBe('D6');
  });
  it('langkah 7: Level 1 (HB ± selisih) dan Level 2–3 (persen × HB)', () => {
    expect(bahas('L1-01', [7], { balik: 26000 })[2]).toBe('Rp20.000 + Rp5.000 = …');
    expect(bahas('L1-03', [7], { balik: 25000 })[2]).toBe('Rp30.000 − Rp6.000 = …');
    expect(bahas('L2-02', [7], { balik: 1 }).slice(1)).toEqual(['20% dari harga beli harus sama dengan rugi.', '20% × Rp75.000 = …']);
  });
  it('Level 3 layar Hitung: kesalahan pertama yang menentukan', () => {
    expect(periksa('L3-03', [3, 4, 6], { besar: 1, persen: 25 })).toMatchObject({ kode: 'D4', langkah: 4 });
    expect(periksa('L3-03', [3, 4, 6], { persen: 25 })).toMatchObject({ kode: 'D1', langkah: 6 });
  });
});

describe('teks pendukung', () => {
  it('kalimat soal Level 1–2 dari templat D-04', () => {
    expect(teksSoalLangsung(soal('L1-01'), data)).toEqual([
      'Pedagang membeli **pisang 1 sisir** seharga **Rp20.000** dan menjualnya **Rp25.000**.',
      '1) Untung atau rugi? 2) Mengapa? 3) Berapa besarnya?',
    ]);
    expect(teksSoalLangsung(soal('L2-06'), data)[0]).toBe('Pedagang membeli **tas selempang** seharga **Rp200.000** dan menjualnya **Rp180.000**. Berapa persen keuntungan atau kerugiannya?');
  });
  it('perintah hitung balik', () => {
    expect(perintahHitungBalik(soal('L1-05'))).toBe('Hitung balik: 60.000 − 6.000 = …');
    expect(perintahHitungBalik(soal('L3-01'))).toBe('Hitung balik: 25% × 48.000 = …');
  });
  it('jawaban benar setelah salah kedua', () => {
    expect(jawabanBenarLangkah(soal('L2-01'), 6)).toBe('10.000 ÷ 40.000 × 100% = 1/4 × 100% = 25%');
    expect(jawabanBenarLangkah(soal('L1-06'), 7)).toBe('18.000 − 3.000 = 15.000 ✓');
    expect(jawabanBenarLangkah(soal('L2-04'), 4)).toBe('Rugi = 120.000 − 90.000 = Rp30.000');
  });
});

describe('pembahasan.json: templat tambahan sama dengan D-05', () => {
  it('petunjuk Level 1 = D-05 §2.1 dan Level 3 = D-05 §2.3', () => {
    const tabel = (judul) => [...D05.split(judul)[1].split('###')[0].matchAll(/^\| \d\. \w+ \| (.+) \|$/gm)].map((m) => m[1]);
    expect(pemb.petunjukLevel1).toEqual(tabel('### 2.1 Level 1'));
    expect(pemb.petunjukLevel3).toEqual(tabel('### 2.3 Level 3'));
  });
  it('D6 Ditanya dan Langkah 7 sesuai D-05 §3.3', () => {
    for (const t of pemb.templatKhusus.D6_ditanya) expect(D05).toContain(`| ${t} |`);
    expect(D05).toContain('| ① Bagian | Hitung balikmu belum cocok. |');
    expect(D05).toContain('Level 1: harga beli ditambah untung (atau dikurangi rugi) harus sama dengan harga jual.');
    expect(D05).toContain('Level 2–3: {persen} dari harga beli harus sama dengan {jenis}.');
    expect(D05).toContain('Level 1: {HB} + {selisih} = … (untung) atau {HB} − {selisih} = … (rugi). Level 2–3: {persen} × {HB} = …');
    expect(D05).toContain('*"Harga beli dan harga jual yang kamu tandai belum tepat."*');
  });
});
