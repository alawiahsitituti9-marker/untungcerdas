import TeksKaya from './TeksKaya.jsx';

// Satu tahap di pembahasan P14 (design.md §17.5): status, jawaban siswa, dan pembahasan.
// Tahap yang perlu diperbaiki memuat 5 bagian (LM-03 A5); tahap yang benar cukup satu kalimat (A7).
export default function BarisTahap({ tahap, hasil, jawaban, pesanUmum }) {
  const benar = hasil.benar;
  const sebagian = !benar && hasil.skor > 0;
  const p = tahap.pembahasan;
  const pesanSebagian = sebagian
    ? hasil.poin[0] ? pesanUmum.skorSebagianRumusBenar : pesanUmum.skorSebagianHitungBenar
    : null;

  return (
    // Terbuka bila perlu diperbaiki, atau benar karena konsekuen (agar pesan "Perbaiki angka di tahap n" terlihat).
    <details className={`baris-tahap baris-tahap--${benar ? 'benar' : 'perbaiki'}`} open={!benar || hasil.konsekuen}>
      <summary>
        <span className="baris-tahap__ikon" aria-hidden="true">{benar ? '✓' : '✗'}</span>
        <span className="baris-tahap__judul">Tahap {tahap.no} {tahap.judul}</span>
        <span className="baris-tahap__status">
          {benar ? 'Sudah benar' : 'Perlu diperbaiki'}
          {hasil.skorMaks > 1 && ` · ${hasil.skor} dari ${hasil.skorMaks}`}
        </span>
      </summary>
      <div className="baris-tahap__isi">
        <p className="label-bagian">Jawabanmu:</p>
        <ul className="jawaban-siswa">
          {jawaban.map((j, i) => <li key={i}>{j}</li>)}
        </ul>
        {benar ? (
          <>
            <p><TeksKaya teks={p.benar} /></p>
            {hasil.konsekuen && (
              <p className="teks-redup">{pesanUmum.konsekuen.replace('{n}', String(hasil.tahapAsalKonsekuen))}</p>
            )}
          </>
        ) : (
          <dl className="pembahasan-tahap">
            <dt>Letak kesalahan</dt>
            <dd>
              {pesanSebagian && <>{pesanSebagian} </>}
              {/* Teks umum hanya dipakai bila tidak ada umpan khusus maupun pesan skor sebagian. */}
              {(hasil.umpan || !pesanSebagian) && <TeksKaya teks={hasil.umpan ?? p.kesalahanUmum} />}
            </dd>
            <dt>Konsep</dt>
            <dd><TeksKaya teks={p.konsep} /></dd>
            <dt>Cara memperbaiki</dt>
            <dd><TeksKaya teks={p.cara} /></dd>
            <dt>Hasil yang benar</dt>
            <dd><TeksKaya teks={p.hasil} /></dd>
          </dl>
        )}
        {hasil.bantuan > 0 && <p className="teks-redup">{pesanUmum.bantuanDipakai.replace('{n}', String(hasil.bantuan))}</p>}
      </div>
    </details>
  );
}
