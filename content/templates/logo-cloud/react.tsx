import type { ReactNode } from 'react';

type Logo = { name: string; font: 'serif' | 'mono' | 'black' | 'ital' | 'wide' | 'round'; mark: ReactNode };

// Marcas monocromas: usan currentColor y se encienden con :hover
const LOGOS: Logo[] = [
  { name: 'Finca Norte', font: 'serif', mark: <circle className="hi" cx="13" cy="13" r="10" fill="currentColor" /> },
  { name: 'orbita.labs', font: 'mono', mark: <path d="M13 3l10 18H3z" fill="currentColor" /> },
  { name: 'kiwipay', font: 'black', mark: <rect className="hi" x="3" y="3" width="20" height="20" rx="4" fill="currentColor" /> },
  { name: 'Marea', font: 'ital', mark: <path d="M3 18c4-12 8-12 10 0s6 12 10 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /> },
  { name: 'Vértice', font: 'wide', mark: <path className="hi" d="M13 2l11 11-11 11L2 13z" fill="currentColor" /> },
  { name: 'Lumen', font: 'round', mark: <><circle cx="9" cy="13" r="7" fill="currentColor" /><circle className="hi" cx="17" cy="13" r="7" fill="currentColor" fillOpacity=".6" /></> },
  { name: 'Estudio Tramo', font: 'serif', mark: <path d="M4 22V4h4v18zM11 22V10h4v12zM18 22V15h4v7z" fill="currentColor" /> },
  { name: 'cobalto', font: 'mono', mark: <path className="hi" d="M13 3a10 10 0 100 20V3z" fill="currentColor" /> },
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
// CSS: copia las reglas .logos / .grid / li / .f-serif / .f-mono / .f-black / .f-ital / .f-wide / .f-round de la pestaña HTML + CSS, junto con los tokens :root.
