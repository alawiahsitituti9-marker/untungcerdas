import { useState } from 'react';
import { Link, Navigate, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import KepalaFokus from '../komponen/KepalaFokus.jsx';
import BilahSkor from '../komponen/BilahSkor.jsx';
import BarisTahap from '../komponen/BarisTahap.jsx';
import TeksKaya from '../komponen/TeksKaya.jsx';
import { useKontenLiterasi } from './LatihanLiterasi.jsx';
import { bacaDraf, hapusDraf } from '../layanan/literasi.js';
import { nilaiLatihan } from '../logika/penilaianLiterasi.js';
import { teksJawaban } from '../logika/alurLiterasi.js';

// P14 Hasil Evaluasi Literasi Matematis (F14, design.md §17.5; KFN-20, KFN-22, KFN-23).
// Tiga bagian dibuka bertahap: ringkasan skor → pembahasan per soal → saran belajar.
// Bagian aktif disimpan di URL (?bagian=…&soal=…) agar tombol ← dan Kembali Android bekerja wajar.
// Hasil dihitung dari draf di HP; penyimpanan ke server dan riwayat dibuat di LM-10/LM-11.

function Ringkasan({ hasil, keBagian }) {
  return (
    <>
      <section className="kartu skor-total" aria-label="Skor total">
        <p className="teks-redup" style={{ margin: 0 }}>Skormu</p>
        <p className="skor-total__angka angka">{hasil.total} dari {hasil.totalMaks}</p>
        <BilahSkor skor={hasil.total} maks={hasil.totalMaks} label="Skor total" />
      </section>

      <ul className="daftar-indikator">
        {hasil.indikator.map((ind) => (
          <li key={ind.no} className="kartu-indikator">
            <p className="kartu-indikator__nama">{ind.no} {ind.nama}</p>
            <p className="teks-redup" style={{ margin: 0 }}>{ind.keterangan}</p>
            <BilahSkor skor={ind.skor} maks={ind.skorMaks} label={ind.nama} />
            <p className="kartu-indikator__pesan">{ind.pesan}</p>
          </li>
        ))}
      </ul>

      <div className="bilah-aksi">
        <button type="button" className="tombol-utama" onClick={() => keBagian({ bagian: 'pembahasan' })}>Lihat pembahasan</button>
      </div>
    </>
  );
}

function DaftarSoal({ konten, hasil, keBagian }) {
  return (
    <>
      <p>Pilih soal untuk melihat pembahasannya.</p>
      <ul className="daftar">
        {[...konten.soal].sort((a, b) => a.nomor - b.nomor).map((s) => {
          const h = hasil.soal.find((x) => x.id === s.id);
          const ind = konten.indikator.find((i) => i.no === s.indikator);
          const perlu = h.tahap.filter((t) => !t.benar).length;
          return (
            <li key={s.id}>
              <button type="button" className="baris-daftar" onClick={() => keBagian({ bagian: 'pembahasan', soal: s.id })}>
                <span>
                  Soal {s.nomor} · {h.skor} dari {h.skorMaks}
                  <small>{ind.nama}</small>
                  <small>{perlu ? `${perlu} tahap perlu diperbaiki` : 'Semua tahap sudah benar'}</small>
                </span>
                <span aria-hidden="true">›</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="bilah-aksi">
        <button type="button" className="tombol-utama" onClick={() => keBagian({ bagian: 'saran' })}>Lihat saran belajar</button>
      </div>
    </>
  );
}

function Penyelesaian({ baris }) {
  const [tampil, setTampil] = useState(0);
  if (tampil === 0) {
    return <button type="button" className="tombol-kedua" onClick={() => setTampil(1)}>Lihat penyelesaian lengkap</button>;
  }
  return (
    <section className="kartu penyelesaian" aria-live="polite" aria-label="Penyelesaian lengkap">
      <ol>
        {baris.slice(0, tampil).map((b, i) => (
          <li key={i} className={i < tampil - 1 ? 'teks-redup-langkah' : undefined}><TeksKaya teks={b.teks} /></li>
        ))}
      </ol>
      {tampil < baris.length ? (
        <button type="button" className="tombol-kedua" onClick={() => setTampil((n) => n + 1)}>Langkah berikutnya</button>
      ) : (
        <button type="button" className="tombol-teks" onClick={() => setTampil(1)}>Ulangi dari awal</button>
      )}
    </section>
  );
}

function PembahasanSoal({ konten, hasil, jawaban, idSoal, keBagian }) {
  const urut = [...konten.soal].sort((a, b) => a.nomor - b.nomor);
  const i = urut.findIndex((s) => s.id === idSoal);
  const soal = urut[i];
  const h = hasil.soal.find((x) => x.id === idSoal);
  const ind = konten.indikator.find((x) => x.no === soal.indikator);
  const berikut = urut[i + 1];
  return (
    <>
      <p className="teks-redup" style={{ marginBottom: 4 }}>{ind.nama} · {h.skor} dari {h.skorMaks}</p>
      <p>{soal.pengantar}</p>
      <details className="panel-soal">
        <summary>Lihat soal</summary>
        <p>{soal.segmen.map((x) => x.teks).join('')}</p>
        <p className="pertanyaan-soal">{soal.pertanyaan}</p>
      </details>

      {soal.tahap.map((t) => (
        <BarisTahap
          key={t.no}
          tahap={t}
          hasil={h.tahap.find((x) => x.no === t.no)}
          jawaban={teksJawaban(soal, t, jawaban[soal.id]?.[t.no]?.isian)}
          pesanUmum={konten.pesanUmum}
        />
      ))}

      <Penyelesaian key={idSoal} baris={soal.penyelesaian} />

      <div className="bilah-aksi">
        {berikut ? (
          <button type="button" className="tombol-utama" onClick={() => keBagian({ bagian: 'pembahasan', soal: berikut.id }, true)}>
            Soal berikutnya ›
          </button>
        ) : (
          <button type="button" className="tombol-utama" onClick={() => keBagian({ bagian: 'saran' }, true)}>Lihat saran belajar</button>
        )}
      </div>
    </>
  );
}

function Saran({ hasil, onCobaLagi }) {
  const semuaBenar = hasil.saran.length === 1 && hasil.saran[0].id === 'LEVEL4';
  return (
    <>
      {!semuaBenar && <p>Pelajari lagi bagian ini:</p>}
      <ul className="daftar">
        {hasil.saran.map((s) => (
          <li key={s.id}>
            <Link className="baris-daftar" to={s.tautan}>{s.teks}<span aria-hidden="true">›</span></Link>
          </li>
        ))}
      </ul>
      {hasil.bantuan > 0 && <p className="teks-redup">Kamu memakai {hasil.bantuan} bantuan.</p>}
      <div className="bilah-aksi">
        <div className="bilah-aksi__baris">
          <button type="button" className="tombol-kedua" onClick={onCobaLagi}>Coba lagi</button>
          <Link to="/latihan" className="tombol-utama tombol-tautan">Selesai</Link>
        </div>
      </div>
    </>
  );
}

export default function HasilLiterasi() {
  const { sesi } = useOutletContext();
  const navigasi = useNavigate();
  const [param, setParam] = useSearchParams();
  const { konten, galat } = useKontenLiterasi();

  const kepala = (judul) => <KepalaFokus judul={judul} kembaliKe="/literasi" />;
  if (galat) return <main className="halaman halaman--fokus">{kepala('Hasil Latihan')}<p className="pesan-galat" role="alert">{galat}</p></main>;
  if (!konten) return <main className="halaman halaman--fokus">{kepala('Hasil Latihan')}<p className="teks-redup">Memuat…</p></main>;

  const draf = bacaDraf(sesi.kodeTampil, konten.versi_rubrik);
  if (!draf?.selesai) return <Navigate to="/literasi" replace />;

  const hasil = nilaiLatihan(konten, draf.jawaban);
  const bagian = param.get('bagian');
  const idSoal = param.get('soal');
  // Pindah bagian menambah riwayat (← kembali ke bagian sebelumnya); antar-soal mengganti riwayat.
  const keBagian = (p, ganti = false) => {
    setParam(p, { replace: ganti });
    window.scrollTo(0, 0);
  };
  const cobaLagi = () => {
    if (!window.confirm('Mulai lagi? Hasil ini akan dihapus dari HP ini.')) return;
    hapusDraf(sesi.kodeTampil);
    navigasi('/literasi', { replace: true });
  };

  const soalValid = idSoal && konten.soal.some((s) => s.id === idSoal);
  let judul = 'Hasil Latihan';
  let isi = <Ringkasan hasil={hasil} keBagian={keBagian} />;
  if (bagian === 'pembahasan' && soalValid) {
    judul = `Pembahasan Soal ${konten.soal.find((s) => s.id === idSoal).nomor}`;
    isi = <PembahasanSoal konten={konten} hasil={hasil} jawaban={draf.jawaban} idSoal={idSoal} keBagian={keBagian} />;
  } else if (bagian === 'pembahasan') {
    judul = 'Pembahasan';
    isi = <DaftarSoal konten={konten} hasil={hasil} keBagian={keBagian} />;
  } else if (bagian === 'saran') {
    judul = 'Saran Belajar';
    isi = <Saran hasil={hasil} onCobaLagi={cobaLagi} />;
  }

  return (
    <main className="halaman halaman--fokus">
      {kepala(judul)}
      {isi}
    </main>
  );
}
