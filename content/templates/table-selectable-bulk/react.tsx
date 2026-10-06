import { useEffect, useRef, useState } from 'react';

type Invoice = { id: string; cliente: string; importe: string };
const DATA: Invoice[] = [
  { id: 'F-1042', cliente: 'Nórdica Labs', importe: '1.240,00 €' },
  { id: 'F-1043', cliente: 'Atlas Energía', importe: '3.890,50 €' },
  { id: 'F-1044', cliente: 'Brío Studio', importe: '760,00 €' },
  { id: 'F-1045', cliente: 'Cobalto SA', importe: '12.300,00 €' },
];

export function SelectableTable({ initial = DATA }: { initial?: Invoice[] }) {
  const [rows, setRows] = useState(initial);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const allRef = useRef<HTMLInputElement>(null);
  const n = sel.size;

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = n > 0 && n < rows.length;
  }, [n, rows.length]);

  const toggle = (id: string) =>
    setSel((s) => { const c = new Set(s); c.has(id) ? c.delete(id) : c.add(id); return c; });
  const toggleAll = () => setSel(n === rows.length ? new Set() : new Set(rows.map((r) => r.id)));
  const archive = () => { setRows(rows.filter((r) => !sel.has(r.id))); setSel(new Set()); allRef.current?.focus(); };

  return (
    <div className="card">
      {n > 0 && (
        <div className="bulk">
          <span className="count" aria-live="polite">{n}</span><span>seleccionados</span>
          <span className="sp" />
          <button type="button" className="btn">Exportar CSV</button>
          <button type="button" className="btn danger" onClick={archive}>Archivar</button>
        </div>
      )}
      <div className="scroll">
        <table>
          <caption hidden>Facturas pendientes. Marca filas para aplicar acciones en bloque.</caption>
          <thead>
            <tr>
              <th scope="col">
                <input ref={allRef} type="checkbox" aria-label="Seleccionar todas las filas"
                  checked={n > 0 && n === rows.length} disabled={!rows.length} onChange={toggleAll} />
              </th>
              <th scope="col">Factura</th><th scope="col">Cliente</th><th scope="col" className="num">Importe</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={4} className="empty">No quedan facturas pendientes. Crea una nueva para empezar.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td><input type="checkbox" aria-label={`Seleccionar ${r.id}`} checked={sel.has(r.id)} onChange={() => toggle(r.id)} /></td>
                <td>{r.id}</td><td>{r.cliente}</td><td className="num">{r.importe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// CSS: copia las reglas .card, .bulk, .count, .btn, .scroll, table, th, td, .num y .empty de la pestaña HTML + CSS.
