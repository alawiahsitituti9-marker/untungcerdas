// Penyimpanan progres di HP siswa (sementara sampai DV-13 menyimpannya ke Supabase).
// Bentuk data mengikuti tabel server: progres_materi (api.md §3.3) dan evaluasi_literasi (§3.6),
// sehingga nanti mudah dikirim lewat antrean.

import { bacaTerbaik } from './progresLatihan.js';
import { ringkasProgres } from '../logika/progres.js';

const kunciMateri = (kode) => `mathsave.materi.${kode ?? 'anonim'}`;
const kunciLiterasi = (kode) => `mathsave.literasi-riwayat.${kode ?? 'anonim'}`;

function baca(kunci, bawaan) {
  try {
    const v = JSON.parse(localStorage.getItem(kunci) ?? 'null');
    return v ?? bawaan;
  } catch {
    return bawaan;
  }
}
function tulis(kunci, nilai) {
  try {
    localStorage.setItem(kunci, JSON.stringify(nilai));
  } catch {
    // penyimpanan diblokir: progres hanya berlaku selama halaman terbuka
  }
}

/** @returns {{ [materiId]: 'dibuka'|'selesai' }} */
export const bacaMateri = (kode) => baca(kunciMateri(kode), {});

/** Menandai submateri/contoh/simulasi. Status tidak pernah turun dari 'selesai' (api.md §3.3). */
export function tandaiMateri(kode, materiId, status) {
  const m = bacaMateri(kode);
  if (m[materiId] === 'selesai' || m[materiId] === status) return m;
  const baru = { ...m, [materiId]: status };
  tulis(kunciMateri(kode), baru);
  return baru;
}

/** Riwayat hasil F14, urut waktu. */
export const bacaRiwayatLiterasi = (kode) => baca(kunciLiterasi(kode), []);

/**
 * Mencatat satu hasil F14 (dipanggil sekali saat latihan selesai).
 * @param {string} id   id percobaan (dipakai juga oleh antrean di LM-10 agar tidak ganda)
 * @param {object} hasil keluaran nilaiLatihan()
 */
export function catatHasilLiterasi(kode, id, hasil, selesaiPada = new Date().toISOString()) {
  const riwayat = bacaRiwayatLiterasi(kode);
  if (riwayat.some((h) => h.id === id)) return riwayat;
  const baru = [...riwayat, {
    id,
    selesai_pada: selesaiPada,
    skor: hasil.indikator.map((i) => i.skor),
    skor_total: hasil.total,
    jumlah_bantuan: hasil.bantuan,
  }];
  tulis(kunciLiterasi(kode), baru);
  return baru;
}

/** Ringkasan untuk Beranda dan Progres dari data di HP. */
export function ringkasanLokal(kode) {
  return ringkasProgres({ materi: bacaMateri(kode), terbaik: bacaTerbaik(kode), literasi: bacaRiwayatLiterasi(kode) });
}
