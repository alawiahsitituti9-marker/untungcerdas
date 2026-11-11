import LabelHarga from './LabelHarga.jsx';

// Gambar barang 2D yang selalu disertai label harga (design.md §1, T13).
// Label harga berupa teks HTML, bukan bagian gambar, agar angkanya bisa dipakai ulang (D-03 §3).
// Dipakai di Materi, Simulasi, dan sebagai cadangan bila 3D tidak tersedia (design.md §14).

const GAMBAR = {
  tas: {
    nama: 'Tas',
    isi: (
      <>
        <path d="M34 30a14 14 0 0 1 28 0" fill="none" stroke="#334e68" strokeWidth="5" strokeLinecap="round" />
        <rect x="18" y="30" width="60" height="54" rx="10" fill="#0f766e" />
        <rect x="28" y="52" width="40" height="22" rx="5" fill="#14b8a6" />
        <rect x="44" y="47" width="8" height="10" rx="2" fill="#f0b429" />
      </>
    ),
  },
  sepatu: {
    nama: 'Sepatu',
    isi: (
      <>
        <path d="M14 34h22l4 14c10 2 22 6 34 10 6 2 10 6 10 12v6H14z" fill="#334e68" />
        <rect x="12" y="74" width="74" height="8" rx="3" fill="#9fb3c8" />
        <path d="M40 48l-6 8M48 51l-6 8M56 54l-6 8" stroke="#f0f4f8" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
};

export default function BarangDuaDimensi({ hb, hj, gambar = 'tas' }) {
  const { nama, isi } = GAMBAR[gambar] ?? GAMBAR.tas;
  return (
    <figure className="barang" aria-label={`${nama}: ${hj != null ? 'harga beli dan harga jual' : 'harga beli'}`}>
      <svg viewBox="0 0 96 96" role="img" aria-label={nama}>
        {isi}
      </svg>
      <figcaption className="barang__label">
        <LabelHarga jenis="hb" nilai={hb} />
        {hj != null && <LabelHarga jenis="hj" nilai={hj} />}
      </figcaption>
    </figure>
  );
}
