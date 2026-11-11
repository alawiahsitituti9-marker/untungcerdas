import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  tambahAntrean, bacaAntrean, jumlahAntrean, kirimAntrean, golongkanGalat, mulaiKirimOtomatis,
} from '../src/layanan/antrean.js';

const galat = (status) => Object.assign(new Error(`HTTP ${status ?? 'jaringan'}`), status ? { status } : {});

beforeEach(() => {
  const isi = new Map();
  globalThis.localStorage = {
    getItem: (k) => isi.get(k) ?? null,
    setItem: (k, v) => isi.set(k, String(v)),
    removeItem: (k) => isi.delete(k),
  };
  vi.restoreAllMocks();
});

describe('menyimpan ke antrean', () => {
  it('item disimpan berurutan dengan id, jenis, data, dan waktu', () => {
    tambahAntrean('A', 'progres_materi', { materi_id: 'M1', status: 'selesai' }, { id: 'x1', sekarang: 't1' });
    tambahAntrean('A', 'percobaan_soal', { soal_id: 'L1-01' }, { id: 'x2', sekarang: 't2' });
    expect(bacaAntrean('A')).toEqual([
      { id: 'x1', jenis: 'progres_materi', data: { materi_id: 'M1', status: 'selesai' }, dibuat_pada: 't1', upaya: 0 },
      { id: 'x2', jenis: 'percobaan_soal', data: { soal_id: 'L1-01' }, dibuat_pada: 't2', upaya: 0 },
    ]);
  });
  it('antrean dipisah per pemilik (HP dipakai bergantian)', () => {
    tambahAntrean('A', 'percobaan_soal', {});
    expect([jumlahAntrean('A'), jumlahAntrean('B')]).toEqual([1, 0]);
  });
  it('id sama tidak digandakan; isinya diperbarui', () => {
    tambahAntrean('A', 'evaluasi_literasi', { skor: 1 }, { id: 'h1', sekarang: 't1' });
    tambahAntrean('A', 'evaluasi_literasi', { skor: 2 }, { id: 'h1', sekarang: 't2' });
    expect(bacaAntrean('A')).toEqual([{ id: 'h1', jenis: 'evaluasi_literasi', data: { skor: 2 }, dibuat_pada: 't1', upaya: 0 }]);
  });
  it('id dibuat otomatis bila tidak diberikan', () => {
    const a = tambahAntrean('A', 'percobaan_soal', {});
    const b = tambahAntrean('A', 'percobaan_soal', {});
    expect(a.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
  });
  it('jenis yang tidak dikenal ditolak', () => {
    expect(() => tambahAntrean('A', 'lain', {})).toThrow();
  });
  it('penyimpanan HP penuh/diblokir: tidak membuat galat, mengembalikan null', () => {
    globalThis.localStorage = { getItem: () => null, setItem: () => { throw new Error('penuh'); }, removeItem: () => {} };
    expect(tambahAntrean('A', 'percobaan_soal', {})).toBeNull();
    expect(jumlahAntrean('A')).toBe(0);
  });
});

describe('menggolongkan galat (api.md §7)', () => {
  it.each([
    [undefined, 'ulang'], [0, 'ulang'], [408, 'ulang'], [429, 'ulang'], [500, 'ulang'], [503, 'ulang'],
    [401, 'sesi'], [409, 'sudah_ada'], [400, 'tolak'], [403, 'tolak'], [404, 'tolak'],
  ])('status %s → %s', (status, hasil) => {
    expect(golongkanGalat(galat(status))).toBe(hasil);
  });
});

describe('mengirim antrean', () => {
  const isi = (...ids) => ids.forEach((id) => tambahAntrean('A', 'percobaan_soal', { id }, { id }));

  it('semua berhasil → antrean kosong, urutan kiriman tetap (FIFO)', async () => {
    isi('a', 'b', 'c');
    const urutan = [];
    const r = await kirimAntrean('A', async (item) => { urutan.push(item.id); });
    expect(urutan).toEqual(['a', 'b', 'c']);
    expect(r).toEqual({ terkirim: 3, ditolak: 0, tersisa: 0, berhenti: null });
  });

  it('jaringan putus di item kedua → berhenti; item kedua dan seterusnya tetap tersimpan', async () => {
    isi('a', 'b', 'c');
    const r = await kirimAntrean('A', async (item) => { if (item.id === 'b') throw galat(); });
    expect(r).toEqual({ terkirim: 1, ditolak: 0, tersisa: 2, berhenti: 'ulang' });
    expect(bacaAntrean('A').map((x) => [x.id, x.upaya])).toEqual([['b', 1], ['c', 0]]);
  });

  it('data masuk setelah koneksi kembali', async () => {
    isi('a', 'b');
    await kirimAntrean('A', async () => { throw galat(503); });
    const server = [];
    const r = await kirimAntrean('A', async (item) => { server.push(item.id); });
    expect(server).toEqual(['a', 'b']);
    expect(r.tersisa).toBe(0);
  });

  it('sesi habis (401) → berhenti dan disimpan untuk setelah masuk lagi', async () => {
    isi('a');
    const r = await kirimAntrean('A', async () => { throw galat(401); });
    expect([r.berhenti, r.tersisa]).toEqual(['sesi', 1]);
  });

  it('409 (sudah ada di server) dihitung terkirim dan dihapus', async () => {
    isi('a');
    const r = await kirimAntrean('A', async () => { throw galat(409); });
    expect([r.terkirim, r.tersisa]).toEqual([1, 0]);
  });

  it('ditolak RLS/constraint (400/403) → dihapus, dicatat di konsol, tidak menghalangi item lain', async () => {
    const peringatan = vi.spyOn(console, 'warn').mockImplementation(() => {});
    isi('a', 'b');
    const r = await kirimAntrean('A', async (item) => { if (item.id === 'a') throw galat(400); });
    expect(r).toEqual({ terkirim: 1, ditolak: 1, tersisa: 0, berhenti: null });
    expect(peringatan).toHaveBeenCalledTimes(1);
  });

  it('panggilan bersamaan tidak mengirim item yang sama dua kali', async () => {
    isi('a', 'b');
    const dikirim = [];
    const kirim = async (item) => { dikirim.push(item.id); await new Promise((r) => setTimeout(r, 5)); };
    const [r1, r2] = await Promise.all([kirimAntrean('A', kirim), kirimAntrean('A', kirim)]);
    expect(dikirim).toEqual(['a', 'b']);
    expect(r1).toBe(r2);
  });

  it('item yang masuk saat sedang mengirim ikut terkirim', async () => {
    isi('a');
    const dikirim = [];
    await kirimAntrean('A', async (item) => {
      dikirim.push(item.id);
      if (item.id === 'a') tambahAntrean('A', 'percobaan_soal', {}, { id: 'baru' });
    });
    expect(dikirim).toEqual(['a', 'baru']);
    expect(jumlahAntrean('A')).toBe(0);
  });

  it('hanya antrean milik pemilik yang dikirim', async () => {
    isi('a');
    tambahAntrean('B', 'percobaan_soal', {}, { id: 'milik-B' });
    const dikirim = [];
    await kirimAntrean('A', async (item) => { dikirim.push(item.id); });
    expect(dikirim).toEqual(['a']);
    expect(jumlahAntrean('B')).toBe(1);
  });
});

describe('kirim otomatis', () => {
  const buatTarget = (extra = {}) => Object.assign(new EventTarget(), extra);

  it('mengirim saat mulai dan saat koneksi kembali; berhenti setelah dilepas', async () => {
    const jendela = buatTarget();
    const dokumen = buatTarget({ visibilityState: 'visible' });
    tambahAntrean('A', 'percobaan_soal', {}, { id: 'a' });
    const kirim = vi.fn().mockRejectedValueOnce(galat()).mockResolvedValue();
    const lepas = mulaiKirimOtomatis('A', kirim, { jendela, dokumen });
    await vi.waitFor(() => expect(kirim).toHaveBeenCalledTimes(1));
    expect(jumlahAntrean('A')).toBe(1);

    jendela.dispatchEvent(new Event('online'));
    await vi.waitFor(() => expect(jumlahAntrean('A')).toBe(0));

    lepas();
    tambahAntrean('A', 'percobaan_soal', {}, { id: 'b' });
    jendela.dispatchEvent(new Event('online'));
    await new Promise((r) => setTimeout(r, 10));
    expect(kirim).toHaveBeenCalledTimes(2);
  });

  it('tidak mengirim apa pun bila antrean kosong atau aplikasi tersembunyi', async () => {
    const jendela = buatTarget();
    const dokumen = buatTarget({ visibilityState: 'hidden' });
    const kirim = vi.fn().mockResolvedValue();
    mulaiKirimOtomatis('A', kirim, { jendela, dokumen });
    tambahAntrean('A', 'percobaan_soal', {});
    jendela.dispatchEvent(new Event('online'));
    await new Promise((r) => setTimeout(r, 10));
    expect(kirim).not.toHaveBeenCalled();
  });
});
