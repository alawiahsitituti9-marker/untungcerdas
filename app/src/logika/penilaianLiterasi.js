// Penilaian F14 Latihan Literasi Matematis (D-08 §4, architecture.md §10.2).
// Fungsi murni: tanpa React dan tanpa jaringan. Semua aturan rubrik dibaca dari literasi.json.
//
// Bentuk jawaban satu soal:
//   { [noTahap]: { isian: { [idBagian]: nilai }, bantuan?: number } }
//   nilai per jenis bagian:
//     tandai  → { [indeksSegmen]: 'HB' | 'HJ' | 'PERSEN' }
//     pilihan → indeks pilihan pada urutan asli di literasi.json
//     rupiah  → bilangan bulat (sudah dibaca dengan bacaRupiah)
//     persen  → bilangan (sudah dibaca dengan bacaPersen)
//
// Aturan umum rubrik (D-08 §4.1):
//   U1 tahap berbobot 1 bernilai 1 hanya jika semua isian benar
//   U2 tahap berbobot 2 dibagi menjadi beberapa poin (ML-1 tahap 3: rumus | tiga persen)
//   U3 persen benar dengan toleransi ±0,01
//   U4 penilaian konsekuen hanya untuk isian perhitungan (rupiah/persen) dan keputusan ML-1 tahap 4;
//      tidak pernah dari pilihan rumus/model (keputusan A, 12 November 2026)
//   U5 isian kosong = salah
//   U6 bantuan tidak mengurangi skor

import { hampirSama, TOLERANSI_BENAR } from './hitung.js';

export const SKOR_MAKS_INDIKATOR = 6;
export const SKOR_MAKS_TOTAL = 24;
export const JUMLAH_TAHAP = 23;
export const MAKS_BANTUAN_PER_TAHAP = 2;
export const MAKS_SARAN = 3;
/** Toleransi untuk mengenali pola kesalahan (D1/D2) dari isian yang sudah dibulatkan siswa. */
export const TOLERANSI_POLA = 0.05;

/** Kode untuk tahap yang (sebagian) belum dijawab. Saran memakai topik tahap (`tahap.saran`). */
export const KODE_KOSONG = 'KOSONG';

const kosong = (x) => x === undefined || x === null || x === '' || Number.isNaN(x);

/** Tandai dianggap belum dijawab bila tidak ada satu label pun. */
const belumDijawab = (bagian, nilai) =>
  bagian.jenis === 'tandai' ? !nilai || Object.keys(nilai).length === 0 : kosong(nilai);

function sama(bagian, a, b) {
  if (kosong(a) || kosong(b)) return false;
  return bagian.jenis === 'persen' ? hampirSama(a, b, TOLERANSI_BENAR) : a === b;
}

const isianTahap = (jawabanSoal, noTahap) => jawabanSoal?.[noTahap]?.isian ?? {};

/** Nilai yang diharapkan dari jawaban siswa sendiri di tahap sebelumnya (U4). */
function nilaiKonsekuen(aturan, jawabanSoal) {
  if (!aturan) return undefined;
  if (aturan.bagi) {
    const x = isianTahap(jawabanSoal, aturan.bagi.tahap)[aturan.bagi.bagian];
    return kosong(x) ? undefined : (x / aturan.pembagi) * 100;
  }
  if (aturan.tambah) {
    const x = isianTahap(jawabanSoal, aturan.tambah.tahap)[aturan.tambah.bagian];
    return kosong(x) ? undefined : x + aturan.nilai;
  }
  return undefined;
}

/**
 * Penanda Informasi. Segmen ber-`peran` (yang labelnya tersedia di tahap ini) wajib diberi label itu.
 * Segmen ber-`peranBoleh` boleh diberi label tersebut atau dibiarkan. Segmen lain harus tanpa label.
 */
function cekTandai(soal, labelTersedia, label) {
  if (!label || typeof label !== 'object') return false;
  return soal.segmen.every((s, i) => {
    const l = label[i];
    if (s.peran && labelTersedia.includes(s.peran)) return l === s.peran;
    if (s.peranBoleh) return l === undefined || s.peranBoleh.includes(l);
    return l === undefined;
  });
}

/** Himpunan isian dengan persen terbesar, misalnya ['pA', 'pB']. */
function himpunanTerbesar(ids, isian) {
  const nilai = ids.map((id) => isian[id]);
  if (nilai.some(kosong)) return null;
  const maks = Math.max(...nilai);
  return ids.filter((id) => hampirSama(isian[id], maks, TOLERANSI_BENAR));
}

