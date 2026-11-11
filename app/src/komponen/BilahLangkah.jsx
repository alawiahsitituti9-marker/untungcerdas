// Penanda "Tahap n dari m" (design.md §7). Titik hanya penanda visual; teksnya untuk pembaca layar.
export default function BilahLangkah({ ke, dari }) {
  return (
    <div className="bilah-langkah" role="img" aria-label={`Tahap ${ke} dari ${dari}`}>
      {Array.from({ length: dari }, (_, i) => (
        <span key={i} className={i < ke ? 'bilah-langkah__isi' : undefined} />
      ))}
    </div>
  );
}
