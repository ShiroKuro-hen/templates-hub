import { useState } from 'react';
import type { CSSProperties } from 'react';

const SERIES = ['Web', 'App', 'Tienda', 'Partners', 'Teléfono', 'Marketplace'];
const DATA: Record<string, number[]> = {
  Norte: [320, 210, 140, 90, 60, 80],
  Sur: [180, 260, 200, 70, 40, 110],
  Centro: [410, 330, 90, 150, 30, 140],
  Oeste: [150, 120, 240, 60, 90, 50],
};

export function DataVizPalette() {
  const [off, setOff] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOff((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const total = Object.values(DATA).flat().reduce((s, v, k) => s + (off.has(k % 6) ? 0 : v), 0);

  return (
    <figure>
      <h2>Pedidos por canal y región</h2>
      <p className="sub">Activa o desactiva un canal para compararlo. Los colores cumplen contraste 3:1 en claro y oscuro.</p>
      <ul className="legend">
        {SERIES.map((s, i) => (
          <li key={s}>
            <button type="button" aria-pressed={!off.has(i)} onClick={() => toggle(i)}>
              <i style={{ '--c': `var(--c${i + 1})` } as CSSProperties} />{s}
            </button>
          </li>
        ))}
      </ul>
      {Object.entries(DATA).map(([region, vals]) => {
        const shown = vals.map((v, i) => [i, v] as const).filter(([i]) => !off.has(i));
        const label = `${region}: ${shown.map(([i, v]) => `${SERIES[i]} ${v}`).join(', ') || 'sin canales'}`;
        return (
          <div className="row" key={region}>
            <span>{region}</span>
            <div className="stack" role="img" aria-label={label}>
              {shown.map(([i, v]) => (
                <i key={i} title={`${SERIES[i]}: ${v}`} style={{ '--v': v, '--c': `var(--c${i + 1})` } as CSSProperties} />
              ))}
            </div>
          </div>
        );
      })}
      <p className="tot" role="status">Total visible: {total.toLocaleString('es')} pedidos</p>
    </figure>
  );
}
// CSS: copia las reglas figure, .legend, .row, .stack y .tot (y las variables --c1 a --c6) de la pestaña HTML + CSS.
