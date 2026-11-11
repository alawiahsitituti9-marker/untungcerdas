import { useEffect, useRef, useState } from 'react';
import LabelHarga from './LabelHarga.jsx';
import BarangDuaDimensi from './BarangDuaDimensi.jsx';

// Barang 3D berlabel harga di P07 Simulasi (F08; KFN-10; design.md §14).
// WebGL diperiksa lebih dulu; Three.js dimuat dengan import() dinamis hanya jika WebGL tersedia.
// Jika WebGL tidak tersedia atau pemuatan gagal, tampil BarangDuaDimensi dengan label yang sama
// (cadangan 2D). `paksa2d` dipakai untuk uji cadangan.

/** true bila peramban dapat membuat konteks WebGL. Konteks uji langsung dilepas. */
function dukungWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'));
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function AdeganBarang3D({ hb, hj, paksa2d = false }) {
  const wadah = useRef(null);
  // Diperiksa sekali saat komponen dipasang; jika tidak bisa 3D, Three.js tidak diunduh.
  const [bisa3d] = useState(() => !paksa2d && dukungWebGL());
  const [mode, setMode] = useState(bisa3d ? 'memuat' : '2d'); // 'memuat' | '3d' | '2d'

  useEffect(() => {
    if (!bisa3d) return undefined;
    let adegan = null;
    let batal = false;
    import('../three/AdeganBarang.js')
      .then((m) => {
        if (batal) return;
        if (!wadah.current) {
          setMode('2d');
          return;
        }
        adegan = m.pasang(wadah.current);
        setMode('3d');
      })
      .catch(() => !batal && setMode('2d'));
    return () => {
      batal = true;
      adegan?.lepas();
    };
  }, [bisa3d]);

  if (mode === '2d') return <BarangDuaDimensi hb={hb} hj={hj} />;

  const untung = hj > hb;
  const rugi = hj < hb;
  return (
    <figure className="adegan-3d" aria-label="Tas sekolah: harga beli dan harga jual">
      <div ref={wadah} className="adegan-3d__kanvas" />
      <figcaption className="adegan-3d__label">
        <LabelHarga jenis="hb" nilai={hb} />
        <LabelHarga jenis="hj" nilai={hj} />
        {(untung || rugi) && (
          <span className={`adegan-3d__jenis jenis--${untung ? 'untung' : 'rugi'}`}>{untung ? '▲ Untung' : '▼ Rugi'}</span>
        )}
      </figcaption>
      {mode === '3d' && <p className="teks-redup adegan-3d__petunjuk">Geser barang untuk memutarnya.</p>}
    </figure>
  );
}
