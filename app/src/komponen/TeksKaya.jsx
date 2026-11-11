// Menampilkan teks konten dengan cetak tebal `**…**` (materi.json). Tanpa HTML mentah.
export default function TeksKaya({ teks }) {
  const bagian = String(teks).split(/\*\*(.+?)\*\*/g);
  return bagian.map((b, i) => (i % 2 === 1 ? <b key={i}>{b}</b> : b));
}
