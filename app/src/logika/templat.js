// Pengisi templat pembahasan dan petunjuk (D-05 §1). Fungsi murni.

import { hitungTransaksi, sederhanakan } from './hitung.js';
import { formatAngka, formatRupiah } from './format.js';

/**
 * Nilai variabel templat untuk satu transaksi.
 * @param {number} hb
 * @param {number} hj
 * @param {object} [tambahan] mis. { jawab: '20%', n: 6, jenis_siswa: 'rugi' }
 */
export function nilaiTemplat(hb, hj, tambahan = {}) {
  const t = hitungTransaksi(hb, hj);
  const untung = t.jenis === 'untung';
  const [a, b] = untung ? [hj, hb] : [hb, hj];
  const { pembilang, penyebut } = sederhanakan(t.selisih, hb);
  const jenis = t.jenis === 'impas' ? 'impas' : t.jenis;
  return {
    HB: formatRupiah(hb),
    HJ: formatRupiah(hj),
    jenis,
    Jenis: jenis.charAt(0).toUpperCase() + jenis.slice(1),
    lebih: untung ? 'lebih besar' : 'lebih kecil',
    a: formatAngka(a),
    b: formatAngka(b),
    a_rb: formatAngka(a / 1000),
    b_rb: formatAngka(b / 1000),
    selisih: formatRupiah(t.selisih),
    pecahan: `${pembilang}/${penyebut}`,
    ...tambahan,
  };
}

/** Mengganti {nama} dengan nilainya. Variabel yang tidak dikenal dibiarkan apa adanya. */
export function isiTemplat(teks, nilai) {
  return teks.replace(/\{([A-Za-z_]+)\}/g, (asli, nama) => (nilai[nama] ?? asli));
}
