import { useRef, useState } from 'react';

type Day = { date: Date; count: number }; // 84 días (12 semanas), el primero es lunes

const level = (n: number) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 8 ? 3 : 4);
const fmt = new Intl.DateTimeFormat('es', { weekday: 'short', day: 'numeric', month: 'short' });
const mon = new Intl.DateTimeFormat('es', { month: 'short' });
const label = (d: Day) => `${d.count === 0 ? 'Sin aportes' : `${d.count} aportes`}, ${fmt.format(d.date)}`;

export function HeatmapCalendar({ data, title = 'Actividad del equipo' }: { data: Day[]; title?: string }) {
  const [focus, setFocus] = useState(0);
  const [tip, setTip] = useState<{ i: number; left: number; top: number } | null>(null);
  const card = useRef<HTMLElement>(null);
  const cells = useRef<(HTMLLIElement | null)[]>([]);

  const show = (i: number) => {
    const r = cells.current[i]!.getBoundingClientRect(), k = card.current!.getBoundingClientRect();
    setTip({ i, left: r.left - k.left + r.width / 2, top: r.top - k.top - 6 });
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step = ({ ArrowDown: 1, ArrowUp: -1, ArrowRight: 7, ArrowLeft: -7 } as Record<string, number>)[e.key];
    if (!step || !data[i + step]) return;
    e.preventDefault(); setFocus(i + step); cells.current[i + step]?.focus();
  };

  return (
    <section className="card" ref={card} aria-labelledby="heat-title">
      <header>
        <h2 id="heat-title">{title}</h2>
        <span className="sum">{data.reduce((a, d) => a + d.count, 0)} aportes en 12 semanas</span>
      </header>
      <div className="cal">
        <span />
        <div className="months" aria-hidden="true">
          {data.map((d, i) => i % 7 === 0 && (i === 0 || d.date.getMonth() !== data[i - 7].date.getMonth()) && (
            <span key={i} style={{ gridColumn: i / 7 + 1 }}>{mon.format(d.date).replace('.', '')}</span>
          ))}
        </div>
        <div className="days" aria-hidden="true"><span /><span>Lun</span><span /><span>Mié</span><span /><span>Vie</span><span /></div>
        <ul className="heat" role="group" aria-label="Actividad diaria de las últimas 12 semanas. Usa las flechas para moverte.">
          {data.map((d, i) => (
            <li key={i} ref={(el) => { cells.current[i] = el; }} className="cell" data-l={level(d.count)} role="img"
              tabIndex={i === focus ? 0 : -1} aria-label={label(d)}
              onMouseEnter={() => show(i)} onFocus={() => show(i)} onMouseLeave={() => setTip(null)} onBlur={() => setTip(null)}
              onKeyDown={(e) => onKey(e, i)} />
          ))}
        </ul>
      </div>
      {tip && <div className="tip on" role="status" style={{ left: tip.left, top: tip.top, transform: 'translate(-50%, -100%)' }}>{label(data[tip.i])}</div>}
    </section>
  );
}
// CSS: copia las reglas .card / .cal / .months / .days / .heat / .cell / [data-l] / .tip de la pestaña HTML + CSS.
