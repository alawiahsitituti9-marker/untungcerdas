import { useState } from 'react';
import KepalaFokus from '../komponen/KepalaFokus.jsx';
import BarangDuaDimensi from '../komponen/BarangDuaDimensi.jsx';
import BatangBanding from '../komponen/BatangBanding.jsx';
import { hitungTransaksi, hampirSama } from '../logika/hitung.js';
import { formatAngka, formatRupiah, formatPersen } from '../logika/format.js';

// P07 Simulasi Jual Beli, versi 2D (DV-14; design.md §6, §16).
// Visual 3D Three.js ditambahkan di DV-15 dengan versi 2D ini sebagai cadangan.

const MIN = 10_000;
const MAKS = 200_000;
const LANGKAH = 5_000;
const batasi = (n) => Math.min(MAKS, Math.max(MIN, n));

const TANTANGAN = [
  // Titik awal dipilih agar target tercapai dengan menggeser harga jual saja (keputusan 11 November 2026):
  // T1: 40.000 → 50.000 = untung 25%. T2: 50.000 → 45.000 = rugi 10%. T3: 80.000 → 100.000 = untung Rp20.000.
  { id: 1, teks: 'Atur harga agar pedagang untung 25%.', target: { jenis: 'untung', persen: 25 }, mulai: { hb: 40_000, hj: 40_000 } },
  { id: 2, teks: 'Atur harga agar pedagang rugi 10%.', target: { jenis: 'rugi', persen: 10 }, mulai: { hb: 50_000, hj: 50_000 } },
  {
    id: 3,
    teks: 'Harga beli tetap Rp80.000. Atur harga jual agar untung Rp20.000.',
    target: { jenis: 'untung', selisih: 20_000 },
    mulai: { hb: 80_000, hj: 80_000 },
    kunciHb: true,
  },
];

function nilaiTantangan(tantangan, t) {
  const { target } = tantangan;
  const kataJenis = target.jenis === 'untung' ? 'lebih besar' : 'lebih kecil';
  if (t.jenis !== target.jenis) {
    return { benar: false, pesan: `Pedagang harus ${target.jenis}. Jadi harga jual harus ${kataJenis} dari harga beli.` };
  }
  if (target.selisih != null) {
    if (t.selisih === target.selisih) return { benar: true };
    const arah = t.selisih < target.selisih ? 'naikkan' : 'turunkan';
    return { benar: false, pesan: `Sekarang untungnya ${formatRupiah(t.selisih)}. Coba ${arah} harga jual.` };
  }
  if (hampirSama(t.persen, target.persen)) return { benar: true };
  const kurang = t.persen < target.persen;
  return {
    benar: false,
    pesan: `Sekarang ${target.jenis} ${formatPersen(t.persen)}. ${
      kurang ? `Persennya masih kurang dari ${target.persen}%.` : `Persennya lebih dari ${target.persen}%.`
    } Ingat, persen dihitung dari harga beli.`,
  };
}

function Penggeser({ id, judul, warna, nilai, onUbah, terkunci }) {
  return (
    <div className={`penggeser penggeser--${warna}`}>
      <div className="penggeser__kepala">
        <label htmlFor={id}>{judul}</label>
        <div className="penggeser__angka">
          <button type="button" className="tombol-langkah" aria-label={`Kurangi ${judul.toLowerCase()}`} disabled={terkunci || nilai <= MIN} onClick={() => onUbah((n) => n - LANGKAH)}>−</button>
          <output htmlFor={id}>{formatAngka(nilai)}</output>
          <button type="button" className="tombol-langkah" aria-label={`Tambah ${judul.toLowerCase()}`} disabled={terkunci || nilai >= MAKS} onClick={() => onUbah((n) => n + LANGKAH)}>+</button>
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={MIN}
        max={MAKS}
        step={LANGKAH}
        value={nilai}
        disabled={terkunci}
        onChange={(e) => onUbah(Number(e.target.value))}
        aria-valuetext={formatRupiah(nilai)}
      />
    </div>
  );
}

