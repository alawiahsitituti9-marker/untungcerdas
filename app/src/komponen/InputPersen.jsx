// Isian persen dengan keyboard desimal; menerima koma atau titik (design.md §7).
// `nilai` berupa teks, dibaca dengan bacaPersen().
export default function InputPersen({ id, nilai, onUbah, nonaktif, label }) {
  const ubah = (e) => onUbah(e.target.value.replace(/[^\d.,]/g, '').slice(0, 9));
  return (
    <div className="input-rupiah">
      <input
        id={id}
        className="isian"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        aria-label={label}
        value={nilai}
        onChange={ubah}
        disabled={nonaktif}
      />
      <span aria-hidden="true">%</span>
    </div>
  );
}
