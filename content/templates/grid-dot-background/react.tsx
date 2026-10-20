import { useState } from 'react';

type Pattern = 'dots' | 'lines' | 'diagonal';

const PATTERNS: { id: Pattern; label: string }[] = [
  { id: 'dots', label: 'Puntos' },
  { id: 'lines', label: 'Cuadrícula' },
  { id: 'diagonal', label: 'Diagonal' },
];

export function GridDotBackground() {
  const [pattern, setPattern] = useState<Pattern>('dots');

  return (
    <>
      <div className="seg" role="group" aria-label="Patrón de fondo">
        {PATTERNS.map((p) => (
          <button key={p.id} type="button" aria-pressed={pattern === p.id} onClick={() => setPattern(p.id)}>
            {p.label}
          </button>
        ))}
      </div>
      <section className="stage" aria-labelledby="gdb-title">
        <div className="layer" data-pattern={pattern} aria-hidden="true" />
        <div className="glow" aria-hidden="true" />
        <div className="content">
          <h1 id="gdb-title">Lanza tu producto con una base clara</h1>
          <p>Plantillas, datos y permisos listos desde el primer día para tu equipo.</p>
          <a className="cta" href="#">Empezar gratis</a>
        </div>
      </section>
    </>
  );
}

// CSS: copia .seg (con sus botones y aria-pressed), .stage, .layer (con sus data-pattern), .glow, .content, h1, p, .cta, :focus-visible y prefers-reduced-motion de la pestaña HTML + CSS.