function Hasil({ t }) {
  if (t.jenis === 'impas') {
    return <p className="jenis--impas" style={{ fontWeight: 700 }}>= Impas: tidak untung dan tidak rugi.</p>;
  }
  const untung = t.jenis === 'untung';
  const Jenis = untung ? 'Untung' : 'Rugi';
  const [a, b] = untung ? [t.hj, t.hb] : [t.hb, t.hj];
  return (
    <>
      <p className={`jenis--${t.jenis}`} style={{ fontWeight: 700, fontSize: 'var(--ukuran-judul)', marginBottom: 4 }}>
        {untung ? '▲' : '▼'} {Jenis.toUpperCase()}
      </p>
      <p className="rumus">
        {Jenis} = {untung ? 'HJ − HB' : 'HB − HJ'}<br />
        = {formatAngka(a)} − {formatAngka(b)} = <b>{formatRupiah(t.selisih)}</b>
      </p>
      <p className="rumus">
        % {Jenis} = {Jenis} ÷ <b style={{ color: 'var(--hb)' }}>HB</b> × 100%<br />
        = {formatAngka(t.selisih)} ÷ {formatAngka(t.hb)} × 100% = <b>{formatPersen(t.persen)}</b>
      </p>
    </>
  );
}

export default function Simulasi() {
  const [hb, setHb] = useState(80_000);
  const [hj, setHj] = useState(100_000);
  const [aktif, setAktif] = useState(null);
  const [nilai, setNilai] = useState(null);

  const t = hitungTransaksi(hb, hj);
  const tantangan = TANTANGAN.find((x) => x.id === aktif);

  // `ubah` menerima angka baru atau fungsi (n) => n ± LANGKAH, agar ketukan cepat tidak hilang.
  const pengubah = (setter) => (ubah) => {
    setter((lama) => batasi(typeof ubah === 'function' ? ubah(lama) : ubah));
    setNilai(null);
  };
  const ubahHb = pengubah(setHb);
  const ubahHj = pengubah(setHj);
  const mulaiTantangan = (x) => {
    setAktif(x.id);
    setHb(x.mulai.hb);
    setHj(x.mulai.hj);
    setNilai(null);
  };

  return (
    <main className="halaman halaman--fokus">
      <KepalaFokus judul="Simulasi Jual Beli" />

      {tantangan && (
        <section className="kartu" aria-live="polite">
          <p style={{ fontWeight: 700 }}>Tantangan {tantangan.id} dari {TANTANGAN.length}</p>
          <p>{tantangan.teks}</p>
        </section>
      )}

      <BarangDuaDimensi hb={hb} hj={hj} />

      <Penggeser id="hb" judul="Harga beli" warna="hb" nilai={hb} onUbah={ubahHb} terkunci={tantangan?.kunciHb} />
      <Penggeser id="hj" judul="Harga jual" warna="hj" nilai={hj} onUbah={ubahHj} />

      <BatangBanding hb={hb} hj={hj} />

      <section className="kartu" aria-live="polite" aria-atomic="true">
        <Hasil t={t} />
      </section>

      {tantangan ? (
        <>
          {nilai && (
            <div className={`umpan-balik umpan-balik--${nilai.benar ? 'benar' : 'salah'}`} role="status">
              {nilai.benar ? (
                <>
                  <p style={{ fontWeight: 700 }}>Tepat!</p>
                  <p>Masih ada pasangan harga lain yang juga benar. Coba cari satu lagi.</p>
                </>
              ) : (
                <p>{nilai.pesan}</p>
              )}
            </div>
          )}
          <button type="button" className="tombol-utama" onClick={() => setNilai(nilaiTantangan(tantangan, t))}>Cek</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <button type="button" className="tombol-teks" onClick={() => { setAktif(null); setNilai(null); }}>Mode bebas</button>
            {tantangan.id < TANTANGAN.length && (
              <button type="button" className="tombol-teks" onClick={() => mulaiTantangan(TANTANGAN[tantangan.id])}>Tantangan berikutnya ›</button>
            )}
          </div>
        </>
      ) : (
        <button type="button" className="tombol-utama" onClick={() => mulaiTantangan(TANTANGAN[0])}>Mulai tantangan</button>
      )}
    </main>
  );
}
