// ④ Penyelesaian benar (F10; D-05 §3.3): format 7 langkah seperti Contoh Bertahap C1 (D-03 §2),
// diisi nilai soal (D-05 §5). Level 1 hanya langkah 2, 3, 4, dan 7; Level 3 dimulai dari langkah 1 (Tandai).
// Teks penjelasan per langkah memakai kalimat C1 (untung) dan C2 (rugi) yang sudah disetujui.

import { hitungTransaksi, sederhanakan } from './hitung.js';
import { formatAngka, formatRupiah, formatPersen } from './format.js';

const LANGKAH_LEVEL = { 1: [2, 3, 4, 7], 2: [2, 3, 4, 5, 6, 7], 3: [1, 2, 3, 4, 5, 6, 7] };

/**
 * @returns {{ no: number, judul: string, teks?: string, hasil: object[] }[]}
 *   `hasil` memakai bentuk baris RumusTerisi ({ teks, tanda } atau { rantai }).
 */
export function penyelesaianSoal(soal) {
  const t = hitungTransaksi(soal.hb, soal.hj);
  const untung = t.jenis === 'untung';
  const Jenis = untung ? 'Untung' : 'Rugi';
  const tanda = t.jenis;
  const [a, b] = untung ? [soal.hj, soal.hb] : [soal.hb, soal.hj];
  const { pembilang, penyebut } = sederhanakan(t.selisih, soal.hb);
  const persen = formatPersen(t.persen);

  const semua = {
    1: {
      judul: '1. Tandai',
      teks: 'Cari kata "membeli" dan "dijual". Lalu cari yang ditanyakan.',
      hasil: [{ teks: `${formatRupiah(soal.hb)} = HB · ${formatRupiah(soal.hj)} = HJ · Ditanya: persen ${t.jenis}` }],
    },
    2: { judul: '2. HB dan HJ', teks: 'Tulis harga beli dan harga jual.', hasil: [{ teks: `HB = ${formatRupiah(soal.hb)} · HJ = ${formatRupiah(soal.hj)}` }] },
    3: {
      judul: '3. Untung atau rugi?',
      teks: untung ? 'Harga jual lebih besar dari harga beli.' : 'Harga jual lebih kecil dari harga beli.',
      hasil: [{ teks: `${untung ? '▲' : '▼'} **${Jenis}**`, tanda }],
    },
    4: {
      judul: `4. Besar ${t.jenis}`,
      teks: untung ? 'Harga jual dikurangi harga beli.' : 'Harga beli dikurangi harga jual.',
      hasil: [{ teks: `${formatAngka(a)} − ${formatAngka(b)} = **${formatRupiah(t.selisih)}**`, tanda }],
    },
    5: {
      judul: '5. Pilih rumus',
      teks: untung ? 'Persentase untung dibagi harga beli.' : 'Persentase rugi juga dibagi harga beli.',
      hasil: [{ teks: `% ${Jenis} = ${Jenis} ÷ HB × 100%`, tanda }],
    },
    6: {
      judul: '6. Hitung',
      teks: 'Masukkan angkanya.',
      hasil: [{
        rantai: pembilang === t.selisih
          ? [{ p: t.selisih, q: soal.hb, ket: 'harga beli' }, `× 100% = **${persen}**`]
          : [{ p: t.selisih, q: soal.hb, ket: 'harga beli' }, '× 100% =', { p: pembilang, q: penyebut }, `× 100% = **${persen}**`],
      }],
    },
    7: soal.level === 1
      ? {
          judul: '7. Periksa',
          teks: 'Harga beli ditambah untung (atau dikurangi rugi) harus sama dengan harga jual.',
          hasil: [{ teks: `${formatAngka(soal.hb)} ${untung ? '+' : '−'} ${formatAngka(t.selisih)} = ${formatAngka(soal.hj)} ✓` }],
        }
      : {
          judul: '7. Periksa',
          teks: `Hitung balik: ${persen} dari harga beli. Hasilnya harus sama dengan ${t.jenis}.`,
          hasil: [{ teks: `${persen} × ${formatAngka(soal.hb)} = ${formatAngka(t.selisih)} ✓` }],
        },
  };
  return (LANGKAH_LEVEL[soal.level] ?? []).map((no) => ({ no, ...semua[no] }));
}
