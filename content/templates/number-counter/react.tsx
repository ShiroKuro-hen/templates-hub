import { useEffect, useRef, useState, type CSSProperties } from 'react';

type Metric = { label: string; to: number; dec?: number; unit?: string; pct: number; note: string };
const METRICS: Metric[] = [
  { label: 'Usuarios activos', to: 128450, pct: 86, note: '86 % de la meta anual' },
  { label: 'Disponibilidad', to: 99.98, dec: 2, unit: '%', pct: 100, note: 'Objetivo de servicio cumplido' },
  { label: 'Latencia mediana', to: 182, unit: 'ms', pct: 64, note: '64 % del presupuesto de 285 ms' },
  { label: 'Pedidos procesados', to: 1284560, pct: 72, note: '72 % de la capacidad contratada' },
];
const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = (n: number, d = 0) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });

function Stat({ m, run }: { m: Metric; run: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(calm ? 1 : 0);

  useEffect(() => {
    if (calm || !ref.current) return;
    let raf = 0;
    setT(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const f = (now: number) => {
        const p = Math.min((now - t0) / 1400, 1);
        setT(1 - (1 - p) ** 3);
        if (p < 1) raf = requestAnimationFrame(f);
      };
      raf = requestAnimationFrame(f);
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [run]);

  return (
    <div className="stat" ref={ref} style={{ '--p': m.pct, '--t': t } as CSSProperties}>
      <dt>{m.label}</dt>
      <dd className="num"><span className="v">{fmt(m.to * t, m.dec)}</span>{m.unit && <small>{m.unit}</small>}</dd>
      <div className="meter" aria-hidden="true"><i /></div>
      <p className="cap">{m.note}</p>
    </div>
  );
}

export function NumberCounter({ metrics = METRICS }: { metrics?: Metric[] }) {
  const [run, setRun] = useState(0);
  return (
    <>
      <div className="head">
        <div><h1>Resumen del trimestre</h1><p>Las cifras cuentan hasta su valor al entrar en vista.</p></div>
        {!calm && <button className="btn" type="button" onClick={() => setRun((r) => r + 1)}>Repetir</button>}
      </div>
      <dl className="grid">{metrics.map((m) => <Stat key={m.label} m={m} run={run} />)}</dl>
    </>
  );
}

// CSS: copia las reglas .head, .btn, .grid, .stat, .num, .meter y .cap de la pestaña HTML + CSS.
