import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

const KPIS: [string, string, string, boolean][] = [
  ['Ingresos', '$ 84.200', '+12,4 %', true], ['Pedidos', '1.284', '+4,1 %', true], ['Ticket promedio', '$ 65,6', '-2,3 %', false], ['Clientes nuevos', '312', '+8,7 %', true],
];
const ACTIVIDAD = [
  ['--ok', 'Pedido #4821 pagado', 'Hace 2 min'], ['--warn', 'Reembolso pedido #4807', 'Hace 14 min'], ['--accent', 'Nueva cliente: Marta Quispe', 'Hace 31 min'],
  ['--err', 'Poco stock: monitor 27" 4K', 'Hace 1 h'], ['--info', 'Reporte semanal listo', 'Hace 3 h'],
];
const PRODUCTOS: [string, number, number][] = [['Teclado mecánico K2', 412, 100], ['Monitor 27" 4K', 268, 65], ['Auriculares ANC', 231, 56], ['Base para laptop', 174, 42]];
const VALS = [2.1, 2.4, 2.2, 3.0, 3.4, 3.1, 2.8, 3.6, 4.0, 3.8, 4.4, 4.1, 4.9, 5.2]; // miles de USD por día
const H = 180, L = 28, T = 8, B = 24, MAX = 6;

const Card = ({ area, className, children }: { area: string; className?: string; children: ReactNode }) => (
  <article className={`c ${className ?? ''}`} style={{ gridArea: area }} data-a={area}>{children}</article>
);

function Ventas() {
  const ref = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(300);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width || 300));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);
  const x = (i: number) => L + (i * (W - L - 8)) / (VALS.length - 1);
  const y = (v: number) => T + (H - T - B) * (1 - v / MAX);
  const pts = VALS.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ventas diarias de septiembre: suben de 2,1 a 5,2 miles de dólares en 14 días.">
      <defs>
        <linearGradient id="lg"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient>
        <linearGradient id="af" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style={{ stopColor: 'var(--accent)', stopOpacity: 0.25 }} /><stop offset="1" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} /></linearGradient>
      </defs>
      {[0, 2, 4, 6].map((t) => (<g key={t}><line className="gl" x1={L} x2={W - 8} y1={y(t)} y2={y(t)} /><text className="ax" x={L - 6} y={y(t) + 4} textAnchor="end">{t}</text></g>))}
      <polygon fill="url(#af)" points={`${x(0)},${y(0)} ${pts} ${x(VALS.length - 1)},${y(0)}`} />
      <polyline fill="none" stroke="url(#lg)" strokeWidth={2} strokeLinejoin="round" points={pts} />
      <circle cx={x(VALS.length - 1)} cy={y(VALS[VALS.length - 1])} r={4} strokeWidth={2} style={{ fill: 'var(--accent)', stroke: 'var(--surface)' }} />
      {([[0, '1 sep', 'start'], [6, '7 sep', 'middle'], [13, '14 sep', 'end']] as const).map(([i, t, a]) => (
        <text key={t} className="ax" x={x(i)} y={H - 6} textAnchor={a}>{t}</text>
      ))}
    </svg>
  );
}

export function GridDashboard() {
  const [areas, setAreas] = useState(false);
  return (
    <>
      <header className="top">
        <div><h1>Panel de ventas</h1><p>Septiembre de 2025</p></div>
        <label className="sw"><input type="checkbox" id="ar" checked={areas} onChange={(e) => setAreas(e.target.checked)} />Ver áreas del grid</label>
      </header>
      <main className="dash">
        {KPIS.map(([l, v, d, up], i) => (
          <Card key={l} area={`kpi${i + 1}`}>
            <p className="lb">{l}</p><p className="v">{v}</p>
            <span className={up ? 'd up' : 'd down'}><span className="sr">{up ? 'Subió ' : 'Bajó '}</span>{d}</span>
          </Card>
        ))}
        <Card area="chart"><h2>Ventas diarias</h2><Ventas /></Card>
        <Card area="act" className="act">
          <h2>Actividad reciente</h2>
          <ul>{ACTIVIDAD.map(([c, t, h]) => <li key={t}><i style={{ background: `var(${c})` }} /><span>{t}</span><small>{h}</small></li>)}</ul>
        </Card>
        <Card area="tabla" className="tabla">
          <h2>Productos más vendidos</h2>
          <ul>{PRODUCTOS.map(([n, u, p]) => <li key={n}><span>{n}</span><span>{u} u.</span><div className="m" style={{ '--p': p } as CSSProperties}><i /></div></li>)}</ul>
        </Card>
        <Card area="meta" className="meta">
          <h2>Meta del mes</h2><p className="v">72 %</p>
          <progress value={72} max={100} aria-label="Avance de la meta mensual">72 %</progress>
          <p>Faltan $ 33.600 y quedan 9 días.</p>
        </Card>
      </main>
    </>
  );
}
// CSS: copia las reglas .top, .sw, .dash, .c, .d, .act, .tabla, .m, progress y los @media de la pestaña HTML + CSS (el botón "Ver áreas" usa body:has(#ar:checked)).
