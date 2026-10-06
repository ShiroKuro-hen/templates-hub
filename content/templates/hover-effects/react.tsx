import type { PointerEvent } from 'react';

const CARDS = [
  { fx: 'lift', title: 'Elevación', text: 'Para tarjetas de proyecto: sube 3px y gana sombra.' },
  { fx: 'glow', title: 'Brillo', text: 'Un halo suave sigue al cursor sobre la tarjeta.' },
  { fx: 'line', title: 'Subrayado', text: 'Para enlaces de documentación: la línea crece.' },
  { fx: 'spin', title: 'Giro', text: 'El icono gira 90° y anuncia que se despliega.' },
  { fx: 'fill', title: 'Relleno', text: 'El fondo se llena de izquierda a derecha.' },
  { fx: 'zoom', title: 'Escala', text: 'La imagen crece dentro de su marco.' },
] as const;

// Guarda la posición del cursor en --x / --y para el halo.
const follow = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
};

export function HoverEffects() {
  return (
    <div className="grid">
      {CARDS.map(({ fx, title, text }) => (
        <a key={fx} className={`card ${fx}`} href="#" onPointerMove={fx === 'glow' ? follow : undefined}>
          {fx === 'spin' && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><path d="m10 8 4 4-4 4" />
            </svg>
          )}
          {fx === 'zoom' && (
            <div className="media">
              <svg viewBox="0 0 200 72" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 60 30 48 60 52 90 30 120 36 150 18 200 24V72H0Z" fill="currentColor" opacity=".18" />
                <path d="M0 60 30 48 60 52 90 30 120 36 150 18 200 24" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          )}
          <h3>{fx === 'line' ? <span>{title}</span> : title}</h3>
          <p>{text}</p>
        </a>
      ))}
    </div>
  );
}

// CSS: copia las reglas .grid, .card y los modificadores .lift/.glow/.line/.spin/.fill/.zoom de la pestaña HTML + CSS.
