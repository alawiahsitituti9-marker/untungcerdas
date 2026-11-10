import { NavLink } from 'react-router-dom';

// 4 tab bawah: ikon + teks (design.md §5).
const TAB = [
  { ke: '/', teks: 'Beranda', ikon: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' },
  { ke: '/materi', teks: 'Materi', ikon: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7M8 11h7' },
  { ke: '/latihan', teks: 'Latihan', ikon: 'M5 3h14v18H5zM9 8h6M9 12h6M9 16h3' },
  { ke: '/progres', teks: 'Progres', ikon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
];

export default function NavBawah() {
  return (
    <nav className="nav-bawah" aria-label="Navigasi utama">
      <ul>
        {TAB.map((t) => (
          <li key={t.ke}>
            <NavLink to={t.ke} end={t.ke === '/'} className={({ isActive }) => (isActive ? 'aktif' : undefined)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={t.ikon} />
              </svg>
              {t.teks}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
