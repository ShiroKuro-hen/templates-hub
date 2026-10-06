import type { CSSProperties } from 'react';

type Metric = { label: string; value: number }; // value: 0-100
type Limits = { warn: number; crit: number };

const DATA: Metric[] = [
  { label: 'CPU', value: 64 },
  { label: 'Memoria', value: 78 },
  { label: 'Disco', value: 93 },
];

// 0 % = izquierda, 100 % = derecha, centro en (100,100)
const pt = (v: number, r: number) => {
  const a = Math.PI * (1 - v / 100);
  return [100 + r * Math.cos(a), 100 - r * Math.sin(a)].map((n) => n.toFixed(1));
};
const arc = (from: number, to: number, r: number) => {
  const [x1, y1] = pt(from, r), [x2, y2] = pt(to, r);
  return `M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`;
};
const state = (v: number, l: Limits) =>
  v >= l.crit ? (['err', 'Crítico'] as const) : v >= l.warn ? (['warn', 'Atención'] as const) : (['ok', 'Normal'] as const);

function Gauge({ label, value, limits }: Metric & { limits: Limits }) {
  const [k, txt] = state(value, limits);
  return (
    <div className="gauge">
      <svg viewBox="0 0 200 112" role="img" aria-label={`${label}: ${value} %, estado ${txt.toLowerCase()}`}>
        <path className="band ok" d={arc(0, limits.warn, 92)} />
        <path className="band warn" d={arc(limits.warn, limits.crit, 92)} />
        <path className="band err" d={arc(limits.crit, 100, 92)} />
        <path className="track" d={arc(0, 100, 76)} />
        <path className="value" d={arc(0, value, 76)} />
        <text className="num" x="100" y="98">{value}%</text>
      </svg>
      <p>{label} <span className={`chip ${k}`}>{txt}</span></p>
    </div>
  );
}

export function GaugeChart({ data = DATA, limits = { warn: 70, crit: 90 } }: { data?: Metric[]; limits?: Limits }) {
  return (
    <figure>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs><linearGradient id="ion" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
      </svg>
      <figcaption><strong>Uso de recursos</strong><span>Clúster de producción, últimos 5 minutos</span></figcaption>
      <div className="grid">{data.map((d) => <Gauge key={d.label} {...d} limits={limits} />)}</div>
      <ul className="legend">
        <li style={{ '--c': 'var(--ok)' } as CSSProperties}><i />Normal, menos de {limits.warn} %</li>
        <li style={{ '--c': 'var(--warn)' } as CSSProperties}><i />Atención, de {limits.warn} a {limits.crit - 1} %</li>
        <li style={{ '--c': 'var(--err)' } as CSSProperties}><i />Crítico, {limits.crit} % o más</li>
      </ul>
    </figure>
  );
}

// CSS: copia las reglas figure, .grid, .gauge, .track, .value, .band, .num, .chip y .legend de la pestaña HTML + CSS.
