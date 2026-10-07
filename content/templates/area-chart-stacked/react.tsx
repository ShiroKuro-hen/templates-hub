import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

const SERIES = [
  { n: 'Escritorio', c: '--accent', d: [42, 45, 48, 46, 52, 55, 58, 61] },
  { n: 'Móvil', c: '--info', d: [30, 34, 39, 44, 48, 53, 57, 64] },
  { n: 'Tablet', c: '--ok', d: [8, 9, 9, 10, 11, 11, 12, 13] },
];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];
const H = 280, L = 40, R = 12, T = 12, B = 28, N = MONTHS.length - 1;

export function AreaChartStacked() {
  const ref = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(560);
  const [on, setOn] = useState([0, 1, 2]);
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width || 560));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);

  const toggle = (i: number) => setOn((o) => (o.includes(i) ? (o.length > 1 ? o.filter((x) => x !== i) : o) : [...o, i].sort()));
  const x = (i: number) => L + (i * (W - L - R)) / N;
  const total = (i: number) => on.reduce((a, s) => a + SERIES[s].d[i], 0);
  const max = Math.ceil(Math.max(...MONTHS.map((_, i) => total(i))) / 40) * 40;
  const y = (n: number) => T + (H - T - B) * (1 - n / max);

  let base = MONTHS.map(() => 0);
  const areas = on.map((s) => {
    const top = base.map((b, i) => b + SERIES[s].d[i]);
    const up = top.map((n, i) => `${x(i)},${y(n)}`), dn = base.map((n, i) => `${x(i)},${y(n)}`).reverse();
    base = top;
    return { s, up: up.join(' '), all: [...up, ...dn].join(' ') };
  });

  const onKey = (e: KeyboardEvent) => {
    const k: Record<string, number> = { ArrowRight: Math.min(N, idx + 1), ArrowLeft: Math.max(0, idx < 0 ? 0 : idx - 1), Home: 0, End: N, Escape: -1 };
    if (e.key in k) { e.preventDefault(); setIdx(k[e.key]); }
  };
  const onMove = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setIdx(Math.max(0, Math.min(N, Math.round((e.clientX - r.left - L) / ((W - L - R) / N)))));
  };

  return (
    <figure className="card">
      <figcaption className="head">
        <div><h2>Sesiones por dispositivo</h2><p>Miles de sesiones al mes, de enero a agosto</p></div>
        <div className="legend" role="group" aria-label="Series visibles">
          {SERIES.map((s, i) => (
            <button key={s.n} type="button" aria-pressed={on.includes(i)} onClick={() => toggle(i)}>
              <i className="sw" style={{ background: `var(${s.c})` }} />{s.n}
            </button>
          ))}
        </div>
      </figcaption>
      <div className="plot">
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="img" aria-label="Áreas apiladas de sesiones por dispositivo. Usa las flechas izquierda y derecha para explorar los meses."
             onKeyDown={onKey} onPointerMove={onMove} onPointerLeave={() => document.activeElement !== ref.current && setIdx(-1)} onBlur={() => setIdx(-1)}>
          <defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
          {Array.from({ length: max / 40 + 1 }, (_, k) => k * 40).map((t) => (
            <g key={t}><line className="gl" x1={L} x2={W - R} y1={y(t)} y2={y(t)} /><text className="ax" x={L - 6} y={y(t) + 4} textAnchor="end">{t}</text></g>
          ))}
          {areas.map((a) => (
            <g key={a.s}>
              <polygon points={a.all} style={{ fill: `var(${SERIES[a.s].c})`, fillOpacity: 0.35 }} />
              <polyline points={a.up} fill="none" strokeWidth={2} style={{ stroke: `var(${SERIES[a.s].c})` }} />
            </g>
          ))}
          {MONTHS.map((m, i) => <text key={m} className="ax" x={x(i)} y={H - 8} textAnchor="middle">{m}</text>)}
          {idx >= 0 && <rect x={x(idx) - 0.75} y={T} width={1.5} height={H - T - B} fill="url(#cg)" />}
        </svg>
        {idx >= 0 && (
          <div className="tip" style={{ left: Math.min(Math.max(x(idx), 90), W - 90) }}>
            <b>{MONTHS[idx]}</b>
            {[...on].reverse().map((s) => (
              <div key={s}><span><i className="sw" style={{ background: `var(${SERIES[s].c})` }} />{SERIES[s].n}</span><span>{SERIES[s].d[idx]}</span></div>
            ))}
            <div className="tot"><span>Total</span><span>{total(idx)}</span></div>
          </div>
        )}
      </div>
      <p className="sr" aria-live="polite">
        {idx >= 0 && `${MONTHS[idx]}: ${on.map((s) => `${SERIES[s].n} ${SERIES[s].d[idx]}`).join(', ')}. Total ${total(idx)}.`}
      </p>
    </figure>
  );
}
// CSS: copia las reglas .card, .head, .legend, i.sw, .plot, svg, .gl, .ax, .tip y .sr de la pestaña HTML + CSS.
