import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import KepalaFokus from '../komponen/KepalaFokus.jsx';
import { muatLiterasi } from '../layanan/konten.js';
import { bacaDraf, simpanDraf, hapusDraf, drafBaru } from '../layanan/literasi.js';
import { validasiKonten } from '../logika/penilaianLiterasi.js';
import { daftarLangkah } from '../logika/alurLiterasi.js';

// P12 Pengantar Latihan Literasi Matematis (F14, design.md §17.3).

export function useKontenLiterasi() {
  const [konten, setKonten] = useState(null);
  const [galat, setGalat] = useState('');
  useEffect(() => {
    muatLiterasi()
      .then((k) => {
        const masalah = validasiKonten(k);
        if (masalah.length) {
          console.error('literasi.json tidak valid:', masalah);
          throw new Error('Soal belum bisa dimuat. Coba muat ulang halaman.');
        }
        setKonten(k);
      })
      .catch((e) => setGalat(e.message));
  }, []);
  return { konten, galat };
}

export default function LatihanLiterasi() {
  const { sesi } = useOutletContext();
  const navigasi = useNavigate();
  const { konten, galat } = useKontenLiterasi();
  const [, setUlang] = useState(0);

  const kepala = <KepalaFokus judul="Latihan Literasi Matematis" kembaliKe="/latihan" />;
  if (galat) return <main className="halaman halaman--fokus">{kepala}<p className="pesan-galat" role="alert">{galat}</p></main>;
  if (!konten) return <main className="halaman halaman--fokus">{kepala}<p className="teks-redup">Memuat…</p></main>;

  const draf = bacaDraf(sesi.kodeTampil, konten.versi_rubrik);
  const langkah = daftarLangkah(konten);
  const sedangBerjalan = draf && !draf.selesai && draf.posisi > 0;
  const posisi = sedangBerjalan ? langkah[draf.posisi] : null; // undefined bila semua tahap sudah dijawab
  const nomorSoal = (id) => konten.soal.find((s) => s.id === id).nomor;

  const mulai = () => {
    if (!draf || draf.selesai) simpanDraf(sesi.kodeTampil, drafBaru(konten.versi_rubrik));
    navigasi('/literasi/kerjakan');
  };
  const mulaiLagi = () => {
    if (!window.confirm('Mulai lagi? Hasil ini akan dihapus dari HP ini.')) return;
    hapusDraf(sesi.kodeTampil);
    setUlang((n) => n + 1);
  };

  return (
    <main className="halaman halaman--fokus">
      {kepala}
      <p>4 soal cerita jual beli. Kerjakan tahap demi tahap. Hasilnya muncul di akhir.</p>

      <ol className="daftar daftar-soal-literasi">
        {konten.urutan.map((id) => {
          const s = konten.soal.find((x) => x.id === id);
          const ind = konten.indikator.find((i) => i.no === s.indikator);
          return (
            <li key={id} className="baris-daftar">
              <span>
                Soal {s.nomor}
                <small>{ind.nama}</small>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="teks-redup">Skor maksimal 24. Ada bantuan di setiap tahap.</p>

      {draf?.selesai ? (
        <>
          <button type="button" className="tombol-utama" onClick={() => navigasi('/literasi/hasil')}>Lihat hasil</button>
          <button type="button" className="tombol-teks tombol-buka-rumus" onClick={mulaiLagi}>Mulai lagi</button>
        </>
      ) : (
        <button type="button" className="tombol-utama" onClick={mulai}>
          {!sedangBerjalan ? 'Mulai' : posisi ? `Lanjutkan (Soal ${nomorSoal(posisi.idSoal)}, tahap ${posisi.noTahap})` : 'Lanjutkan'}
        </button>
      )}
    </main>
  );
}
