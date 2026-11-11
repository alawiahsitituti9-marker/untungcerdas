import { useEffect, useState } from 'react';
import KepalaFokus from '../komponen/KepalaFokus.jsx';
import IsiKartuRumus from '../komponen/IsiKartuRumus.jsx';
import { muatMateri } from '../layanan/konten.js';

// P05 Kartu Rumus sebagai halaman penuh (dibuka dari Daftar Materi). Dari P04 dan P09
// Kartu Rumus dibuka sebagai lembar bawah agar jawaban tidak hilang (design.md §5).
export default function KartuRumus() {
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState('');

  useEffect(() => {
    muatMateri().then((d) => setData(d.kartuRumus)).catch((e) => setGalat(e.message));
  }, []);

  return (
    <main className="halaman halaman--fokus">
      <KepalaFokus judul="Kartu Rumus" kembaliKe="/materi" />
      {galat && <p className="pesan-galat" role="alert">{galat}</p>}
      {!data && !galat && <p className="teks-redup">Memuat…</p>}
      {data && <IsiKartuRumus data={data} />}
    </main>
  );
}
