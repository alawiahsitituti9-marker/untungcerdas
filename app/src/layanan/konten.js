// Memuat konten statis (api.md §5). Hasil disimpan agar tidak diunduh ulang.

const cache = new Map();

async function muat(nama) {
  if (!cache.has(nama)) {
    const janji = fetch(`${import.meta.env.BASE_URL}data/${nama}.json`).then((r) => {
      if (!r.ok) throw new Error('Materi belum termuat. Periksa koneksi internet.');
      return r.json();
    });
    cache.set(nama, janji);
    janji.catch(() => cache.delete(nama));
  }
  return cache.get(nama);
}

export const muatMateri = () => muat('materi');
export const muatSoal = () => muat('soal');
