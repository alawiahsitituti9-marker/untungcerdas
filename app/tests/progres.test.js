import { describe, it, expect, beforeEach } from 'vitest';
import { ringkasProgres, saranBerikutnya } from '../src/logika/progres.js';
import { tandaiMateri, bacaMateri, catatHasilLiterasi, bacaRiwayatLiterasi, ringkasanLokal } from '../src/layanan/progres.js';
import { catatSesi } from '../src/layanan/progresLatihan.js';

const selesai = (...ids) => Object.fromEntries(ids.map((m) => [m, 'selesai']));
const semuaMateri = selesai('M1', 'M2', 'M3', 'M4', 'M5', 'M6');

describe('ringkasProgres (bentuk sama dengan RPC ringkasan_progres)', () => {
  it('awal: 0 dari 7 materi, berikutnya M1, hanya Level 1 terbuka, belum ada literasi', () => {
    const r = ringkasProgres({});
    expect([r.materi_selesai, r.materi_total, r.materi_berikutnya]).toEqual([0, 7, 'M1']);
    expect(r.level.map((l) => l.terbuka)).toEqual([true, false, false, false]);
    expect(r.literasi).toBeNull();
  });
  it('M0 opsional dihitung selesai tetapi tidak menghalangi materi berikutnya', () => {
    const r = ringkasProgres({ materi: { ...selesai('M0', 'M1'), M2: 'dibuka' } });
    expect([r.materi_selesai, r.materi_berikutnya]).toEqual([2, 'M2']);
  });
  it('literasi: pertama, terakhir, terbaik, perubahan', () => {
    const lit = [
      { selesai_pada: '2026-11-12', skor: [3, 3, 4, 4], skor_total: 14 },
      { selesai_pada: '2026-11-13', skor: [6, 5, 5, 4], skor_total: 20 },
      { selesai_pada: '2026-11-14', skor: [5, 5, 4, 5], skor_total: 19 },
    ];
    const r = ringkasProgres({ literasi: lit }).literasi;
    expect([r.jumlah_percobaan, r.pertama.skor_total, r.terakhir.skor_total, r.terbaik, r.perubahan]).toEqual([3, 14, 19, 20, 5]);
    expect(ringkasProgres({ literasi: lit.slice(0, 1) }).literasi.perubahan).toBeNull();
  });
});

describe('saranBerikutnya (design.md §4; KL-09)', () => {
  const saran = (data) => saranBerikutnya(ringkasProgres(data));
  it('materi dulu', () => {
    expect(saran({})).toEqual({ jenis: 'materi', id: 'M1', tautan: '/materi/M1' });
    expect(saran({ materi: selesai('M1', 'M2', 'M3') }).id).toBe('M4');
  });
  it('setelah M6: latihan Level 1–3 sampai 4 dari 5 benar', () => {
    expect(saran({ materi: semuaMateri })).toMatchObject({ jenis: 'latihan', id: 1 });
    expect(saran({ materi: semuaMateri, terbaik: { 1: 5, 2: 3 } })).toMatchObject({ jenis: 'latihan', id: 2 });
  });
  it('setelah M6 dan Level 3: Latihan Literasi Matematis (KL-09), lalu Level 4', () => {
    const lulus3 = { 1: 5, 2: 4, 3: 4 };
    expect(saran({ materi: semuaMateri, terbaik: lulus3 })).toEqual({ jenis: 'literasi', tautan: '/literasi' });
    const adaHasil = [{ selesai_pada: 'x', skor: [1, 1, 1, 1], skor_total: 4 }];
    expect(saran({ materi: semuaMateri, terbaik: lulus3, literasi: adaHasil })).toMatchObject({ jenis: 'latihan', id: 4 });
    expect(saran({ materi: semuaMateri, terbaik: { ...lulus3, 4: 5 }, literasi: adaHasil }).jenis).toBe('literasi');
  });
});

describe('penyimpanan progres di HP', () => {
  beforeEach(() => {
    const isi = new Map();
    globalThis.localStorage = { getItem: (k) => isi.get(k) ?? null, setItem: (k, v) => isi.set(k, String(v)), removeItem: (k) => isi.delete(k) };
  });
  it('status materi tidak turun dari selesai (seperti trigger server)', () => {
    tandaiMateri('MS-A', 'M1', 'dibuka');
    tandaiMateri('MS-A', 'M1', 'selesai');
    tandaiMateri('MS-A', 'M1', 'dibuka');
    expect(bacaMateri('MS-A')).toEqual({ M1: 'selesai' });
    expect(bacaMateri('MS-B')).toEqual({});
  });
  it('hasil literasi dicatat sekali per id', () => {
    const hasil = { indikator: [{ skor: 5 }, { skor: 4 }, { skor: 6 }, { skor: 3 }], total: 18, bantuan: 2 };
    catatHasilLiterasi('MS-A', 'id-1', hasil, '2026-11-12T08:00:00Z');
    catatHasilLiterasi('MS-A', 'id-1', hasil, '2026-11-12T08:00:00Z');
    expect(bacaRiwayatLiterasi('MS-A')).toEqual([{ id: 'id-1', selesai_pada: '2026-11-12T08:00:00Z', skor: [5, 4, 6, 3], skor_total: 18, jumlah_bantuan: 2 }]);
  });
  it('ringkasanLokal menggabungkan materi, latihan, dan literasi', () => {
    tandaiMateri('MS-A', 'M1', 'selesai');
    catatSesi('MS-A', 1, 4);
    const r = ringkasanLokal('MS-A');
    expect([r.materi_selesai, r.level[1].terbuka, r.literasi]).toEqual([1, true, null]);
  });
  it('penyimpanan diblokir tidak membuat galat', () => {
    globalThis.localStorage = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
    expect(() => tandaiMateri('MS-A', 'M1', 'selesai')).not.toThrow();
    expect(ringkasanLokal('MS-A').materi_selesai).toBe(0);
  });
});