const samaHimpunan = (a, b) => a && b && a.length === b.length && a.every((x) => b.includes(x));

/**
 * Menilai satu bagian isian.
 * @returns {{ benar: boolean, konsekuen: boolean, pilihan?: object }}
 */
function nilaiBagian(soal, bagian, nilai, jawabanSoal) {
  switch (bagian.jenis) {
    case 'tandai':
      return { benar: cekTandai(soal, bagian.label, nilai), konsekuen: false };
    case 'pilihan': {
      const p = kosong(nilai) ? undefined : bagian.pilihan[nilai];
      if (!p) return { benar: false, konsekuen: false };
      if (p.benar) return { benar: true, konsekuen: false, pilihan: p };
      if (bagian.konsekuenTerbesar) {
        const k = bagian.konsekuenTerbesar;
        const terbesar = himpunanTerbesar(k.bagian, isianTahap(jawabanSoal, k.tahap));
        if (samaHimpunan(terbesar, p.himpunan)) return { benar: true, konsekuen: true, pilihan: p };
      }
      return { benar: false, konsekuen: false, pilihan: p };
    }
    case 'rupiah':
    case 'persen': {
      if (sama(bagian, nilai, bagian.kunci)) return { benar: true, konsekuen: false };
      const harap = nilaiKonsekuen(bagian.konsekuen, jawabanSoal);
      if (harap !== undefined && sama(bagian, nilai, harap)) return { benar: true, konsekuen: true };
      return { benar: false, konsekuen: false };
    }
    default:
      throw new Error(`Jenis bagian tidak dikenal: ${bagian.jenis}`);
  }
}

/** Mencari pola kesalahan bilangan (D1, D2, …) yang cocok untuk semua isian di pola itu. */
function cariPola(tahap, isian) {
  return (tahap.pola ?? []).find((p) =>
    Object.entries(p.nilai).every(([id, v]) => !kosong(isian[id]) && Math.abs(isian[id] - v) <= TOLERANSI_POLA),
  );
}

/**
 * Menilai satu tahap.
 * @returns {{ no, skor, skorMaks, benar, konsekuen, kode, umpan, bagian, poin, bantuan, tahapAsalKonsekuen }}
 *   `kode`/`umpan` diisi bila tahap belum penuh. `umpan` null berarti pakai pembahasan.kesalahanUmum.
 */
export function nilaiTahap(soal, tahap, jawabanSoal = {}) {
  const isian = isianTahap(jawabanSoal, tahap.no);
  const hasilBagian = Object.fromEntries(
    tahap.bagian.map((b) => [b.id, nilaiBagian(soal, b, isian[b.id], jawabanSoal)]),
  );
  const poin = (tahap.poin ?? [tahap.bagian.map((b) => b.id)]).map((ids) => ids.every((id) => hasilBagian[id].benar));
  const skor = poin.filter(Boolean).length;
  const skorMaks = tahap.bobot;
  const penuh = skor === skorMaks;
  const konsekuen = penuh && Object.values(hasilBagian).some((h) => h.konsekuen);

  let kode = null;
  let umpan = null;
  if (!penuh) {
    const pilihanSalah = tahap.bagian
      .map((b) => hasilBagian[b.id])
      .find((h) => !h.benar && h.pilihan);
    const pola = cariPola(tahap, isian);
    const adaKosong = tahap.bagian.some((b) => belumDijawab(b, isian[b.id]));
    if (pilihanSalah) {
      kode = pilihanSalah.pilihan.kode ?? tahap.kodeUmum;
      umpan = pilihanSalah.pilihan.umpan ?? null;
    } else if (pola) {
      kode = pola.kode;
      umpan = pola.umpan;
    } else if (adaKosong) {
      // Isian yang belum dijawab tidak boleh diberi kode kesalahan konsep (D1, D3, …).
      kode = KODE_KOSONG;
    } else {
      kode = tahap.kodeUmum;
      umpan = tahap.umpanUmum ?? null;
    }
  }

  // Tahap sumber konsekuen, untuk pesan "Perbaiki angka di tahap {n}".
  const tahapAsalKonsekuen = konsekuen
    ? tahap.bagian
        .filter((b) => hasilBagian[b.id].konsekuen)
        .map((b) => b.konsekuen?.bagi?.tahap ?? b.konsekuen?.tambah?.tahap ?? b.konsekuenTerbesar?.tahap)[0]
    : null;

  return {
    no: tahap.no,
    skor,
    skorMaks,
    benar: penuh,
    konsekuen,
    tahapAsalKonsekuen,
    kode,
    umpan,
    poin,
    bagian: Object.fromEntries(Object.entries(hasilBagian).map(([id, h]) => [id, { benar: h.benar, konsekuen: h.konsekuen }])),
    bantuan: Math.min(jawabanSoal?.[tahap.no]?.bantuan ?? 0, MAKS_BANTUAN_PER_TAHAP),
    saran: penuh ? null : (tahap.saranKode?.[kode] ?? tahap.saran),
  };
}

