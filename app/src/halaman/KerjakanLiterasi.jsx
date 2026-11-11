import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import KepalaFokus from '../komponen/KepalaFokus.jsx';
import BilahLangkah from '../komponen/BilahLangkah.jsx';
import TeksBertanda from '../komponen/TeksBertanda.jsx';
import TeksKaya from '../komponen/TeksKaya.jsx';
import TombolPilihan from '../komponen/TombolPilihan.jsx';
import InputRupiah from '../komponen/InputRupiah.jsx';
import InputPersen from '../komponen/InputPersen.jsx';
import RingkasHarga from '../komponen/RingkasHarga.jsx';
import LembarBawah from '../komponen/LembarBawah.jsx';
import IsiKartuRumus from '../komponen/IsiKartuRumus.jsx';
import { TombolBantuan, DaftarBantuan } from '../komponen/TombolBantuan.jsx';
import { useKontenLiterasi } from './LatihanLiterasi.jsx';
import { muatMateri } from '../layanan/konten.js';
import { bacaDraf, simpanDraf, kunciTahap, catatBantuan } from '../layanan/literasi.js';
import { daftarLangkah, isianAwal, tahapLengkap, bacaIsianTahap, tandaSiswa, ringkasTanda } from '../logika/alurLiterasi.js';

// P13 Mengerjakan Soal Literasi Matematis (F14, design.md §17.4).
// Satu tahap per layar. Jawaban tahap dikunci setelah "Simpan & lanjut".
// Tidak ada tanda benar/salah selama pengerjaan (KL-08); penilaian ada di P14 HasilLiterasi.

const PESAN_KELUAR = 'Keluar dulu? Jawabanmu tersimpan di HP ini.';

function Bagian({ soal, tahap, bagian, nilai, onUbah }) {
  const id = `isian-${tahap.no}-${bagian.id}`;
  const judul = bagian.label && <p className="label-bagian"><label htmlFor={id}>{bagian.label}</label></p>;
  switch (bagian.jenis) {
    case 'tandai':
      return (
        <TeksBertanda
          segmen={soal.segmen}
          label={nilai}
          onUbah={onUbah}
          labelTersedia={bagian.label}
          sesudahTeks={<p className="pertanyaan-soal">{soal.pertanyaan}</p>}
        />
      );
    case 'pilihan':
      return (
        <>
          {bagian.label && <p className="label-bagian">{bagian.label}</p>}
          <TombolPilihan label={bagian.label ?? tahap.perintah} pilihan={bagian.pilihan} terpilih={nilai} onPilih={onUbah} />
        </>
      );
    case 'rupiah':
      return <>{judul}<InputRupiah id={id} label={bagian.label ?? tahap.perintah} nilai={nilai} onUbah={onUbah} /></>;
    case 'persen':
      return <>{judul}<InputPersen id={id} label={bagian.label ?? tahap.perintah} nilai={nilai} onUbah={onUbah} /></>;
    default:
      return null;
  }
}

function LayarTahap({ konten, soal, tahap, draf, kartuRumus, onSimpan, onBantuan, onKeluar }) {
  const [isian, setIsian] = useState(() => isianAwal(tahap));
  const [pesan, setPesan] = useState('');
  const [rumusTerbuka, setRumusTerbuka] = useState(false);

  const jawabanSoal = draf.jawaban[soal.id] ?? {};
  const bantuanTerbuka = jawabanSoal[tahap.no]?.bantuan ?? 0;
  const adaTandai = tahap.bagian.some((b) => b.jenis === 'tandai');
  const soalPunyaTandai = soal.tahap.some((t) => t.bagian.some((b) => b.jenis === 'tandai'));
  const tanda = tandaSiswa(soal, jawabanSoal);

  const ubah = (idBagian) => (nilai) => {
    setIsian((x) => ({ ...x, [idBagian]: nilai }));
    setPesan('');
  };
  const simpan = () => {
    const r = bacaIsianTahap(tahap, isian);
    if (!r.ok) return setPesan(r.pesan);
    onSimpan(r.isian);
  };

  return (
    <main className="halaman halaman--fokus halaman--tahap">
      <KepalaFokus judul={`Soal ${soal.nomor} · Tahap ${tahap.no} dari ${soal.tahap.length}`} onKembali={onKeluar} />
      <BilahLangkah ke={tahap.no} dari={soal.tahap.length} />

      {tahap.no === 1 && <p className="teks-redup">{soal.pengantar}</p>}

      {!adaTandai && (
        <details className="panel-soal" open={tahap.no === 1 && !soalPunyaTandai}>
          <summary>Lihat soal</summary>
          <TeksBertanda segmen={soal.segmen} label={tanda} onUbah={() => {}} terkunci />
          <p className="pertanyaan-soal">{soal.pertanyaan}</p>
        </details>
      )}
      {!adaTandai && soalPunyaTandai && <RingkasHarga ringkasan={ringkasTanda(soal, tanda)} />}

      <h2 className="perintah-tahap">{tahap.perintah}</h2>
      {tahap.bagian.map((b) => (
        <Bagian key={b.id} soal={soal} tahap={tahap} bagian={b} nilai={isian[b.id]} onUbah={ubah(b.id)} />
      ))}

      <DaftarBantuan bantuan={tahap.bantuan} terbuka={bantuanTerbuka} pesanHabis={konten.pesanUmum.bantuanHabis} />
      {pesan && <p className="pesan-galat" role="alert">{pesan}</p>}

      <div className="bilah-aksi">
        <div className="bilah-aksi__baris">
          <TombolBantuan terbuka={bantuanTerbuka} total={tahap.bantuan.length} onBuka={() => onBantuan(bantuanTerbuka + 1)} />
          <button type="button" className="tombol-kedua" onClick={() => setRumusTerbuka(true)} disabled={!kartuRumus}>Rumus</button>
        </div>
        <button type="button" className="tombol-utama" disabled={!tahapLengkap(tahap, isian)} onClick={simpan}>
          Simpan &amp; lanjut
        </button>
      </div>

      <LembarBawah terbuka={rumusTerbuka} onTutup={() => setRumusTerbuka(false)} judul="Kartu Rumus">
        {kartuRumus && <IsiKartuRumus data={kartuRumus} />}
      </LembarBawah>
    </main>
  );
}

