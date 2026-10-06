import { useState } from 'react';

type Kpi = { label: string; value: string; change: string; up: boolean };
type Range = { points: number[]; ticks: [string, string, string]; kpis: Kpi[] }; // points: 0-100

const k = (label: string, value: string, change: string, up = true): Kpi => ({ label, value, change, up });
const DATA: Record<'7' | '30' | '90', Range> = {
  '7': { points: [42, 55, 48, 63, 71, 58, 80], ticks: ['30 sep', '3 oct', '6 oct'],
    kpis: [k('Visitantes', '18.420', '+8,2 %'), k('Sesiones', '26.910', '+5,1 %'), k('Conversión', '3,4 %', '−0,3 pp', false), k('Ingresos', '12.480 €', '+11,6 %')] },
  '30': { points: [35, 41, 38, 52, 47, 60, 55, 49, 66, 72, 64, 78], ticks: ['7 sep', '21 sep', '6 oct'],
    kpis: [k('Visitantes', '74.305', '+14,0 %'), k('Sesiones', '108.240', '+9,8 %'), k('Conversión', '3,6 %', '+0,2 pp'), k('Ingresos', '51.920 €', '+17,3 %')] },
  '90': { points: [62, 58, 50, 44, 47, 40, 52, 57, 61, 59, 70, 76], ticks: ['8 jul', '22 ago', '6 oct'],
    kpis: [k('Visitantes', '201.780', '−2,4 %', false), k('Sesiones', '296.400', '+1,2 %'), k('Conversión', '3,5 %', '+0,1 pp'), k('Ingresos', '139.610 €', '+4,7 %')] },
};

export function AnalyticsOverview({ data = DATA }: { data?: typeof DATA }) {
  const [range, setRange] = useState<keyof typeof DATA>('7');
  const d = data[range];
  const n = d.points.length - 1;
  const pts = d.points.map((v, i) => `${(i * 600) / n},${200 - v * 2}`).join(' ');
  const trend = d.points[n] > d.points[0] ? 'al alza' : 'a la baja';

  return (
    <section className="panel" aria-labelledby="ao-t">
      <div className="head">
        <div><h2 id="ao-t">Resumen de analítica</h2><p>Tienda online de Norte Digital</p></div>
        <fieldset className="range">
          <legend className="sr">Rango de fechas</legend>
          {(Object.keys(data) as (keyof typeof DATA)[]).map((r) => (
            <label key={r}>
              <input type="radio" name="ao-r" value={r} checked={r === range} onChange={() => setRange(r)} />
              <span>{r} días</span>
            </label>
          ))}
        </fieldset>
      </div>
      <dl className="kpis" aria-live="polite">
        {d.kpis.map((x) => (
          <div key={x.label}>
            <dt>{x.label}</dt>
            <dd><b>{x.value}</b><span className={`delta ${x.up ? 'up' : 'down'}`}>{x.change}</span></dd>
          </div>
        ))}
      </dl>
      <figure>
        <figcaption>Visitantes únicos por día</figcaption>
        <svg viewBox="0 0 600 200" preserveAspectRatio="none" role="img"
             aria-label={`Visitantes en ${range} días, de ${d.ticks[0]} a ${d.ticks[2]}. Tendencia ${trend}.`}>
          <defs>
            <linearGradient id="ao-g" gradientUnits="userSpaceOnUse" x1="0" x2="600">
              <stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" />
            </linearGradient>
          </defs>
          <g className="grid">{[50, 100, 150, 200].map((y) => <line key={y} x1="0" x2="600" y1={y} y2={y} />)}</g>
          <polygon className="area" points={`${pts} 600,200 0,200`} />
          <polyline className="line" points={pts} stroke="url(#ao-g)" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="x" aria-hidden="true">{d.ticks.map((t) => <span key={t}>{t}</span>)}</div>
      </figure>
    </section>
  );
}
// CSS: copia las reglas .panel / .head / .range / .sr / .kpis / dt / dd / .delta / figure / svg / .x de la pestaña HTML + CSS.
