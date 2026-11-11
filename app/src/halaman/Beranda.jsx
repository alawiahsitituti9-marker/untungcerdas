import { Link, useOutletContext } from 'react-router-dom';
import { modeUji } from '../layanan/auth.js';

// P02 Beranda / Dashboard (design.md §6, F02).
// Progres masih tetap 0 sampai penyimpanan progres dibuat (DV-13, DV-16).
export default function Beranda() {
  const { sesi, keluar } = useOutletContext();
  const selesai = 0;
  const total = 7;

  return (
    <main className="halaman">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ fontSize: 'var(--ukuran-judul)', margin: 0 }}>Halo, {sesi.kodeTampil}</h1>
        <button type="button" className="tombol-teks" onClick={keluar}>Keluar</button>
      </header>
      {modeUji && <p className="spanduk-uji">Mode uji: progres belum disimpan ke server.</p>}

      <section className="kartu" style={{ marginTop: 12 }}>
        <h2>Persentase Untung dan Rugi</h2>
        <div className="bilah-kemajuan" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={selesai}>
          <span style={{ width: `${(selesai / total) * 100}%` }} />
        </div>
        <p className="teks-redup">{selesai} dari {total} materi</p>
      </section>

      <section className="kartu">
        <p className="teks-redup" style={{ marginBottom: 4 }}>Berikutnya:</p>
        <h2>M1 Harga Beli dan Harga Jual</h2>
        <Link to="/materi/M1" className="tombol-utama" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
          Lanjut belajar
        </Link>
      </section>

      <ul className="daftar">
        <li><Link className="baris-daftar" to="/latihan">Latihan<span aria-hidden="true">›</span></Link></li>
        <li><Link className="baris-daftar" to="/simulasi">Simulasi Jual Beli<span aria-hidden="true">›</span></Link></li>
      </ul>
    </main>
  );
}
