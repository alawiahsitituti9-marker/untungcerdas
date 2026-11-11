import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import NavBawah from './komponen/NavBawah.jsx';
import Masuk from './halaman/Masuk.jsx';
import Beranda from './halaman/Beranda.jsx';
import DaftarMateri from './halaman/DaftarMateri.jsx';
import PilihLevel from './halaman/PilihLevel.jsx';
import Progres from './halaman/Progres.jsx';
import Simulasi from './halaman/Simulasi.jsx';
import CobaPenanda from './halaman/CobaPenanda.jsx';
import HalamanKartuMateri from './halaman/KartuMateri.jsx';
import KartuRumus from './halaman/KartuRumus.jsx';
import LatihanLiterasi from './halaman/LatihanLiterasi.jsx';
import KerjakanLiterasi from './halaman/KerjakanLiterasi.jsx';
import { sesiSaatIni, keluar as keluarLayanan } from './layanan/auth.js';

// Halaman yang membutuhkan sesi. `denganNav` = tampilkan tab bawah;
// halaman mode fokus (Simulasi, Soal, Materi) tanpa tab bawah (design.md §5).
function Terlindung({ sesi, setSesi, denganNav }) {
  const navigasi = useNavigate();
  if (!sesi) return <Navigate to="/masuk" replace />;
  const keluar = async () => {
    await keluarLayanan();
    setSesi(null);
    navigasi('/masuk', { replace: true });
  };
  return (
    <>
      <Outlet context={{ sesi, keluar }} />
      {denganNav && <NavBawah />}
    </>
  );
}

export default function App() {
  const [sesi, setSesi] = useState(() => sesiSaatIni());
  const lindungi = { sesi, setSesi };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/masuk" element={sesi ? <Navigate to="/" replace /> : <Masuk onMasuk={setSesi} />} />
        <Route element={<Terlindung {...lindungi} denganNav />}>
          <Route index element={<Beranda />} />
          <Route path="materi" element={<DaftarMateri />} />
          <Route path="latihan" element={<PilihLevel />} />
          <Route path="progres" element={<Progres />} />
        </Route>
        <Route element={<Terlindung {...lindungi} />}>
          <Route path="materi/:id" element={<HalamanKartuMateri />} />
          <Route path="rumus" element={<KartuRumus />} />
          <Route path="literasi" element={<LatihanLiterasi />} />
          <Route path="literasi/kerjakan" element={<KerjakanLiterasi />} />
          <Route path="simulasi" element={<Simulasi />} />
          <Route path="latihan/tandai" element={<CobaPenanda />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
