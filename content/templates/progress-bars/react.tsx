import { useId } from 'react';

type Item = { label: string; value: number }; // value 0-100

const tone = (v: number) => (v >= 75 ? 'hi' : v >= 40 ? 'mid' : 'lo');

export function ProgressBars({ items }: { items: Item[] }) {
  const uid = useId();
  return (
    <div className="card">
      {items.map(({ label, value }) => {
        const id = `${uid}-${label}`;
        return (
          <div className="row" key={label}>
            <label htmlFor={id}>{label}</label>
            <progress id={id} className={tone(value)} max={100} value={value} />
            <output htmlFor={id}>{value}%</output>
          </div>
        );
      })}
    </div>
  );
}
// CSS: copia las reglas .card / .row / .row output / progress (+ ::-webkit-progress-* y ::-moz-progress-bar) / .lo / .mid / .hi de la pestaña HTML + CSS.
