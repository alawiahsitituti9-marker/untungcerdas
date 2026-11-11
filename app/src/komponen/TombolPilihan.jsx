// Pilihan jawaban besar (design.md §7). Bekerja seperti radio: satu pilihan aktif.
export default function TombolPilihan({ label, pilihan, terpilih, onPilih, nonaktif }) {
  return (
    <div className="tombol-pilihan" role="radiogroup" aria-label={label}>
      {pilihan.map((p, i) => (
        <button
          key={p.teks}
          type="button"
          role="radio"
          aria-checked={terpilih === i}
          disabled={nonaktif}
          onClick={() => onPilih(i)}
        >
          {p.teks}
        </button>
      ))}
    </div>
  );
}
