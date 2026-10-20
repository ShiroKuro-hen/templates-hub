import { useEffect, useRef, useState, type CSSProperties } from 'react';

type Tier = { name: string; hasta: number; precio: number };

const TIERS: Tier[] = [
  { name: 'Inicio', hasta: 10, precio: 12 },
  { name: 'Crecimiento', hasta: 50, precio: 10 },
  { name: 'Equipo', hasta: 200, precio: 8 },
  { name: 'Escala', hasta: 500, precio: 6 },
];
const ANUAL = 0.8;
const money = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const tierOf = (n: number): Tier => TIERS.find((t) => n <= t.hasta) ?? TIERS[TIERS.length - 1];

function cuota(n: number): number {
  let desde = 0;
  return TIERS.reduce((sum, t) => {
    const enTramo = Math.max(0, Math.min(n, t.hasta) - desde);
    desde = t.hasta;
    return sum + enTramo * t.precio;
  }, 0);
}

function useTween(target: number, ms = 320): number {
  const [value, setValue] = useState(target);
  const shown = useRef(target);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = shown.current;
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const k = reduce ? 1 : Math.min(1, (now - t0) / ms);
      shown.current = from + (target - from) * (1 - (1 - k) ** 3);
      setValue(shown.current);
      if (k < 1) raf = requestAnimationFrame(frame);
    };
    frame(t0);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}

export function UsageSlider({ inicial = 25 }: { inicial?: number }) {
  const [users, setUsers] = useState(inicial);
  const [annual, setAnnual] = useState(false);
  const bruto = cuota(users);
  const mes = annual ? bruto * ANUAL : bruto;
  const tier = tierOf(users);
  const shown = useTween(mes);
  const ahorro = money.format(Math.round(bruto * (1 - ANUAL) * 12));
  const resumen = `Precio ${annual ? 'anual' : 'mensual'}: US$${money.format(Math.round(mes))} al mes para ${users} usuarios. Tramo ${tier.name}.`;

  return (
    <section className="calc" aria-labelledby="usage-title">
      <header className="top">
        <h2 id="usage-title">Calcula tu plan</h2>
        <div className="billing">
          <span className={`lbl${annual ? '' : ' on'}`}>Mensual</span>
          <button
            type="button"
            className="switch"
            role="switch"
            aria-checked={annual}
            aria-label="Facturación anual"
            onClick={() => setAnnual(!annual)}
          />
          <span className={`lbl${annual ? ' on' : ''}`}>Anual</span>
        </div>
      </header>

      <div className="usage">
        <div className="usage-head">
          <label htmlFor="u">Usuarios activos</label>
          <span className="count" aria-hidden="true">{users}</span>
        </div>
        <input
          id="u"
          type="range"
          min={1}
          max={500}
          step={1}
          value={users}
          aria-valuetext={`${users} ${users === 1 ? 'usuario' : 'usuarios'}`}
          style={{ '--p': `${((users - 1) / 499) * 100}%` } as CSSProperties}
          onChange={(e) => setUsers(Number(e.target.value))}
        />
        <div className="ends" aria-hidden="true"><span>1</span><span>500</span></div>
        <ol className="tiers" aria-hidden="true">
          {TIERS.map((t, i) => (
            <li key={t.name} className={t === tier ? 'on' : undefined}>
              <b>{t.name}</b>
              {i ? TIERS[i - 1].hasta + 1 : 1}–{t.hasta} · US${t.precio}
            </li>
          ))}
        </ol>
      </div>

      <div className="result">
        <p className="tramo">Tramo <b>{tier.name}</b></p>
        <p className="price" aria-hidden="true">US${money.format(Math.round(shown))}</p>
        <p className="unit">{annual ? 'al mes, facturado al año' : 'al mes, facturado cada mes'}</p>
        <p className="meta">
          <span>US${cents.format(mes / users)} por usuario al mes</span>
          <span className="save">{annual ? `Ahorras US$${ahorro} al año` : `Con anual ahorrarías US$${ahorro}`}</span>
        </p>
        <p className="sr" aria-live="polite">{resumen}</p>
      </div>
    </section>
  );
}
// CSS: copia los tokens :root, .calc, .top, .billing (.lbl.on, .switch), .usage, input[type=range] (pistas y pulgar), .ends, .tiers (.on), .result, .price, .unit, .meta, .save, .sr y la media query de movimiento de la pestaña HTML + CSS.