/** Menilai satu soal (skor 0–6). */
export function nilaiSoal(soal, jawabanSoal = {}) {
  const tahap = soal.tahap.map((t) => nilaiTahap(soal, t, jawabanSoal));
  return {
    id: soal.id,
    indikator: soal.indikator,
    skor: tahap.reduce((n, t) => n + t.skor, 0),
    skorMaks: tahap.reduce((n, t) => n + t.skorMaks, 0),
    bantuan: tahap.reduce((n, t) => n + t.bantuan, 0),
    tahap,
  };
}

/** Pesan hasil per rentang skor indikator (D-08 §8). */
export function pesanSkor(konten, skor) {
  return konten.pesanSkor.find((p) => skor >= p.min && skor <= p.maks)?.teks ?? '';
}

/**
 * Saran materi (D-08 §7): dikumpulkan dari tahap yang belum penuh, diurutkan menurut
 * banyaknya tahap, paling banyak 3. Jika semua tahap benar → saran LEVEL4.
 */
export function pilihSaran(konten, hasilSoal) {
  const hitung = new Map();
  for (const s of hasilSoal) {
    for (const t of s.tahap) {
      if (t.saran) hitung.set(t.saran, (hitung.get(t.saran) ?? 0) + 1);
    }
  }
  const urutanKunci = Object.keys(konten.saran);
  const ids = hitung.size
    ? [...hitung.entries()]
        .sort((a, b) => b[1] - a[1] || urutanKunci.indexOf(a[0]) - urutanKunci.indexOf(b[0]))
        .slice(0, MAKS_SARAN)
        .map(([id]) => id)
    : ['LEVEL4'];
  return ids.map((id) => ({ id, ...konten.saran[id] }));
}

/**
 * Menilai seluruh latihan.
 * @param {object} konten  isi literasi.json
 * @param {{ [idSoal]: object }} jawaban
 */
export function nilaiLatihan(konten, jawaban = {}) {
  const hasilSoal = konten.soal.map((s) => nilaiSoal(s, jawaban[s.id]));
  const indikator = konten.indikator.map((ind) => {
    const h = hasilSoal.find((s) => s.id === ind.soal);
    return { ...ind, skor: h.skor, skorMaks: h.skorMaks, pesan: pesanSkor(konten, h.skor) };
  });
  return {
    versiRubrik: konten.versi_rubrik,
    soal: hasilSoal,
    indikator,
    total: indikator.reduce((n, i) => n + i.skor, 0),
    totalMaks: indikator.reduce((n, i) => n + i.skorMaks, 0),
    bantuan: hasilSoal.reduce((n, s) => n + s.bantuan, 0),
    saran: pilihSaran(konten, hasilSoal),
  };
}

/** Jawaban kunci lengkap untuk satu soal (dipakai uji dan pratinjau pengembang). */
export function jawabanKunci(soal) {
  const hasil = {};
  for (const t of soal.tahap) {
    const isian = {};
    for (const b of t.bagian) {
      if (b.jenis === 'tandai') {
        isian[b.id] = Object.fromEntries(
          soal.segmen.map((s, i) => [i, s.peran]).filter(([, p]) => p && b.label.includes(p)),
        );
      } else if (b.jenis === 'pilihan') {
        isian[b.id] = b.pilihan.findIndex((p) => p.benar);
      } else {
        isian[b.id] = b.kunci;
      }
    }
    hasil[t.no] = { isian };
  }
  return hasil;
}

/**
 * Memeriksa struktur literasi.json. Mengembalikan daftar masalah (kosong = valid).
 * Dipakai di uji unit dan bisa dipanggil aplikasi saat konten dimuat.
 */
