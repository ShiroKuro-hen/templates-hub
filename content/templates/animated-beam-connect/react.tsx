const SOURCES = [
  { label: 'Base de datos', d: 'M5 5c0-1.7 3.1-3 7-3s7 1.3 7 3v14c0 1.7-3.1 3-7 3s-7-1.3-7-3zM5 5c0 1.7 3.1 3 7 3s7-1.3 7-3M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3' },
  { label: 'Correo', d: 'M3 5h18v14H3zM3 7l9 6 9-6' },
  { label: 'Hojas de cálculo', d: 'M3 4h18v16H3zM3 10h18M9 4v16' },
];

const TRACKS = [
  { d: 'M44 40C196 40 196 101 345 101', delay: '-0.6s' },
  { d: 'M44 120H338', delay: '-1.4s' },
  { d: 'M44 200C196 200 196 139 345 139', delay: '-2s' },
];

export function AnimatedBeamConnect() {
  return (
    <>
      <div className="beam" role="img" aria-label="Tres fuentes de datos (base de datos, correo y hojas de cálculo) conectadas a un panel central">
        <svg className="beam-svg" viewBox="0 0 420 240" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="beam-grad" gradientUnits="userSpaceOnUse" x1="44" y1="0" x2="370" y2="0">
              <stop offset="0" style={{ stopColor: 'var(--accent-2, #22d3ee)' }} />
              <stop offset="1" style={{ stopColor: 'var(--accent)' }} />
            </linearGradient>
          </defs>
          {TRACKS.map((t) => (
            <path key={t.d} className="track" d={t.d} />
          ))}
          {TRACKS.map((t) => (
            <path key={t.d} className="beam-run" pathLength={100} d={t.d} style={{ animationDelay: t.delay }} />
          ))}
        </svg>
        <ul className="srcs">
          {SOURCES.map((s) => (
            <li key={s.label} className="src">
              <svg viewBox="0 0 24 24">
                <path d={s.d} />
              </svg>
            </li>
          ))}
        </ul>
        <div className="hub">
          <svg viewBox="0 0 24 24">
            <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
          </svg>
        </div>
      </div>
      <p className="caption">Datos, correo y tablas llegan a un mismo panel en tiempo real.</p>
    </>
  );
}

// CSS: copia .beam, .beam-svg, .track, .beam-run, .srcs, .src (y nth-child), .hub (y ::after), .caption, @keyframes y prefers-reduced-motion de la pestaña HTML + CSS.
