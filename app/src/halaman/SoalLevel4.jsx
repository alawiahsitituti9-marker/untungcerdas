import { useState } from 'react';
import KepalaFokus from '../komponen/KepalaFokus.jsx';
import TeksKaya from '../komponen/TeksKaya.jsx';
import TombolPilihan from '../komponen/TombolPilihan.jsx';
import InputRupiah from '../komponen/InputRupiah.jsx';
import InputPersen from '../komponen/InputPersen.jsx';
import { bacaRupiah, bacaPersen } from '../logika/format.js';
import { periksaLevel4 } from '../logika/level4.js';
import { BATAS_PERCOBAAN, JUMLAH_SOAL_SESI } from '../logika/panduan.js';

// Soal Level 4 (F09; design.md §8): tanpa panduan dan tanpa petunjuk.
// Satu layar jawaban; pembahasan muncul setelah menjawab. Alur dua kesempatan D-05 §3.1:
// salah pertama → ①–③ + "Coba lagi"; salah kedua → penyelesaian D-04 lalu soal berikutnya.

const JENIS = [{ teks: '▲ Untung', nilai: 'untung' }, { teks: '▼ Rugi', nilai: 'rugi' }];
const BENAR_SALAH = [{ teks: 'Benar' }, { teks: 'Salah' }];

function Rupiah({ id, label, nilai, ubah, nonaktif }) {
  return (
    <>
      <p className="label-bagian"><label htmlFor={id}>{label}</label></p>
      <InputRupiah id={id} label={label} nilai={nilai ?? ''} onUbah={ubah} nonaktif={nonaktif} />
    </>
  );
}
function Persen({ id, label, nilai, ubah, nonaktif }) {
  return (
    <>
      <p className="label-bagian"><label htmlFor={id}>{label}</label></p>
      <InputPersen id={id} label={label} nilai={nilai ?? ''} onUbah={ubah} nonaktif={nonaktif} />
    </>
  );
}
function Pilihan({ label, pilihan, nilai, ubah, nonaktif }) {
  return (
    <>
      <p className="label-bagian">{label}</p>
      <TombolPilihan label={label} pilihan={pilihan} terpilih={nilai} onPilih={ubah} nonaktif={nonaktif} />
    </>
  );
}

/** Bidang isian per bentuk soal: [kunci, jenis isian]. */
const BIDANG = {
  umum: [['hb', 'rupiah'], ['hj', 'rupiah'], ['jenisI', 'pilihan'], ['persen', 'persen'], ['alasan', 'pilihan']],
  bandingkan: [['persen0', 'persen'], ['persen1', 'persen'], ['pilihan', 'pilihan'], ['alasan', 'pilihan']],
  evaluasi: [['pernyataan', 'pilihan'], ['jenisI', 'pilihan'], ['persen', 'persen'], ['alasan', 'pilihan']],
};

function baca(soal, isian) {
  const j = { ...isian, jenis: isian.jenisI != null ? JENIS[isian.jenisI].nilai : undefined };
  for (const [k, jenis] of BIDANG[soal.bentuk]) {
    if (jenis === 'pilihan') continue;
    const r = jenis === 'rupiah' ? bacaRupiah(isian[k] ?? '') : bacaPersen(isian[k] ?? '');
    if (!r.ok) return { ok: false, pesan: r.pesan };
    j[k] = r.nilai;
  }
  return { ok: true, jawab: j };
}

