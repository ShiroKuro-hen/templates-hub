import { useMemo, useState } from 'react';

type Item = { nombre: string; fecha: string; mb: number };
type Orden = 'reciente' | 'antiguo' | 'az' | 'za' | 'tamano';

const DATA: Item[] = [
  { nombre: 'Portal de clientes', fecha: '2026-09-28', mb: 482 },
  { nombre: 'Migración a Postgres', fecha: '2026-08-14', mb: 1260 },
  { nombre: 'Rediseño de facturación', fecha: '2026-09-02', mb: 214 },
  { nombre: 'API de pagos', fecha: '2026-07-21', mb: 96 },
  { nombre: 'Panel de analítica', fecha: '2026-10-01', mb: 738 },
  { nombre: 'Auditoría de accesos', fecha: '2026-06-30', mb: 58 },
];
const OPCIONES: [Orden, string][] = [
  ['reciente', 'Más recientes'], ['antiguo', 'Más antiguos'], ['az', 'Nombre (A a Z)'], ['za', 'Nombre (Z a A)'], ['tamano', 'Mayor tamaño'],
];
const SORT: Record<Orden, (a: Item, b: Item) => number> = {
  reciente: (a, b) => b.fecha.localeCompare(a.fecha),
  antiguo: (a, b) => a.fecha.localeCompare(b.fecha),
  az: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
  za: (a, b) => b.nombre.localeCompare(a.nombre, 'es'),
  tamano: (a, b) => b.mb - a.mb,
};
const fmt = (d: string) => new Date(d + 'T00:00').toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });

export function SortDropdown({ items = DATA }: { items?: Item[] }) {
  const [orden, setOrden] = useState<Orden>('reciente');
  const sorted = useMemo(() => [...items].sort(SORT[orden]), [items, orden]);

  return (
    <div className="box">
      <div className="bar">
        <h2>{items.length} proyectos</h2>
        <label htmlFor="s">Ordenar por
          <span className="sel">
            <select id="s" value={orden} onChange={(e) => setOrden(e.target.value as Orden)}>
              {OPCIONES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </select>
          </span>
        </label>
      </div>
      <ol>
        {sorted.map((i) => (
          <li key={i.nombre}>
            <span>{i.nombre}<small>Actualizado el <time dateTime={i.fecha}>{fmt(i.fecha)}</time></small></span>
            <output>{i.mb} MB</output>
          </li>
        ))}
      </ol>
      <p className="sr" aria-live="polite">Lista ordenada: {OPCIONES.find(([v]) => v === orden)![1]}.</p>
    </div>
  );
}

// CSS: copia las reglas .box, .bar, .sel, select, li y .sr de la pestaña HTML + CSS.
