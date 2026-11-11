import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import BilahSkor from '../komponen/BilahSkor.jsx';
import { muatMateri, muatLiterasi } from '../layanan/konten.js';
import { bacaMateri, bacaRiwayatLiterasi, ringkasanLokal } from '../layanan/progres.js';
import { MATERI } from '../logika/progres.js';

// P11 Progres (F13; KFN-17; design.md §6 P11, §17.6).
// Status submateri, hasil per level, dan riwayat Latihan Literasi Matematis.
// Tanpa peringkat atau perbandingan dengan teman (design.md §6).
// Data dibaca dari HP siswa; diganti data server di DV-13/LM-11.

const tanggal = (iso) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

function StatusLevel({ l }) {
  if (!l.terbuka) return <small aria-label="Terkunci">🔒</small>;
  if (l.benar_terbaik == null) return <small>Belum dicoba</small>;
  return <small>{l.benar_terbaik >= 4 ? '✓' : '▸'} {l.benar_terbaik}/{l.jumlah_soal} benar</small>;
}

function Literasi({ lit, indikator }) {
  const [semua, setSemua] = useState(false);
  if (!lit) {
    return (
      <p className="teks-redup">
        Belum ada hasil. <Link to="/literasi">Buka Latihan Literasi Matematis</Link>
      </p>
    );
  }
  const { pertama, terakhir, perubahan } = lit;
  return (
    <>
      <ul className="daftar">
        <li className="baris-daftar"><span>Pertama · {tanggal(pertama.selesai_pada)}</span><small>{pertama.skor_total} dari 24</small></li>
        {lit.jumlah_percobaan > 1 && (
          <li className="baris-daftar"><span>Terakhir · {tanggal(terakhir.selesai_pada)}</span><small>{terakhir.skor_total} dari 24</small></li>
        )}
      </ul>
      {perubahan != null && (
        <p style={{ fontWeight: 600 }}>
          {perubahan > 0 ? `Naik ${perubahan} poin.` : perubahan < 0 ? `Turun ${-perubahan} poin.` : 'Skornya sama.'}
        </p>
      )}
      <p className="teks-redup" style={{ marginBottom: 4 }}>Hasil terakhir per indikator:</p>
      <ul className="daftar-indikator">
        {indikator.map((ind, i) => (
          <li key={ind.no} className="kartu-indikator">
            <p className="kartu-indikator__nama">{ind.no} {ind.nama}</p>
            <BilahSkor skor={terakhir.skor[i]} maks={6} label={ind.nama} />
          </li>
        ))}
      </ul>
      {lit.jumlah_percobaan > 1 && (
        <>
          <button type="button" className="tombol-teks" aria-expanded={semua} onClick={() => setSemua((x) => !x)}>
            {semua ? 'Tutup daftar percobaan' : 'Lihat semua percobaan'}
          </button>
          {semua && (
            <ol className="daftar">
              {lit.riwayat.map((h, i) => (
                <li key={h.id} className="baris-daftar"><span>Percobaan {i + 1} · {tanggal(h.selesai_pada)}</span><small>{h.skor_total} dari 24</small></li>
              ))}
            </ol>
          )}
        </>
      )}
    </>
  );
}

export default function Progres() {
  const { sesi } = useOutletContext();
  const [konten, setKonten] = useState({ materi: [], indikator: [] });
  useEffect(() => {
    Promise.all([muatMateri(), muatLiterasi()])
      .then(([m, l]) => setKonten({ materi: m.materi, indikator: l.indikator }))
      .catch(() => {});
  }, []);

  const r = ringkasanLokal(sesi.kodeTampil);
  const status = bacaMateri(sesi.kodeTampil);
  const judul = (id) => konten.materi.find((m) => m.id === id)?.judul ?? '';
  const riwayat = r.literasi ? { ...r.literasi, riwayat: bacaRiwayatLiterasi(sesi.kodeTampil) } : null;

  return (
    <main className="halaman">
      <h1>Progres Belajar</h1>

      <h2>Materi</h2>
      <p className="teks-redup">{r.materi_selesai} dari {r.materi_total} materi selesai.</p>
      <ul className="daftar">
        {MATERI.map((id) => (
          <li key={id} className="baris-daftar">
            <span>
              <span aria-hidden="true">{status[id] === 'selesai' ? '✓ ' : '○ '}</span>
              {id} {judul(id)}
            </span>
            <small>{status[id] === 'selesai' ? 'Selesai' : status[id] === 'dibuka' ? 'Sudah dibuka' : 'Belum'}</small>
          </li>
        ))}
      </ul>

      <h2>Latihan</h2>
      <ul className="daftar">
        {r.level.map((l) => (
          <li key={l.level} className="baris-daftar">
            <span>Level {l.level}</span>
            <StatusLevel l={l} />
          </li>
        ))}
      </ul>

      <h2>Literasi Matematis</h2>
      <Literasi lit={riwayat} indikator={konten.indikator} />
    </main>
  );
}
