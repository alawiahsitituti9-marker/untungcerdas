import TeksKaya from './TeksKaya.jsx';

// Bantuan bertahap F14 (D-08 §6, LM-03): dibuka satu tingkat per ketukan, maksimal 2.
// Bantuan tidak mengurangi skor; jumlahnya dicatat (KL-06).
export function TombolBantuan({ terbuka, total, onBuka }) {
  const sisa = total - terbuka;
  return (
    <button type="button" className="tombol-kedua" onClick={onBuka} disabled={sisa === 0}>
      {sisa === 0 ? 'Bantuan habis' : `Bantuan (${sisa} lagi)`}
    </button>
  );
}

export function DaftarBantuan({ bantuan, terbuka, pesanHabis }) {
  if (terbuka === 0) return null;
  return (
    <div className="kotak-bantuan" aria-live="polite">
      {bantuan.slice(0, terbuka).map((b, i) => (
        <p key={i}>
          <b>Bantuan {i + 1}:</b> <TeksKaya teks={b} />
        </p>
      ))}
      {terbuka >= bantuan.length && <p className="teks-redup">{pesanHabis}</p>}
    </div>
  );
}
