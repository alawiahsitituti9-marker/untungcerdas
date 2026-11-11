import { describe, it, expect, beforeEach } from 'vitest';
import { bacaKonfigurasi, kunciRahasia, DOMAIN_BAWAAN } from '../src/layanan/konfigurasi.js';
import { buatAuth, golongkanGalatMasuk, PESAN, DETIK_TUNGGU } from '../src/layanan/auth.js';

const URL_UJI = 'https://contoh.supabase.co';
// JWT tiruan (bukan kunci asli): hanya bagian isi yang dibaca.
const jwt = (role) => `x.${btoa(JSON.stringify({ role })).replace(/=+$/, '')}.y`;

describe('bacaKonfigurasi', () => {
  it('kosong → mode uji', () => {
    expect(bacaKonfigurasi({})).toEqual({ mode: 'uji', domain: DOMAIN_BAWAAN, masalah: null });
  });
  it('publishable key diutamakan; ANON_KEY sebagai cadangan', () => {
    expect(bacaKonfigurasi({ VITE_SUPABASE_URL: URL_UJI, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_a', VITE_SUPABASE_ANON_KEY: 'lama' }).kunci).toBe('sb_publishable_a');
    expect(bacaKonfigurasi({ VITE_SUPABASE_URL: URL_UJI, VITE_SUPABASE_ANON_KEY: jwt('anon') })).toMatchObject({ mode: 'supabase', kunci: jwt('anon') });
  });
  it('domain bawaan siswa.mathsave.app; bisa diganti', () => {
    expect(bacaKonfigurasi({ VITE_SUPABASE_URL: URL_UJI, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_a' }).domain).toBe('siswa.mathsave.app');
    expect(bacaKonfigurasi({ VITE_SUPABASE_URL: URL_UJI, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_a', VITE_SISWA_DOMAIN: 'lain.example' }).domain).toBe('lain.example');
  });
  it('konfigurasi setengah → mode salah dengan alasan', () => {
    expect(bacaKonfigurasi({ VITE_SUPABASE_URL: URL_UJI })).toMatchObject({ mode: 'salah', masalah: expect.stringMatching(/PUBLISHABLE_KEY/) });
    expect(bacaKonfigurasi({ VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_a' })).toMatchObject({ mode: 'salah', masalah: expect.stringMatching(/URL/) });
  });
  it('kunci rahasia di frontend ditolak', () => {
    expect(kunciRahasia('sb_secret_abc')).toBe(true);
    expect(kunciRahasia(jwt('service_role'))).toBe(true);
    expect(kunciRahasia(jwt('anon'))).toBe(false);
    expect(kunciRahasia('sb_publishable_abc')).toBe(false);
    expect(bacaKonfigurasi({ VITE_SUPABASE_URL: URL_UJI, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_abc' }).mode).toBe('salah');
  });
  it('URL tanpa https ditolak, kecuali localhost', () => {
    expect(bacaKonfigurasi({ VITE_SUPABASE_URL: 'http://contoh.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'k' }).mode).toBe('salah');
    expect(bacaKonfigurasi({ VITE_SUPABASE_URL: 'http://127.0.0.1:54321', VITE_SUPABASE_PUBLISHABLE_KEY: 'k' }).mode).toBe('supabase');
  });
});

describe('golongkanGalatMasuk (api.md §7)', () => {
  it.each([
    [{ status: 400, code: 'invalid_credentials' }, PESAN.kodeSalah],
    [{ status: 429, code: 'over_request_rate_limit' }, PESAN.terlaluBanyak],
    [{ status: 503 }, PESAN.server],
    [{ name: 'AuthRetryableFetchError', status: 0 }, PESAN.luring],
    [{ status: 400, code: 'email_not_confirmed' }, PESAN.akunBelumSiap],
  ])('%o → pesan sesuai', (galat, pesan) => expect(golongkanGalatMasuk(galat).pesan).toBe(pesan));
  it('429 mengunci tombol 30 detik', () => expect(golongkanGalatMasuk({ status: 429 }).tunggu).toBe(DETIK_TUNGGU));
});

// Klien tiruan berbentuk supabase-js.
function klienTiruan({ masuk = () => ({ data: { user: { id: 'u-1' } }, error: null }), siswa = () => ({ data: { kode_tampil: 'MS-7K4P', kelas: 'VIII' }, error: null }) } = {}) {
  const catatan = { masuk: [], keluar: [], pantau: null, berhenti: false };
  return {
    catatan,
    auth: {
      signInWithPassword: async (x) => { catatan.masuk.push(x); return masuk(x); },
      signOut: async (x) => { catatan.keluar.push(x); return { error: null }; },
      onAuthStateChange: (f) => { catatan.pantau = f; return { data: { subscription: { unsubscribe: () => { catatan.berhenti = true; } } } }; },
    },
    from: () => ({ select: () => ({ maybeSingle: async () => siswa() }) }),
  };
}

let isi;
beforeEach(() => {
  isi = new Map();
  globalThis.localStorage = { getItem: (k) => isi.get(k) ?? null, setItem: (k, v) => isi.set(k, String(v)), removeItem: (k) => isi.delete(k) };
});

const konfigSupabase = { mode: 'supabase', url: URL_UJI, kunci: 'sb_publishable_a', domain: 'siswa.mathsave.app', masalah: null };

describe('login mode Supabase (DV-05)', () => {
  it('kode → email sintetis + password kode ternormal; sesi dari tabel siswa', async () => {
    const k = klienTiruan();
    const auth = buatAuth({ konfigurasi: konfigSupabase, klien: k, kunciAuth: 'mathsave.auth' });
    const r = await auth.masuk(' ms-7k4p-q2xr ');
    expect(k.catatan.masuk).toEqual([{ email: 'ms7k4pq2xr@siswa.mathsave.app', password: 'MS7K4PQ2XR' }]);
    expect(r).toEqual({ ok: true, sesi: { id: 'u-1', kodeTampil: 'MS-7K4P', kelas: 'VIII' } });
  });
  it('format salah tidak dikirim ke server', async () => {
    const k = klienTiruan();
    const r = await buatAuth({ konfigurasi: konfigSupabase, klien: k }).masuk('MS-123');
    expect([r.ok, k.catatan.masuk.length]).toEqual([false, 0]);
  });
  it('kode salah → pesan api.md §7', async () => {
    const k = klienTiruan({ masuk: () => ({ data: {}, error: { status: 400, code: 'invalid_credentials' } }) });
    expect(await buatAuth({ konfigurasi: konfigSupabase, klien: k }).masuk('MS7K4PQ2XR')).toEqual({ ok: false, pesan: PESAN.kodeSalah });
  });
  it('akun Auth ada tetapi baris siswa belum dibuat → keluar lagi, pesan akun belum siap', async () => {
    const k = klienTiruan({ siswa: () => ({ data: null, error: null }) });
    const r = await buatAuth({ konfigurasi: konfigSupabase, klien: k }).masuk('MS7K4PQ2XR');
    expect(r).toEqual({ ok: false, pesan: PESAN.akunBelumSiap });
    expect(k.catatan.keluar).toEqual([{ scope: 'local' }]);
  });
  it('jaringan putus (klien melempar) → pesan luring', async () => {
    const k = klienTiruan({ masuk: () => { throw new TypeError('Failed to fetch'); } });
    expect((await buatAuth({ konfigurasi: konfigSupabase, klien: k }).masuk('MS7K4PQ2XR')).pesan).toBe(PESAN.luring);
  });
  it('sesi tersimpan hanya berlaku bila token supabase-js masih ada (KFN-02)', async () => {
    const k = klienTiruan();
    const auth = buatAuth({ konfigurasi: konfigSupabase, klien: k, kunciAuth: 'mathsave.auth' });
    await auth.masuk('MS7K4PQ2XR');
    expect(auth.sesiSaatIni()).toBeNull(); // klien tiruan tidak menulis token
    localStorage.setItem('mathsave.auth', '{"access_token":"t"}');
    await auth.masuk('MS7K4PQ2XR');
    expect(auth.sesiSaatIni()).toEqual({ id: 'u-1', kodeTampil: 'MS-7K4P', kelas: 'VIII' });
  });
  it('keluar: signOut lokal dan semua sesi di HP dihapus', async () => {
    const k = klienTiruan();
    const auth = buatAuth({ konfigurasi: konfigSupabase, klien: k, kunciAuth: 'mathsave.auth' });
    localStorage.setItem('mathsave.auth', 'x');
    await auth.masuk('MS7K4PQ2XR');
    await auth.keluar();
    expect(k.catatan.keluar).toEqual([{ scope: 'local' }]);
    expect([...isi.keys()]).toEqual([]);
    expect(auth.sesiSaatIni()).toBeNull();
  });
  it('pantauSesi: SIGNED_OUT → berubah(null); sesi yang masih ada tidak diakhiri', () => {
    const k = klienTiruan();
    const auth = buatAuth({ konfigurasi: konfigSupabase, klien: k });
    const panggilan = [];
    const berhenti = auth.pantauSesi((s) => panggilan.push(s));
    k.catatan.pantau('TOKEN_REFRESHED', { access_token: 't' });
    k.catatan.pantau('SIGNED_OUT', null);
    expect(panggilan).toEqual([null]);
    berhenti();
    expect(k.catatan.berhenti).toBe(true);
  });
});

describe('mode uji dan mode salah', () => {
  it('mode uji tetap seperti sebelumnya (tanpa server)', async () => {
    const auth = buatAuth({ konfigurasi: { mode: 'uji', domain: DOMAIN_BAWAAN, masalah: null }, klien: null });
    expect(await auth.masuk('MS7K4PQ2XR')).toEqual({ ok: true, sesi: { kodeTampil: 'MS-7K4P' } });
    expect(auth.sesiSaatIni()).toEqual({ kodeTampil: 'MS-7K4P' });
    await auth.keluar();
    expect(auth.sesiSaatIni()).toBeNull();
  });
  it('mode salah: login ditolak dengan pesan untuk guru', async () => {
    const auth = buatAuth({ konfigurasi: { mode: 'salah', domain: DOMAIN_BAWAAN, masalah: 'x' }, klien: null });
    expect(await auth.masuk('MS7K4PQ2XR')).toEqual({ ok: false, pesan: PESAN.belumDiatur });
    expect(auth.sesiSaatIni()).toBeNull();
  });
});
