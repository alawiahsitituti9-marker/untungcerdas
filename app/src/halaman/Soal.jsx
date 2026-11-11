import { useEffect, useState } from 'react';
import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom';
import KepalaFokus from '../komponen/KepalaFokus.jsx';
import BilahLangkah from '../komponen/BilahLangkah.jsx';
import TeksBertanda from '../komponen/TeksBertanda.jsx';
import TeksKaya from '../komponen/TeksKaya.jsx';
import TombolPilihan from '../komponen/TombolPilihan.jsx';
import InputRupiah from '../komponen/InputRupiah.jsx';
import InputPersen from '../komponen/InputPersen.jsx';
import LabelHarga from '../komponen/LabelHarga.jsx';
import LembarBawah from '../komponen/LembarBawah.jsx';
import IsiKartuRumus from '../komponen/IsiKartuRumus.jsx';
import { muatSoal, muatPembahasan, muatMateri } from '../layanan/konten.js';
import { catatSesi } from '../layanan/progresLatihan.js';
import KerjakanLevel4 from './SoalLevel4.jsx';
import { TombolBantuan, DaftarBantuan } from '../komponen/TombolBantuan.jsx';
import { petunjukSoal, layarUntuk } from '../logika/petunjuk.js';
import { penyelesaianSoal } from '../logika/penyelesaian.js';
import PenyelesaianBertahap from '../komponen/PenyelesaianBertahap.jsx';
import { bacaRupiah, bacaPersen } from '../logika/format.js';
import {
  JUDUL_LANGKAH, BATAS_PERCOBAAN, SYARAT_BUKA, JUMLAH_SOAL_SESI,
  pilihSoalSesi, periksaLayar, pembahasanLangkah, teksSoalLangsung, perintahHitungBalik,
} from '../logika/panduan.js';

// P09 Mengerjakan Soal Level 1–4 (F05 Panduan Langkah, F09 Latihan; KFN-07, KFN-11; design.md §6, §8).
// Level 4 tanpa panduan: lihat SoalLevel4.jsx.
// Setiap layar diperiksa sebelum lanjut. Jawaban salah membuka lembar Pembahasan (P10, F10):
// salah pertama → ①–③ + "Coba lagi"; salah kedua → ④ penyelesaian 7 langkah, lalu soal berikutnya
// dan soal dihitung salah (D-05 §3.1, §3.3).
// Petunjuk bertingkat (F11, DV-11): dibuka satu tingkat per ketukan; jumlahnya dicatat untuk fading.
// Penyimpanan percobaan (DV-13) belum di sini.

const LEVEL_ADA = [1, 2, 3, 4];
const LABEL_TANDAI = ['HB', 'HJ', 'DITANYA'];
const JENIS = [{ teks: '▲ Untung', nilai: 'untung' }, { teks: '▼ Rugi', nilai: 'rugi' }];

/** Mengubah isian teks menjadi angka; mengembalikan pesan bila format salah. */
function bacaIsian(langkahLayar, isian) {
  const hasil = { ...isian };
  const baca = (kunci, fn) => {
    const r = fn(isian[kunci] ?? '');
    if (!r.ok) throw new Error(r.pesan);
    hasil[kunci] = r.nilai;
  };
  try {
    for (const n of langkahLayar) {
      if (n === 2) { baca('hb', bacaRupiah); baca('hj', bacaRupiah); }
      if (n === 4) baca('besar', bacaRupiah);
      if (n === 6) baca('persen', bacaPersen);
      if (n === 7) baca('balik', bacaRupiah);
    }
    return { ok: true, isian: hasil };
  } catch (e) {
    return { ok: false, pesan: e.message };
  }
}

function lengkap(langkahLayar, isian) {
  return langkahLayar.every((n) => {
    if (n === 1) return Object.keys(isian.tandai ?? {}).length > 0;
    if (n === 2) return !!isian.hb && !!isian.hj;
    if (n === 3) return isian.jenisI != null && isian.alasan != null;
    if (n === 4) return !!isian.besar;
    if (n === 5) return isian.rumus != null;
    if (n === 6) return !!isian.persen;
    if (n === 7) return !!isian.balik;
    return false;
  });
}

