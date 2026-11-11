import { Link, useOutletContext } from 'react-router-dom';
import { bacaTerbaik } from '../layanan/progresLatihan.js';
import { levelTerbuka, SYARAT_BUKA, JUMLAH_SOAL_SESI } from '../logika/panduan.js';

// P08 Pilih Level (design.md §3, §6 P11, F09; KFN-11).
// Level terbuka berurutan (design.md §4, [Asumsi] 4 dari 5 benar).
// Kartu Latihan Literasi Matematis (F14) mengarah ke P12 (design.md §17.1).
const LEVEL = [
  { n: 1, ket: 'Untung atau rugi, dan berapa besarnya?' },
  { n: 2, ket: 'Berapa persennya?' },
  { n: 3, ket: 'Soal cerita pendek' },
  { n: 4, ket: 'Soal cerita penerapan' },
];
const LEVEL_SIAP = [1, 2, 3]; // Level 4 dibuat di DV-10 bagian B

export default function PilihLevel() {
  const { sesi } = useOutletContext();
  const terbaik = bacaTerbaik(sesi.kodeTampil);
  const buka = levelTerbuka(terbaik);

  return (
    <main className="halaman">
      <h1>Latihan</h1>
      <ul className="daftar">
        {LEVEL.map((l) => {
          const terbuka = buka.includes(l.n) && LEVEL_SIAP.includes(l.n);
          const status = !LEVEL_SIAP.includes(l.n)
            ? 'Segera'
            : !buka.includes(l.n)
              ? '🔒'
              : terbaik[l.n] != null
                ? `${terbaik[l.n]}/${JUMLAH_SOAL_SESI} benar`
                : '›';
          const isi = (
            <>
              <span>Level {l.n}<small>{l.ket}</small></span>
              <small aria-label={status === '🔒' ? 'Terkunci' : undefined}>{status}</small>
            </>
          );
          return (
            <li key={l.n}>
              {terbuka ? (
                <Link className="baris-daftar" to={`/latihan/level/${l.n}`}>{isi}</Link>
              ) : (
                <div className="baris-daftar" aria-disabled="true">{isi}</div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="teks-redup">Level berikutnya terbuka jika {SYARAT_BUKA} dari {JUMLAH_SOAL_SESI} soal benar.</p>
      {buka.includes(2) && (
        <p className="teks-redup">
          Sebelum Level 2, coba dulu <Link to="/contoh/C4">Contoh Sebagian C4</Link>.
        </p>
      )}

      <section className="kartu">
        <h2>Latihan Literasi Matematis</h2>
        <p>4 soal cerita jual beli. Skor maksimal 24.</p>
        <Link to="/literasi" className="tombol-utama tombol-tautan">Buka latihan</Link>
      </section>
    </main>
  );
}
