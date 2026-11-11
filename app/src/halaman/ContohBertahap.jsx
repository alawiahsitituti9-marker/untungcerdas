import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import KepalaFokus from '../komponen/KepalaFokus.jsx';
import BilahLangkah from '../komponen/BilahLangkah.jsx';
import TeksBertanda from '../komponen/TeksBertanda.jsx';
import TeksKaya from '../komponen/TeksKaya.jsx';
import RumusTerisi from '../komponen/RumusTerisi.jsx';
import TombolPilihan from '../komponen/TombolPilihan.jsx';
import InputRupiah from '../komponen/InputRupiah.jsx';
import InputPersen from '../komponen/InputPersen.jsx';
import { Gambar } from '../komponen/KartuMateri.jsx';
import { muatMateri, muatPembahasan } from '../layanan/konten.js';
import { bacaRupiah, bacaPersen } from '../logika/format.js';
import { periksaIsianContoh, BATAS_PERCOBAAN } from '../logika/contoh.js';

// P06 Contoh Bertahap (F12; KFN-15; design.md §6; D-03 §2).
// Setiap ketukan "Lanjut" membuka satu langkah baru di bawah langkah sebelumnya.
// Langkah sebelumnya tetap terlihat tetapi diredupkan. "Ulangi dari awal" ada di langkah terakhir.
// C4 (Contoh Sebagian): langkah 4–6 diisi siswa; pembahasan memakai alur D-05 §3.1.

function IsianLangkah({ contoh, langkah, data, status, onUbah }) {
  const { isian } = langkah;
  const [teks, setTeks] = useState('');
  const [pilih, setPilih] = useState(null);
  const [pesan, setPesan] = useState('');

  const periksa = () => {
    let jawab;
    if (isian.jenis === 'rumus') jawab = isian.pilihan[pilih].nilai;
    else {
      const r = isian.jenis === 'rupiah' ? bacaRupiah(teks) : bacaPersen(teks);
      if (!r.ok) return setPesan(r.pesan);
      jawab = r.nilai;
    }
    setPesan('');
    const h = periksaIsianContoh(contoh, langkah, jawab, data);
    const percobaan = status.percobaan + 1;
    onUbah({ percobaan, hasil: h, selesai: h.benar || percobaan >= BATAS_PERCOBAAN });
  };

  const terisi = isian.jenis === 'rumus' ? pilih != null : teks.trim() !== '';
  const id = `isian-contoh-${langkah.no}`;
  return (
    <div className="isian-contoh">
      <p style={{ fontWeight: 600 }}><label htmlFor={id}><TeksKaya teks={isian.perintah} /></label></p>
      {isian.jenis === 'rumus' && (
        <TombolPilihan label={isian.perintah} pilihan={isian.pilihan} terpilih={pilih} onPilih={setPilih} nonaktif={status.selesai} />
      )}
      {isian.jenis === 'rupiah' && <InputRupiah id={id} label={isian.perintah} nilai={teks} onUbah={setTeks} nonaktif={status.selesai} />}
      {isian.jenis === 'persen' && <InputPersen id={id} label={isian.perintah} nilai={teks} onUbah={setTeks} nonaktif={status.selesai} />}
      {pesan && <p className="pesan-galat" role="alert">{pesan}</p>}

      <div aria-live="polite">
        {status.hasil?.benar && <div className="umpan-balik umpan-balik--benar"><p style={{ fontWeight: 700 }}>✓ Benar!</p></div>}
        {status.hasil && !status.hasil.benar && (
          <div className="umpan-balik umpan-balik--salah">
            {status.hasil.pembahasan.map((p, i) => <p key={i}><TeksKaya teks={p} /></p>)}
          </div>
        )}
      </div>

      {!status.selesai && (
        <button type="button" className="tombol-utama" disabled={!terisi} onClick={periksa}>
          {status.percobaan > 0 ? 'Coba lagi' : 'Periksa'}
        </button>
      )}
      {status.selesai && !status.hasil?.benar && <p className="label-bagian">Hasil yang benar:</p>}
    </div>
  );
}

