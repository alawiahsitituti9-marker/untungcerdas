import { Link } from 'react-router-dom';

// P08 Pilih Level (design.md §3, F09). Halaman soal lengkap dibuat di DV-10.
// Kartu Latihan Literasi Matematis (F14) mengarah ke P12 (design.md §17.1).
const LEVEL = [
  { n: 1, ket: 'Untung atau rugi, dan berapa besarnya?' },
  { n: 2, ket: 'Berapa persennya?' },
  { n: 3, ket: 'Soal cerita pendek' },
  { n: 4, ket: 'Soal cerita penerapan' },
];

export default function PilihLevel() {
  return (
    <main className="halaman">
      <h1>Latihan</h1>
      <ul className="daftar">
        {LEVEL.map((l) => (
          <li key={l.n}>
            <div className="baris-daftar" aria-disabled="true">
              <span>Level {l.n}<small>{l.ket}</small></span>
              <small>Segera</small>
            </div>
          </li>
        ))}
      </ul>
      <section className="kartu">
        <h2>Latihan Literasi Matematis</h2>
        <p>4 soal cerita jual beli. Skor maksimal 24.</p>
        <Link to="/literasi" className="tombol-utama tombol-tautan">Buka latihan</Link>
      </section>
      <section className="kartu">
        <h2>Pratinjau: Tandai Informasi</h2>
        <p>Coba fitur penanda pada soal cerita Level 3.</p>
        <Link to="/latihan/tandai" className="tombol-kedua" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
          Coba sekarang
        </Link>
      </section>
    </main>
  );
}