export default function KerjakanLevel4({ soal, nomor, data, onSelesai }) {
  const [isian, setIsian] = useState({});
  const [percobaan, setPercobaan] = useState(0);
  const [hasil, setHasil] = useState(null);
  const [pesan, setPesan] = useState('');
  const set = (k) => (v) => {
    setIsian((x) => ({ ...x, [k]: v }));
    setPesan('');
  };

  const selesai = hasil?.benar || percobaan >= BATAS_PERCOBAAN;
  const lengkap = BIDANG[soal.bentuk].every(([k, j]) => (j === 'pilihan' ? isian[k] != null : !!isian[k]));
  const alasan = soal.bentuk === 'umum' ? data.alasanJenis.map((teks) => ({ teks })) : soal.alasan.pilihan.map((teks) => ({ teks }));
  const p = { nonaktif: selesai };

  const periksa = () => {
    const r = baca(soal, isian);
    if (!r.ok) return setPesan(r.pesan);
    setPercobaan((n) => n + 1);
    setHasil(periksaLevel4(soal, r.jawab, data));
    window.scrollTo(0, document.body.scrollHeight);
  };

  return (
    <main className="halaman halaman--fokus halaman--tahap">
      <KepalaFokus judul={`Level 4 · Soal ${nomor}/${JUMLAH_SOAL_SESI}`} kembaliKe="/latihan" />
      <section className="kartu">
        <p className="teks-soal-cerita">{soal.segmen.map((s) => s.teks).join('')}</p>
      </section>

      {soal.bentuk === 'umum' && (
        <>
          <Rupiah id="l4-hb" label="Harga beli" nilai={isian.hb} ubah={set('hb')} {...p} />
          <Rupiah id="l4-hj" label="Harga jual" nilai={isian.hj} ubah={set('hj')} {...p} />
          <Pilihan label="Untung atau rugi?" pilihan={JENIS} nilai={isian.jenisI} ubah={set('jenisI')} {...p} />
          <Persen id="l4-persen" label="Persentasenya" nilai={isian.persen} ubah={set('persen')} {...p} />
        </>
      )}
      {soal.bentuk === 'bandingkan' && (
        <>
          {soal.transaksi.map((t, i) => (
            <Persen key={t.nama} id={`l4-p${i}`} label={`Persen untung ${t.nama.toLowerCase()}`} nilai={isian[`persen${i}`]} ubah={set(`persen${i}`)} {...p} />
          ))}
          <Pilihan label="Barang mana yang persentase keuntungannya lebih besar?" pilihan={soal.transaksi.map((t) => ({ teks: t.nama }))} nilai={isian.pilihan} ubah={set('pilihan')} {...p} />
        </>
      )}
      {soal.bentuk === 'evaluasi' && (
        <>
          <Pilihan label="Apakah perkataan Rina benar?" pilihan={BENAR_SALAH} nilai={isian.pernyataan} ubah={set('pernyataan')} {...p} />
          <Pilihan label="Untung atau rugi?" pilihan={JENIS} nilai={isian.jenisI} ubah={set('jenisI')} {...p} />
          <Persen id="l4-persen" label="Persentasenya" nilai={isian.persen} ubah={set('persen')} {...p} />
        </>
      )}
      <Pilihan label="Pilih alasannya." pilihan={alasan} nilai={isian.alasan} ubah={set('alasan')} {...p} />
      {pesan && <p className="pesan-galat" role="alert">{pesan}</p>}

      <div aria-live="polite">
        {hasil?.benar && (
          <div className="umpan-balik umpan-balik--benar">
            <p style={{ fontWeight: 700 }}>✓ Benar!</p>
            {hasil.tambahan?.map((t, i) => <p key={i}><TeksKaya teks={t} /></p>)}
          </div>
        )}
        {hasil && !hasil.benar && (
          <div className="umpan-balik umpan-balik--salah">
            {hasil.pembahasan.map((t, i) => <p key={i}><TeksKaya teks={t} /></p>)}
          </div>
        )}
        {selesai && (
          <div className="kartu">
            <p className="label-bagian">Penyelesaian:</p>
            <p><TeksKaya teks={soal.penyelesaian} /></p>
          </div>
        )}
      </div>

      <div className="bilah-aksi">
        {selesai ? (
          <button type="button" className="tombol-utama" onClick={() => onSelesai(!!hasil.benar)}>Soal berikutnya</button>
        ) : (
          <button type="button" className="tombol-utama" disabled={!lengkap} onClick={periksa}>
            {percobaan > 0 ? 'Coba lagi' : 'Periksa'}
          </button>
        )}
      </div>
    </main>
  );
}
