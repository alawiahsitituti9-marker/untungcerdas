import TeksKaya from './TeksKaya.jsx';
import RumusTerisi from './RumusTerisi.jsx';
import BarangDuaDimensi from './BarangDuaDimensi.jsx';
import BatangBanding from './BatangBanding.jsx';
import LabelHarga from './LabelHarga.jsx';

// Satu kartu materi: gambar opsional (maksimal satu, selalu berlabel harga) +
// teks ≤ 3 kalimat + rumus terisi di bawah gambar transaksi yang sama (design.md §2, §7).
function Gambar({ gambar }) {
  if (gambar.batang) {
    return (
      <figure className="gambar-batang" aria-label="Perbandingan harga beli dan harga jual">
        <BatangBanding hb={gambar.hb} hj={gambar.hj} />
        <figcaption className="gambar-batang__label">
          <LabelHarga jenis="hb" nilai={gambar.hb} />
          <LabelHarga jenis="hj" nilai={gambar.hj} />
        </figcaption>
      </figure>
    );
  }
  return <BarangDuaDimensi gambar={gambar.barang} hb={gambar.hb} hj={gambar.hj} />;
}

export default function KartuMateri({ kartu }) {
  return (
    <div className="kartu-materi">
      {kartu.gambar && <Gambar gambar={kartu.gambar} />}
      <p className="kartu-materi__teks"><TeksKaya teks={kartu.teks} /></p>
      <RumusTerisi baris={kartu.rumus} />
    </div>
  );
}
