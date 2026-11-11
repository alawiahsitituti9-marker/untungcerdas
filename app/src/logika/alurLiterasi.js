// Alur pengerjaan F14 (design.md §17.2, §17.4): urutan langkah, kelengkapan isian,
// pembacaan isian, dan ringkasan tanda siswa. Fungsi murni, tanpa React.

import { bacaRupiah, bacaPersen } from './format.js';

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
