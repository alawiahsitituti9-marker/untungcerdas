import { useState } from 'react';
import TeksKaya from './TeksKaya.jsx';
import RumusTerisi from './RumusTerisi.jsx';
import KartuMateri from './KartuMateri.jsx';

// Isi Kartu Rumus (P05, F04): 4 rumus, arti simbol, dan satu contoh (KFN-06).
// Dipakai sebagai halaman penuh (/rumus) dan di dalam LembarBawah.
export default function IsiKartuRumus({ data }) {
  const [lihatContoh, setLihatContoh] = useState(false);
  return (
    <div className="isi-kartu-rumus">
      <RumusTerisi baris={data.rumus} />
      <dl className="daftar-simbol">
        {data.simbol.map((s) => (
          <div key={s.kode}>
            <dt className={`simbol--${s.kode.toLowerCase()}`}>{s.kode}</dt>
            <dd>= {s.arti}</dd>
          </div>
        ))}
      </dl>
      <p className="kotak-ingat"><TeksKaya teks={data.ingat} /></p>
      <button type="button" className="tombol-kedua" aria-expanded={lihatContoh} onClick={() => setLihatContoh((x) => !x)}>
        {lihatContoh ? 'Tutup contoh' : 'Lihat contoh'}
      </button>
      {lihatContoh && (
        <section className="kartu" style={{ marginTop: 12 }} aria-label="Contoh">
          <KartuMateri kartu={data.contoh} />
        </section>
      )}
    </div>
  );
}
