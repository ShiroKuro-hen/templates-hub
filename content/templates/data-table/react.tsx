import { useMemo, useState } from 'react';

type Row = { nombre: string; plan: string; ventas: number };
const DATA: Row[] = [
  { nombre: 'Ana Pérez', plan: 'Pro', ventas: 1240 },
  { nombre: 'Luis Gómez', plan: 'Free', ventas: 310 },
  { nombre: 'Marta Ruiz', plan: 'Pro', ventas: 2890 },
];
const COLS = [['nombre', 'Nombre'], ['plan', 'Plan'], ['ventas', 'Ventas']] as const;

export function DataTable({ rows = DATA }: { rows?: Row[] }) {
  const [key, setKey] = useState<keyof Row>('nombre');
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => (a[key] > b[key] ? 1 : -1) * (asc ? 1 : -1)),
    [rows, key, asc],
  );
  const sort = (k: keyof Row) => (k === key ? setAsc(!asc) : (setKey(k), setAsc(true)));

  return (
    <div className="wrap">
      <table>
        <caption hidden>Ventas por persona. Usa los encabezados para ordenar.</caption>
        <thead>
          <tr>
            {COLS.map(([k, label]) => (
              <th key={k} scope="col" className={k === 'ventas' ? 'num' : undefined}
                  aria-sort={k === key ? (asc ? 'ascending' : 'descending') : 'none'}>
                <button type="button" onClick={() => sort(k)}>{label}</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.nombre}><td>{r.nombre}</td><td>{r.plan}</td><td className="num">{r.ventas}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// CSS: copia las reglas .wrap, table, th, td y .num de la pestaña HTML + CSS.
