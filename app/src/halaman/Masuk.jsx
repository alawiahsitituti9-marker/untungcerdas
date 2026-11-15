
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { masuk, modeUji } from '../layanan/auth.js';

export default function Masuk({ onMasuk }) {
  const [idSiswa, setIdSiswa] = useState('');
  const [pin, setPin] = useState('');
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
    setPesan('');

    const hasil = await masuk(idSiswa, pin);

    setSibuk(false);

    if (!hasil.ok) {
      setPesan(hasil.pesan);

      if (hasil.tunggu) {
        setTerkunci(true);
        clearTimeout(pewaktu.current);

        pewaktu.current = setTimeout(() => {
          setTerkunci(false);
        }, hasil.tunggu * 1000);
      }

      return;
    }

    onMasuk(hasil.sesi);
    navigasi('/', { replace: true });
  };

  return (
    <main className="halaman halaman--fokus" style={{ paddingTop: 64 }}>
      <h1>UntungCerdas</h1>
      <p>Belajar persentase untung dan rugi.</p>

      <form onSubmit={kirim} noValidate style={{ marginTop: 32 }}>
        <label htmlFor="idSiswa" style={{ fontWeight: 600 }}>
          ID siswa
        </label>

        <input
          id="idSiswa"
          className="isian"
          value={idSiswa}
          onChange={(e) => {
            setIdSiswa(e.target.value.toUpperCase());
            setPesan('');
          }}
          placeholder="UC-XXXXXXXX"
          autoComplete="username"
          autoCapitalize="characters"
          spellCheck="false"
          required
        />

        <label
          htmlFor="pin"
          style={{ fontWeight: 600, display: 'block', marginTop: 16 }}
        >
          PIN
        </label>

        <input
          id="pin"
          className="isian"
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ''));
            setPesan('');
          }}
          placeholder="Masukkan PIN"
          autoComplete="current-password"
          maxLength={12}
          required
        />

        <p className="pesan-galat" role="alert">
          {pesan}
        </p>

        <button
          type="submit"
          className="tombol-utama"
          disabled={sibuk || terkunci}
        >
          {sibuk ? 'Memeriksa…' : terkunci ? 'Tunggu sebentar…' : 'Masuk'}
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        Belum punya akun? <Link to="/daftar">Daftar di sini</Link>
      </p>

      {modeUji && (
        <p className="spanduk-uji" style={{ marginTop: 24 }}>
          Mode uji: pendaftaran dan login siswa memerlukan koneksi Supabase.
        </p>
      )}
    </main>
  );
}
