import { useMemo, useState } from 'react';

type Item = { nombre: string; region: string; tipo: string; estado: string };
type Key = Exclude<keyof Item, 'nombre'>;
type Sel = Record<Key, string[]>;

const ITEMS: Item[] = [
  { nombre: 'api-lima-01', region: 'Lima', tipo: 'Cómputo', estado: 'Activo' },
  { nombre: 'db-lima-02', region: 'Lima', tipo: 'Base de datos', estado: 'Activo' },
  { nombre: 'cache-scl-01', region: 'Santiago', tipo: 'Caché', estado: 'Detenido' },
  { nombre: 'api-scl-03', region: 'Santiago', tipo: 'Cómputo', estado: 'Activo' },
  { nombre: 'db-bog-01', region: 'Bogotá', tipo: 'Base de datos', estado: 'Mantenimiento' },
];
const FACETS: [Key, string][] = [['region', 'Región'], ['tipo', 'Tipo'], ['estado', 'Estado']];
const EMPTY: Sel = { region: [], tipo: [], estado: [] };

const match = (i: Item, s: Sel, skip?: Key) =>
  FACETS.every(([k]) => k === skip || !s[k].length || s[k].includes(i[k]));

export function FacetedFilters({ items = ITEMS }: { items?: Item[] }) {
  const [sel, setSel] = useState<Sel>(EMPTY);
  const hits = useMemo(() => items.filter((i) => match(i, sel)), [items, sel]);
  const toggle = (k: Key, v: string) =>
    setSel((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));

  return (
    <div className="ff">
      <aside aria-label="Filtros">
        {FACETS.map(([k, title]) => (
          <fieldset key={k}>
            <legend>{title}</legend>
            {[...new Set(items.map((i) => i[k]))].map((v) => {
              const n = items.filter((i) => match(i, sel, k) && i[k] === v).length;
              const on = sel[k].includes(v);
              return (
                <label key={v}>
                  <input type="checkbox" checked={on} disabled={!n && !on} onChange={() => toggle(k, v)} /> {v}
                  <small>{n}</small>
                </label>
              );
            })}
          </fieldset>
        ))}
      </aside>
      <section aria-labelledby="h">
        <p className="head" id="h" aria-live="polite"><span>{hits.length}</span> servidores</p>
        <ul>
          {hits.map((i) => (
            <li key={i.nombre}><span>{i.nombre}</span><small>{i.region}, {i.tipo}, {i.estado}</small></li>
          ))}
          {!hits.length && (
            <li className="empty">
              Ningún servidor cumple estos filtros. <button type="button" onClick={() => setSel(EMPTY)}>Quitar filtros</button>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

// CSS: copia las reglas .ff, fieldset, label, .head, li y button de la pestaña HTML + CSS.
