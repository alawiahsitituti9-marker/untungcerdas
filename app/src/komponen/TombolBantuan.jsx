import TeksKaya from './TeksKaya.jsx';

// Bantuan bertahap F14 (D-08 §6, LM-03) dan Petunjuk Bertingkat F11 (D-05 §2):
// dibuka satu tingkat per ketukan. `nama` = "Bantuan" (F14) atau "Petunjuk" (F11).
export function TombolBantuan({ terbuka, total, onBuka, nama = 'Bantuan' }) {
  const sisa = total - terbuka;
  return (
    <button type="button" className="tombol-kedua" onClick={onBuka} disabled={sisa === 0}>
      {sisa === 0 ? `${nama} habis` : `${nama} (${sisa} lagi)`}
    </button>
  );
}

export function DaftarBantuan({ bantuan, terbuka, pesanHabis, nama = 'Bantuan' }) {
  if (terbuka === 0) return null;
  return (
    <div className="kotak-bantuan" aria-live="polite">
      {bantuan.slice(0, terbuka).map((b, i) => (
        <p key={i}>
          <b>{nama} {i + 1}:</b> <TeksKaya teks={b} />
        </p>
      ))}
      {terbuka >= bantuan.length && pesanHabis && <p className="teks-redup">{pesanHabis}</p>}
    </div>
  );
}
