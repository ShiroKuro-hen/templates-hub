import { Fragment, useState } from 'react';

type Row = { id: string; servicio: string; entorno: string; estado: string; tono: 'ok' | 'info' | 'err'; duracion: string; detalle: [string, string, boolean?][] };
const ROWS: Row[] = [
  { id: 'd1', servicio: 'api-pagos', entorno: 'Producción', estado: 'Completado', tono: 'ok', duracion: '2 min 14 s',
    detalle: [['Versión', 'v3.8.1'], ['Responsable', 'Lucía Vargas'], ['Cambios', 'Corrige el redondeo de impuestos en las facturas.']] },
  { id: 'd2', servicio: 'web-cliente', entorno: 'Preproducción', estado: 'En curso', tono: 'info', duracion: '1 min 03 s',
    detalle: [['Versión', 'v5.2.0-rc2'], ['Responsable', 'Marco Huamán'], ['Cambios', 'Nuevo flujo de registro con verificación por correo.']] },
  { id: 'd3', servicio: 'worker-correo', entorno: 'Producción', estado: 'Fallido', tono: 'err', duracion: '48 s',
    detalle: [['Versión', 'v1.14.3'], ['Responsable', 'Diana Salas'], ['Error', 'Tiempo de espera agotado al conectar con la cola.', true], ['Solución', 'Revisa la variable QUEUE_URL y vuelve a desplegar.']] },
];

export function ExpandableRows() {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const allOpen = open.size === ROWS.length;
  const toggle = (id: string) => {
    const n = new Set(open);
    n.has(id) ? n.delete(id) : n.add(id);
    setOpen(n);
  };

  return (
    <section className="card" aria-labelledby="t">
      <header>
        <h2 id="t">Despliegues recientes</h2>
        <button className="btn" type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(ROWS.map((r) => r.id)))}>
          {allOpen ? 'Contraer todo' : 'Expandir todo'}
        </button>
      </header>
      <div className="scroll">
        <table>
          <caption className="sr">Despliegues recientes. Usa el botón de cada fila para ver su detalle.</caption>
          <thead>
            <tr><th scope="col" className="tgc"><span className="sr">Detalle</span></th><th scope="col">Servicio</th><th scope="col">Entorno</th><th scope="col">Estado</th><th scope="col" className="num">Duración</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <Fragment key={r.id}>
                <tr className={open.has(r.id) ? 'open' : undefined}>
                  <td className="tgc">
                    <button className="tg" type="button" aria-expanded={open.has(r.id)} aria-controls={r.id}
                            aria-label={`Detalle de ${r.servicio}`} onClick={() => toggle(r.id)}>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
                    </button>
                  </td>
                  <th scope="row">{r.servicio}</th><td>{r.entorno}</td>
                  <td><span className={`b ${r.tono}`}>{r.estado}</span></td><td className="num">{r.duracion}</td>
                </tr>
                <tr id={r.id} hidden={!open.has(r.id)}>
                  <td />
                  <td colSpan={4}>
                    <dl>{r.detalle.map(([k, v, bad]) => (<Fragment key={k}><dt>{k}</dt><dd className={bad ? 'err' : undefined}>{v}</dd></Fragment>))}</dl>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// CSS: copia las reglas .card, header, .btn, table, .tg, tr.open, .b, dl y .sr de la pestaña HTML + CSS.
