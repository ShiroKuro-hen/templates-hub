import { useState } from 'react';

type Kpi = { n: string; u: string; v: number; t: number; r: [number, number, number] }; // r: bajo / medio / alto (máximo)

const KPIS: Kpi[] = [
  { n: 'Ingresos', u: 'miles USD', v: 270, t: 250, r: [150, 210, 300] },
  { n: 'Clientes nuevos', u: 'altas', v: 182, t: 220, r: [120, 180, 260] },
  { n: 'Satisfacción', u: 'NPS', v: 61, t: 55, r: [35, 50, 80] },
  { n: 'Retención', u: '%', v: 91, t: 94, r: [80, 90, 100] },
];
const f = (n: number) => n.toLocaleString('es');

export function BulletChart({ kpis = KPIS }: { kpis?: Kpi[] }) {
  const [rangos, setRangos] = useState(true);
  return (
    <section className="card" aria-labelledby="t">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
      </svg>
      <div className="head">
        <div><h2 id="t">Objetivos del trimestre</h2><p>Valor actual frente a la meta, con rangos de desempeño.</p></div>
        <label className="sw"><input type="checkbox" checked={rangos} onChange={(e) => setRangos(e.target.checked)} />Mostrar rangos</label>
      </div>
      <ul>
        {kpis.map((k) => {
          const max = k.r[2], p = (x: number) => `${((x / max) * 100).toFixed(2)}%`, pct = Math.round((k.v / k.t) * 100);
          const [cls, txt] = k.v >= k.t ? ['ok', 'Objetivo superado'] : k.v >= k.t * 0.9 ? ['warn', 'Cerca del objetivo'] : ['err', 'Por debajo'];
          const o = rangos ? undefined : 0;
          return (
            <li key={k.n}>
              <div className="top">
                <span className="name">{k.n}<small>{k.u}</small></span>
                <span className="val"><b>{f(k.v)}</b> de {f(k.t)}<span className={`badge ${cls}`}>{txt}, {pct} %</span></span>
              </div>
              <svg className="b" role="img" aria-label={`${k.n}: ${f(k.v)} ${k.u}, objetivo ${f(k.t)}, ${pct} % del objetivo. ${txt}.`}>
                <rect className="r3" style={{ fillOpacity: o }} width="100%" height="28" />
                <rect className="r2" style={{ fillOpacity: o }} width={p(k.r[1])} height="28" />
                <rect className="r1" style={{ fillOpacity: o }} width={p(k.r[0])} height="28" />
                <rect className={k.v >= k.t ? 'bar met' : 'bar'} y="10" width={p(k.v)} height="8" rx="2" />
                <line className="tg" x1={p(k.t)} x2={p(k.t)} y1="4" y2="24" />
              </svg>
            </li>
          );
        })}
      </ul>
      <p className="key" aria-hidden="true">
        <span><i style={{ background: 'var(--muted)', opacity: 0.38 }} />Bajo</span>
        <span><i style={{ background: 'var(--muted)', opacity: 0.22 }} />Medio</span>
        <span><i style={{ background: 'var(--muted)', opacity: 0.1 }} />Alto</span>
        <span><i style={{ background: 'var(--accent)' }} />Valor</span>
        <span><i className="t" />Objetivo</span>
      </p>
    </section>
  );
}
// CSS: copia las reglas .card, .head, .sw, ul, .top, .badge, svg.b, .r1-.r3, .bar, .tg y .key de la pestaña HTML + CSS.
