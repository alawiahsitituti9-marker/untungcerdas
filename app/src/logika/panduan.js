// Panduan Langkah demi Langkah (F05) dan sesi Latihan Level 1–3 (F09). Fungsi murni.
// Langkah per level mengikuti design.md §8 dan D-04: Level 1 = 2, 3, 4, 7; Level 2 = 2–7;
// Level 3 = 3 tahap: Tandai (1) → Hitung (3, 4, 6) → Periksa (7).
// Pembahasan memakai templat D-05 §3.3 dengan alur D-05 §3.1 (dua kesempatan).

import { diagnosisLangkah } from './diagnosis.js';
import { hitungTransaksi, sederhanakan } from './hitung.js';
import { formatAngka, formatRupiah, formatPersen, formatDesimal } from './format.js';
import { isiTemplat, nilaiTemplat } from './templat.js';
import { acakUrutan } from './cekCepat.js';

export const JUMLAH_SOAL_SESI = 5;
/** [Asumsi] design.md §4: Level n+1 terbuka setelah 4 dari 5 soal Level n benar. Angka perlu dikonfirmasi. */
export const SYARAT_BUKA = 4;
export const BATAS_PERCOBAAN = 2;

/** Layar panduan per level; setiap layar memuat satu atau beberapa nomor langkah. */
export const LAYAR = {
  1: [[2], [3], [4], [7]],
  2: [[2], [3], [4], [5], [6], [7]],
  3: [[1], [3, 4, 6], [7]],
};

/** Judul langkah (design.md §8, kolom "Langkah"). */
export const JUDUL_LANGKAH = {
  1: 'Identifikasi informasi',
  2: 'Tentukan HB dan HJ',
  3: 'Untung atau rugi?',
  4: 'Hitung besar untung/rugi',
  5: 'Pilih rumus persentase',
  6: 'Hitung persentase',
  7: 'Periksa kembali',
};

/** Lima soal acak dari satu level (D-04: "Setiap sesi menampilkan 5 soal acak dari satu level"). */
export function pilihSoalSesi(semuaSoal, level, acak = Math.random) {
  return acakUrutan(semuaSoal.filter((s) => s.level === level), acak).slice(0, JUMLAH_SOAL_SESI);
}

/** Level yang terbuka berdasarkan jumlah benar terbaik per level ({1: 5, 2: 3, …}). Level 1 selalu terbuka. */
export function levelTerbuka(terbaik = {}) {
  const buka = [1];
  for (let n = 1; n < 4; n++) {
    if ((terbaik[n] ?? 0) >= SYARAT_BUKA) buka.push(n + 1);
    else break;
  }
  return buka;
}

/** Ubah isian layar menjadi jawaban yang dipahami diagnosisLangkah. */
export function jawabanLangkah(langkah, isian, soal, data) {
  switch (langkah) {
    case 1: return isian.tandai ?? {};
    case 2: return { hb: isian.hb, hj: isian.hj };
    case 3: {
      const jenis = isian.jenis;
      const alasanBenar = isian.alasan === (soal.kunci.jenis === 'untung' ? 0 : 1);
      return { jenis, alasanBenar };
    }
    case 4: return isian.besar;
    case 5: return data.rumusPersen[isian.rumus]?.nilai;
    case 6: return isian.persen;
    case 7: return isian.balik;
    default: throw new RangeError(`Langkah ${langkah}`);
  }
}

/** Memeriksa satu layar: langkah diperiksa berurutan; yang pertama salah menentukan hasil. */
export function periksaLayar(soal, langkahLayar, isian, data) {
  for (const n of langkahLayar) {
    const h = diagnosisLangkah(n, jawabanLangkah(n, isian, soal, data), soal);
    if (!h.benar) return { ...h, langkah: n };
  }
  return { benar: true };
}

function teksJawab(langkah, isian, kode) {
  if (langkah === 4) return formatRupiah(isian.besar);
  if (langkah === 6) return kode === 'D2' ? formatDesimal(isian.persen) : formatPersen(isian.persen);
  if (langkah === 7) return formatRupiah(isian.balik);
  return '';
}

/** Rumus pada Kartu Rumus yang sesuai langkah (unsur ② D6). */
function rumusLangkah(langkah, Jenis, kartuRumus) {
  const r = kartuRumus.rumus;
  if (langkah === 4) return r.find((x) => x.teks.startsWith(`${Jenis} =`))?.teks ?? '';
  return r.find((x) => x.teks.startsWith(`% ${Jenis}`))?.teks ?? '';
}

