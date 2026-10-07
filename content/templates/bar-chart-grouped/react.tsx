import { useEffect, useRef, useState } from 'react';

const SERIES = [{ n: 'Ingresos', c: '--accent' }, { n: 'Costos', c: '--info' }, { n: 'Margen', c: '--ok' }];
const DATA: [string, number[]][] = [['T1', [120, 78, 42]], ['T2', [138, 84, 54]], ['T3', [126, 90, 36]], ['T4', [152, 96, 56]]];
const H = 260, L = 36, R = 8, T = 12, B = 28, MAX = 160;

export function BarChartGrouped() {
  const ref = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(480);
  const [on, setOn] = useState([0, 1, 2]);
  const [g, setG] = useState<number | null>(null);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width || 480));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);

  const toggle = (i: number) =>
    setOn((o) => (o.includes(i) ? (o.length > 1 ? o.filter((x) => x !== i) : o) : [...o, i].sort()));
  const gw = (W - L - R) / DATA.length;
  const bw = Math.min(28, (gw * 0.72 - 4 * (on.length - 1)) / on.length);
  const y = (v: number) => T + (H - T - B) * (1 - v / MAX);

  return (
    <figure className="card" onKeyDown={(e) => e.key === 'Escape' && setG(null)}>
      <figcaption className="head">
        <div><h2>Ingresos, costos y margen por trimestre</h2><p>Miles de USD, año fiscal 2025</p></div>
        <div className="legend" role="group" aria-label="Series visibles">
          {SERIES.map((s, i) => (
            <button key={s.n} type="button" aria-pressed={on.includes(i)} onClick={() => toggle(i)}>
              <i className="sw" style={{ background: `var(${s.c})` }} />{s.n}
            </button>
          ))}
        </div>
      </figcaption>
      <div className="plot">
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Barras agrupadas por trimestre" onPointerLeave={() => setG(null)}>
          {[0, 40, 80, 120, 160].map((t) => (
            <g key={t}>
              <line className="gl" x1={L} x2={W - R} y1={y(t)} y2={y(t)} />
              <text className="ax" x={L - 6} y={y(t) + 4} textAnchor="end">{t}</text>
            </g>
          ))}
          {DATA.map(([l, v], k) => {
            const x0 = L + k * gw, off = (gw - bw * on.length - 4 * (on.length - 1)) / 2;
            return (
              <g key={l}>
                <g className="grp" tabIndex={0} role="img" aria-label={`${l}: ${on.map((i) => `${SERIES[i].n} ${v[i]}`).join(', ')}`}
                   onPointerOver={() => setG(k)} onFocus={() => setG(k)} onBlur={() => setG(null)}>
                  <rect className="hit" x={x0} y={T} width={gw} height={H - T - B} rx={4} />
                  {on.map((i, j) => (
                    <rect key={i} x={x0 + off + j * (bw + 4)} y={y(v[i])} width={bw} height={y(0) - y(v[i])} rx={2} style={{ fill: `var(${SERIES[i].c})` }} />
                  ))}
                </g>
                <text className="ax" x={x0 + gw / 2} y={H - 8} textAnchor="middle">{l}</text>
              </g>
            );
          })}
        </svg>
        {g !== null && (
          <div className="tip" style={{ left: Math.min(Math.max(L + (g + 0.5) * gw, 80), W - 80) }}>
            <b>{DATA[g][0]}</b>
            {on.map((i) => (
              <div key={i}><span><i className="sw" style={{ background: `var(${SERIES[i].c})` }} />{SERIES[i].n}</span><b>{DATA[g][1][i]}</b></div>
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}
// CSS: copia las reglas .card, .head, .legend, i.sw, .plot, svg, .gl, .ax, .hit, .grp y .tip de la pestaña HTML + CSS.
