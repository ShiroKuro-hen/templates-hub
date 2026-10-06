import type { ReactNode } from 'react';

type Logo = { name: string; font: 'serif' | 'mono' | 'black' | 'ital' | 'wide' | 'round'; mark: ReactNode };

const LOGOS: Logo[] = [
  { name: 'Finca Norte', font: 'serif', mark: <circle cx="13" cy="13" r="10" fill="#ff5a36" stroke="#17130f" strokeWidth="2.5" /> },
  { name: 'orbita.labs', font: 'mono', mark: <path d="M13 3l10 18H3z" fill="#17130f" /> },
  { name: 'kiwipay', font: 'black', mark: <rect x="3" y="3" width="20" height="20" rx="4" fill="#3b5bfd" stroke="#17130f" strokeWidth="2.5" /> },
  { name: 'Marea', font: 'ital', mark: <path d="M3 18c4-12 8-12 10 0s6 12 10 0" fill="none" stroke="#17130f" strokeWidth="3" strokeLinecap="round" /> },
  { name: 'VÉRTICE', font: 'wide', mark: <path d="M13 2l11 11-11 11L2 13z" fill="#ffd84d" stroke="#17130f" strokeWidth="2.5" strokeLinejoin="round" /> },
  { name: 'Lumen', font: 'round', mark: <><circle cx="9" cy="13" r="7" fill="#17130f" /><circle cx="17" cy="13" r="7" fill="#1f9d55" fillOpacity=".85" /></> },
  { name: 'Estudio Tramo', font: 'serif', mark: <path d="M4 22V4h4v18zM11 22V10h4v12zM18 22V15h4v7z" fill="#17130f" /> },
  { name: 'cobalto', font: 'mono', mark: <path d="M13 3a10 10 0 100 20V3z" fill="#ff5a36" stroke="#17130f" strokeWidth="2.5" strokeLinejoin="round" /> },
];

export function LogoCloud({ logos = LOGOS, title = 'Más de 2.400 equipos confían en Nimbo' }: { logos?: Logo[]; title?: string }) {
  return (
    <section className="logos" aria-labelledby="logos-title">
      <h2 id="logos-title">{title}</h2>
      <ul className="grid">
        {logos.map((l) => (
          <li key={l.name} className={`f-${l.font}`}>
            <svg viewBox="0 0 26 26" aria-hidden="true">{l.mark}</svg>
            {l.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
// CSS: copia las reglas .logos / .grid / li / .f-serif / .f-mono / .f-black / .f-ital / .f-wide / .f-round de la pestaña HTML + CSS.
