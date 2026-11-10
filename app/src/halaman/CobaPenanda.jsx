import { useEffect, useState } from 'react';
import KepalaFokus from '../komponen/KepalaFokus.jsx';
import TeksBertanda from '../komponen/TeksBertanda.jsx';
import { muatSoal } from '../layanan/konten.js';
import { diagnosisLangkah } from '../logika/diagnosis.js';

// Pratinjau Penanda Informasi (DV-09) pada soal Level 3.
// Di DV-10, komponen ini menjadi langkah 1 dari Panduan Langkah di halaman Soal.
// Alur dua kesempatan sesuai D-05 §3.1.

function pembahasan(hasil, soal) {
  if (hasil.kode === 'D5') {
    return [
      'Harga beli dan harga jual yang kamu tandai belum tepat.',
      'Harga saat membeli adalah harga beli. Harga saat menjual adalah harga jual.',
      `Cari kata kunci di soal. "${soal.kataKunci.HB}" menunjuk harga beli. "${soal.kataKunci.HJ}" menunjuk harga jual.`,
    ];
  }
  return [
    'Jawabanmu belum tepat di Langkah 1.',
    'Tandai juga kalimat yang ditanyakan.',
    'Kalimat tanya biasanya ada di akhir soal.',
  ];
}

const kunciLabel = (soal) =>
  Object.fromEntries(soal.segmen.map((s, i) => [i, s.peran]).filter(([, p]) => p && p !== 'PENGECOH'));

export default function CobaPenanda() {
  const [daftar, setDaftar] = useState(null);
  const [galat, setGalat] = useState('');
  const [indeks, setIndeks] = useState(0);
  const [label, setLabel] = useState({});
  const [hasil, setHasil] = useState(null);
  const [percobaan, setPercobaan] = useState(0);

  useEffect(() => {
    muatSoal()
      .then((d) => setDaftar(d.soal.filter((s) => s.level === 3)))
      .catch((e) => setGalat(e.message));
  }, []);

  if (galat) return <main className="halaman halaman--fokus"><KepalaFokus judul="Tandai Informasi" /><p className="pesan-galat">{galat}</p></main>;
  if (!daftar) return <main className="halaman halaman--fokus"><KepalaFokus judul="Tandai Informasi" /><p className="teks-redup">Memuat…</p></main>;

  const soal = daftar[indeks];
  const selesai = hasil?.benar || percobaan >= 2;
  const labelTampil = !hasil?.benar && percobaan >= 2 ? kunciLabel(soal) : label;

  const periksa = () => {
    const h = diagnosisLangkah(1, label, soal);
    setHasil(h);
    if (!h.benar) setPercobaan((p) => p + 1);
  };
  const soalBerikutnya = () => {
    setIndeks((indeks + 1) % daftar.length);
    setLabel({});
    setHasil(null);
    setPercobaan(0);
  };

  return (
    <main className="halaman halaman--fokus">
      <KepalaFokus judul="Tandai Informasi" kembaliKe="/latihan" />
      <p className="teks-redup">Soal {indeks + 1} dari {daftar.length} · Langkah 1: Tandai</p>

      <TeksBertanda segmen={soal.segmen} label={labelTampil} onUbah={(l) => { setLabel(l); setHasil(null); }} terkunci={selesai} />

      {hasil && (
        <div className={`umpan-balik umpan-balik--${hasil.benar ? 'benar' : 'salah'}`} role="status">
          {hasil.benar ? (
            <p style={{ fontWeight: 700 }}>Semua tanda sudah tepat.</p>
          ) : percobaan >= 2 ? (
            <>
              <p style={{ fontWeight: 700 }}>Ini tanda yang benar.</p>
              <p>Harga beli: {soal.segmen.find((s) => s.peran === 'HB').teks}. Harga jual: {soal.segmen.find((s) => s.peran === 'HJ').teks}.</p>
            </>
          ) : (
            pembahasan(hasil, soal).map((t, i) => <p key={i} style={i === 0 ? { fontWeight: 700 } : undefined}>{t}</p>)
          )}
        </div>
      )}

      {selesai ? (
        <button type="button" className="tombol-utama" onClick={soalBerikutnya}>Soal berikutnya</button>
      ) : (
        hasil && !hasil.benar ? (
          <button type="button" className="tombol-utama" onClick={() => setHasil(null)}>Coba lagi</button>
        ) : (
          <button type="button" className="tombol-utama" onClick={periksa} disabled={Object.keys(label).length === 0}>
            Periksa
          </button>
        )
      )}
    </main>
  );
}