function IsianLangkah({ n, soal, data, isian, ubah, nonaktif }) {
  const Jenis = soal.kunci.jenis === 'untung' ? 'Untung' : 'Rugi';
  switch (n) {
    case 1:
      return (
        <TeksBertanda segmen={soal.segmen} label={isian.tandai ?? {}} onUbah={(v) => ubah({ tandai: v })} labelTersedia={LABEL_TANDAI} terkunci={nonaktif} />
      );
    case 2:
      return (
        <>
          <p className="teks-redup">Tulis harga beli dan harga jual.</p>
          <p className="label-bagian"><label htmlFor="isi-hb">Harga beli</label></p>
          <InputRupiah id="isi-hb" label="Harga beli" nilai={isian.hb ?? ''} onUbah={(v) => ubah({ hb: v })} nonaktif={nonaktif} />
          <p className="label-bagian"><label htmlFor="isi-hj">Harga jual</label></p>
          <InputRupiah id="isi-hj" label="Harga jual" nilai={isian.hj ?? ''} onUbah={(v) => ubah({ hj: v })} nonaktif={nonaktif} />
        </>
      );
    case 3:
      return (
        <>
          <TombolPilihan label="Untung atau rugi?" pilihan={JENIS} terpilih={isian.jenisI} onPilih={(i) => ubah({ jenisI: i, jenis: JENIS[i].nilai })} nonaktif={nonaktif} />
          <p className="label-bagian">Pilih alasannya.</p>
          <TombolPilihan label="Pilih alasannya." pilihan={data.alasanJenis.map((teks) => ({ teks }))} terpilih={isian.alasan} onPilih={(i) => ubah({ alasan: i })} nonaktif={nonaktif} />
        </>
      );
    case 4:
      return <InputRupiah id="isi-besar" label="Besar untung atau rugi" nilai={isian.besar ?? ''} onUbah={(v) => ubah({ besar: v })} nonaktif={nonaktif} />;
    case 5:
      return (
        <TombolPilihan
          label="Pilih rumus persentase"
          pilihan={data.rumusPersen.map((r) => ({ teks: r.teks.replaceAll('{Jenis}', Jenis) }))}
          terpilih={isian.rumus}
          onPilih={(i) => ubah({ rumus: i })}
          nonaktif={nonaktif}
        />
      );
    case 6:
      return <InputPersen id="isi-persen" label="Persentase" nilai={isian.persen ?? ''} onUbah={(v) => ubah({ persen: v })} nonaktif={nonaktif} />;
    case 7:
      return (
        <>
          <p style={{ fontWeight: 600 }}>{perintahHitungBalik(soal)}</p>
          <InputRupiah id="isi-balik" label="Hasil hitung balik" nilai={isian.balik ?? ''} onUbah={(v) => ubah({ balik: v })} nonaktif={nonaktif} />
        </>
      );
    default:
      return null;
  }
}

function TampilanSoal({ soal, data, labelTampil, tandaiAktif }) {
  if (soal.level <= 2) {
    return (
      <section className="kartu">
        <figure className="kartu-harga" aria-label={`${soal.barang}: harga beli dan harga jual`}>
          <figcaption className="kartu-harga__nama">{soal.barang}</figcaption>
          <div className="barang__label">
            <LabelHarga jenis="hb" nilai={soal.hb} />
            <LabelHarga jenis="hj" nilai={soal.hj} />
          </div>
        </figure>
        {teksSoalLangsung(soal, data).map((t, i) => <p key={i}><TeksKaya teks={t} /></p>)}
      </section>
    );
  }
  if (tandaiAktif) return null; // langkah 1 menampilkan soal sendiri lewat TeksBertanda
  return (
    <section className="kartu">
      <TeksBertanda segmen={soal.segmen} label={labelTampil} onUbah={() => {}} terkunci />
    </section>
  );
}

