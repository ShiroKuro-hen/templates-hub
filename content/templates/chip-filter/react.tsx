import { useState } from 'react';

type Item = { name: string; tags: string[] };

type Props = { legend: string; filters: string[]; items: Item[] };

export function ChipFilter({ legend, filters, items }: Props) {
  const [on, setOn] = useState<string[]>([]);
  const toggle = (f: string) => setOn((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));
  const shown = items.filter((i) => on.every((t) => i.tags.includes(t))); // coincide con todos

  return (
    <>
      <fieldset>
        <legend>{legend}</legend>
        <div className="chips">
          {filters.map((f) => (
            <label className="chip" key={f}>
              <input type="checkbox" checked={on.includes(f)} onChange={() => toggle(f)} />
              <span>{f}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="bar">
        <span aria-live="polite">{shown.length} de {items.length} resultados</span>
        <button type="button" onClick={() => setOn([])}>Limpiar filtros</button>
      </div>

      {shown.length ? (
        <ul>{shown.map((i) => <li key={i.name}>{i.name}</li>)}</ul>
      ) : (
        <p className="empty">Ningún resultado cumple todos los filtros. Quita alguno.</p>
      )}
    </>
  );
}
// CSS: copia las reglas .chips / .chip / .bar / ul / li / .empty de la pestaña HTML + CSS.
