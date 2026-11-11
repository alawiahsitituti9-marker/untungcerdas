import { useNavigate } from 'react-router-dom';

// Kepala halaman mode fokus: tombol ←, judul, dan isi kanan opsional (misalnya "3/5") (design.md §5).
// Tombol ← memakai riwayat peramban, sama seperti tombol Kembali Android.
export default function KepalaFokus({ judul, kembaliKe = '/', kanan }) {
  const navigasi = useNavigate();
  const kembali = () => (window.history.length > 1 ? navigasi(-1) : navigasi(kembaliKe));
  return (
    <header className="kepala-fokus">
      <button type="button" className="tombol-kembali" onClick={kembali} aria-label="Kembali">
        ←
      </button>
      <h1>{judul}</h1>
      {kanan && <div className="kepala-fokus__kanan">{kanan}</div>}
    </header>
  );
}
