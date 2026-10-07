import { useState } from 'react';
import type { CSSProperties } from 'react';

type Key = 'ok' | 'warn' | 'err' | 'info' | 'idle';
const STATES: Record<Key, { name: string; color: string; live: boolean }> = {
  ok: { name: 'Operativo', color: 'var(--ok)', live: true },
  warn: { name: 'Degradado', color: 'var(--warn)', live: true },
  err: { name: 'Incidente', color: 'var(--err)', live: true },
  info: { name: 'Mantenimiento', color: 'var(--info)', live: false },
  idle: { name: 'Pausado', color: 'var(--muted)', live: false },
};
const SERVICES: [string, Key, string][] = [
  ['API pública', 'ok', 'hace 1 min'], ['Panel web', 'ok', 'hace 3 min'], ['Pagos', 'warn', 'hace 12 min'],
  ['Correo transaccional', 'err', 'hace 4 min'], ['Base de datos', 'info', 'hace 25 min'],
  ['Webhooks', 'ok', 'hace 2 min'], ['Exportaciones', 'idle', 'hace 3 h'],
];

function Dot({ k }: { k: Key }) {
  const s = STATES[k];
  return <span className={`dot ${k}${s.live ? ' live' : ''}`} style={{ '--c': s.color } as CSSProperties} aria-hidden="true" />;
}

export function StatusDots() {
  const [filter, setFilter] = useState<Key | null>(null);
  const rows = SERVICES.filter(([, k]) => !filter || k === filter);
  const live = filter ? `Mostrando ${rows.length} con estado ${STATES[filter].name.toLowerCase()}.` : `Mostrando los ${rows.length} servicios.`;

  return (
    <section className="card" aria-labelledby="t">
      <h2 id="t">Estado de los servicios</h2>
      <p className="sub">Filtra por estado. Cada punto va acompañado de su nombre.</p>
      <ul className="legend">
        {(Object.keys(STATES) as Key[]).map((k) => (
          <li key={k}>
            <button type="button" aria-pressed={filter === k} onClick={() => setFilter(filter === k ? null : k)}>
              <Dot k={k} />{STATES[k].name} <b>{SERVICES.filter(([, s]) => s === k).length}</b>
            </button>
          </li>
        ))}
      </ul>
      <p className="sub" role="status" style={{ margin: '8px 0 0' }}>{live}</p>
      <ul className="list">
        {rows.map(([name, k, t]) => (
          <li key={name}>
            <Dot k={k} /><span>{name}</span>
            <span className="meta"><span className="st">{STATES[k].name}</span><time>{t}</time></span>
          </li>
        ))}
      </ul>
    </section>
  );
}
// CSS: copia las reglas .card, .legend, .dot, .list y @keyframes pulse de la pestaña HTML + CSS.
