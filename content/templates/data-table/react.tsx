import { useMemo, useState } from 'react';

type Row = { nombre: string; plan: string; ventas: number };
const DATA: Row[] = [
  { nombre: 'Ana Pérez', plan: 'Pro', ventas: 1240 },
  { nombre: 'Luis Gómez', plan: 'Free', ventas: 310 },
  { nombre: 'Marta Ruiz', plan: 'Pro', ventas: 2890 },
];

export function DataTable({ rows = DATA }: { rows?: Row[] }) {
  const [key, setKey] = useState<keyof Row>('nombre');
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => (a[key] > b[key] ? 1 : -1) * (asc ? 1 : -1)),
    [rows, key, asc],
  );
  const sort = (k: keyof Row) => (k === key ? setAsc(!asc) : (setKey(k), setAsc(true)));
  const arrow = (k: keyof Row) => (k === key ? (asc ? ' ▲' : ' ▼') : '');

  return (
    <table>
      <thead>
        <tr>
          {(['nombre', 'plan', 'ventas'] as const).map((k) => (
            <th key={k} scope="col" onClick={() => sort(k)} aria-sort={k === key ? (asc ? 'ascending' : 'descending') : 'none'}>
              {k}{arrow(k)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((r) => (
          <tr key={r.nombre}><td>{r.nombre}</td><td>{r.plan}</td><td>{r.ventas}</td></tr>
        ))}
      </tbody>
    </table>
  );
}
