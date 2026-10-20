import { useState } from 'react';

type Rama = 'main' | 'login' | 'pagos';
type Commit = { hash: string; mensaje: string; autor: string; fecha: string; rama: Rama; x: number; y: number };

const RAMAS: Record<Rama, { etiqueta: string; color: string }> = {
  main: { etiqueta: 'main', color: 'var(--accent)' },
  login: { etiqueta: 'feature/login', color: 'var(--ok)' },
  pagos: { etiqueta: 'feature/pagos', color: 'var(--warn)' },
};
const CARRILES: { rama: Rama; d: string }[] = [
  { rama: 'main', d: 'M40 50V442' },
  { rama: 'pagos', d: 'M40 50C40 78 140 78 140 106V162C140 190 40 190 40 218' },
  { rama: 'login', d: 'M40 386C40 358 90 358 90 330V274' },
];
const COMMITS: Commit[] = [
  { hash: 'e41d0a2', mensaje: 'Fusiona feature/pagos en main', autor: 'Lucía Ruiz', fecha: 'hace 1 día', rama: 'main', x: 40, y: 50 },
  { hash: '9c7f3b1', mensaje: 'Añade reintentos al cobro', autor: 'Mateo Ortiz', fecha: 'hace 2 días', rama: 'pagos', x: 140, y: 106 },
  { hash: '5b2e8d4', mensaje: 'Integra la pasarela de pago', autor: 'Mateo Ortiz', fecha: 'hace 3 días', rama: 'pagos', x: 140, y: 162 },
  { hash: '3f8a6c2', mensaje: 'Corrige el redondeo de totales', autor: 'Ana Gil', fecha: 'hace 4 días', rama: 'main', x: 40, y: 218 },
  { hash: 'd62b9e1', mensaje: 'Pantalla de inicio de sesión', autor: 'Ana Gil', fecha: 'hace 5 días', rama: 'login', x: 90, y: 274 },
  { hash: 'b1d4e77', mensaje: 'Valida el formato del correo', autor: 'Carlos Pérez', fecha: 'hace 6 días', rama: 'login', x: 90, y: 330 },
  { hash: '7c02a9e', mensaje: 'Añade CI con pruebas', autor: 'Lucía Ruiz', fecha: 'hace 1 semana', rama: 'main', x: 40, y: 386 },
  { hash: 'a0f13c5', mensaje: 'Versión 2.3.0', autor: 'Lucía Ruiz', fecha: 'hace 2 semanas', rama: 'main', x: 40, y: 442 },
];
const PISTA_TITULO = 'Ningún commit seleccionado';
const PISTA = 'Pasa el cursor o enfoca un commit para ver su detalle.';

export function GitBranchTimeline() {
  const [activo, setActivo] = useState<number | null>(null);
  const commit = activo === null ? null : COMMITS[activo];

  return (
    <figure className="card">
      <figcaption>
        <h2>Ramas y fusiones</h2>
        <p>Cada línea es una rama. Pasa el cursor o enfoca un commit para ver su detalle y resaltar su rama.</p>
      </figcaption>
      <div className="scroll" role="region" tabIndex={0} aria-label="Grafo de commits desplazable horizontalmente">
        <svg id="graph" className={commit ? 'active' : undefined} viewBox="0 0 560 480" role="img" aria-labelledby="g-t g-d" onPointerLeave={() => setActivo(null)}>
          <title id="g-t">Grafo de commits con main y dos ramas</title>
          <desc id="g-d">La rama main recibe la fusión de feature/pagos. feature/login sale de main y aún no está fusionada. Cada commit muestra su hash, su mensaje, su autor y la fecha relativa.</desc>
          {CARRILES.map((c) => (
            <path key={c.rama} className={commit?.rama === c.rama ? 'lane on' : 'lane'} d={c.d}
              style={{ ['--c' as string]: RAMAS[c.rama].color }} />
          ))}
          {COMMITS.map((c, i) => (
            <g key={c.hash} className={activo === i ? 'commit on' : 'commit'} tabIndex={0} role="group"
              aria-label={`${c.hash} ${c.mensaje}, ${c.autor}, ${c.fecha}`}
              style={{ ['--c' as string]: RAMAS[c.rama].color }}
              onPointerOver={() => setActivo(i)} onFocus={() => setActivo(i)} onBlur={() => setActivo(null)}>
              <rect className="row" x={10} y={c.y - 26} width={540} height={52} rx={6} />
              <circle className="dot" cx={c.x} cy={c.y} r={6} />
              <text x={170} y={c.y - 5}><tspan className="hash">{c.hash}</tspan><tspan dx={8}>{c.mensaje}</tspan></text>
              <text className="meta" x={170} y={c.y + 13}>{`${c.autor} · ${c.fecha}`}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="panel" aria-live="polite">
        <strong>{commit ? commit.mensaje : PISTA_TITULO}</strong>
        <span>{commit ? `${commit.hash} · ${commit.autor} · ${commit.fecha} · rama ${RAMAS[commit.rama].etiqueta}` : PISTA}</span>
      </p>
      <ul className="legend" aria-label="Leyenda de ramas">
        {(Object.keys(RAMAS) as Rama[]).map((r) => (
          <li key={r}><i style={{ ['--c' as string]: RAMAS[r].color }} />{RAMAS[r].etiqueta}</li>
        ))}
      </ul>
    </figure>
  );
}

// CSS: copia las reglas de body, .card, h2, .scroll, text, .hash, .meta, .lane, .dot, .row, .commit, svg.active, .panel y .legend de la pestaña HTML + CSS.
