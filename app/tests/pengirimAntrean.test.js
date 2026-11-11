import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buatPengirim } from '../src/layanan/pengirimAntrean.js';
import { tambahAntrean, kirimAntrean, jumlahAntrean } from '../src/layanan/antrean.js';

// Klien tiruan dengan bentuk supabase-js: from().insert/upsert dan rpc() mengembalikan { data, error, status }.
function klienTiruan(jawab = () => ({ data: null, error: null, status: 201 })) {
  const panggilan = [];
  const catat = (nama, ...arg) => { panggilan.push([nama, ...arg]); return Promise.resolve(jawab(nama, ...arg)); };
  return {
    panggilan,
    from: (tabel) => ({
      insert: (baris) => catat(`${tabel}.insert`, baris),
      upsert: (baris, opsi) => catat(`${tabel}.upsert`, baris, opsi),
    }),
    rpc: (fungsi, arg) => catat(`rpc.${fungsi}`, arg),
  };
}

beforeEach(() => {
  const isi = new Map();
  globalThis.localStorage = { getItem: (k) => isi.get(k) ?? null, setItem: (k, v) => isi.set(k, String(v)), removeItem: (k) => isi.delete(k) };
  vi.restoreAllMocks();
});

const percobaan = { siswa_id: 'u1', soal_id: 'L2-03', level: 2, benar: true, jumlah_petunjuk: 0, percobaan_ke: 1 };

describe('isi kiriman per jenis', () => {
  it('percobaan_soal: id item antrean dikirim sebagai id_klien', async () => {
    const k = klienTiruan();
    await buatPengirim(k)({ id: 'id-1', jenis: 'percobaan_soal', data: percobaan });
    expect(k.panggilan).toEqual([['percobaan_soal.insert', { ...percobaan, id_klien: 'id-1' }]]);
  });
  it('progres_materi: upsert pada (siswa_id, materi_id)', async () => {
    const k = klienTiruan();
    const data = { siswa_id: 'u1', materi_id: 'M2', status: 'selesai' };
    await buatPengirim(k)({ id: 'id-2', jenis: 'progres_materi', data });
    expect(k.panggilan).toEqual([['progres_materi.upsert', data, { onConflict: 'siswa_id,materi_id' }]]);
  });
  it('evaluasi_literasi: RPC dengan p_hasil.id = id item antrean', async () => {
    const k = klienTiruan();
    await buatPengirim(k)({ id: 'id-3', jenis: 'evaluasi_literasi', data: { versi_rubrik: 1 } });
    expect(k.panggilan).toEqual([['rpc.simpan_evaluasi_literasi', { p_hasil: { versi_rubrik: 1, id: 'id-3' } }]]);
  });
  it('jenis tidak dikenal → galat 400 (dibuang antrean, tidak diulang)', async () => {
    await expect(buatPengirim(klienTiruan())({ id: 'x', jenis: 'lain', data: {} })).rejects.toMatchObject({ status: 400 });
  });
});

describe('galat dari supabase-js diberi status HTTP', () => {
  const gagal = (error, status) => buatPengirim(klienTiruan(() => ({ data: null, error, status })))({ id: 'a', jenis: 'percobaan_soal', data: percobaan });
  it('UNIQUE dilanggar (23505) → 409', async () => {
    await expect(gagal({ code: '23505', message: 'duplicate key' }, 409)).rejects.toMatchObject({ status: 409, kode: '23505' });
    await expect(gagal({ code: '23505', message: 'duplicate key' }, 0)).rejects.toMatchObject({ status: 409 });
  });
  it('jaringan putus (status 0) → tanpa status (diulang)', async () => {
    await expect(gagal({ message: 'TypeError: Failed to fetch', code: '' }, 0)).rejects.toMatchObject({ status: 0 });
  });
  it('RLS (403) dan constraint (400) diteruskan apa adanya', async () => {
    await expect(gagal({ code: '42501', message: 'rls' }, 403)).rejects.toMatchObject({ status: 403 });
    await expect(gagal({ code: '23514', message: 'check' }, 400)).rejects.toMatchObject({ status: 400 });
  });
});

describe('bersama antrean: kiriman ulang tidak membuat data ganda', () => {
  it('balasan hilang setelah server menyimpan → kiriman ulang 409 → item dihapus, server tetap 1 baris', async () => {
    const server = new Map(); // id_klien → baris
    let balasanHilang = true;
    const k = klienTiruan((nama, baris) => {
      if (server.has(baris.id_klien)) return { data: null, error: { code: '23505', message: 'duplicate key' }, status: 409 };
      server.set(baris.id_klien, baris);
      if (balasanHilang) { balasanHilang = false; return { data: null, error: { message: 'TypeError: Failed to fetch', code: '' }, status: 0 }; }
      return { data: null, error: null, status: 201 };
    });
    const kirim = buatPengirim(k);
    tambahAntrean('u1', 'percobaan_soal', percobaan, { id: 'p-1' });

    const r1 = await kirimAntrean('u1', kirim);
    expect([r1.berhenti, jumlahAntrean('u1'), server.size]).toEqual(['ulang', 1, 1]);

    const r2 = await kirimAntrean('u1', kirim);
    expect([r2.terkirim, jumlahAntrean('u1'), server.size]).toEqual([1, 0, 1]);
  });
  it('item berbeda (id berbeda) untuk soal yang sama tetap tersimpan masing-masing', async () => {
    const server = new Map();
    const k = klienTiruan((nama, baris) => { server.set(baris.id_klien, baris); return { data: null, error: null, status: 201 }; });
    tambahAntrean('u1', 'percobaan_soal', percobaan, { id: 'p-1' });
    tambahAntrean('u1', 'percobaan_soal', { ...percobaan, percobaan_ke: 2 }, { id: 'p-2' });
    await kirimAntrean('u1', buatPengirim(k));
    expect([...server.keys()]).toEqual(['p-1', 'p-2']);
  });
});
