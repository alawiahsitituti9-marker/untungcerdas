// Alur pengerjaan F14 (design.md §17.2, §17.4): urutan langkah, kelengkapan isian,
// pembacaan isian, dan ringkasan tanda siswa. Fungsi murni, tanpa React.

import { bacaRupiah, bacaPersen, formatRupiah, formatPersen } from './format.js';

/**
 * Semua langkah (tahap) dalam urutan pengerjaan `konten.urutan` (KL-03).
 * @returns {{ idSoal: string, noTahap: number, tahapTerakhir: boolean }[]}
 */
export function daftarLangkah(konten) {
  return konten.urutan.flatMap((id) => {
    const s = konten.soal.find((x) => x.id === id);
    return s.tahap.map((t, i) => ({ idSoal: id, noTahap: t.no, tahapTerakhir: i === s.tahap.length - 1 }));
  });
}

/** Isian awal untuk satu tahap (yang ditampilkan di layar, belum dibaca). */
export function isianAwal(tahap) {
  return Object.fromEntries(
    tahap.bagian.map((b) => [b.id, b.jenis === 'tandai' ? {} : b.jenis === 'pilihan' ? null : '']),
  );
}

/** Tombol "Simpan & lanjut" aktif hanya jika semua isian terisi (D-08 §4.1 U5). */
export function tahapLengkap(tahap, isian) {
  return tahap.bagian.every((b) => {
    const v = isian?.[b.id];
    if (b.jenis === 'tandai') return !!v && Object.keys(v).length > 0;
    if (b.jenis === 'pilihan') return Number.isInteger(v);
    return typeof v === 'string' && v.trim() !== '';
  });
}

/**
 * Mengubah isian layar menjadi nilai untuk penilaian (rupiah/persen → angka).
 * @returns {{ ok: true, isian: object } | { ok: false, bagian: string, pesan: string }}
 */
export function bacaIsianTahap(tahap, isian) {
  const hasil = {};
  for (const b of tahap.bagian) {
    const v = isian?.[b.id];
    if (b.jenis === 'rupiah' || b.jenis === 'persen') {
      const r = b.jenis === 'rupiah' ? bacaRupiah(v ?? '') : bacaPersen(v ?? '');
      if (!r.ok) return { ok: false, bagian: b.id, pesan: r.pesan };
      hasil[b.id] = r.nilai;
    } else {
      hasil[b.id] = v;
    }
  }
  return { ok: true, isian: hasil };
}

/** Label tandai milik siswa untuk satu soal (dari tahap bertipe tandai), atau {} bila belum ada. */
export function tandaSiswa(soal, jawabanSoal) {
  const t = soal.tahap.find((x) => x.bagian.some((b) => b.jenis === 'tandai'));
  if (!t) return {};
  const b = t.bagian.find((x) => x.jenis === 'tandai');
  return jawabanSoal?.[t.no]?.isian?.[b.id] ?? {};
}

/**
 * Ringkasan harga dari tanda siswa sendiri, dikelompokkan (Toko A, Sepeda, …).
 * Jika tanda salah, ringkasan ikut salah; penilaian konsekuen yang menangani (design.md §17.4).
 * @returns {{ kelompok: string, isi: { label: string, nilai: number, teks: string }[] }[]}
 */
export function ringkasTanda(soal, label) {
  const grup = new Map();
  soal.segmen.forEach((s, i) => {
    const l = label?.[i];
    if (!l) return;
    const nama = s.kelompok ?? 'Lainnya';
    if (!grup.has(nama)) grup.set(nama, []);
    grup.get(nama).push({ label: l, nilai: s.nilai ?? null, teks: s.teks });
  });
  return [...grup.entries()].map(([kelompok, isi]) => ({ kelompok, isi }));
}

const NAMA_LABEL = { HB: 'harga beli', HJ: 'harga jual', PERSEN: 'persen untung' };

/**
 * Jawaban siswa pada satu tahap dalam bentuk teks, untuk baris "Jawabanmu" di P14.
 * @returns {string[]} satu baris per isian; "(belum diisi)" bila kosong
 */
export function teksJawaban(soal, tahap, isian = {}) {
  const KOSONG = '(belum diisi)';
  return tahap.bagian.map((b) => {
    const v = isian?.[b.id];
    const awal = b.label && b.jenis !== 'tandai' ? `${b.label}: ` : '';
    if (b.jenis === 'tandai') {
      const tanda = Object.entries(v ?? {}).sort((a, c) => a[0] - c[0]);
      return tanda.length ? tanda.map(([i, l]) => `${soal.segmen[i].teks} = ${NAMA_LABEL[l] ?? l}`).join('; ') : KOSONG;
    }
    if (v === undefined || v === null || v === '') return awal + KOSONG;
    if (b.jenis === 'pilihan') return awal + (b.pilihan[v]?.teks ?? KOSONG);
    if (b.jenis === 'rupiah') return awal + formatRupiah(v);
    return awal + formatPersen(v);
  });
}
