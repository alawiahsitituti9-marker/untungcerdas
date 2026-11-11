// Klien Supabase untuk frontend (DV-05; architecture.md §5).
// Hanya dibuat bila app/.env berisi Project URL dan publishable key. Tanpa itu `klien` = null
// dan aplikasi berjalan dalam mode uji. Kunci rahasia tidak pernah dipakai di sini (AGENTS.md §7).

import { createClient } from '@supabase/supabase-js';
import { bacaKonfigurasi } from './konfigurasi.js';

export const konfigurasi = bacaKonfigurasi(import.meta.env);
if (konfigurasi.masalah) console.error(`MathSave: ${konfigurasi.masalah}`);

/** Kunci localStorage tempat supabase-js menyimpan sesi (access + refresh token). */
export const KUNCI_PENYIMPANAN_AUTH = 'mathsave.auth';

export const klien =
  konfigurasi.mode === 'supabase'
    ? createClient(konfigurasi.url, konfigurasi.kunci, {
        auth: {
          storageKey: KUNCI_PENYIMPANAN_AUTH,
          persistSession: true, // KFN-02: tidak perlu login ulang setiap membuka aplikasi
          autoRefreshToken: true,
          detectSessionInUrl: false, // login hanya dengan kode, tanpa tautan email
        },
      })
    : null;