/**
 * Pembahasan unsur ①–③ (D-05 §3.3) untuk hasil periksa yang salah.
 * @param {object} data { templat, templatKhusus, petunjukLevel1, petunjukLevel2, kartuRumus }
 */
export function pembahasanLangkah(soal, hasil, isian, data) {
  const { langkah, kode } = hasil;
  const nilai = nilaiTemplat(soal.hb, soal.hj, {
    jawab: teksJawab(langkah, isian, kode),
    n: String(langkah),
    persen: soal.kunci.persen != null ? formatPersen(soal.kunci.persen) : '',
    jenis_siswa: isian.jenis ?? '',
    kata_HB: soal.kataKunci?.HB ?? 'membeli',
    kata_HJ: soal.kataKunci?.HJ ?? 'dijual',
  });
  const isi = (baris) => baris.map((t) => isiTemplat(t, nilai));
  const k = data.templatKhusus;

  if (langkah === 1) return isi(kode === 'D5' ? k.D5_tandai : k.D6_ditanya);
  if (langkah === 7) {
    if (soal.level === 1) return isi(soal.kunci.jenis === 'untung' ? k.L7_level1_untung : k.L7_level1_rugi);
    return isi(k.L7_level23);
  }
  const templat = data.templat[kode] ?? data.templat.D6;
  return templat.map((t) => {
    if (t === '@kartuRumus') return rumusLangkah(langkah, nilai.Jenis, data.kartuRumus);
    if (t === '@petunjuk3') return isiTemplat((soal.level === 1 ? data.petunjukLevel1 : data.petunjukLevel2)[2], nilai);
    return isiTemplat(t, nilai);
  });
}

/** Teks jawaban benar satu langkah, ditampilkan setelah salah kedua (sementara, sebelum ④ di DV-12). */
export function jawabanBenarLangkah(soal, langkah) {
  const t = hitungTransaksi(soal.hb, soal.hj);
  const Jenis = t.jenis === 'untung' ? 'Untung' : 'Rugi';
  const [a, b] = t.jenis === 'untung' ? [soal.hj, soal.hb] : [soal.hb, soal.hj];
  const { pembilang, penyebut } = sederhanakan(t.selisih, soal.hb);
  switch (langkah) {
    case 1: return `HB = ${formatRupiah(soal.hb)} · HJ = ${formatRupiah(soal.hj)} · Ditanya: persen ${t.jenis}`;
    case 2: return `HB = ${formatRupiah(soal.hb)} · HJ = ${formatRupiah(soal.hj)}`;
    case 3: return `${t.jenis === 'untung' ? '▲' : '▼'} ${Jenis}, karena harga jual ${t.jenis === 'untung' ? 'lebih besar' : 'lebih kecil'} dari harga beli`;
    case 4: return `${Jenis} = ${formatAngka(a)} − ${formatAngka(b)} = ${formatRupiah(t.selisih)}`;
    case 5: return `% ${Jenis} = ${Jenis} ÷ HB × 100%`;
    case 6: return `${formatAngka(t.selisih)} ÷ ${formatAngka(soal.hb)} × 100% = ${pembilang}/${penyebut} × 100% = ${formatPersen(t.persen)}`;
    case 7:
      return soal.level === 1
        ? `${formatAngka(soal.hb)} ${t.jenis === 'untung' ? '+' : '−'} ${formatAngka(t.selisih)} = ${formatAngka(soal.hj)} ✓`
        : `${formatPersen(t.persen)} × ${formatAngka(soal.hb)} = ${formatAngka(t.selisih)} ✓`;
    default: return '';
  }
}

/** Kalimat soal Level 1–2 dari templat `teksLevel` (D-04 §1–2). */
export function teksSoalLangsung(soal, data) {
  const barang = soal.barang.charAt(0).toLowerCase() + soal.barang.slice(1);
  return data.teksLevel[String(soal.level)].map((t) =>
    t.replace('{barang}', barang).replace('{HB}', formatRupiah(soal.hb)).replace('{HJ}', formatRupiah(soal.hj)),
  );
}

/**
 * Perintah hitung balik langkah 7 (D-04: Level 1 HB ± besar; Level 2–3 persen × HB).
 * Selalu memakai nilai kunci, karena langkah sebelumnya sudah benar atau jawabannya sudah ditampilkan.
 */
export function perintahHitungBalik(soal) {
  const t = hitungTransaksi(soal.hb, soal.hj);
  if (soal.level === 1) return `Hitung balik: ${formatAngka(soal.hb)} ${t.jenis === 'untung' ? '+' : '−'} ${formatAngka(t.selisih)} = …`;
  return `Hitung balik: ${formatPersen(t.persen)} × ${formatAngka(soal.hb)} = …`;
}
