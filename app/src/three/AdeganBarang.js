// Adegan 3D Simulasi Jual Beli (F08; design.md §14; architecture.md §6; Keputusan K-06).
// Dimuat HANYA lewat import() dinamis dari komponen AdeganBarang3D di P07, setelah komponen itu
// memastikan WebGL tersedia, sehingga Three.js tidak ikut dalam unduhan awal dan tidak diunduh di
// HP tanpa WebGL. Label harga berupa HTML di atas kanvas (diatur komponen React), jadi adegan ini
// tidak perlu mengetahui harga.
//
// - Tas sekolah low-poly dari bentuk dasar, tanpa file model eksternal.
// - Diputar dengan geser satu jari, rotasi horizontal saja; tanpa zoom dan tanpa animasi otomatis.
// - Render on-demand: hanya saat diputar atau ukuran berubah. devicePixelRatio dibatasi 2.

import {
  WebGLRenderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight, Group, Mesh,
  BoxGeometry, TorusGeometry, MeshStandardMaterial, Color,
} from 'three';

const WARNA = { badan: 0x0f766e, saku: 0x14b8a6, gesper: 0xf0b429, tali: 0x334e68 };

function buatTas() {
  const tas = new Group();
  const bahan = (warna) => new MeshStandardMaterial({ color: warna, roughness: 0.75, flatShading: true });
  const badan = new Mesh(new BoxGeometry(1.6, 1.8, 0.7), bahan(WARNA.badan));
  const saku = new Mesh(new BoxGeometry(1.1, 0.7, 0.2), bahan(WARNA.saku));
  saku.position.set(0, -0.35, 0.42);
  const gesper = new Mesh(new BoxGeometry(0.22, 0.22, 0.08), bahan(WARNA.gesper));
  gesper.position.set(0, 0.05, 0.54);
  const tali = new Mesh(new TorusGeometry(0.45, 0.07, 6, 12, Math.PI), bahan(WARNA.tali));
  tali.position.set(0, 0.9, 0);
  tas.add(badan, saku, gesper, tali);
  tas.rotation.y = -0.5;
  return tas;
}

/**
 * Memasang adegan di dalam elemen.
 * @param {HTMLElement} elemen wadah kanvas
 * @returns {{ lepas: () => void }} panggil lepas() saat halaman ditutup untuk membersihkan memori
 */
export function pasang(elemen) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.style.touchAction = 'pan-y'; // gulir halaman tetap bisa; geser horizontal memutar
  elemen.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.background = null;
  const kamera = new PerspectiveCamera(35, 1, 0.1, 50);
  kamera.position.set(0, 0.6, 5.2);
  kamera.lookAt(0, 0.1, 0);
  scene.add(new AmbientLight(new Color(0xffffff), 1.6));
  const sinar = new DirectionalLight(0xffffff, 2.2);
  sinar.position.set(2, 3, 4);
  scene.add(sinar);
  const tas = buatTas();
  scene.add(tas);

  const render = () => renderer.render(scene, kamera);
  const ukur = () => {
    const { clientWidth: w, clientHeight: h } = elemen;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    kamera.aspect = w / h;
    kamera.updateProjectionMatrix();
    render();
  };
  const pengamat = new ResizeObserver(ukur);
  pengamat.observe(elemen);
  ukur();

  // Geser satu jari / tetikus: rotasi horizontal saja.
  let xAwal = null;
  const turun = (e) => { xAwal = e.clientX; renderer.domElement.setPointerCapture?.(e.pointerId); };
  const gerak = (e) => {
    if (xAwal == null) return;
    tas.rotation.y += (e.clientX - xAwal) * 0.012;
    xAwal = e.clientX;
    render();
  };
  const naik = () => { xAwal = null; };
  const c = renderer.domElement;
  c.addEventListener('pointerdown', turun);
  c.addEventListener('pointermove', gerak);
  c.addEventListener('pointerup', naik);
  c.addEventListener('pointercancel', naik);

  return {
    lepas() {
      pengamat.disconnect();
      c.removeEventListener('pointerdown', turun);
      c.removeEventListener('pointermove', gerak);
      c.removeEventListener('pointerup', naik);
      c.removeEventListener('pointercancel', naik);
      tas.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss(); // lepaskan konteks WebGL sekarang, jangan menunggu peramban
      c.remove();
    },
  };
}
