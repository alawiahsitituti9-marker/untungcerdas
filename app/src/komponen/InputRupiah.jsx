import { formatAngka } from '../logika/format.js';

// Isian rupiah dengan pemisah ribuan otomatis dan keyboard angka (design.md §7).
// `nilai` berupa teks tampilan, misalnya "6.000"; dibaca dengan bacaRupiah().
export default function InputRupiah({ id, nilai, onUbah, nonaktif, label }) {
  const ubah = (e) => {
    const angka = e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 9);
    onUbah(angka ? formatAngka(Number(angka)) : '');
  };
  return (
    <div className="input-rupiah">
      <span aria-hidden="true">Rp</span>
      <input
        id={id}
        className="isian"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label={label}
        value={nilai}
        onChange={ubah}
        disabled={nonaktif}
      />
    </div>
  );
}
