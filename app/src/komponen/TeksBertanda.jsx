import { useState } from 'react';

// Penanda Informasi Penting (F06, design.md §6 P09).
// Siswa mengetuk bagian soal, lalu memilih labelnya. Label tampil dengan warna dan teks tetap.

export const LABEL = [
  { id: 'HB', teks: 'Harga beli', tag: 'Beli' },
  { id: 'HJ', teks: 'Harga jual', tag: 'Jual' },
  { id: 'SELISIH', teks: 'Untung/Rugi', tag: 'Untung/Rugi' },
  { id: 'DITANYA', teks: 'Ditanya', tag: 'Ditanya' },
];
const TAG = Object.fromEntries(LABEL.map((l) => [l.id, l.tag]));

// Segmen yang hanya berisi tanda baca tidak perlu bisa diketuk.
const bisaDiketuk = (s) => /[\p{L}\p{N}]/u.test(s.teks);

/**
 * @param {{ segmen: {teks:string}[], label: Record<number,string>, onUbah: (label) => void, terkunci?: boolean }} props
 */
export default function TeksBertanda({ segmen, label, onUbah, terkunci = false }) {
  const [terpilih, setTerpilih] = useState(null);

  const beriLabel = (id) => {
    if (terpilih == null) return;
    const baru = { ...label };
    if (id) baru[terpilih] = id;
    else delete baru[terpilih];
    onUbah(baru);
    setTerpilih(null);
  };

  return (
    <>
      <p className="teks-bertanda">
        {segmen.map((s, i) =>
          bisaDiketuk(s) && !terkunci ? (
            // <span role="button"> (bukan <button>) agar kalimat soal tetap mengalir dalam satu paragraf.
            <span
              key={i}
              role="button"
              tabIndex={0}
              className={`segmen segmen--ketuk${terpilih === i ? ' segmen--terpilih' : ''}`}
              data-label={label[i]}
              aria-pressed={terpilih === i}
              aria-label={label[i] ? `${s.teks}, ditandai ${TAG[label[i]]}` : s.teks}
              onClick={() => setTerpilih((t) => (t === i ? null : i))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setTerpilih((t) => (t === i ? null : i));
                }
              }}
            >
              {label[i] && <span className="segmen__tag" aria-hidden="true">{TAG[label[i]]}</span>}
              {s.teks}
            </span>
          ) : (
            <span key={i} className={label[i] ? 'segmen' : undefined} data-label={label[i]}>
              {label[i] && <span className="segmen__tag">{TAG[label[i]]}</span>}
              {s.teks}
            </span>
          ),
        )}
      </p>

      {!terkunci && (
        <>
          <p className="teks-redup" aria-live="polite">
            {terpilih == null ? 'Ketuk bagian soal, lalu pilih labelnya.' : `Pilih label untuk: "${segmen[terpilih].teks}"`}
          </p>
          <div className="pilihan-label" role="group" aria-label="Pilih label">
            {LABEL.map((l) => (
              <button key={l.id} type="button" data-label={l.id} disabled={terpilih == null} onClick={() => beriLabel(l.id)}>
                {l.teks}
              </button>
            ))}
            {terpilih != null && label[terpilih] && (
              <button type="button" onClick={() => beriLabel(null)} style={{ gridColumn: '1 / -1' }}>
                Hapus tanda
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
