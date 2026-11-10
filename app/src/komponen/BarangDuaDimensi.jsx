import LabelHarga from './LabelHarga.jsx';

// Gambar barang 2D yang selalu disertai label harga (design.md §1, T13).
// Dipakai di Simulasi dan sebagai cadangan bila 3D tidak tersedia (design.md §14).
export default function BarangDuaDimensi({ hb, hj, nama = 'Tas sekolah' }) {
  return (
    <figure className="barang" aria-label={`${nama}: harga beli dan harga jual`}>
      <svg viewBox="0 0 96 96" role="img" aria-label={nama}>
        <path d="M34 30a14 14 0 0 1 28 0" fill="none" stroke="#334e68" strokeWidth="5" strokeLinecap="round" />
        <rect x="18" y="30" width="60" height="54" rx="10" fill="#0f766e" />
        <rect x="28" y="52" width="40" height="22" rx="5" fill="#14b8a6" />
        <rect x="44" y="47" width="8" height="10" rx="2" fill="#f0b429" />
      </svg>
      <figcaption className="barang__label">
        <LabelHarga jenis="hb" nilai={hb} />
        {hj != null && <LabelHarga jenis="hj" nilai={hj} />}
      </figcaption>
    </figure>
  );
}