function KerjakanSoal({ soal, nomor, level, data, daftarLayar, onSelesai }) {
  const petunjuk = petunjukSoal(soal, data);
  const [petunjukTerbuka, setPetunjukTerbuka] = useState(0);
  const [iLayar, setILayar] = useState(0);
  const [isian, setIsian] = useState({});
  const [st, setSt] = useState({ percobaan: 0, hasil: null, selesai: false, pembahasan: null });
  const [adaSalah, setAdaSalah] = useState(false);
  const [pesan, setPesan] = useState('');
  const [rumusTerbuka, setRumusTerbuka] = useState(false);
  const [bahasTerbuka, setBahasTerbuka] = useState(false);

  const langkahLayar = daftarLayar[iLayar];
  const tandaiAktif = langkahLayar.includes(1);
  const kunciLabel = Object.fromEntries((soal.segmen ?? []).map((s, i) => [i, s.peran]).filter(([, p]) => p));
  const ubah = (x) => {
    setIsian((v) => ({ ...v, ...x }));
    setPesan('');
  };

  const periksa = () => {
    const r = bacaIsian(langkahLayar, isian);
    if (!r.ok) return setPesan(r.pesan);
    const h = periksaLayar(soal, langkahLayar, r.isian, data);
    const percobaan = st.percobaan + 1;
    if (h.benar) return setSt({ percobaan, hasil: h, selesai: true, pembahasan: null });
    const habis = percobaan >= BATAS_PERCOBAAN;
    if (habis) setAdaSalah(true);
    setSt({ percobaan, hasil: h, selesai: habis, pembahasan: pembahasanLangkah(soal, h, r.isian, data) });
    setBahasTerbuka(true);
  };

  const gagal = st.selesai && !st.hasil?.benar; // salah kedua: soal berakhir (D-05 §3.1)
  const lanjut = () => {
    if (gagal) return onSelesai(false, petunjukTerbuka);
    if (iLayar + 1 < daftarLayar.length) {
      setILayar(iLayar + 1);
      setSt({ percobaan: 0, hasil: null, selesai: false, pembahasan: null });
      window.scrollTo(0, 0);
    } else {
      onSelesai(!adaSalah, petunjukTerbuka);
    }
  };

  const benar = st.hasil?.benar;
  return (
    <main className="halaman halaman--fokus halaman--tahap">
      <KepalaFokus judul={`Level ${level} · Soal ${nomor}/${JUMLAH_SOAL_SESI}`} kembaliKe="/latihan" />
      <BilahLangkah ke={iLayar + 1} dari={daftarLayar.length} />

      <TampilanSoal soal={soal} data={data} labelTampil={kunciLabel} tandaiAktif={tandaiAktif} />

      <h2 className="perintah-tahap">
        {langkahLayar.length > 1 ? 'Hitung' : `Langkah ${langkahLayar[0]}: ${JUDUL_LANGKAH[langkahLayar[0]]}`}
      </h2>
      {/* Petunjuk tampil dekat judul langkah agar tidak tertutup bilah tombol di HP. */}
      <DaftarBantuan bantuan={petunjuk} terbuka={petunjukTerbuka} nama="Petunjuk" />
      {langkahLayar.map((n) => (
        <div key={n} className="bagian-langkah">
          {langkahLayar.length > 1 && <p className="label-bagian">{JUDUL_LANGKAH[n]}</p>}
          <IsianLangkah n={n} soal={soal} data={data} isian={isian} ubah={ubah} nonaktif={st.selesai} />
        </div>
      ))}
      {pesan && <p className="pesan-galat" role="alert">{pesan}</p>}

      <div aria-live="polite">
        {benar && <div className="umpan-balik umpan-balik--benar"><p style={{ fontWeight: 700 }}>✓ Benar!</p></div>}
        {st.pembahasan && (
          <button type="button" className="tombol-teks tombol-buka-rumus" onClick={() => setBahasTerbuka(true)}>Lihat pembahasan</button>
        )}
      </div>

      <div className="bilah-aksi">
        <div className="bilah-aksi__baris" style={level >= 2 ? undefined : { gridTemplateColumns: '1fr' }}>
          <TombolBantuan nama="Petunjuk" terbuka={petunjukTerbuka} total={petunjuk.length} onBuka={() => setPetunjukTerbuka((n) => Math.min(n + 1, petunjuk.length))} />
          {level >= 2 && <button type="button" className="tombol-kedua" onClick={() => setRumusTerbuka(true)}>Rumus</button>}
        </div>
        {st.selesai ? (
          <button type="button" className="tombol-utama" onClick={lanjut}>
            {!gagal && iLayar + 1 < daftarLayar.length ? 'Lanjut' : 'Soal berikutnya'}
          </button>
        ) : (
          <button type="button" className="tombol-utama" disabled={!lengkap(langkahLayar, isian)} onClick={periksa}>
            {st.percobaan > 0 ? 'Coba lagi' : 'Periksa'}
          </button>
        )}
      </div>

      <LembarBawah terbuka={rumusTerbuka} onTutup={() => setRumusTerbuka(false)} judul="Kartu Rumus">
        <IsiKartuRumus data={data.kartuRumus} />
      </LembarBawah>
      <LembarBawah terbuka={bahasTerbuka} onTutup={() => setBahasTerbuka(false)} judul={`Belum tepat di Langkah ${st.hasil?.langkah ?? ''}`}>
        {st.pembahasan && (
          <IsiPembahasan
            pembahasan={st.pembahasan}
            penyelesaian={gagal ? penyelesaianSoal(soal) : null}
            onCobaLagi={() => setBahasTerbuka(false)}
            onBerikutnya={() => onSelesai(false, petunjukTerbuka)}
          />
        )}
      </LembarBawah>
    </main>
  );
}

