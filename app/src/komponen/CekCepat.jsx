import { useState } from 'react';
import TeksKaya from './TeksKaya.jsx';
import TombolPilihan from './TombolPilihan.jsx';
import InputRupiah from './InputRupiah.jsx';
import { bacaRupiah } from '../logika/format.js';
import { nilaiCekCepat, acakUrutan } from '../logika/cekCepat.js';

// Satu soal cek cepat di akhir submateri (KFN-05). Jika salah, muncul satu
// pembahasan singkat dan siswa boleh mencoba lagi (D-05 §6).
export default function CekCepat({ cek, onBenar }) {
  const [pilihan] = useState(() => (cek.acak ? acakUrutan(cek.pilihan) : cek.pilihan));
  const [iPilih, setIPilih] = useState(null);
  const [iAlasan, setIAlasan] = useState(null);
  const [rupiah, setRupiah] = useState('');
  const [hasil, setHasil] = useState(null);

  const ubah = (setter) => (nilai) => {
    setter(nilai);
    if (!hasil?.benar) setHasil(null);
  };

  const lengkap =
    cek.tipe === 'rupiah' ? rupiah !== '' : iPilih != null && (!cek.alasan || iAlasan != null);

  const periksa = () => {
    let jawab;
    if (cek.tipe === 'rupiah') {
      const baca = bacaRupiah(rupiah);
      if (!baca.ok) return setHasil({ benar: false, umpan: baca.pesan });
      jawab = { rupiah: baca.nilai };
    } else {
      jawab = { pilihan: pilihan[iPilih], alasan: cek.alasan?.pilihan[iAlasan] };
    }
    const h = nilaiCekCepat(cek, jawab);
    setHasil(h);
    if (h.benar) onBenar?.();
  };

  const selesai = hasil?.benar;

  return (
    <section className="cek-cepat" aria-labelledby="judul-cek">
      <h2 id="judul-cek">Cek cepat</h2>
      {cek.cerita && <p>{cek.cerita}</p>}
      <p style={{ fontWeight: 600 }}>{cek.tanya}</p>

      {cek.tipe === 'rupiah' ? (
        <InputRupiah id="isian-cek" label={cek.tanya} nilai={rupiah} onUbah={ubah(setRupiah)} nonaktif={selesai} />
      ) : (
        <TombolPilihan label={cek.tanya} pilihan={pilihan} terpilih={iPilih} onPilih={ubah(setIPilih)} nonaktif={selesai} />
      )}

      {cek.alasan && (
        <>
          <p style={{ fontWeight: 600, marginTop: 12 }}>{cek.alasan.tanya}</p>
          <TombolPilihan label={cek.alasan.tanya} pilihan={cek.alasan.pilihan} terpilih={iAlasan} onPilih={ubah(setIAlasan)} nonaktif={selesai} />
        </>
      )}

      <div aria-live="polite">
        {hasil && (
          <div className={`umpan-balik umpan-balik--${hasil.benar ? 'benar' : 'salah'}`}>
            {hasil.benar ? (
              <p style={{ fontWeight: 700 }}>✓ Benar!</p>
            ) : (
              <>
                <p style={{ fontWeight: 700 }}>Belum tepat. Coba lagi.</p>
                <p><TeksKaya teks={hasil.umpan} /></p>
              </>
            )}
          </div>
        )}
      </div>

      {!selesai && (
        <button type="button" className="tombol-utama" disabled={!lengkap} onClick={periksa}>
          Periksa
        </button>
      )}
    </section>
  );
}
