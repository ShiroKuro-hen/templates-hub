import type { PointerEvent } from 'react';

const CARDS = [
  { id: 'seguridad', titulo: 'Seguridad', texto: 'Cifrado de extremo a extremo y permisos por rol para cada equipo.' },
  { id: 'analitica', titulo: 'Analítica', texto: 'Paneles en tiempo real con alertas cuando una métrica se desvía.' },
  { id: 'equipos', titulo: 'Equipos', texto: 'Espacios compartidos con comentarios y menciones en cada documento.' },
] as const;

// Guarda la posición del cursor en --mx / --my; el táctil no tiene foco de luz.
const follow = (e: PointerEvent<HTMLAnchorElement>) => {
  if (e.pointerType === 'touch') return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export function SpotlightHoverCard() {
  return (
    <main className="grid">
      {CARDS.map(({ id, titulo, texto }) => (
        <a key={id} className="spot" href="#" onPointerMove={follow}>
          <span className="ico" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M12 3l9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" />
            </svg>
          </span>
          <h3>{titulo}</h3>
          <p>{texto}</p>
        </a>
      ))}
    </main>
  );
}

// CSS: copia las reglas .grid, .spot (con ::before/::after y estados), .ico, h3/p y prefers-reduced-motion de la pestaña HTML + CSS.
