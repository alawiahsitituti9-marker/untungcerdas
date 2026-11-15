
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { klien } from '../layanan/supabase.js';

export default function Daftar() {
  const navigasi = useNavigate();

  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [asalSekolah, setAsalSekolah] = useState('');
  const [kelas, setKelas] = useState('VIII');
  const [pin, setPin] = useState('');
  const [konfirmasiPin, setKonfirmasiPin] = useState('');
  const [pesan, setPesan] = useState('');
  const [idSiswa, setIdSiswa] = useState('');
  const [sibuk, setSibuk] = useState(false);

  async function kirim(e) {
    e.preventDefault();
    setPesan('');

    if (pin !== konfirmasiPin) {
      setPesan('Konfirmasi PIN tidak sama.');
      return;
    }

    if (!klien) {
      setPesan('Koneksi Supabase belum tersedia.');
      return;
    }

    setSibuk(true);

    try {
      const { data, error } = await klien.functions.invoke(
        'daftar-siswa',
        {
          body: {
            kode,
            nama,
            asalSekolah,
            kelas,
            pin,
          },
        },
      );

      if (error) {
        throw error;
      }

      if (!data?.berhasil || !data?.idSiswa) {
        setPesan(data?.pesan || 'Pendaftaran gagal.');
        return;
      }

      setIdSiswa(data.idSiswa);
    } catch (error) {
      setPesan(
        error?.message || 'Pendaftaran gagal. Periksa koneksi internet.',
      );
    } finally {
      setSibuk(false);
    }
  }

  return (
    <main className="halaman halaman--fokus" style={{ paddingTop: 40 }}>
      <h1>Daftar UntungCerdas</h1>
      <p>Buat akun untuk mulai belajar.</p>

      {idSiswa ? (
        <section style={{ marginTop: 24 }}>
          <h2>Pendaftaran berhasil!</h2>
          <p>Simpan ID siswa berikut untuk login.</p>

          <h2 style={{ letterSpacing: 2 }}>{idSiswa}</h2>

          <button
            type="button"
            className="tombol-utama"
            onClick={() => navigasi('/masuk')}
          >
            Lanjut ke halaman masuk
          </button>
        </section>
      ) : (
        <form onSubmit={kirim} noValidate style={{ marginTop: 24 }}>
          <label htmlFor="kode">Kode pendaftaran</label>
          <input
            id="kode"
            className="isian"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            placeholder="Masukkan kode pendaftaran"
            required
          />

          <label htmlFor="nama" style={{ display: 'block', marginTop: 14 }}>
            Nama siswa
          </label>
          <input
            id="nama"
            className="isian"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama lengkap"
            required
          />

          <label htmlFor="sekolah" style={{ display: 'block', marginTop: 14 }}>
            Asal sekolah
          </label>
          <input
            id="sekolah"
            className="isian"
            value={asalSekolah}
            onChange={(e) => setAsalSekolah(e.target.value)}
            placeholder="Nama sekolah"
            required
          />

          <label htmlFor="kelas" style={{ display: 'block', marginTop: 14 }}>
            Kelas
          </label>
          <select
            id="kelas"
            className="isian"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
          >
            <option value="VIII">VIII</option>
            <option value="IX">IX</option>
          </select>

          <label htmlFor="pin" style={{ display: 'block', marginTop: 14 }}>
            Buat PIN (6–12 angka)
          </label>
          <input
            id="pin"
            className="isian"
            type="password"
            inputMode="numeric"
            maxLength={12}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            required
          />

          <label htmlFor="konfirmasi" style={{ display: 'block', marginTop: 14 }}>
            Ulangi PIN
          </label>
          <input
            id="konfirmasi"
            className="isian"
            type="password"
            inputMode="numeric"
            maxLength={12}
            value={konfirmasiPin}
            onChange={(e) => setKonfirmasiPin(e.target.value.replace(/\D/g, ''))}
            required
          />

          <p className="pesan-galat" role="alert">{pesan}</p>

          <button
            type="submit"
            className="tombol-utama"
            disabled={sibuk}
          >
            {sibuk ? 'Mendaftarkan…' : 'Daftar'}
          </button>
        </form>
      )}

      <p style={{ marginTop: 20 }}>
        Sudah punya akun? <Link to="/masuk">Masuk di sini</Link>
      </p>
    </main>
  );
}
