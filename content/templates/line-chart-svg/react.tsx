import { useState } from 'react';

type Point = { x: string; y: number };

const DATA: Point[] = [
  { x: 'Ene', y: 120 }, { x: 'Feb', y: 150 }, { x: 'Mar', y: 135 }, { x: 'Abr', y: 190 },
  { x: 'May', y: 220 }, { x: 'Jun', y: 205 }, { x: 'Jul', y: 260 }, { x: 'Ago', y: 310 },
  { x: 'Sep', y: 290 }, { x: 'Oct', y: 340 }, { x: 'Nov', y: 380 }, { x: 'Dic', y: 420 },
];
const W = 420, H = 220, L = 34, R = 14, T = 14, B = 26;

type Props = { data?: Point[]; title?: string; unit?: string; step?: number };

export function LineChart({ data = DATA, title = 'Pedidos mensuales, 2026', unit = 'pedidos', step = 100 }: Props) {
  const [cur, setCur] = useState<number | null>(null);
  const max = Math.ceil(Math.max(...data.map((d) => d.y)) / step) * step;
  const X = (i: number) => L + (i * (W - L - R)) / (data.length - 1);
  const Y = (v: number) => T + (1 - v / max) * (H - T - B);
  const pts = data.map((d, i) => `${X(i)},${Y(d.y)}`);
  const ticks = Array.from({ length: max / step + 1 }, (_, k) => k * step);
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    setCur(Math.min(data.length - 1, Math.max(0, Math.round((x - L) / ((W - L - R) / (data.length - 1))))));
  };

  return (
    <section className="card" aria-labelledby="line-title">
      <header><h2 id="line-title">{title}</h2></header>
      <div className="plot">
        <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Gráfico de líneas: ${title}`} onPointerMove={onMove} onPointerLeave={() => setCur(null)}>
          <g className="grid axis">
            {ticks.map((v) => (
              <g key={v}>
                <line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} />
                <text x={L - 6} y={Y(v) + 3.5} textAnchor="end">{v}</text>
              </g>
            ))}
          </g>
          <g className="axis">{data.map((d, i) => <text key={d.x} x={X(i)} y={H - 8} textAnchor="middle">{d.x}</text>)}</g>
          <path className="area" d={`M${X(0)},${Y(0)} L${pts.join(' L')} L${X(data.length - 1)},${Y(0)}Z`} />
          <path className="line" d={`M${pts.join(' L')}`} pathLength={1} />
          {cur !== null && <line className="guide on" x1={X(cur)} x2={X(cur)} y1={T} y2={Y(0)} />}
          {data.map((d, i) => (
            <circle key={d.x} className={`pt${cur === i ? ' on' : ''}`} cx={X(i)} cy={Y(d.y)} r={4} tabIndex={0} role="img"
              aria-label={`${d.x}: ${d.y} ${unit}`} onFocus={() => setCur(i)} onBlur={() => setCur(null)} />
          ))}
        </svg>
        {cur !== null && (
          <div className="tip on" role="status" style={{ left: `${Math.min(Math.max((X(cur) / W) * 100, 14), 86)}%`, top: `${(Y(data[cur].y) / H) * 100}%`, transform: 'translate(-50%, calc(-100% - 12px))' }}>
            {data[cur].x}<b>{data[cur].y} {unit}</b>
          </div>
        )}
      </div>
    </section>
  );
}
// CSS: copia las reglas .card / .plot / svg / .grid / .axis / .area / .line / .pt / .guide / .tip de la pestaña HTML + CSS.
