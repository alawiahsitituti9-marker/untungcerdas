// Rumus resmi MathSave (AGENTS.md §4). Jangan diubah tanpa persetujuan.
//   Keuntungan            = Harga Jual − Harga Beli
//   Kerugian              = Harga Beli − Harga Jual
//   Persentase Keuntungan = (Keuntungan / Harga Beli) × 100%
//   Persentase Kerugian   = (Kerugian / Harga Beli) × 100%

/** Toleransi jawaban persen yang dianggap benar (api.md §6). */
export const TOLERANSI_BENAR = 0.01;

function pastikanHarga(hb, hj) {
  if (!Number.isFinite(hb) || !Number.isFinite(hj) || hb <= 0 || hj < 0) {
    throw new RangeError('Harga beli harus lebih dari 0 dan harga jual tidak boleh negatif.');
  }
}

/** @returns {'untung' | 'rugi' | 'impas'} */
export function jenisTransaksi(hb, hj) {
  pastikanHarga(hb, hj);
  if (hj > hb) return 'untung';
  if (hj < hb) return 'rugi';
  return 'impas';
}

/** Besar untung atau rugi (selalu ≥ 0): yang besar dikurangi yang kecil. */
export function besarSelisih(hb, hj) {
  pastikanHarga(hb, hj);
  return Math.abs(hj - hb);
}

/** Persentase untung/rugi terhadap harga beli. */
export function persenSelisih(hb, hj) {
  return (besarSelisih(hb, hj) / hb) * 100;
}

/** Faktor persekutuan terbesar (FPB). */
export function fpb(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

/** 20000/80000 → { pembilang: 1, penyebut: 4 } */
export function sederhanakan(pembilang, penyebut) {
  const f = fpb(pembilang, penyebut) || 1;
  return { pembilang: pembilang / f, penyebut: penyebut / f };
}

/** Hitung balik untuk langkah Periksa: persen × HB ÷ 100. */
export function hitungBalik(persen, hb) {
  return (persen * hb) / 100;
}

/** Membandingkan dua angka dengan toleransi. */
export function hampirSama(a, b, toleransi = TOLERANSI_BENAR) {
  return Math.abs(a - b) <= toleransi + 1e-9;
}

/**
 * Semua besaran satu transaksi, untuk kunci jawaban, petunjuk, dan pembahasan.
 * Selain nilai benar, memuat nilai kesalahan umum: D1 (dibagi HJ) dan D2 (lupa × 100).
 */
export function hitungTransaksi(hb, hj) {
  const jenis = jenisTransaksi(hb, hj);
  const selisih = besarSelisih(hb, hj);
  const persen = persenSelisih(hb, hj);
  return {
    hb,
    hj,
    jenis,
    selisih,
    persen,
    pecahan: sederhanakan(selisih, hb),
    nilaiD1: hj > 0 ? (selisih / hj) * 100 : null,
    nilaiD2: selisih / hb,
  };
}
