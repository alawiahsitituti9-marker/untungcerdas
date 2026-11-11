import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { masuk, modeUji } from '../layanan/auth.js';

// P01 Masuk (design.md §6, F01; api.md §7: setelah 429 tombol dinonaktifkan 30 detik).
export default function Masuk({ onMasuk }) {
  const [kode, setKode] = useState('');
  const [pesan, setPesan] = useState('');
  const [sibuk, setSibuk] = useState(false);
  const [terkunci, setTerkunci] = useState(false);
  const pewaktu = useRef(null);
  const navigasi = useNavigate();
  useEffect(() => () => clearTimeout(pewaktu.current), []);

  const kirim = async (e) => {
    e.preventDefault();
    if (sibuk || terkunci) return;
    setSibuk(true);
    const hasil = await masuk(kode);
    setSibuk(false);
    if (!hasil.ok) {
      setPesan(hasil.pesan);
      if (hasil.tunggu) {
        setTerkunci(true);
        clearTimeout(pewaktu.current);
        pewaktu.current = setTimeout(() => setTerkunci(false), hasil.tunggu * 1000);
      }
      return;
    }
    onMasuk(hasil.sesi);
    navigasi('/', { replace: true });
  };

  return (
    <main className="halaman halaman--fokus" style={{ paddingTop: 64 }}>
      <h1>MathSave</h1>
      <p>Belajar persentase untung dan rugi.</p>

      <form onSubmit={kirim} noValidate style={{ marginTop: 32 }}>
        <label htmlFor="kode" style={{ fontWeight: 600 }}>Kode siswa</label>
        <input
          id="kode"
          className="isian"
          value={kode}
          onChange={(e) => { setKode(e.target.value); setPesan(''); }}
          placeholder="MS-____-____"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck="false"
          aria-describedby="kode-bantuan kode-pesan"
          aria-invalid={pesan ? 'true' : undefined}
        />
        <p id="kode-bantuan" className="teks-redup" style={{ marginTop: 4 }}>Kode diberikan oleh guru.</p>
        <p id="kode-pesan" className="pesan-galat" role="alert">{pesan}</p>
        <button type="submit" className="tombol-utama" disabled={sibuk || terkunci}>
          {sibuk ? 'Memeriksa…' : 'Masuk'}
        </button>
      </form>

      {modeUji && (
        <p className="spanduk-uji" style={{ marginTop: 24 }}>
          Mode uji: server belum tersambung. Kode apa pun yang formatnya benar diterima,
          misalnya MS-7K4P-Q2XR.
        </p>
      )}
    </main>
  );
}
