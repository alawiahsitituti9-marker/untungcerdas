import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  nilaiTahap, nilaiSoal, nilaiLatihan, jawabanKunci, validasiKonten, pesanSkor, pilihSaran,
  SKOR_MAKS_TOTAL, JUMLAH_TAHAP,
} from '../src/logika/penilaianLiterasi.js';
import { besarSelisih, persenSelisih } from '../src/logika/hitung.js';

// Dokumen di Windows bisa memakai CRLF; disamakan menjadi LF agar perbandingan teks persis.
const baca = (p) => readFileSync(new URL(p, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const konten = JSON.parse(baca('../public/data/literasi.json'));
const PRD = baca('../../docs/PRD.md');
const LM03 = baca('../../docs/konten/LM-03_bantuan_pembahasan.md');

const soal = (id) => konten.soal.find((s) => s.id === id);
const tahap = (id, no) => soal(id).tahap.find((t) => t.no === no);
const idxPilihan = (id, no, bagian, teks) => tahap(id, no).bagian.find((b) => b.id === bagian).pilihan.findIndex((p) => p.teks === teks);
const kunciSemua = () => Object.fromEntries(konten.soal.map((s) => [s.id, jawabanKunci(s)]));
/** Jawaban kunci satu soal dengan beberapa isian diganti. */
function denganUbah(id, ubah) {
  const j = structuredClone(jawabanKunci(soal(id)));
  for (const [no, isian] of Object.entries(ubah)) Object.assign(j[no].isian, isian);
  return j;
}

// ---------------------------------------------------------------------------
describe('literasi.json: struktur', () => {
  it('lolos validasiKonten', () => {
    expect(validasiKonten(konten)).toEqual([]);
  });
  it('4 indikator dengan nama lengkap dan urutan tetap [Spesifikasi]', () => {
    expect(konten.indikator.map((i) => i.nama)).toEqual([
      'Mathematical Reasoning',
      'Formulating Situations Mathematically',
      'Employing Mathematical Concepts, Facts, and Procedures',
      'Interpreting, Applying, and Evaluating Mathematical Outcomes',
    ]);
    expect(konten.indikator.map((i) => i.soal)).toEqual(['ML-1', 'ML-2', 'ML-3', 'ML-4']);
  });
  it('23 tahap; bobot ML-1 = 1,1,2,1,1; ML-2..4 = 6 × 1; total 24 [Spesifikasi]', () => {
    expect(konten.soal.flatMap((s) => s.tahap)).toHaveLength(JUMLAH_TAHAP);
    expect(soal('ML-1').tahap.map((t) => t.bobot)).toEqual([1, 1, 2, 1, 1]);
    for (const id of ['ML-2', 'ML-3', 'ML-4']) expect(soal(id).tahap.map((t) => t.bobot)).toEqual([1, 1, 1, 1, 1, 1]);
  });
  it('urutan pengerjaan sesuai KL-03: Soal 3 → 4 → 2 → 1', () => {
    expect(konten.urutan).toEqual(['ML-3', 'ML-4', 'ML-2', 'ML-1']);
  });
  it('validasiKonten menangkap kerusakan data', () => {
    const rusak = structuredClone(konten);
    rusak.soal[0].tahap[2].bobot = 1;
    rusak.soal[1].tahap[0].bantuan = ['satu saja'];
    rusak.soal[2].tahap[3].bagian[0].pilihan.forEach((p) => { p.benar = true; });
    const m = validasiKonten(rusak);
    expect(m.some((x) => x.includes('ML-1: jumlah bobot 5'))).toBe(true);
    expect(m.some((x) => x.includes('ML-2: tahap 1: harus ada 2 bantuan'))).toBe(true);
    expect(m.some((x) => x.includes('ML-3: tahap 4: rumus: harus tepat satu pilihan benar'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
describe('literasi.json sama persis dengan PRD §8.4 [Spesifikasi]', () => {
  const bagianPRD = PRD.split('### 8.4')[1].split('### 8.5')[0];
  const blok = bagianPRD.split(/\*\*Soal \d – .+?\*\*/).slice(1);

  it.each(konten.soal.map((s) => [s.id, s]))('%s: teks soal, pertanyaan, dan kunci', (_, s) => {
    const b = blok[s.nomor - 1];
    const kutipan = b.split('\n').filter((l) => l.startsWith('> ') ).map((l) => l.slice(2));
    expect(s.segmen.map((x) => x.teks).join('')).toBe(kutipan[0]);
    expect(s.pertanyaan).toBe(kutipan[1]);
    const kunci = b.split('Kunci jawaban:')[1].split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2));
    expect(s.kunci_teks).toEqual(kunci);
    // Baris penyelesaian [Spesifikasi] juga harus ada di kunci PRD.
    for (const p of s.penyelesaian.filter((x) => x.asal === 'spesifikasi')) expect(kunci).toContain(p.teks);
  });

  it('nilai pada segmen sama dengan angka di teksnya', () => {
    for (const s of konten.soal) {
      for (const x of s.segmen.filter((y) => y.nilai != null)) {
        expect(Number(x.teks.replace(/Rp|\.|%/g, ''))).toBe(x.nilai);
      }
    }
  });
});

// ---------------------------------------------------------------------------
describe('literasi.json sama persis dengan LM-03 v1.0', () => {
  const NAMA = {
    'Bantuan 1': 'b1', 'Bantuan 2': 'b2', 'Jika sudah benar': 'benar', 'Letak kesalahan (umum)': 'kesalahanUmum',
    Konsep: 'konsep', 'Cara memperbaiki': 'cara', 'Hasil yang benar': 'hasil',
  };
  const bersih = (t) => t
    .replace(/\*\((.+?)\)\*/g, '')          // catatan miring, mis. rujukan ke §6
    .replace(/\*\*\[(Spesifikasi|Usulan)\]\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const doc = {};
  for (const [, id, no, isi] of LM03.matchAll(/^#### (ML-\d) · Tahap (\d) — .+\n((?:- .+\n)+)/gm)) {
    doc[`${id}/${no}`] = Object.fromEntries(
      [...isi.matchAll(/^- \*\*(.+?):\*\* (.+)$/gm)].map(([, k, v]) => [NAMA[k], bersih(v)]),
    );
  }
  const semua = konten.soal.flatMap((s) => s.tahap.map((t) => [`${s.id}/${t.no}`, t]));

  it('dokumen LM-03 memuat 23 tahap', () => {
    expect(Object.keys(doc)).toHaveLength(23);
  });
  it.each(semua)('%s: bantuan dan pembahasan', (kunci, t) => {
    const d = doc[kunci];
    expect(t.bantuan).toEqual([d.b1, d.b2]);
    expect(t.pembahasan).toEqual({ benar: d.benar, kesalahanUmum: d.kesalahanUmum, konsep: d.konsep, cara: d.cara, hasil: d.hasil });
  });
  it('pengantar indikator', () => {
    const pengantar = [...LM03.matchAll(/\*\*Pengantar indikator:\*\* (.+)/g)].map((x) => x[1]);
    expect(konten.soal.map((s) => s.pengantar)).toEqual(pengantar);
  });
  it.each(konten.soal.map((s) => [s.id, s]))('%s: penyelesaian lengkap', (id, s) => {
    const tabel = LM03.split(`Penyelesaian lengkap ${id}`)[1].split('\n---')[0];
    const baris = [...tabel.matchAll(/^\| \d \| (.+?) \| \[(Spesifikasi|Usulan)\].*\|$/gm)]
      .map(([, teks, asal]) => ({ teks, asal: asal.toLowerCase() }));
    expect(s.penyelesaian).toEqual(baris);
  });
  it('keputusan 12 November 2026: ML-2 tahap 5 Bantuan 2 tetap teks KL-02; "modal toko" dipakai', () => {
    expect(tahap('ML-2', 5).bantuan[1]).toBe('Untung = HJ − HB. Jadi HJ = HB + untung.');
    expect(tahap('ML-1', 3).bantuan[1]).toContain('modal toko');
  });
});

// ---------------------------------------------------------------------------
describe('kunci sesuai rumus resmi (pembagi harga beli)', () => {
  const nilaiSeg = (id, kel, peran) => soal(id).segmen.find((x) => x.kelompok === kel && x.peran === peran).nilai;
  it('ML-1: keuntungan dan persen setiap toko', () => {
    for (const [toko, u, p] of [['A', 'uA', 'pA'], ['B', 'uB', 'pB'], ['C', 'uC', 'pC']]) {
      const hb = nilaiSeg('ML-1', `Toko ${toko}`, 'HB');
      const hj = nilaiSeg('ML-1', `Toko ${toko}`, 'HJ');
      expect(tahap('ML-1', 2).bagian.find((b) => b.id === u).kunci).toBe(besarSelisih(hb, hj));
      expect(tahap('ML-1', 3).bagian.find((b) => b.id === p).kunci).toBe(persenSelisih(hb, hj));
    }
  });
  it('ML-2: keuntungan 20% × HB dan HJ = HB + keuntungan', () => {
    expect(tahap('ML-2', 4).bagian[0].kunci).toBe(0.2 * 250000);
    expect(tahap('ML-2', 6).bagian[0].kunci).toBe(250000 + 50000);
    expect(persenSelisih(250000, 300000)).toBe(20);
  });
  it('ML-3 dan ML-4', () => {
    expect(tahap('ML-3', 2).bagian[0].kunci).toBe(besarSelisih(800000, 920000));
    expect(tahap('ML-3', 3).bagian[0].kunci).toBe(besarSelisih(500000, 425000));
    expect(tahap('ML-3', 5).bagian[0].kunci).toBe(persenSelisih(800000, 920000));
    expect(tahap('ML-3', 6).bagian[0].kunci).toBe(persenSelisih(500000, 425000));
    expect(tahap('ML-4', 2).bagian[0].kunci).toBe(besarSelisih(400000, 340000));
    expect(tahap('ML-4', 4).bagian[0].kunci).toBe(persenSelisih(400000, 340000));
  });
  it('setiap pembagi konsekuen persen adalah harga beli', () => {
    const hbSemua = konten.soal.flatMap((s) => s.segmen.filter((x) => x.peran === 'HB').map((x) => x.nilai));
    const pembagi = konten.soal.flatMap((s) => s.tahap.flatMap((t) => t.bagian.map((b) => b.konsekuen?.pembagi).filter(Boolean)));
    expect(pembagi.length).toBe(6);
    for (const p of pembagi) expect(hbSemua).toContain(p);
  });
});

// ---------------------------------------------------------------------------
describe('nilaiLatihan: skor total', () => {
  it('kunci lengkap → 6 per indikator, total 24', () => {
    const h = nilaiLatihan(konten, kunciSemua());
    expect(h.indikator.map((i) => i.skor)).toEqual([6, 6, 6, 6]);
    expect(h.total).toBe(SKOR_MAKS_TOTAL);
    expect(h.totalMaks).toBe(24);
    expect(h.saran.map((s) => s.id)).toEqual(['LEVEL4']);
    expect(h.indikator.every((i) => i.pesan === 'Semua tahap sudah tepat.')).toBe(true);
    expect(h.soal.flatMap((s) => s.tahap).every((t) => t.benar && !t.konsekuen && t.kode === null)).toBe(true);
  });
  it('jawaban kosong → 0 (U5)', () => {
    const h = nilaiLatihan(konten, {});
    expect(h.total).toBe(0);
    expect(h.indikator.map((i) => i.skor)).toEqual([0, 0, 0, 0]);
    expect(h.indikator[0].pesan).toBe('Ayo ulangi materinya dulu, lalu coba lagi.');
  });
  it('skor indikator n = skor soal n', () => {
    const j = kunciSemua();
    j['ML-2'] = denganUbah('ML-2', { 4: { untung: 1 }, 6: { hj: 1 } }); // dua tahap salah
    const h = nilaiLatihan(konten, j);
    expect(h.indikator.map((i) => i.skor)).toEqual([6, 4, 6, 6]);
    expect(h.total).toBe(22);
    expect(h.indikator[1].pesan).toBe('Hampir semua tepat. Lihat tahap yang perlu diperbaiki.');
  });
  it('bantuan dicatat tetapi tidak mengurangi skor (KL-06), maksimal 2 per tahap', () => {
    const j = kunciSemua();
    j['ML-3'][2].bantuan = 2;
    j['ML-4'][4].bantuan = 1;
    j['ML-1'][1].bantuan = 9;
    const h = nilaiLatihan(konten, j);
    expect(h.total).toBe(24);
    expect(h.bantuan).toBe(5);
  });
});

// ---------------------------------------------------------------------------
describe('ML-1 Mathematical Reasoning', () => {
  const S = soal('ML-1');
  it('tahap 1: label tertukar → 0, kode IDENTIFIKASI', () => {
    const r = nilaiTahap(S, tahap('ML-1', 1), denganUbah('ML-1', { 1: { tandai: { 1: 'HJ', 3: 'HB', 5: 'HB', 7: 'HJ', 9: 'HB', 11: 'HJ' } } }));
    expect([r.skor, r.kode, r.umpan, r.saran]).toEqual([0, 'IDENTIFIKASI', null, 'M1']);
  });
  it('tahap 1: label pada teks yang bukan harga → 0', () => {
    const j = denganUbah('ML-1', {});
    j[1].isian.tandai = { ...j[1].isian.tandai, 0: 'HB' };
    expect(nilaiTahap(S, tahap('ML-1', 1), j).skor).toBe(0);
  });
  it('tahap 3 bernilai 0, 1, atau 2 (U2)', () => {
    const rumusHJ = idxPilihan('ML-1', 3, 'rumus', 'Untung ÷ harga jual × 100%');
    const t3 = tahap('ML-1', 3);
    expect(nilaiTahap(S, t3, denganUbah('ML-1', {})).skor).toBe(2);
    const r1 = nilaiTahap(S, t3, denganUbah('ML-1', { 3: { pC: 30 } }));
    expect([r1.skor, r1.poin]).toEqual([1, [true, false]]);
    const r2 = nilaiTahap(S, t3, denganUbah('ML-1', { 3: { rumus: rumusHJ } }));
    expect([r2.skor, r2.poin, r2.kode]).toEqual([1, [false, true], 'D1']);
    const r0 = nilaiTahap(S, t3, denganUbah('ML-1', { 3: { rumus: rumusHJ, pA: 20, pB: 20, pC: 16.67 } }));
    expect([r0.skor, r0.kode]).toEqual([0, 'D1']);
  });
  it('tahap 3: pola D1 dan D2 dikenali dari isian persen', () => {
    const d1 = nilaiTahap(S, tahap('ML-1', 3), denganUbah('ML-1', { 3: { pA: 20, pB: 20, pC: 16.67 } }));
    expect([d1.skor, d1.kode]).toEqual([1, 'D1']);
    expect(d1.umpan).toContain('membagi dengan harga jual');
    const d2 = nilaiTahap(S, tahap('ML-1', 3), denganUbah('ML-1', { 3: { pA: 0.25, pB: 0.25, pC: 0.2 } }));
    expect([d2.kode, d2.umpan]).toEqual(['D2', 'Kamu lupa mengalikan dengan 100%.']);
  });
  it('tahap 3 konsekuen: keuntungan salah di tahap 2, persen benar dari angka itu (U4)', () => {
    const j = denganUbah('ML-1', { 2: { uC: 40000 }, 3: { pC: 25 } }); // 40.000 ÷ 160.000 × 100% = 25
    expect(nilaiTahap(S, tahap('ML-1', 2), j).skor).toBe(0);
    const r = nilaiTahap(S, tahap('ML-1', 3), j);
    expect([r.skor, r.konsekuen, r.tahapAsalKonsekuen]).toEqual([2, true, 2]);
    expect(nilaiSoal(S, j).skor).toBe(5);
  });
  it('tahap 4: keputusan benar konsekuen dengan persen siswa sendiri (U4)', () => {
    const tokoA = idxPilihan('ML-1', 4, 'toko', 'Toko A');
    const j = denganUbah('ML-1', { 3: { pA: 25, pB: 24, pC: 20 }, 4: { toko: tokoA } });
    const r = nilaiTahap(S, tahap('ML-1', 4), j);
    expect([r.skor, r.konsekuen]).toEqual([1, true]);
    // Persen siswa benar, tetapi memilih Toko B → salah, dengan umpan khusus.
    const tokoB = idxPilihan('ML-1', 4, 'toko', 'Toko B');
    const r2 = nilaiTahap(S, tahap('ML-1', 4), denganUbah('ML-1', { 4: { toko: tokoB } }));
    expect([r2.skor, r2.kode]).toEqual([0, 'KEPUTUSAN']);
    expect(r2.umpan).toContain('dalam rupiah');
  });
  it('tahap 5: setiap alasan salah punya kode dan saran', () => {
    const t5 = tahap('ML-1', 5);
    const harap = { 'ALASAN-RUPIAH': 'M5K5', 'ALASAN-HJ': 'M5K5', D1: 'M5K5' };
    t5.bagian[0].pilihan.forEach((p, i) => {
      const r = nilaiTahap(S, t5, denganUbah('ML-1', { 5: { alasan: i } }));
      if (p.benar) expect(r.skor).toBe(1);
      else expect([r.skor, r.kode, r.umpan, r.saran]).toEqual([0, p.kode, p.umpan, harap[p.kode]]);
    });
  });
});

// ---------------------------------------------------------------------------
describe('ML-2 Formulating Situations Mathematically', () => {
  const S = soal('ML-2');
  it('tahap 1: HB dan PERSEN wajib benar', () => {
    expect(nilaiTahap(S, tahap('ML-2', 1), denganUbah('ML-2', { 1: { tandai: { 1: 'HB' } } })).skor).toBe(0);
    expect(nilaiTahap(S, tahap('ML-2', 1), denganUbah('ML-2', { 1: { tandai: { 1: 'PERSEN', 3: 'HB' } } })).skor).toBe(0);
    expect(nilaiTahap(S, tahap('ML-2', 1), denganUbah('ML-2', {})).skor).toBe(1);
  });
  it('tahap 3: setiap model salah punya kode', () => {
    const t3 = tahap('ML-2', 3);
    const kode = t3.bagian[0].pilihan.map((_, i) => nilaiTahap(S, t3, denganUbah('ML-2', { 3: { model: i } })).kode);
    expect(kode).toEqual([null, 'D1', 'D2', 'M-SALAH']);
  });
  it('tahap 4 TIDAK konsekuen terhadap model yang salah di tahap 3 (keputusan A)', () => {
    const kali20 = idxPilihan('ML-2', 3, 'model', 'Keuntungan = 20 × harga beli');
    const r = nilaiTahap(S, tahap('ML-2', 4), denganUbah('ML-2', { 3: { model: kali20 }, 4: { untung: 5000000 } }));
    expect([r.skor, r.konsekuen, r.kode]).toEqual([0, false, 'D2']);
    const bagi = idxPilihan('ML-2', 3, 'model', 'Keuntungan = harga beli ÷ 20%');
    expect(nilaiTahap(S, tahap('ML-2', 4), denganUbah('ML-2', { 3: { model: bagi }, 4: { untung: 1250000 } })).skor).toBe(0);
    expect(tahap('ML-2', 4).bagian[0].konsekuen).toBeUndefined();
  });
  it('tahap 4: model benar tetapi aritmetika salah → 0 (rubrik biasa)', () => {
    const r = nilaiTahap(S, tahap('ML-2', 4), denganUbah('ML-2', { 4: { untung: 60000 } }));
    expect([r.skor, r.kode]).toEqual([0, 'HITUNG']);
  });
  it('tahap 6: 250.000 + keuntungan siswa (konsekuen); D3 dan M-SALAH dikenali', () => {
    const k = nilaiTahap(S, tahap('ML-2', 6), denganUbah('ML-2', { 4: { untung: 60000 }, 6: { hj: 310000 } }));
    expect([k.skor, k.konsekuen]).toEqual([1, true]);
    const d3 = nilaiTahap(S, tahap('ML-2', 6), denganUbah('ML-2', { 6: { hj: 200000 } }));
    expect([d3.skor, d3.kode]).toEqual([0, 'D3']);
    const m = nilaiTahap(S, tahap('ML-2', 6), denganUbah('ML-2', { 6: { hj: 50000 } }));
    expect([m.skor, m.kode, m.saran]).toEqual([0, 'M-SALAH', 'RUMUS']);
  });
  it('model harga jual (tahap 5) tidak dinilai konsekuen', () => {
    const kurang = idxPilihan('ML-2', 5, 'model', 'Harga jual = harga beli − keuntungan');
    const r = nilaiTahap(S, tahap('ML-2', 5), denganUbah('ML-2', { 5: { model: kurang } }));
    expect([r.skor, r.kode]).toEqual([0, 'D3']);
  });
});

// ---------------------------------------------------------------------------
describe('ML-3 Employing Mathematical Concepts, Facts, and Procedures', () => {
  const S = soal('ML-3');
  it('tahap 1: kedua jenis harus benar', () => {
    const untung = idxPilihan('ML-3', 1, 'kipas', '▲ Untung');
    const r = nilaiTahap(S, tahap('ML-3', 1), denganUbah('ML-3', { 1: { kipas: untung } }));
    expect([r.skor, r.kode, r.saran]).toEqual([0, 'D3', 'M2']);
    expect(r.umpan).toContain('Kipas');
    // Sepeda salah: tanpa umpan khusus → pakai kesalahanUmum.
    const rugi = idxPilihan('ML-3', 1, 'sepeda', '▼ Rugi');
    const r2 = nilaiTahap(S, tahap('ML-3', 1), denganUbah('ML-3', { 1: { sepeda: rugi } }));
    expect([r2.kode, r2.umpan]).toEqual(['D3', null]);
  });
  it('tahap 3: selisih salah memakai umpan umum D4', () => {
    const r = nilaiTahap(S, tahap('ML-3', 3), denganUbah('ML-3', { 3: { rugi: 925000 } }));
    expect([r.skor, r.kode, r.umpan, r.saran]).toEqual([0, 'D4', 'Rugi = HB − HJ = 500.000 − 425.000.', 'SELISIH']);
  });
  it('tahap 5–6: D1 (dibagi harga jual) dan D2 (lupa ×100)', () => {
    expect(nilaiTahap(S, tahap('ML-3', 5), denganUbah('ML-3', { 5: { persen: 13.04 } })).kode).toBe('D1');
    expect(nilaiTahap(S, tahap('ML-3', 6), denganUbah('ML-3', { 6: { persen: 17.65 } })).kode).toBe('D1');
    expect(nilaiTahap(S, tahap('ML-3', 6), denganUbah('ML-3', { 6: { persen: 0.15 } })).kode).toBe('D2');
    expect(nilaiTahap(S, tahap('ML-3', 6), denganUbah('ML-3', { 6: { persen: 17.65 } })).saran).toBe('M6');
  });
  it('tahap 5–6 konsekuen dengan tahap 2–3', () => {
    const j = denganUbah('ML-3', { 2: { untung: 160000 }, 5: { persen: 20 }, 3: { rugi: 50000 }, 6: { persen: 10 } });
    const h = nilaiSoal(S, j);
    expect(h.tahap.map((t) => t.skor)).toEqual([1, 0, 0, 1, 1, 1]);
    expect(h.tahap.map((t) => t.konsekuen)).toEqual([false, false, false, false, true, true]);
    expect(h.skor).toBe(4);
  });
  it('persen benar dengan toleransi ±0,01 (U3)', () => {
    expect(nilaiTahap(S, tahap('ML-3', 5), denganUbah('ML-3', { 5: { persen: 15.01 } })).skor).toBe(1);
    expect(nilaiTahap(S, tahap('ML-3', 5), denganUbah('ML-3', { 5: { persen: 15.02 } })).skor).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe('ML-4 Interpreting, Applying, and Evaluating Mathematical Outcomes', () => {
  const S = soal('ML-4');
  const t1 = () => tahap('ML-4', 1);
  it('tahap 1: Rp340.000 kedua boleh diberi HJ atau dibiarkan', () => {
    expect(nilaiTahap(S, t1(), denganUbah('ML-4', { 1: { tandai: { 1: 'HB', 3: 'HJ', 9: 'HJ' } } })).skor).toBe(1);
    expect(nilaiTahap(S, t1(), denganUbah('ML-4', { 1: { tandai: { 1: 'HB', 3: 'HJ' } } })).skor).toBe(1);
  });
  it('tahap 1: Rp60.000 atau 17,65% diberi label → 0', () => {
    expect(nilaiTahap(S, t1(), denganUbah('ML-4', { 1: { tandai: { 1: 'HB', 3: 'HJ', 7: 'HB' } } })).skor).toBe(0);
    expect(nilaiTahap(S, t1(), denganUbah('ML-4', { 1: { tandai: { 1: 'HB', 3: 'HJ', 9: 'HB' } } })).skor).toBe(0);
    expect(nilaiTahap(S, t1(), denganUbah('ML-4', { 1: { tandai: { 1: 'HB', 3: 'HJ', 5: 'HJ' } } })).skor).toBe(0);
  });
  it('tahap 4: cara teman Dina (17,65) dikenali sebagai D1', () => {
    const r = nilaiTahap(S, tahap('ML-4', 4), denganUbah('ML-4', { 4: { persen: 17.65 } }));
    expect([r.skor, r.kode, r.umpan]).toEqual([0, 'D1', 'Kamu memakai cara teman Dina. Bagi dengan 400.000.']);
  });
  it('tahap 4 konsekuen; tahap 5 (evaluasi) tidak konsekuen', () => {
    const benar = idxPilihan('ML-4', 5, 'nilai', 'Benar');
    const j = denganUbah('ML-4', { 2: { rugi: 80000 }, 4: { persen: 20 }, 5: { nilai: benar } });
    const h = nilaiSoal(S, j);
    expect(h.tahap.map((t) => t.skor)).toEqual([1, 0, 1, 1, 0, 1]);
    expect(h.tahap[3].konsekuen).toBe(true);
  });
  it('tahap 6 (alasan): D1 dan ALASAN-* disarankan M5 kartu 5 (keputusan B)', () => {
    const t6 = tahap('ML-4', 6);
    const saran = t6.bagian[0].pilihan.map((_, i) => nilaiTahap(S, t6, denganUbah('ML-4', { 6: { alasan: i } })).saran);
    expect(saran).toEqual([null, 'M5K5', 'M5K5', 'M5K5']);
  });
});

// ---------------------------------------------------------------------------
describe('saran dan pesan', () => {
  it('pesanSkor mengikuti rentang D-08 §8', () => {
    expect([6, 5, 4, 3, 2, 1, 0].map((s) => pesanSkor(konten, s))).toEqual([
      'Semua tahap sudah tepat.',
      'Hampir semua tepat. Lihat tahap yang perlu diperbaiki.',
      'Hampir semua tepat. Lihat tahap yang perlu diperbaiki.',
      'Sebagian sudah tepat. Pelajari pembahasannya pelan-pelan.',
      'Sebagian sudah tepat. Pelajari pembahasannya pelan-pelan.',
      'Ayo ulangi materinya dulu, lalu coba lagi.',
      'Ayo ulangi materinya dulu, lalu coba lagi.',
    ]);
  });
  it('paling banyak 3 saran, diurutkan menurut banyaknya tahap', () => {
    const j = kunciSemua();
    j['ML-2'] = denganUbah('ML-2', { 3: { model: 1 }, 4: { untung: 1 }, 6: { hj: 1 } }); // 3 × RUMUS
    j['ML-3'] = denganUbah('ML-3', { 6: { persen: 17.65 } });                            // 1 × M6
    j['ML-4'] = denganUbah('ML-4', { 3: { rumus: 1 }, 4: { persen: 17.65 } });           // 2 × M6
    j['ML-1'] = denganUbah('ML-1', { 1: { tandai: {} } });                                // 1 × M1
    const ids = nilaiLatihan(konten, j).saran.map((s) => s.id);
    expect(ids).toEqual(['M6', 'RUMUS', 'M1']);
  });
  it('setiap saran punya teks dan tautan', () => {
    const h = pilihSaran(konten, nilaiLatihan(konten, {}).soal);
    expect(h).toHaveLength(3);
    for (const s of h) expect(s.teks && s.tautan).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
describe('jawaban kosong → kode KOSONG (perbaikan 12 November 2026)', () => {
  it('tidak ada tahap kosong yang diberi kode kesalahan konsep', () => {
    const semua = nilaiLatihan(konten, {}).soal.flatMap((s) => s.tahap);
    expect(semua).toHaveLength(23);
    for (const t of semua) expect(t.kode, `tahap ${t.no}`).toBe('KOSONG');
  });
  it('ML-3 tahap 1 dan ML-4 tahap 5 kosong tidak lagi menjadi D3/D1', () => {
    expect(nilaiTahap(soal('ML-3'), tahap('ML-3', 1), {}).kode).toBe('KOSONG');
    expect(nilaiTahap(soal('ML-4'), tahap('ML-4', 5), {}).kode).toBe('KOSONG');
  });
  it('sebagian kosong: pilihan salah yang dijawab tetap terdiagnosis; jika tidak ada → KOSONG', () => {
    const S = soal('ML-1');
    const rumusHJ = idxPilihan('ML-1', 3, 'rumus', 'Untung ÷ harga jual × 100%');
    const j1 = denganUbah('ML-1', { 3: { rumus: rumusHJ, pA: undefined } });
    expect(nilaiTahap(S, tahap('ML-1', 3), j1).kode).toBe('D1');
    const j2 = denganUbah('ML-1', { 3: { rumus: undefined } });
    const r2 = nilaiTahap(S, tahap('ML-1', 3), j2);
    expect([r2.skor, r2.kode]).toEqual([1, 'KOSONG']);
  });
  it('tahap tandai tanpa label → KOSONG; label salah → IDENTIFIKASI', () => {
    expect(nilaiTahap(soal('ML-4'), tahap('ML-4', 1), denganUbah('ML-4', { 1: { tandai: {} } })).kode).toBe('KOSONG');
    expect(nilaiTahap(soal('ML-4'), tahap('ML-4', 1), denganUbah('ML-4', { 1: { tandai: { 1: 'HJ', 3: 'HB' } } })).kode).toBe('IDENTIFIKASI');
  });
  it('KOSONG memakai saran topik tahap', () => {
    expect(nilaiTahap(soal('ML-3'), tahap('ML-3', 6), {}).saran).toBe('M6');
  });
});

// ---------------------------------------------------------------------------
describe('pemetaan saran materi (keputusan B, C, D)', () => {
  const saranDari = (id, no, isian) => nilaiTahap(soal(id), tahap(id, no), denganUbah(id, { [no]: isian })).saran;
  it('D2 → M5 di mana pun, kecuali baris khusus ML-2 tahap 3–6', () => {
    expect(saranDari('ML-1', 3, { pA: 0.25, pB: 0.25, pC: 0.2 })).toBe('M5');
    expect(saranDari('ML-3', 4, { rumus: 2 })).toBe('M5');
    expect(saranDari('ML-3', 5, { persen: 0.15 })).toBe('M5');
    expect(saranDari('ML-3', 6, { persen: 0.15 })).toBe('M5');
    expect(saranDari('ML-4', 3, { rumus: 2 })).toBe('M5');
    expect(saranDari('ML-2', 3, { model: 2 })).toBe('RUMUS');
    expect(saranDari('ML-2', 4, { untung: 5000000 })).toBe('RUMUS');
  });
  it('D1 pada soal rugi → M6; D1 pada tahap alasan → M5K5', () => {
    expect(saranDari('ML-3', 6, { persen: 17.65 })).toBe('M6');
    expect(saranDari('ML-4', 3, { rumus: 1 })).toBe('M6');
    expect(saranDari('ML-4', 4, { persen: 17.65 })).toBe('M6');
    expect(saranDari('ML-4', 5, { nilai: 0 })).toBe('M6');
    expect(saranDari('ML-1', 5, { alasan: 3 })).toBe('M5K5');
    expect(saranDari('ML-4', 6, { alasan: 1 })).toBe('M5K5');
  });
  it('baris khusus ML-2 tahap 3–6 → RUMUS untuk semua kode', () => {
    expect(saranDari('ML-2', 3, { model: 1 })).toBe('RUMUS');
    expect(saranDari('ML-2', 5, { model: 1 })).toBe('RUMUS');
    expect(saranDari('ML-2', 6, { hj: 200000 })).toBe('RUMUS');
  });
  it('KEPUTUSAN (ML-1 tahap 4) → M5', () => {
    expect(saranDari('ML-1', 4, { toko: 1 })).toBe('M5');
  });
  it('M3/M4 digabung: teks persis D-08 §7, tautan M3, satu slot', () => {
    expect(konten.saran.SELISIH).toEqual({ teks: 'Ulangi: Menghitung Untung / Menghitung Rugi', tautan: '/materi/M3' });
    expect(konten.saran.M3).toBeUndefined();
    expect(konten.saran.M4).toBeUndefined();
    const j = kunciSemua();
    j['ML-1'] = denganUbah('ML-1', { 2: { uA: 1 } });
    j['ML-3'] = denganUbah('ML-3', { 2: { untung: 1 }, 3: { rugi: 1 } });
    j['ML-4'] = denganUbah('ML-4', { 2: { rugi: 1 } });
    const saran = nilaiLatihan(konten, j).saran;
    expect(saran.filter((x) => x.id === 'SELISIH')).toHaveLength(1);
  });
  it('dari M3 siswa bisa lanjut ke M4 (urutan materi.json)', () => {
    const ids = JSON.parse(baca('../public/data/materi.json')).materi.map((m) => m.id);
    expect(ids.indexOf('M4')).toBe(ids.indexOf('M3') + 1);
  });
});

// ---------------------------------------------------------------------------
describe('simulasi salah konsep: konsekuen tidak memberi skor konsep', () => {
  const skor = (id, ubah) => nilaiSoal(soal(id), denganUbah(id, ubah)).tahap.map((t) => `${t.skor}${t.konsekuen ? 'k' : ''}`).join(' ');
  it.each([
    ['ML-1 membagi harga jual (D1)', 'ML-1', { 3: { rumus: 1, pA: 20, pB: 20, pC: 16.67 }, 5: { alasan: 3 } }, '1 1 0 1 0'],
    ['ML-1 membandingkan rupiah', 'ML-1', { 4: { toko: 1 }, 5: { alasan: 1 } }, '1 1 2 0 0'],
    ['ML-2 model "20 × HB" (D2)', 'ML-2', { 3: { model: 2 }, 4: { untung: 5000000 }, 6: { hj: 5250000 } }, '1 1 0 0 1 1k'],
    ['ML-2 model "HB ÷ 20%"', 'ML-2', { 3: { model: 3 }, 4: { untung: 1250000 }, 6: { hj: 1500000 } }, '1 1 0 0 1 1k'],
    ['ML-2 model benar, salah hitung', 'ML-2', { 4: { untung: 60000 }, 6: { hj: 310000 } }, '1 1 1 0 1 1k'],
    ['ML-3 membagi harga jual (D1)', 'ML-3', { 4: { rumus: 1 }, 5: { persen: 13.04 }, 6: { persen: 17.65 } }, '1 1 1 0 0 0'],
    ['ML-4 cara teman Dina', 'ML-4', { 3: { rumus: 1 }, 4: { persen: 17.65 }, 5: { nilai: 0 }, 6: { alasan: 1 } }, '1 1 0 0 0 0'],
  ])('%s', (_, id, ubah, harap) => {
    expect(skor(id, ubah)).toBe(harap);
  });
  it('tahap rumus, model, evaluasi, dan alasan tidak pernah memakai konsekuen', () => {
    for (const s of konten.soal) {
      for (const t of s.tahap) {
        for (const b of t.bagian.filter((x) => x.jenis === 'pilihan')) {
          const bolehKonsekuen = s.id === 'ML-1' && t.no === 4; // keputusan dari persen siswa sendiri (U4)
          expect(!!b.konsekuenTerbesar, `${s.id} t${t.no}`).toBe(bolehKonsekuen);
        }
      }
    }
  });
  it('validasiKonten menolak konsekuen yang merujuk pilihan', () => {
    const rusak = structuredClone(konten);
    rusak.soal[1].tahap[3].bagian[0].konsekuen = { bagi: { tahap: 3, bagian: 'model' }, pembagi: 1 };
    expect(validasiKonten(rusak).some((m) => m.includes('konsekuen harus merujuk isian angka'))).toBe(true);
  });
});
