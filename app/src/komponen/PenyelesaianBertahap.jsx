import { useState } from 'react';
import TeksKaya from './TeksKaya.jsx';
import RumusTerisi from './RumusTerisi.jsx';

// ④ Penyelesaian benar (F10) dalam format Contoh Bertahap: satu langkah per ketukan,
// langkah sebelumnya diredupkan, "Ulangi dari awal" di langkah terakhir (design.md §6 P06; D-05 §3.3).
export default function PenyelesaianBertahap({ langkah }) {
  const [tampil, setTampil] = useState(1);
  return (
    <section className="penyelesaian-bertahap" aria-live="polite" aria-label="Penyelesaian benar">
      <ol className="daftar-langkah">
        {langkah.slice(0, tampil).map((l, i) => (
          <li key={l.no} className={`langkah-contoh${i < tampil - 1 ? ' langkah-contoh--lama' : ''}`}>
            <p className="langkah-contoh__judul">{l.judul}</p>
            {l.teks && <p><TeksKaya teks={l.teks} /></p>}
            <RumusTerisi baris={l.hasil} />
          </li>
        ))}
      </ol>
      {tampil < langkah.length ? (
        <button type="button" className="tombol-kedua" onClick={() => setTampil((n) => n + 1)}>Langkah berikutnya</button>
      ) : (
        <button type="button" className="tombol-teks" onClick={() => setTampil(1)}>Ulangi dari awal</button>
      )}
    </section>
  );
}
