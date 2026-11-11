import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { nilaiCekCepat, acakUrutan } from '../src/logika/cekCepat.js';
import { hitungTransaksi } from '../src/logika/hitung.js';
import { formatRupiah } from '../src/logika/format.js';
import { CONTOH_MATERI } from './data-soal.js';

const { materi, kartuRumus } = JSON.parse(readFileSync(new URL('../public/data/materi.json', import.meta.url), 'utf8'));
const tanpaTebal = (t) => t.replace(/\*\*/g, '');

// Kalimat dipisah pada . ? ! yang diikuti spasi atau akhir teks (angka seperti 80.000 tidak terpotong).
const kalimat = (t) => tanpaTebal(t).split(/(?<=[.?!])\s+/).filter(Boolean);
// Kata = token yang memuat huruf atau angka (simbol seperti ▲ dan = tidak dihitung).
const kata = (k) => k.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

const semuaKartu = materi.flatMap((m) => m.kartu.map((k, i) => [`${m.id} kartu ${i + 1}`, k]));

describe('materi.json: jumlah kartu sesuai D-03', () => {
  it('M0–M6 memiliki 3, 3, 3, 3, 3, 5, 4 kartu', () => {
    expect(materi.map((m) => m.kartu.length)).toEqual([3, 3, 3, 3, 3, 5, 4]);
  });
  it('setiap submateri diakhiri satu cek cepat L0-Mx (KFN-05)', () => {
    for (const m of materi) expect(m.cek.id).toBe(`L0-${m.id}`);
  });
});

describe('materi.json: aturan bahasa (AGENTS.md §4)', () => {
  it.each(semuaKartu)('%s: ≤ 3 kalimat, ≤ 15 kata per kalimat', (_, k) => {
    const ks = kalimat(k.teks);
    expect(ks.length).toBeLessThanOrEqual(3);
    for (const x of ks) expect(kata(x).length, x).toBeLessThanOrEqual(15);
  });
});

describe('materi.json: gambar selalu berlabel harga', () => {
  it.each(semuaKartu.filter(([, k]) => k.gambar))('%s', (_, k) => {
    expect(k.gambar.hb).toBeGreaterThan(0);
    if (k.gambar.batang) expect(k.gambar.hj).toBeGreaterThan(0);
    else expect(['tas', 'sepatu']).toContain(k.gambar.barang);
  });
});

describe('materi.json: angka rumus terisi', () => {
  // Kumpulkan semua rantai pecahan dari kartu materi dan contoh Kartu Rumus.
  const rantai = [...semuaKartu, ['Kartu Rumus contoh', kartuRumus.contoh]].flatMap(([nama, k]) =>
    (k.rumus ?? []).filter((b) => b.rantai).map((b) => [nama, b]),
  );

  it.each(rantai)('%s: pecahan dalam satu rantai bernilai sama, hasil persen benar', (_, b) => {
    const pecahan = b.rantai.filter((r) => typeof r === 'object');
    const nilai = pecahan[0].p / pecahan[0].q;
    for (const f of pecahan) expect(f.p / f.q).toBeCloseTo(nilai, 10);

    const akhir = typeof b.rantai.at(-1) === 'string' ? tanpaTebal(b.rantai.at(-1)) : '';
    const persen = akhir.match(/× 100% = ([\d,]+)%$/);
    if (persen) expect(Number(persen[1].replace(',', '.'))).toBeCloseTo(nilai * 100, 2);
    // Baris "salah" memang memakai harga jual sebagai pembagi (M5 kartu 5).
    if (b.tanda === 'salah') expect(pecahan[0].ket).toBe('harga jual');
    else if (pecahan[0].ket) expect(pecahan[0].ket).toBe('harga beli');
  });

  it('transaksi tas dan sepatu sesuai verifikasi D-03 §4', () => {
    for (const [nama, hb, hj, jenis, selisih, persen] of CONTOH_MATERI.slice(0, 2)) {
      const t = hitungTransaksi(hb, hj);
      expect([t.jenis, t.selisih, t.persen], nama).toEqual([jenis, selisih, persen]);
    }
    const teksM3 = materi[3].kartu[1].rumus[0].teks;
    expect(teksM3).toContain(formatRupiah(20000));
    const teksM4 = materi[4].kartu[1].rumus[0].teks;
    expect(teksM4).toContain(formatRupiah(10000));
  });
});