export function validasiKonten(konten) {
  const m = [];
  const cek = (syarat, pesan) => { if (!syarat) m.push(pesan); };
  cek(Array.isArray(konten?.soal) && konten.soal.length === 4, 'Harus ada 4 soal');
  cek(Array.isArray(konten?.indikator) && konten.indikator.length === 4, 'Harus ada 4 indikator');
  if (m.length) return m;

  const idSoal = konten.soal.map((s) => s.id);
  cek(JSON.stringify([...konten.urutan].sort()) === JSON.stringify([...idSoal].sort()), 'urutan harus memuat keempat soal');
  let jumlahTahap = 0;
  let total = 0;

  for (const ind of konten.indikator) cek(idSoal.includes(ind.soal), `Indikator ${ind.no}: soal ${ind.soal} tidak ada`);

  for (const s of konten.soal) {
    const p = (x) => `${s.id}: ${x}`;
    cek(s.segmen?.length && s.pertanyaan && s.kunci_teks?.length && s.penyelesaian?.length && s.pengantar, p('data soal belum lengkap'));
    const bobot = s.tahap.reduce((n, t) => n + t.bobot, 0);
    cek(bobot === SKOR_MAKS_INDIKATOR, p(`jumlah bobot ${bobot}, seharusnya 6`));
    total += bobot;
    s.tahap.forEach((t, i) => {
      jumlahTahap += 1;
      const q = (x) => p(`tahap ${t.no}: ${x}`);
      cek(t.no === i + 1, q('nomor tahap tidak berurutan'));
      cek(t.perintah && t.bagian?.length, q('perintah atau bagian kosong'));
      cek(Array.isArray(t.bantuan) && t.bantuan.length === MAKS_BANTUAN_PER_TAHAP && t.bantuan.every(Boolean), q('harus ada 2 bantuan'));
      for (const f of ['benar', 'kesalahanUmum', 'konsep', 'cara', 'hasil']) cek(t.pembahasan?.[f], q(`pembahasan.${f} kosong`));
      cek(t.kodeUmum && t.saran && konten.saran[t.saran], q('kodeUmum/saran tidak valid'));
      for (const id of Object.values(t.saranKode ?? {})) cek(konten.saran[id], q(`saranKode ${id} tidak ada`));
      const poin = t.poin ?? [t.bagian.map((b) => b.id)];
      cek(poin.length === t.bobot, q(`jumlah poin ${poin.length} ≠ bobot ${t.bobot}`));
      const idBagian = t.bagian.map((b) => b.id);
      cek(poin.flat().every((id) => idBagian.includes(id)), q('poin merujuk bagian yang tidak ada'));
      for (const b of t.bagian) {
        if (b.jenis === 'pilihan') {
          cek(b.pilihan.filter((x) => x.benar).length === 1, q(`${b.id}: harus tepat satu pilihan benar`));
          cek(b.pilihan.filter((x) => !x.benar).every((x) => x.kode), q(`${b.id}: pilihan salah harus punya kode`));
        } else if (b.jenis === 'rupiah' || b.jenis === 'persen') {
          cek(typeof b.kunci === 'number', q(`${b.id}: kunci bukan angka`));
          const k = b.konsekuen;
          const asal = k?.bagi ?? k?.tambah;
          if (k) cek(asal && asal.tahap < t.no, q(`${b.id}: konsekuen harus berbentuk bagi/tambah dan merujuk tahap sebelumnya`));
          // Konsekuen hanya boleh merujuk isian angka, bukan pilihan rumus/model (U4).
          const sumber = asal && s.tahap[asal.tahap - 1]?.bagian.find((x) => x.id === asal.bagian);
          if (k) cek(sumber && sumber.jenis !== 'pilihan', q(`${b.id}: konsekuen harus merujuk isian angka`));
        } else if (b.jenis === 'tandai') {
          cek(s.segmen.some((x) => x.peran && b.label.includes(x.peran)), q('tidak ada segmen kunci untuk ditandai'));
        } else {
          m.push(q(`jenis bagian tidak dikenal: ${b.jenis}`));
        }
      }
    });
  }
  cek(jumlahTahap === JUMLAH_TAHAP, `Jumlah tahap ${jumlahTahap}, seharusnya ${JUMLAH_TAHAP}`);
  cek(total === SKOR_MAKS_TOTAL, `Total skor ${total}, seharusnya ${SKOR_MAKS_TOTAL}`);
  return m;
}
