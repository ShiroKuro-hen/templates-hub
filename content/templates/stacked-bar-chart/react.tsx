import { useEffect, useRef, useState, type CSSProperties } from 'react';

type Series = { key: string; label: string; color: string };
type Row = { mes: string } & Record<string, number | string>;

const SERIES: Series[] = [
  { key: 'web', label: 'Web', color: 'var(--accent)' },
  { key: 'app', label: 'App móvil', color: 'var(--info)' },
  { key: 'tienda', label: 'Tienda física', color: 'var(--ok)' },
];
const DATA: Row[] = [
  { mes: 'Ene', web: 42, app: 28, tienda: 12 }, { mes: 'Feb', web: 38, app: 31, tienda: 14 },
  { mes: 'Mar', web: 51, app: 35, tienda: 11 }, { mes: 'Abr', web: 47, app: 40, tienda: 15 },
  { mes: 'May', web: 56, app: 44, tienda: 13 }, { mes: 'Jun', web: 61, app: 49, tienda: 16 },
];
const BASE = 222, H = 196;

export function StackedBarChart({ data = DATA, series = SERIES }: { data?: Row[]; series?: Series[] }) {
  const plot = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ i: number; s: Series; left: number; top: number } | null>(null);
  const val = (d: Row, k: string) => Number(d[k]);
  const total = (d: Row) => series.reduce((sum, s) => sum + val(d, s.key), 0);
  const max = Math.ceil(Math.max(...data.map(total)) / 50) * 50, k = H / max, n = data.length;
  const ticks = Array.from({ length: max / 50 }, (_, j) => (j + 1) * 50);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setTip(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function show(el: SVGRectElement, i: number, s: Series) {
    const r = el.getBoundingClientRect(), p = plot.current!.getBoundingClientRect();
    setTip({ i, s, left: Math.min(Math.max(r.left - p.left + r.width / 2, 90), p.width - 90), top: r.top - p.top });
  }

  return (
    <figure>
      <figcaption><strong>Pedidos por canal</strong><span>Primer semestre de 2026, en miles de pedidos</span></figcaption>
      <ul className="legend">
        {series.map((s) => <li key={s.key} style={{ '--c': s.color } as CSSProperties}><i />{s.label}</li>)}
      </ul>
      <div className="plot" ref={plot}>
        <svg width="100%" height="250" role="group" aria-label="Pedidos por canal y mes. Recorre las barras con Tab.">
          {ticks.map((v) => <line key={v} className="grid" x1="0" x2="100%" y1={BASE - v * k} y2={BASE - v * k} />)}
          {data.map((d, i) => {
            let y = BASE;
            const cx = `${((i + 0.5) / n) * 100}%`;
            return (
              <g key={d.mes}>
                {series.map((s) => {
                  const h = val(d, s.key) * k; y -= h;
                  return (
                    <rect key={s.key} className="seg" tabIndex={0} role="img" x={`${((i + 0.25) / n) * 100}%`} y={y}
                          width={`${(0.5 / n) * 100}%`} height={h} style={{ fill: s.color }}
                          aria-label={`${d.mes}, ${s.label}: ${val(d, s.key)} mil`}
                          onPointerOver={(e) => show(e.currentTarget, i, s)} onFocus={(e) => show(e.currentTarget, i, s)}
                          onPointerOut={() => setTip(null)} onBlur={() => setTip(null)} />
                  );
                })}
                <text className="total" x={cx} y={y - 6}>{total(d)}</text>
                <text className="tick" x={cx} y={BASE + 20}>{d.mes}</text>
              </g>
            );
          })}
          <line className="axis" x1="0" x2="100%" y1={BASE} y2={BASE} />
        </svg>
        {tip && (
          <div className="tip" role="tooltip" style={{ left: tip.left, top: tip.top }}>
            {tip.s.label}: <b>{val(data[tip.i], tip.s.key)} mil</b>
            <span>{data[tip.i].mes}, total {total(data[tip.i])} mil</span>
          </div>
        )}
      </div>
    </figure>
  );
}

// CSS: copia las reglas figure, .legend, .plot, svg, .grid, .axis, .seg, .total, .tick y .tip de la pestaña HTML + CSS.
