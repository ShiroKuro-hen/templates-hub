type Kpi = {
  label: string;
  value: string;
  before: string; // valor del periodo anterior
  change: string;
  up: boolean;
  now: number[]; // 0-100
  prev: number[]; // 0-100
};

const KPIS: Kpi[] = [
  { label: 'Ingresos', value: '48.920 €', before: '42.150 €', change: '+16,1 %', up: true,
    now: [40, 48, 45, 60, 58, 72, 80], prev: [38, 42, 40, 50, 48, 55, 58] },
  { label: 'Pedidos', value: '1.284', before: '1.339', change: '−4,1 %', up: false,
    now: [60, 55, 62, 50, 52, 45, 48], prev: [58, 60, 64, 58, 60, 58, 62] },
  { label: 'Visitantes', value: '31.240', before: '29.780', change: '+4,9 %', up: true,
    now: [50, 52, 49, 55, 57, 56, 63], prev: [50, 50, 51, 50, 52, 51, 52] },
];

const pts = (a: number[]) =>
  a.map((v, i) => `${(i * 120) / (a.length - 1)},${(38 - v * 0.36).toFixed(1)}`).join(' ');

export function KpiChartCards({ kpis = KPIS }: { kpis?: Kpi[] }) {
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="kg"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient>
        </defs>
      </svg>
      <section aria-labelledby="kc-t">
        <h2 id="kc-t">Rendimiento de octubre</h2>
        <p className="sub">Últimos 30 días frente a los 30 anteriores.</p>
        <div className="cards">
          {kpis.map((k) => (
            <article className="card" key={k.label}>
              <h3>{k.label}</h3>
              <p className="v">{k.value}</p>
              <p className="cmp"><span className={`delta ${k.up ? 'up' : 'down'}`}>{k.change}</span> frente a {k.before}</p>
              <svg className="spark" viewBox="0 0 120 40" preserveAspectRatio="none" role="img"
                   aria-label={`${k.label} ${k.up ? 'al alza' : 'a la baja'} respecto al periodo anterior`}>
                <polyline className="prev" points={pts(k.prev)} />
                <polyline className="cur" stroke="url(#kg)" points={pts(k.now)} />
              </svg>
            </article>
          ))}
        </div>
        <p className="key">Línea de color: este periodo. Línea discontinua: periodo anterior.</p>
      </section>
    </>
  );
}
// CSS: copia las reglas h2 / .sub / .cards / .card / .v / .cmp / .delta / .up / .down / svg.spark / .cur / .prev / .key de la pestaña HTML + CSS.
