import type { CSSProperties } from 'react';

type Point = { label: string; value: number }; // value: 0-100

export function BarChart({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div>
      <div className="chart">
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
      <div className="labels">{data.map((d) => <span key={d.label}>{d.label}</span>)}</div>
    </div>
  );
}
// CSS: copia las reglas .chart / .bar / .labels de la pestaña HTML + CSS.
