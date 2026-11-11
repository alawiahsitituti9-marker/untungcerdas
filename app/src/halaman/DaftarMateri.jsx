import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { muatMateri } from '../layanan/konten.js';

// P03 Daftar Materi (design.md §3, F03). Semua submateri bisa dibuka bebas (design.md §4).
export default function DaftarMateri() {
  const [materi, setMateri] = useState(null);
  const [contoh, setContoh] = useState([]);
  const [galat, setGalat] = useState('');

  useEffect(() => {
    muatMateri()
      .then((d) => {
        setMateri(d.materi);
        setContoh(d.contoh ?? []);
      })
      .catch((e) => setGalat(e.message));
  }, []);

  return (
    <main className="halaman">
      <h1>Materi</h1>
      {galat && <p className="pesan-galat" role="alert">{galat}</p>}
      {!materi && !galat && <p className="teks-redup">Memuat…</p>}
      {materi && (
        <ul className="daftar">
          {materi.map((m) => (
            <li key={m.id}>
              <Link className="baris-daftar" to={`/materi/${m.id}`}>
                <span>
                  {m.id} {m.judul}
                  {m.opsional && ' (pilihan)'}
                  <small>{m.ringkas}</small>
                </span>
                <span aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {contoh.length > 0 && (
        <>
          <h2>Contoh Bertahap</h2>
          <ul className="daftar">
            {contoh.map((c) => (
              <li key={c.id}>
                <Link className="baris-daftar" to={`/contoh/${c.id}`}>
                  <span>{c.id} {c.judul}</span>
                  <span aria-hidden="true">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <ul className="daftar">
        <li><Link className="baris-daftar" to="/rumus">Kartu Rumus<span aria-hidden="true">›</span></Link></li>
        <li><Link className="baris-daftar" to="/simulasi">Simulasi Jual Beli<span aria-hidden="true">›</span></Link></li>
      </ul>
    </main>
  );
}
