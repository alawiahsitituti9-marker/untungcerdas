import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { modeUji } from '../layanan/auth.js';
import { muatMateri } from '../layanan/konten.js';
import { ringkasanLokal } from '../layanan/progres.js';
import { saranBerikutnya } from '../logika/progres.js';

// P02 Beranda / Dashboard (design.md §6, F02; KFN-03).
// Progres dibaca dari HP siswa (layanan/progres.js); diganti ringkasan_progres() dari server di DV-13.
// Selalu menyarankan satu langkah berikutnya (design.md §4), termasuk Latihan Literasi Matematis (KL-09).

function judulSaran(saran, materi) {
  if (saran.jenis === 'materi') {
    const m = materi?.find((x) => x.id === saran.id);
    return m ? `${m.id} ${m.judul}` : saran.id;
  }
  if (saran.jenis === 'latihan') return `Latihan Level ${saran.id}`;
  return 'Latihan Literasi Matematis';
}

export default function Beranda() {
  const { sesi, keluar } = useOutletContext();
  const [materi, setMateri] = useState(null);
  useEffect(() => {
    muatMateri().then((d) => setMateri(d.materi)).catch(() => setMateri([]));
  }, []);

  const r = ringkasanLokal(sesi.kodeTampil);
  const saran = saranBerikutnya(r);

  return (
    <main className="halaman">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ fontSize: 'var(--ukuran-judul)', margin: 0 }}>Halo, {sesi.kodeTampil}</h1>
        <button type="button" className="tombol-teks" onClick={keluar}>Keluar</button>
      </header>
      {modeUji && <p className="spanduk-uji">Mode uji: progres hanya disimpan di HP ini.</p>}

      <section className="kartu" style={{ marginTop: 12 }}>
        <h2>Persentase Untung dan Rugi</h2>
        <div className="bilah-kemajuan" role="progressbar" aria-label="Materi selesai" aria-valuemin={0} aria-valuemax={r.materi_total} aria-valuenow={r.materi_selesai}>
          <span style={{ width: `${(r.materi_selesai / r.materi_total) * 100}%` }} />
        </div>
        <p className="teks-redup">{r.materi_selesai} dari {r.materi_total} materi</p>
      </section>

      <section className="kartu">
        <p className="teks-redup" style={{ marginBottom: 4 }}>Berikutnya:</p>
        <h2>{judulSaran(saran, materi)}</h2>
        <Link to={saran.tautan} className="tombol-utama tombol-tautan">Lanjut belajar</Link>
      </section>

      <ul className="daftar">
        <li><Link className="baris-daftar" to="/latihan">Latihan<span aria-hidden="true">›</span></Link></li>
        <li><Link className="baris-daftar" to="/simulasi">Simulasi Jual Beli<span aria-hidden="true">›</span></Link></li>
      </ul>
    </main>
  );
}
