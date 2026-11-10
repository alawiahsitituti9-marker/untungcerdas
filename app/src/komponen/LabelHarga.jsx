import { formatRupiah } from '../logika/format.js';

// Label harga: biru "Beli" untuk harga beli, oranye "Jual" untuk harga jual (design.md §7).
export default function LabelHarga({ jenis, nilai }) {
  const beli = jenis === 'hb';
  return (
    <span className={`label-harga label-harga--${jenis}`}>
      <small>{beli ? 'Beli' : 'Jual'}</small>
      <span className="angka">{formatRupiah(nilai)}</span>
    </span>
  );
}