export default function KerjakanLiterasi() {
  const { sesi } = useOutletContext();
  const navigasi = useNavigate();
  const { konten, galat } = useKontenLiterasi();
  const [kartuRumus, setKartuRumus] = useState(null);
  const [draf, setDraf] = useState(undefined);
  const [jeda, setJeda] = useState(null); // { selesai: nomor, berikut: nomor }

  useEffect(() => {
    muatMateri().then((d) => setKartuRumus(d.kartuRumus)).catch(() => setKartuRumus(null));
  }, []);
  useEffect(() => {
    if (konten) setDraf(bacaDraf(sesi.kodeTampil, konten.versi_rubrik));
  }, [konten, sesi.kodeTampil]);

  const kepalaSaja = (isi) => (
    <main className="halaman halaman--fokus">
      <KepalaFokus judul="Latihan Literasi Matematis" kembaliKe="/literasi" />
      {isi}
    </main>
  );
  if (galat) return kepalaSaja(<p className="pesan-galat" role="alert">{galat}</p>);
  if (!konten || draf === undefined) return kepalaSaja(<p className="teks-redup">Memuat…</p>);
  if (!draf || draf.selesai) return <Navigate to="/literasi" replace />;

  const perbarui = (baru) => {
    setDraf(baru);
    simpanDraf(sesi.kodeTampil, baru);
  };
  const keluar = () => {
    if (window.confirm(PESAN_KELUAR)) navigasi('/literasi', { replace: true });
  };
  const langkah = daftarLangkah(konten);
  const soalDari = (id) => konten.soal.find((s) => s.id === id);

  if (jeda) {
    return kepalaSaja(
      <section className="kartu layar-jeda" aria-live="polite">
        <p style={{ fontWeight: 700 }}>Soal {jeda.selesai} selesai. Berikutnya Soal {jeda.berikut}.</p>
        <button type="button" className="tombol-utama" onClick={() => setJeda(null)}>Lanjut</button>
      </section>,
    );
  }

  if (draf.posisi >= langkah.length) {
    const selesai = () => {
      perbarui({ ...draf, selesai: true, selesai_pada: new Date().toISOString() });
      navigasi('/literasi/hasil', { replace: true });
    };
    return kepalaSaja(
      <section className="kartu" aria-live="polite">
        <p style={{ fontWeight: 700 }}>Semua soal sudah dijawab.</p>
        <p>Setelah ini, jawabanmu tidak bisa diubah.</p>
        <button type="button" className="tombol-utama" onClick={selesai}>Selesai dan lihat hasil</button>
      </section>,
    );
  }

  const l = langkah[draf.posisi];
  const soal = soalDari(l.idSoal);
  const tahap = soal.tahap.find((t) => t.no === l.noTahap);

  const simpan = (isian) => {
    perbarui(kunciTahap(draf, soal.id, tahap.no, isian));
    const berikut = langkah[draf.posisi + 1];
    if (l.tahapTerakhir && berikut) setJeda({ selesai: soal.nomor, berikut: soalDari(berikut.idSoal).nomor });
    window.scrollTo(0, 0);
  };

  return (
    <LayarTahap
      key={draf.posisi}
      konten={konten}
      soal={soal}
      tahap={tahap}
      draf={draf}
      kartuRumus={kartuRumus}
      onSimpan={simpan}
      onBantuan={(n) => perbarui(catatBantuan(draf, soal.id, tahap.no, Math.min(n, tahap.bantuan.length)))}
      onKeluar={keluar}
    />
  );
}
