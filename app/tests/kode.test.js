import { describe, it, expect } from 'vitest';
import { normalisasiKode, validasiKode, kodeTampil, kodeKeEmail } from '../src/logika/kode.js';

describe('kode siswa', () => {
  it('menormalkan huruf kecil, spasi, dan tanda hubung', () => {
    expect(normalisasiKode(' ms-7k4p-q2xr ')).toBe('MS7K4PQ2XR');
  });

  it('menerima kode yang sah', () => {
    expect(validasiKode('MS-7K4P-Q2XR')).toEqual({ ok: true, kode: 'MS7K4PQ2XR' });
  });

  it.each(['', 'MS-7K4P', 'XX-7K4P-Q2XR', 'MS-7K4P-Q2X0', 'MS-IL01-ABCD', 'MS-7K4P-Q2XRZ'])('menolak "%s"', (teks) => {
    expect(validasiKode(teks)).toEqual({ ok: false, pesan: 'Kode terdiri dari MS dan 8 huruf/angka.' });
  });

  it('kode tampil hanya 4 karakter pertama', () => {
    expect(kodeTampil('MS7K4PQ2XR')).toBe('MS-7K4P');
  });

  it('email sintetis', () => {
    expect(kodeKeEmail('MS-7K4P-Q2XR', 'siswa.contoh.app')).toBe('ms7k4pq2xr@siswa.contoh.app');
  });
});
