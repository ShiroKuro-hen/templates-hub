type Factura = { id: string; cliente: string; fecha: string; estado: 'Pagada' | 'Pendiente' | 'Vencida'; importe: number };
const DATA: Factura[] = [
  { id: 'F-2041', cliente: 'Textiles Andina', fecha: '3 oct 2026', estado: 'Pagada', importe: 2480 },
  { id: 'F-2040', cliente: 'Café del Valle', fecha: '1 oct 2026', estado: 'Pendiente', importe: 960.5 },
  { id: 'F-2039', cliente: 'Logística Pacífico', fecha: '28 sep 2026', estado: 'Pagada', importe: 5310 },
  { id: 'F-2038', cliente: 'Estudio Mirador', fecha: '25 sep 2026', estado: 'Vencida', importe: 740 },
];
const TONO = { Pagada: 'ok', Pendiente: 'warn', Vencida: 'err' } as const;
const money = (n: number) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function ResponsiveCardsTable({ rows = DATA }: { rows?: Factura[] }) {
  return (
    <section className="card" aria-labelledby="t">
      <h2 id="t">Facturas de octubre</h2>
      <table role="table" aria-labelledby="t">
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader" scope="col">Factura</th><th role="columnheader" scope="col">Cliente</th>
            <th role="columnheader" scope="col">Fecha</th><th role="columnheader" scope="col">Estado</th>
            <th role="columnheader" scope="col" className="num">Importe</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((r) => (
            <tr role="row" key={r.id}>
              <th role="rowheader" scope="row">{r.id}</th>
              <td role="cell" data-label="Cliente">{r.cliente}</td>
              <td role="cell" data-label="Fecha">{r.fecha}</td>
              <td role="cell" data-label="Estado"><span className={`b ${TONO[r.estado]}`}>{r.estado}</span></td>
              <td role="cell" data-label="Importe" className="num">{money(r.importe)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// CSS: copia las reglas .card, table, th, td, .num, .b y el @media (max-width:639px) de la pestaña HTML + CSS.
