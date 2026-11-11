import LabelHarga from './LabelHarga.jsx';
import { formatPersen } from '../logika/format.js';

// Ringkasan harga dari tanda buatan siswa sendiri (design.md §17.4).
export default function RingkasHarga({ ringkasan }) {
  if (!ringkasan.length) return null;
  return (
    <section className="ringkas-harga" aria-label="Tanda buatanmu">
      <p className="teks-redup" style={{ marginBottom: 4 }}>Tanda buatanmu:</p>
      {ringkasan.map((g) => (
        <div key={g.kelompok} className="ringkas-harga__baris">
          <span className="ringkas-harga__nama">{g.kelompok}</span>
          {g.isi.map((x, i) =>
            x.label === 'HB' || x.label === 'HJ' ? (
              x.nilai != null ? <LabelHarga key={i} jenis={x.label.toLowerCase()} nilai={x.nilai} /> : <span key={i}>{x.teks}</span>
            ) : (
              <span key={i} className="label-harga label-harga--persen">
                <small>Persen</small>
                <span className="angka">{x.nilai != null ? formatPersen(x.nilai) : x.teks}</span>
              </span>
            ),
          )}
        </div>
      ))}
    </section>
  );
}
