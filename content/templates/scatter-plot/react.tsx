import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

type Punto = [nombre: string, gasto: number, clientes: number, canal: number];

const GRUPOS = [{ n: 'Búsqueda', c: '--accent' }, { n: 'Redes sociales', c: '--info' }, { n: 'Correo', c: '--ok' }];
const PUNTOS: Punto[] = ([
  ['Marca', 14, 52, 0], ['Competencia', 28, 88, 0], ['Genéricas', 45, 118, 0], ['Remarketing', 62, 170, 0], ['Shopping', 78, 196, 0],
  ['Reels', 10, 24, 1], ['Anuncios en feed', 26, 46, 1], ['Influencers', 44, 64, 1], ['Comunidad', 58, 92, 1], ['Video largo', 84, 104, 1],
  ['Bienvenida', 6, 48, 2], ['Carrito abandonado', 12, 92, 2], ['Boletín mensual', 20, 70, 2], ['Reactivación', 32, 110, 2],
] as Punto[]).sort((a, b) => a[1] - b[1]);
const H = 320, L = 48, R = 12, T = 12, B = 44;

export function ScatterPlot() {
  const ref = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(560);
  const [on, setOn] = useState([0, 1, 2]);
  const [cur, setCur] = useState(0); // punto con tabindex=0
  const [tip, setTip] = useState(-1);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width || 560));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);

  const v = PUNTOS.filter((p) => on.includes(p[3]));
  const x = (n: number) => L + ((W - L - R) * n) / 100;
  const y = (n: number) => T + (H - T - B) * (1 - n / 200);
  const toggle = (i: number) => setOn((o) => (o.includes(i) ? (o.length > 1 ? o.filter((k) => k !== i) : o) : [...o, i]));

  const n = v.length, sx = v.reduce((a, p) => a + p[1], 0), sy = v.reduce((a, p) => a + p[2], 0);
  const m = (n * v.reduce((a, p) => a + p[1] * p[2], 0) - sx * sy) / (n * v.reduce((a, p) => a + p[1] ** 2, 0) - sx ** 2);
  const b = (sy - m * sx) / n;

  const onKey = (e: KeyboardEvent<SVGCircleElement>, i: number) => {
    const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
    if (e.key === 'Escape') setTip(-1);
    if (!d) return;
    e.preventDefault();
    (ref.current!.querySelector(`circle[data-i="${i + d}"]`) as SVGElement | null)?.focus();
  };
  const sel = tip >= 0 ? v[tip] : null;
  const cy = sel ? y(sel[2]) : 0;

  return (
    <figure className="card">
      <figcaption className="head">
        <div><h2>Gasto frente a clientes nuevos</h2><p>Cada punto es una campaña del primer semestre.</p></div>
        <div className="legend" role="group" aria-label="Canales visibles">
          {GRUPOS.map((g, i) => (
            <button key={g.n} type="button" aria-pressed={on.includes(i)} onClick={() => toggle(i)}>
              <i className="sw" style={{ background: `var(${g.c})` }} />{g.n}
            </button>
          ))}
          <span className="tr"><i />Tendencia</span>
        </div>
      </figcaption>
      <div className="plot">
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Diagrama de dispersión de gasto y clientes nuevos" onPointerLeave={() => setTip(-1)}>
          <defs><linearGradient id="tg"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
          {[0, 50, 100, 150, 200].map((t) => (
            <g key={t}><line className="gl" x1={L} x2={W - R} y1={y(t)} y2={y(t)} /><text className="ax" x={L - 8} y={y(t) + 4} textAnchor="end">{t}</text></g>
          ))}
          {[0, 20, 40, 60, 80, 100].map((t) => (
            <g key={t}><line className="gl" x1={x(t)} x2={x(t)} y1={T} y2={H - B} /><text className="ax" x={x(t)} y={H - B + 18} textAnchor="middle">{t}</text></g>
          ))}
          <text className="at" x={L + (W - L - R) / 2} y={H - 6} textAnchor="middle">Gasto en marketing (miles de USD)</text>
          <text className="at" transform={`translate(12 ${T + (H - T - B) / 2}) rotate(-90)`} textAnchor="middle">Clientes nuevos</text>
          {n > 2 && <line x1={x(v[0][1])} y1={y(m * v[0][1] + b)} x2={x(v[n - 1][1])} y2={y(m * v[n - 1][1] + b)} stroke="url(#tg)" strokeWidth={2} strokeLinecap="round" />}
          {v.map((p, i) => (
            <circle key={p[0]} className="p" data-i={i} cx={x(p[1])} cy={y(p[2])} r={6} tabIndex={i === Math.min(cur, n - 1) ? 0 : -1} role="img"
                    aria-label={`${p[0]}, ${GRUPOS[p[3]].n}: gasto ${p[1]} mil USD, ${p[2]} clientes nuevos`} style={{ fill: `var(${GRUPOS[p[3]].c})` }}
                    onPointerOver={() => setTip(i)} onFocus={() => { setCur(i); setTip(i); }} onBlur={() => setTip(-1)} onKeyDown={(e) => onKey(e, i)} />
          ))}
        </svg>
        {sel && (
          <div className={cy < 110 ? 'tip below' : 'tip'} style={{ left: Math.min(Math.max(x(sel[1]), 80), W - 80), top: cy }}>
            <b>{sel[0]}</b>
            <div><span>Canal</span><span>{GRUPOS[sel[3]].n}</span></div>
            <div><span>Gasto</span><span>{sel[1]} mil USD</span></div>
            <div><span>Clientes nuevos</span><span>{sel[2]}</span></div>
          </div>
        )}
      </div>
      <p className="hint">Usa Tab para entrar en el gráfico y las flechas para moverte entre campañas.</p>
    </figure>
  );
}
// CSS: copia las reglas .card, .head, .legend, i.sw, .plot, svg, .gl, .ax, .at, circle.p, .tip y .hint de la pestaña HTML + CSS.
