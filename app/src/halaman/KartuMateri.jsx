import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import KepalaFokus from '../komponen/KepalaFokus.jsx';
import KartuMateri from '../komponen/KartuMateri.jsx';
import CekCepat from '../komponen/CekCepat.jsx';
import LembarBawah from '../komponen/LembarBawah.jsx';
import IsiKartuRumus from '../komponen/IsiKartuRumus.jsx';
import { muatMateri } from '../layanan/konten.js';

// P04 Kartu Materi (F03; KFN-04, KFN-05; design.md §6).
// Satu konsep per kartu. Tempo diatur siswa dengan "Lanjut" dan "Kembali".
// Setelah kartu terakhir muncul satu soal cek cepat.
// Status selesai belum disimpan; penyimpanan progres_materi dibuat di DV-13.

function IsiMateri({ data, id }) {
  const [param, setParam] = useSearchParams();
  const [selesai, setSelesai] = useState(false);
  const [rumusTerbuka, setRumusTerbuka] = useState(false);
  const fokusRef = useRef(null);
  const pertama = useRef(true);

  const iMateri = data.materi.findIndex((m) => m.id === id);
  const m = data.materi[iMateri];
  const jumlahKartu = m?.kartu.length ?? 0;
  // Nomor langkah 1..jumlahKartu = kartu; jumlahKartu + 1 = cek cepat. Disimpan di URL agar tetap saat dimuat ulang.
  const nomor = Math.min(Math.max(Number(param.get('kartu')) || 1, 1), jumlahKartu + 1);
  const diCek = nomor > jumlahKartu;

  // Saat pindah kartu: kembali ke atas dan pindahkan fokus agar pembaca layar membaca kartu baru.
  useEffect(() => {
    if (pertama.current) {
      pertama.current = false;
      return;
    }
    window.scrollTo(0, 0);
    fokusRef.current?.focus();
  }, [nomor]);

  if (!m) return <Navigate to="/materi" replace />;

  const ke = (n) => setParam({ kartu: String(n) }, { replace: true });
  const berikut = data.materi[iMateri + 1];
  // Contoh Bertahap setelah submateri (D-03 §2: C1 setelah M5, C2 setelah M6).
  const contoh = m.contoh && data.contoh?.find((c) => c.id === m.contoh);

  return (
    <main className="halaman halaman--fokus halaman--kartu">
      <KepalaFokus
        judul={m.judul}
        kembaliKe="/materi"
        kanan={<span className="angka" aria-label={diCek ? 'Cek cepat' : `Kartu ${nomor} dari ${jumlahKartu}`}>{diCek ? 'Cek' : `${nomor}/${jumlahKartu}`}</span>}
      />

      <div ref={fokusRef} tabIndex={-1} className="area-kartu" key={nomor}>
        {diCek ? (
          <CekCepat cek={m.cek} onBenar={() => setSelesai(true)} />
        ) : (
          <section className="kartu" aria-label={`Kartu ${nomor} dari ${jumlahKartu}`}>
            <KartuMateri kartu={m.kartu[nomor - 1]} />
          </section>
        )}
      </div>

      {diCek && selesai ? (
        <div className="selesai-materi">
          <p style={{ fontWeight: 700 }}>{m.id} {m.judul} selesai.</p>
          {contoh ? (
            <Link className="tombol-utama tombol-tautan" to={`/contoh/${contoh.id}`}>
              Lanjut: Contoh {contoh.id} {contoh.judul}
            </Link>
          ) : berikut ? (
            <Link className="tombol-utama tombol-tautan" to={`/materi/${berikut.id}`} replace>
              Lanjut: {berikut.id} {berikut.judul}
            </Link>
          ) : (
            <Link className="tombol-utama tombol-tautan" to="/simulasi" replace>
              Lanjut: Simulasi Jual Beli
            </Link>
          )}
          <Link className="tombol-teks" to="/materi" replace>Kembali ke daftar materi</Link>
        </div>
      ) : (
        <nav className="navigasi-kartu" aria-label="Pindah kartu">
          <button type="button" className="tombol-kedua" disabled={nomor === 1} onClick={() => ke(nomor - 1)}>
            Kembali
          </button>
          {!diCek && (
            <button type="button" className="tombol-utama" onClick={() => ke(nomor + 1)}>
              Lanjut
            </button>
          )}
        </nav>
      )}

      <button type="button" className="tombol-teks tombol-buka-rumus" onClick={() => setRumusTerbuka(true)}>
        Lihat Kartu Rumus
      </button>
      <LembarBawah terbuka={rumusTerbuka} onTutup={() => setRumusTerbuka(false)} judul="Kartu Rumus">
        <IsiKartuRumus data={data.kartuRumus} />
      </LembarBawah>
    </main>
  );
}

export default function HalamanKartuMateri() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState('');

  useEffect(() => {
    muatMateri().then(setData).catch((e) => setGalat(e.message));
  }, []);

  if (galat) {
    return (
      <main className="halaman halaman--fokus">
        <KepalaFokus judul="Materi" kembaliKe="/materi" />
        <p className="pesan-galat" role="alert">{galat}</p>
      </main>
    );
  }
  if (!data) return <main className="halaman halaman--fokus"><p className="teks-redup">Memuat…</p></main>;
  // `key` mengatur ulang status kartu dan cek cepat saat pindah ke submateri lain.
  return <IsiMateri key={id} data={data} id={id} />;
}