function IsiContoh({ contoh, data }) {
  const [tampil, setTampil] = useState(0); // banyak langkah yang sudah dibuka
  const [status, setStatus] = useState({}); // per indeks langkah isian: { percobaan, hasil, selesai }
  const [putaran, setPutaran] = useState(0); // naik saat "Ulangi dari awal" agar isian kembali kosong
  const terakhirRef = useRef(null);

  useEffect(() => {
    if (tampil > 0) terakhirRef.current?.scrollIntoView({ block: 'nearest' });
  }, [tampil]);

  const jumlah = contoh.langkah.length;
  const iSekarang = tampil - 1;
  const sekarang = contoh.langkah[iSekarang];
  const stSekarang = status[iSekarang] ?? { percobaan: 0 };
  const menunggu = sekarang?.isian && !stSekarang.selesai;
  const selesaiSemua = tampil === jumlah && !menunggu;

  const label = tampil > 0 ? Object.fromEntries(contoh.segmen.map((s, i) => [i, s.peran]).filter(([, p]) => p)) : {};
  const ulangi = () => {
    setTampil(0);
    setStatus({});
    setPutaran((n) => n + 1);
    window.scrollTo(0, 0);
  };

  return (
    <main className="halaman halaman--fokus">
      <KepalaFokus
        judul={`${contoh.id} ${contoh.judul}`}
        kembaliKe="/materi"
        kanan={<span className="angka" aria-label={`Langkah ${tampil} dari ${jumlah}`}>{tampil}/{jumlah}</span>}
      />
      <BilahLangkah ke={tampil} dari={jumlah} />

      <section className="kartu">
        <Gambar gambar={contoh.gambar} />
        <TeksBertanda segmen={contoh.segmen} label={label} onUbah={() => {}} terkunci />
      </section>

      <ol className="daftar-langkah" key={putaran}>
        {contoh.langkah.slice(0, tampil).map((l, i) => {
          const st = status[i] ?? { percobaan: 0 };
          const lama = i < iSekarang;
          const tampilHasil = !l.isian || st.selesai;
          return (
            <li key={i} ref={i === iSekarang ? terakhirRef : null} className={`langkah-contoh${lama ? ' langkah-contoh--lama' : ''}`}>
              <p className="langkah-contoh__judul">{l.judul}</p>
              {l.teks && <p><TeksKaya teks={l.teks} /></p>}
              {l.isian && (
                <IsianLangkah contoh={contoh} langkah={l} data={data} status={st} onUbah={(s) => setStatus((x) => ({ ...x, [i]: s }))} />
              )}
              {tampilHasil && <RumusTerisi baris={l.hasil} />}
            </li>
          );
        })}
      </ol>

      <div className="bilah-aksi">
        {selesaiSemua ? (
          <div className="bilah-aksi__baris">
            <button type="button" className="tombol-kedua" onClick={ulangi}>Ulangi dari awal</button>
            <Link to={contoh.berikut.tautan} className="tombol-utama tombol-tautan">{contoh.berikut.teks}</Link>
          </div>
        ) : (
          <button type="button" className="tombol-utama" disabled={menunggu} onClick={() => setTampil((n) => n + 1)}>
            Lanjut
          </button>
        )}
      </div>
    </main>
  );
}

export default function ContohBertahap() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState('');

  useEffect(() => {
    Promise.all([muatMateri(), muatPembahasan()])
      .then(([m, p]) => setData({ ...p, contoh: m.contoh, kartuRumus: m.kartuRumus }))
      .catch((e) => setGalat(e.message));
  }, []);

  if (galat) {
    return <main className="halaman halaman--fokus"><KepalaFokus judul="Contoh Bertahap" kembaliKe="/materi" /><p className="pesan-galat" role="alert">{galat}</p></main>;
  }
  if (!data) return <main className="halaman halaman--fokus"><p className="teks-redup">Memuat…</p></main>;
  const contoh = data.contoh.find((c) => c.id === id);
  if (!contoh) return <Navigate to="/materi" replace />;
  return <IsiContoh key={id} contoh={contoh} data={data} />;
}
