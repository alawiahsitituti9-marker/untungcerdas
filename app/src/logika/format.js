// Format dan pembacaan angka gaya Indonesia (KNF-10, api.md §6).
// Rupiah: Rp100.000 (titik pemisah ribuan). Persen: 12,5% (koma desimal).

export const RUPIAH_MAKS = 10_000_000;
export const PERSEN_MAKS = 10_000; // persen untung bisa > 100%; batas ini mencegah angka tak wajar

/** 100000 → "100.000" */
export function formatAngka(n) {
  const bulat = Math.round(Math.abs(n));
  const teks = String(bulat).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return n < 0 ? `−${teks}` : teks;
}

/** 100000 → "Rp100.000" */
export function formatRupiah(n) {
  return `Rp${formatAngka(n)}`;
}

/** 25 → "25%", 12.5 → "12,5%", 16.6667 → "16,67%" */
export function formatPersen(x) {
  const dibulatkan = Math.round(x * 100) / 100;
  const teks = String(dibulatkan).replace('.', ',');
  return `${teks}%`;
}

/** 0.25 → "0,25" (untuk menampilkan jawaban siswa yang belum dikali 100) */
export function formatDesimal(x) {
  return String(Math.round(x * 10_000) / 10_000).replace('.', ',');
}

/**
 * Membaca isian rupiah dari siswa.
 * Menerima: "20000", "20.000", "Rp20.000", "Rp 20.000".
 * @returns {{ ok: true, nilai: number } | { ok: false, pesan: string }}
 */
export function bacaRupiah(teks) {
  const pesan = 'Tulis angka saja, contoh 20000.';
  if (typeof teks !== 'string') return { ok: false, pesan };
  const bersih = teks.trim().replace(/^rp\.?\s*/i, '').replace(/\s/g, '');
  if (!/^\d{1,3}(\.\d{3})*$|^\d+$/.test(bersih)) return { ok: false, pesan };
  const nilai = Number(bersih.replace(/\./g, ''));
  if (!Number.isSafeInteger(nilai) || nilai > RUPIAH_MAKS) return { ok: false, pesan };
  return { ok: true, nilai };
}

/**
 * Membaca isian persen dari siswa.
 * Menerima: "25", "25%", "12,5", "12.5", "16,67", "0,25".
 * Titik dianggap koma desimal (persen tidak memakai pemisah ribuan).
 * @returns {{ ok: true, nilai: number } | { ok: false, pesan: string }}
 */
export function bacaPersen(teks) {
  const pesan = 'Tulis angka persennya, contoh 25 atau 12,5.';
  if (typeof teks !== 'string') return { ok: false, pesan };
  const bersih = teks.trim().replace(/\s*%$/, '').replace(',', '.');
  if (!/^\d+(\.\d{1,4})?$/.test(bersih)) return { ok: false, pesan };
  const nilai = Number(bersih);
  if (!Number.isFinite(nilai) || nilai > PERSEN_MAKS) return { ok: false, pesan };
  return { ok: true, nilai };
}
