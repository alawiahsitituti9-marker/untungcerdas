import { useEffect, useRef } from 'react';

// Lembar bawah (bottom sheet) untuk Kartu Rumus dan Pembahasan (design.md §5, §7).
// Memakai <dialog> bawaan: fokus terkunci di dalam, tombol Esc / Kembali menutup.
export default function LembarBawah({ terbuka, onTutup, judul, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (terbuka && !d.open) d.showModal();
    if (!terbuka && d.open) d.close();
  }, [terbuka]);

  // Ketukan di luar lembar (pada latar) menutup lembar.
  const ketukLatar = (e) => {
    if (e.target === ref.current) onTutup();
  };

  return (
    <dialog ref={ref} className="lembar-bawah" aria-labelledby="judul-lembar" onClose={onTutup} onClick={ketukLatar}>
      <div className="lembar-bawah__isi">
        <header className="lembar-bawah__kepala">
          <h2 id="judul-lembar">{judul}</h2>
          <button type="button" className="tombol-kembali" onClick={onTutup} aria-label="Tutup">✕</button>
        </header>
        {terbuka && children}
      </div>
    </dialog>
  );
}
