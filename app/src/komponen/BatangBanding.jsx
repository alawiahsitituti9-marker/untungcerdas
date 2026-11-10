// Dua batang HB dan HJ; selisihnya diarsir hijau (untung) atau merah (rugi) (design.md §7, §16).
export default function BatangBanding({ hb, hj }) {
  const maks = Math.max(hb, hj) || 1;
  const lebar = (n) => `${(n / maks) * 100}%`;
  const untung = hj > hb;
  const rugi = hj < hb;
  return (
    <div className="batang-banding" aria-hidden="true">
      <span style={{ color: 'var(--hb)' }}>HB</span>
      <div>
        <div className="batang batang--hb" style={{ width: lebar(hb) }}>
          {rugi && (
            <span
              className="batang__selisih jenis--rugi"
              style={{ left: `${(hj / hb) * 100}%`, right: 0 }}
            />
          )}
        </div>
      </div>
      <span style={{ color: 'var(--hj)' }}>HJ</span>
      <div>
        <div className="batang batang--hj" style={{ width: lebar(hj) }}>
          {untung && (
            <span
              className="batang__selisih jenis--untung"
              style={{ left: `${(hb / hj) * 100}%`, right: 0 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
