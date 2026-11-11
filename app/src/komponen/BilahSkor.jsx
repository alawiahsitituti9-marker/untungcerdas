// Bilah skor "x dari m" dengan teks angka (design.md §17.7). Warna bukan satu-satunya penanda.
export default function BilahSkor({ skor, maks, label }) {
  return (
    <div className="bilah-skor">
      <div className="bilah-kemajuan" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={maks} aria-valuenow={skor}>
        <span style={{ width: `${(skor / maks) * 100}%` }} />
      </div>
      <span className="bilah-skor__angka angka">{skor} dari {maks}{skor === maks ? ' ✓' : ''}</span>
    </div>
  );
}
