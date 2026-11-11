#!/usr/bin/env node
// Membuat akun siswa MathSave (DV-03; architecture.md §5; Keputusan K-03, K-04, K-05).
//
// DIJALANKAN HANYA DI KOMPUTER PENGEMBANG. Memakai kunci secret / service_role (AGENTS.md §7).
// Kunci itu dibaca dari supabase/scripts/.env yang tidak masuk git. Jangan pernah menempelnya di kode.
//
// Pemakaian (dari folder repositori):
//   node supabase/scripts/buat-akun-siswa.js --jumlah 30 --kelas VIII
//   node supabase/scripts/buat-akun-siswa.js --jumlah 3 --coba      (hanya membuat kode, tanpa Supabase)
//
// Hasil: supabase/scripts/keluaran/kode-<waktu>.csv berisi kode lengkap untuk guru.
// Folder keluaran tidak masuk git, karena kode berfungsi sebagai kata sandi siswa.

import { randomInt } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const folder = dirname(fileURLToPath(import.meta.url));
const akar = join(folder, '..', '..');
const { buatKode, formatKode, kodeTampil, kodeKeEmail, validasiKode } = await import(
  pathToFileURL(join(akar, 'app/src/logika/kode.js')).href
);

function bacaArg(nama, bawaan) {
  const i = process.argv.indexOf(`--${nama}`);
  if (i === -1) return bawaan;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}

function bacaEnv() {
  const berkas = join(folder, '.env');
  if (!existsSync(berkas)) return {};
  return Object.fromEntries(
    readFileSync(berkas, 'utf8')
      .split(/\r?\n/)
      .filter((b) => b.trim() && !b.trim().startsWith('#'))
      .map((b) => b.split('=').map((x) => x.trim()))
      .map(([k, ...v]) => [k, v.join('=')]),
  );
}

const jumlah = Number(bacaArg('jumlah', 0));
const kelas = bacaArg('kelas', null);
const coba = bacaArg('coba', false) === true;

if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 200) {
  console.error('Isi --jumlah antara 1 dan 200.');
  process.exit(1);
}
if (kelas !== null && !['VIII', 'IX'].includes(kelas)) {
  console.error('--kelas hanya boleh VIII atau IX (Keputusan K-05).');
  process.exit(1);
}

// Kode unik dalam satu batch, termasuk 4 karakter tampilannya agar guru mudah membedakan.
const kode = [];
const tampil = new Set();
while (kode.length < jumlah) {
  const k = buatKode(randomInt);
  if (!validasiKode(k).ok || tampil.has(kodeTampil(k))) continue;
  tampil.add(kodeTampil(k));
  kode.push(k);
}

const hasil = [];
if (coba) {
  for (const k of kode) hasil.push({ kode: formatKode(k), kode_tampil: kodeTampil(k), kelas: kelas ?? '', status: 'coba' });
} else {
  const env = { ...bacaEnv(), ...process.env };
  const url = env.SUPABASE_URL;
  // SUPABASE_SECRET_KEY (kunci secret baru); cadangan: SUPABASE_SERVICE_ROLE_KEY (nama lama).
  const kunci = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  const domain = env.SISWA_DOMAIN;
  if (!url || !kunci || !domain) {
    console.error('Isi SUPABASE_URL, SUPABASE_SECRET_KEY, dan SISWA_DOMAIN di supabase/scripts/.env (lihat .env.example).');
    process.exit(1);
  }
  const require = createRequire(join(akar, 'app/package.json'));
  const { createClient } = require('@supabase/supabase-js');
  const sb = createClient(url, kunci, { auth: { persistSession: false, autoRefreshToken: false } });

  for (const k of kode) {
    const { data, error } = await sb.auth.admin.createUser({ email: kodeKeEmail(k, domain), password: k, email_confirm: true });
    if (error) {
      hasil.push({ kode: formatKode(k), kode_tampil: kodeTampil(k), kelas: kelas ?? '', status: `gagal: ${error.message}` });
      continue;
    }
    const { error: e2 } = await sb.from('siswa').insert({ id: data.user.id, kode_tampil: kodeTampil(k), kelas });
    if (e2) {
      await sb.auth.admin.deleteUser(data.user.id); // jangan tinggalkan akun tanpa baris siswa
      hasil.push({ kode: formatKode(k), kode_tampil: kodeTampil(k), kelas: kelas ?? '', status: `gagal: ${e2.message}` });
      continue;
    }
    hasil.push({ kode: formatKode(k), kode_tampil: kodeTampil(k), kelas: kelas ?? '', status: 'dibuat' });
  }
}

const keluaran = join(folder, 'keluaran');
mkdirSync(keluaran, { recursive: true });
const berkas = join(keluaran, `kode-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`);
writeFileSync(berkas, ['kode,kode_tampil,kelas,status', ...hasil.map((h) => `${h.kode},${h.kode_tampil},${h.kelas},${h.status}`)].join('\n') + '\n');
const dibuat = hasil.filter((h) => h.status === 'dibuat' || h.status === 'coba').length;
console.log(`${dibuat} dari ${jumlah} kode ${coba ? 'dibuat (mode coba, tanpa Supabase)' : 'dibuat di Supabase'}.`);
console.log(`Daftar kode: ${berkas}`);
console.log('Simpan file ini dengan aman. Kode berfungsi sebagai kata sandi siswa.');
if (dibuat < jumlah) process.exit(1);
