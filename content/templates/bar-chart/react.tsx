import type { CSSProperties } from 'react';

type Point = { label: string; value: number }; // value: 0-100

export function BarChart({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.value));
  const resumen = data.map((d) => `${d.label} ${d.value}`).join(', ');
  return (
    <figure>
      <div className="chart" role="img" aria-label={`Valores por periodo: ${resumen}`}>
        {data.map((d) => (
          <div
            key={d.label}
            className={d.value === max ? 'bar max' : 'bar'}
            style={{ '--v': d.value } as CSSProperties}
          >
            <b>{d.value}</b>
          </div>
        ))}
      </div>
      <div className="labels" aria-hidden="true">{data.map((d) => <span key={d.label}>{d.label}</span>)}</div>
    </figure>
  );
}
// CSS: copia las reglas figure / .chart / .bar / .labels de la pestaña HTML + CSS.
