import { formatRupiah } from '../logika/format.js';

// Label harga: biru "Beli" untuk harga beli, oranye "Jual" untuk harga jual (design.md §7).
// `keterangan` opsional untuk satuan, mis. "(10 kg)" atau "/kg" (D-03 §3, C3).
export default function LabelHarga({ jenis, nilai, keterangan }) {
  const beli = jenis === 'hb';
  return (
    <span className={`label-harga label-harga--${jenis}`}>
      <small>{beli ? 'Beli' : 'Jual'}</small>
      <span className="angka">{formatRupiah(nilai)}{keterangan && <span className="label-harga__ket">{keterangan.startsWith('/') ? '' : ' '}{keterangan}</span>}</span>
    </span>
  );
}
