import type { PointerEvent } from 'react';
import { useState } from 'react';

const PULL = 0.3;
const MAX = 8;
const offset = (d: number) => `${Math.max(-MAX, Math.min(MAX, d * PULL))}px`;

// Mueve el botón hacia el cursor dentro de su zona; el táctil no se desplaza.
const follow = (e: PointerEvent<HTMLDivElement>) => {
  if (e.pointerType === 'touch') return;
  const zone = e.currentTarget;
  const r = zone.getBoundingClientRect();
  const btn = zone.querySelector<HTMLElement>('.mag');
  btn?.style.setProperty('--tx', offset(e.clientX - r.left - r.width / 2));
  btn?.style.setProperty('--ty', offset(e.clientY - r.top - r.height / 2));
};

const reset = (e: PointerEvent<HTMLDivElement>) => {
  const btn = e.currentTarget.querySelector<HTMLElement>('.mag');
  btn?.style.setProperty('--tx', '0px');
  btn?.style.setProperty('--ty', '0px');
};

export function MagneticButton() {
  const [saved, setSaved] = useState(false);

  return (
    <main className="stage">
      <div className="zone" onPointerMove={follow} onPointerLeave={reset}>
        <button type="button" className="mag primary">Empezar gratis</button>
      </div>
      <div className="zone" onPointerMove={follow} onPointerLeave={reset}>
        <button
          type="button"
          className="mag icon"
          aria-pressed={saved}
          aria-label="Guardar en favoritos"
          onClick={() => setSaved(!saved)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 3h12v18l-6-4-6 4z" />
          </svg>
        </button>
      </div>
    </main>
  );
}

// CSS: copia .stage, .zone, .mag (con :focus-visible y los bloques hover:hover y prefers-reduced-motion), .primary, .icon y su aria-pressed de la pestaña HTML + CSS.
