import { useState } from 'react';

type Slice = { label: string; value: number; color: string };

const DATA: Slice[] = [
  { label: 'Directo', value: 38, color: 'var(--accent)' },
  { label: 'Orgánico', value: 27, color: 'var(--info)' },
  { label: 'Referidos', value: 18, color: 'var(--ok)' },
  { label: 'Social', value: 12, color: 'var(--warn)' },
  { label: 'Otros', value: 5, color: 'var(--err)' },
];
const R = 100 / (2 * Math.PI); // circunferencia = 100 → dasharray en porcentajes
const GAP = 0.8;

type Props = { data?: Slice[]; title?: string; total?: string; unit?: string };

export function DonutChart({ data = DATA, title = 'Visitas por canal', total = '12,5k', unit = 'visitas' }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const sum = data.reduce((a, d) => a + d.value, 0);
  let acc = 0;
  const segs = data.map((d) => {
    const share = (d.value / sum) * 100;
    const seg = { len: Math.max(share - GAP, 0.1), offset: 25 - acc };
    acc += share;
    return seg;
  });
  const cur = active === null ? null : data[active];

  return (
    <section className="card" aria-labelledby="donut-title">
      <div className={`wrap${cur ? ' dim' : ''}`}>
        <svg viewBox="0 0 42 42" role="img" aria-label={`Gráfico de donut: ${title}`}>
          {segs.map((s, i) => (
            <circle key={data[i].label} className={`seg${active === i ? ' on' : ''}`} cx="21" cy="21" r={R}
              style={{ stroke: data[i].color }} strokeDasharray={`${s.len} ${100 - s.len}`} strokeDashoffset={s.offset}
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} />
          ))}
        </svg>
        <div className="center" aria-hidden="true">
          <strong>{cur ? `${cur.value}%` : total}</strong>
          <span>{cur ? cur.label : unit}</span>
        </div>
      </div>
      <div>
        <h2 id="donut-title">{title}</h2>
        <ul className="legend">
          {data.map((d, i) => (
            <li key={d.label}>
              <button type="button" className={active === i ? 'on' : ''}
                onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
                <span className="dot" style={{ ['--c' as string]: d.color }} />
                <span className="name">{d.label}</span>
                <span className="val">{d.value}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
// CSS: copia las reglas .card / .wrap / svg / .seg / .dim / .center / .legend / .dot / .name / .val de la pestaña HTML + CSS.
