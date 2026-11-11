import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { daftarLangkah, isianAwal, tahapLengkap, bacaIsianTahap, tandaSiswa, ringkasTanda } from '../src/logika/alurLiterasi.js';
import { drafBaru, bacaDraf, simpanDraf, hapusDraf, kunciTahap, catatBantuan } from '../src/layanan/literasi.js';
import { nilaiLatihan } from '../src/logika/penilaianLiterasi.js';

const konten = JSON.parse(readFileSync(new URL('../public/data/literasi.json', import.meta.url), 'utf8'));
const soal = (id) => konten.soal.find((s) => s.id === id);
const tahap = (id, no) => soal(id).tahap.find((t) => t.no === no);

describe('daftarLangkah', () => {
  it('23 langkah mengikuti urutan KL-03 (3 → 4 → 2 → 1)', () => {
    const l = daftarLangkah(konten);
    expect(l).toHaveLength(23);
    expect([...new Set(l.map((x) => x.idSoal))]).toEqual(['ML-3', 'ML-4', 'ML-2', 'ML-1']);
    expect(l.filter((x) => x.tahapTerakhir).map((x) => `${x.idSoal}/${x.noTahap}`)).toEqual(['ML-3/6', 'ML-4/6', 'ML-2/6', 'ML-1/5']);
  });
});

describe('tahapLengkap (tombol "Simpan & lanjut")', () => {
  it('nonaktif sampai semua isian terisi', () => {
    const t = tahap('ML-1', 3);
    const isian = isianAwal(t);
    expect(tahapLengkap(t, isian)).toBe(false);
    expect(tahapLengkap(t, { ...isian, rumus: 0, pA: '25', pB: '25' })).toBe(false);
    expect(tahapLengkap(t, { rumus: 0, pA: '25', pB: '25', pC: '20' })).toBe(true);
  });
  it('tandai butuh minimal satu label; pilihan indeks 0 dianggap terisi', () => {
    expect(tahapLengkap(tahap('ML-4', 1), { tandai: {} })).toBe(false);
    expect(tahapLengkap(tahap('ML-4', 1), { tandai: { 1: 'HB' } })).toBe(true);
    expect(tahapLengkap(tahap('ML-4', 5), { nilai: 0 })).toBe(true);
    expect(tahapLengkap(tahap('ML-4', 2), { rugi: '   ' })).toBe(false);
  });
});

describe('bacaIsianTahap', () => {
  it('rupiah dan persen dibaca menjadi angka (format Indonesia)', () => {
    expect(bacaIsianTahap(tahap('ML-3', 2), { untung: '120.000' })).toEqual({ ok: true, isian: { untung: 120000 } });
    expect(bacaIsianTahap(tahap('ML-4', 4), { persen: '15' })).toEqual({ ok: true, isian: { persen: 15 } });
    expect(bacaIsianTahap(tahap('ML-4', 4), { persen: '17,65' }).isian.persen).toBeCloseTo(17.65);
  });
  it('format salah ditolak dengan pesan, tidak dikunci', () => {
    const r = bacaIsianTahap(tahap('ML-3', 2), { untung: '12,5' });
    expect(r).toMatchObject({ ok: false, bagian: 'untung' });
    expect(r.pesan).toBeTruthy();
  });
  it('isian hasil bacaan bisa dinilai: semua kunci lewat layar → 24', () => {
    const jawaban = {};
    for (const s of konten.soal) {
      jawaban[s.id] = {};
      for (const t of s.tahap) {
        const layar = {};
        for (const b of t.bagian) {
          if (b.jenis === 'tandai') layar[b.id] = Object.fromEntries(s.segmen.map((x, i) => [i, x.peran]).filter(([, p]) => p && b.label.includes(p)));
          else if (b.jenis === 'pilihan') layar[b.id] = b.pilihan.findIndex((p) => p.benar);
          else layar[b.id] = String(b.kunci).replace('.', ',');
        }
        expect(tahapLengkap(t, layar), `${s.id} t${t.no}`).toBe(true);
        const r = bacaIsianTahap(t, layar);
        expect(r.ok).toBe(true);
        jawaban[s.id][t.no] = { isian: r.isian };
      }
    }
    expect(nilaiLatihan(konten, jawaban).total).toBe(24);
  });
});

describe('tanda siswa dan ringkasan', () => {
  it('ringkasan mengikuti tanda siswa sendiri, dikelompokkan per toko', () => {
    const jawabanSoal = { 1: { isian: { tandai: { 1: 'HB', 3: 'HJ', 5: 'HJ' } } } };
    const tanda = tandaSiswa(soal('ML-1'), jawabanSoal);
    expect(ringkasTanda(soal('ML-1'), tanda)).toEqual([
      { kelompok: 'Toko A', isi: [{ label: 'HB', nilai: 120000, teks: 'Rp120.000' }, { label: 'HJ', nilai: 150000, teks: 'Rp150.000' }] },
      { kelompok: 'Toko B', isi: [{ label: 'HJ', nilai: 140000, teks: 'Rp140.000' }] },
    ]);
  });
  it('soal tanpa tahap tandai (ML-3) tidak punya tanda', () => {
    expect(tandaSiswa(soal('ML-3'), {})).toEqual({});
  });
  it('label pada segmen tanpa kelompok masuk "Lainnya"', () => {
    expect(ringkasTanda(soal('ML-4'), { 7: 'HB' })[0].kelompok).toBe('Lainnya');
  });
});

describe('draf di localStorage (KFN-26)', () => {
  beforeEach(() => {
    const isi = new Map();
    globalThis.localStorage = {
      getItem: (k) => (isi.has(k) ? isi.get(k) : null),
      setItem: (k, v) => isi.set(k, String(v)),
      removeItem: (k) => isi.delete(k),
    };
  });

  it('simpan, baca, kunci tahap, catat bantuan, hapus', () => {
    let d = drafBaru(1);
    d = catatBantuan(d, 'ML-3', 1, 2);
    d = kunciTahap(d, 'ML-3', 1, { sepeda: 0, kipas: 1 });
    expect(simpanDraf('MS-AB12', d)).toBe(true);
    const b = bacaDraf('MS-AB12', 1);
    expect(b.posisi).toBe(1);
    expect(b.jawaban['ML-3'][1]).toEqual({ bantuan: 2, isian: { sepeda: 0, kipas: 1 } });
    hapusDraf('MS-AB12');
    expect(bacaDraf('MS-AB12', 1)).toBeNull();
  });
  it('draf per siswa terpisah', () => {
    simpanDraf('MS-AAAA', drafBaru(1));
    expect(bacaDraf('MS-BBBB', 1)).toBeNull();
  });
  it('draf versi rubrik lain atau rusak diabaikan', () => {
    simpanDraf('MS-AB12', drafBaru(1));
    expect(bacaDraf('MS-AB12', 2)).toBeNull();
    localStorage.setItem('mathsave.literasi.MS-AB12', '{rusak');
    expect(bacaDraf('MS-AB12', 1)).toBeNull();
  });
  it('penyimpanan diblokir tidak membuat aplikasi galat', () => {
    globalThis.localStorage = { getItem: () => { throw new Error('blokir'); }, setItem: () => { throw new Error('blokir'); }, removeItem: () => { throw new Error('blokir'); } };
    expect(simpanDraf('MS-AB12', drafBaru(1))).toBe(false);
    expect(bacaDraf('MS-AB12', 1)).toBeNull();
    expect(() => hapusDraf('MS-AB12')).not.toThrow();
  });
});