/** Isi lembar Pembahasan (P10): ① bagian yang belum tepat, ② "Ingat:", ③ "Petunjuk:", ④ penyelesaian (design.md §6). */
function IsiPembahasan({ pembahasan, penyelesaian, onCobaLagi, onBerikutnya }) {
  const [bagian, konsep, petunjuk] = pembahasan;
  return (
    <div className="isi-pembahasan">
      <p><TeksKaya teks={bagian} /></p>
      {konsep && <p><b>Ingat:</b> <TeksKaya teks={konsep} /></p>}
      {petunjuk && <p><b>Petunjuk:</b> <TeksKaya teks={petunjuk} /></p>}
      {penyelesaian ? (
        <>
          <p className="label-bagian">Penyelesaian yang benar:</p>
          <PenyelesaianBertahap langkah={penyelesaian} />
          <button type="button" className="tombol-utama" style={{ marginTop: 12 }} onClick={onBerikutnya}>Soal berikutnya</button>
        </>
      ) : (
        <button type="button" className="tombol-utama" onClick={onCobaLagi}>Coba lagi</button>
      )}
    </div>
  );
}

function Ringkasan({ level, hasil, onUlangi }) {
  const benar = hasil.filter((h) => h.benar).length;
  const buka = benar >= SYARAT_BUKA && level < 4;
  return (
    <main className="halaman halaman--fokus">
      <KepalaFokus judul={`Level ${level} selesai`} kembaliKe="/latihan" />
      <section className="kartu skor-total">
        <p className="skor-total__angka angka">{benar} dari {hasil.length}</p>
        <p>soal benar.</p>
        {buka && <p style={{ fontWeight: 700 }}>Level {level + 1} terbuka.</p>}
      </section>
      <div className="bilah-aksi">
        <div className="bilah-aksi__baris">
          <button type="button" className="tombol-kedua" onClick={onUlangi}>Ulangi Level {level}</button>
          <Link to="/latihan" className="tombol-utama tombol-tautan">Kembali ke Latihan</Link>
        </div>
      </div>
    </main>
  );
}

export default function Soal() {
  const { level: teksLevel } = useParams();
  const level = Number(teksLevel);
  const { sesi } = useOutletContext();
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState('');
  const [daftar, setDaftar] = useState(null);
  const [hasil, setHasil] = useState([]);
  const [putaran, setPutaran] = useState(0);

  useEffect(() => {
    Promise.all([muatSoal(), muatPembahasan(), muatMateri()])
      .then(([s, p, m]) => setData({ ...s, ...p, kartuRumus: m.kartuRumus }))
      .catch((e) => setGalat(e.message));
  }, []);
  useEffect(() => {
    if (data) {
      setDaftar(pilihSoalSesi(data.soal, level));
      setHasil([]);
    }
  }, [data, level, putaran]);

  if (!LEVEL_ADA.includes(level)) return <Navigate to="/latihan" replace />;
  if (galat) return <main className="halaman halaman--fokus"><KepalaFokus judul={`Level ${level}`} kembaliKe="/latihan" /><p className="pesan-galat" role="alert">{galat}</p></main>;
  if (!daftar) return <main className="halaman halaman--fokus"><p className="teks-redup">Memuat…</p></main>;

  if (hasil.length === daftar.length) {
    return <Ringkasan level={level} hasil={hasil} onUlangi={() => setPutaran((n) => n + 1)} />;
  }
  const soal = daftar[hasil.length];
  const selesaiSoal = (benar, petunjuk = 0) => {
    const baru = [...hasil, { benar, petunjuk }];
    setHasil(baru);
    if (baru.length === daftar.length) catatSesi(sesi.kodeTampil, level, baru.filter((h) => h.benar).length);
    window.scrollTo(0, 0);
  };
  const kunci = `${putaran}-${soal.id}`;
  const props = { soal, nomor: hasil.length + 1, data, onSelesai: selesaiSoal };
  return level === 4
    ? <KerjakanLevel4 key={kunci} {...props} />
    : <KerjakanSoal key={kunci} {...props} level={level} daftarLayar={layarUntuk(level, hasil)} />;
}
