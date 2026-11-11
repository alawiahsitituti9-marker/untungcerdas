import TeksKaya from './TeksKaya.jsx';
import { formatAngka } from '../logika/format.js';

// Rumus terisi angka (design.md §7). Setiap baris berupa teks biasa atau
// rantai pecahan bertingkat, misalnya 20.000/80.000 × 100% = 25%.
// `tanda` memberi warna + ikon + teks: untung ▲, rugi ▼, salah ✗, benar ✓.

const TANDA = {
  untung: { ikon: '▲', teks: null },
  rugi: { ikon: '▼', teks: null },
  impas: { ikon: null, teks: null },
  salah: { ikon: '✗', teks: 'Salah:' },
  benar: { ikon: '✓', teks: 'Benar:' },
};

function Pecahan({ p, q, ket }) {
  return (
    <span className="pecahan">
      <span className="pecahan__atas">{formatAngka(p)}</span>
      <span className="sr-only"> dibagi </span>
      <span className="pecahan__bawah">{formatAngka(q)}</span>
      {ket && <small className="pecahan__ket">↑ {ket}</small>}
    </span>
  );
}

function Baris({ baris }) {
  const tanda = TANDA[baris.tanda];
  // Ikon ▲/▼ tidak diulang bila teks sudah memuatnya (misalnya "→ ▲ Untung").
  const tampilIkon = tanda?.ikon && !(baris.teks && baris.teks.includes(tanda.ikon));
  return (
    <div className={`rumus-baris${baris.rantai ? ' rumus-baris--rantai' : ''}${baris.tanda ? ` rumus-baris--${baris.tanda}` : ''}`}>
      {tampilIkon && <span className="rumus-baris__ikon" aria-hidden="true">{tanda.ikon}</span>}
      {tanda?.teks && <span className="rumus-baris__label">{tanda.teks}</span>}
      {baris.teks != null && <span><TeksKaya teks={baris.teks} /></span>}
      {baris.rantai?.map((r, i) =>
        typeof r === 'string' ? <span key={i}><TeksKaya teks={r} /></span> : <Pecahan key={i} {...r} />,
      )}
    </div>
  );
}

export default function RumusTerisi({ baris }) {
  if (!baris?.length) return null;
  return (
    <div className="rumus-terisi">
      {baris.map((b, i) => <Baris key={i} baris={b} />)}
    </div>
  );
}