describe('cek cepat: kunci dari D-03', () => {
  const benar = (m) => m.cek.pilihan?.find((p) => p.benar)?.teks;
  it('kunci tiap submateri', () => {
    expect(materi.map((m) => benar(m) ?? m.cek.kunci)).toEqual(['20%', 'Rp2.000', '▼ Rugi', 6000, 5000, '20%', '25%']);
  });
  it('tepat satu pilihan benar, pilihan salah punya umpan balik', () => {
    for (const m of materi.filter((x) => x.cek.tipe === 'pilihan')) {
      for (const grup of [m.cek.pilihan, m.cek.alasan?.pilihan].filter(Boolean)) {
        expect(grup.filter((p) => p.benar), m.id).toHaveLength(1);
        for (const p of grup.filter((x) => !x.benar)) expect(p.umpan ?? m.cek.umpanSalah, `${m.id} ${p.teks}`).toBeTruthy();
      }
    }
  });
  it('kunci isian rupiah dihitung ulang dari HB dan HJ di soal', () => {
    expect(hitungTransaksi(30000, 36000).selisih).toBe(materi[3].cek.kunci);
    expect(hitungTransaksi(25000, 20000).selisih).toBe(materi[4].cek.kunci);
  });
});

describe('nilaiCekCepat', () => {
  const cekPilihan = materi.find((m) => m.id === 'M5').cek;
  const cekAlasan = materi.find((m) => m.id === 'M2').cek;
  const cekRupiah = materi.find((m) => m.id === 'M3').cek;
  const pilih = (cek, teks) => cek.pilihan.find((p) => p.teks === teks);

  it('pilihan benar', () => {
    expect(nilaiCekCepat(cekPilihan, { pilihan: pilih(cekPilihan, '20%') })).toEqual({ benar: true });
  });
  it('D1 (membagi harga jual) memberi umpan balik khusus', () => {
    const h = nilaiCekCepat(cekPilihan, { pilihan: pilih(cekPilihan, '16,67%') });
    expect(h.benar).toBe(false);
    expect(h.umpan).toContain('harga jual');
  });
  it('jenis benar tetapi alasan salah tetap salah', () => {
    const h = nilaiCekCepat(cekAlasan, { pilihan: pilih(cekAlasan, '▼ Rugi'), alasan: cekAlasan.alasan.pilihan[1] });
    expect(h).toEqual({ benar: false, umpan: cekAlasan.alasan.pilihan[1].umpan });
  });
  it('jenis dan alasan benar', () => {
    expect(nilaiCekCepat(cekAlasan, { pilihan: pilih(cekAlasan, '▼ Rugi'), alasan: cekAlasan.alasan.pilihan[0] }).benar).toBe(true);
  });
  it('isian rupiah', () => {
    expect(nilaiCekCepat(cekRupiah, { rupiah: 6000 })).toEqual({ benar: true });
    expect(nilaiCekCepat(cekRupiah, { rupiah: 66000 })).toEqual({ benar: false, umpan: cekRupiah.umpanSalah });
  });
  it('pilihan tanpa umpan khusus memakai umpanSalah (M0)', () => {
    const cek = materi[0].cek;
    expect(nilaiCekCepat(cek, { pilihan: cek.pilihan[1] }).umpan).toBe(cek.umpanSalah);
  });
});

describe('acakUrutan', () => {
  it('mempertahankan semua anggota dan tidak mengubah daftar asli', () => {
    const asli = [1, 2, 3, 4];
    const hasil = acakUrutan(asli, () => 0);
    expect([...hasil].sort()).toEqual(asli);
    expect(asli).toEqual([1, 2, 3, 4]);
    expect(hasil).not.toEqual(asli);
  });
});
