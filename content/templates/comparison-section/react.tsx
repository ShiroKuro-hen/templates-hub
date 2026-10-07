type Cell = boolean | string; // true = incluido, false = no incluido, string = texto
type Row = { feature: string; nimbo: Cell; orbita: Cell; cumbre: Cell };

const ROWS: Row[] = [
  { feature: 'Automatizaciones sin código', nimbo: true, orbita: true, cumbre: false },
  { feature: 'Integraciones nativas', nimbo: '120+', orbita: '45', cumbre: '20' },
  { feature: 'Edición colaborativa en tiempo real', nimbo: true, orbita: false, cumbre: false },
  { feature: 'SSO y aprovisionamiento SCIM', nimbo: true, orbita: 'Costo extra', cumbre: false },
  { feature: 'Registro de auditoría', nimbo: true, orbita: true, cumbre: false },
  { feature: 'Datos alojados en Latinoamérica', nimbo: true, orbita: false, cumbre: false },
  { feature: 'Respuesta de soporte', nimbo: '4 h', orbita: '24 h', cumbre: '48 h' },
  { feature: 'Precio por usuario al mes', nimbo: 'US$ 12', orbita: 'US$ 18', cumbre: 'US$ 15' },
];
const COLS = [['nimbo', 'Nimbo'], ['orbita', 'Órbita'], ['cumbre', 'Cumbre']] as const;

function Valor({ v, bold }: { v: Cell; bold?: boolean }) {
  if (typeof v === 'string') return bold ? <b>{v}</b> : <>{v}</>;
  return <i className={v ? 'yes' : 'no'}><b className="sr">{v ? 'Incluido' : 'No incluido'}</b></i>;
}

export function ComparisonSection({ rows = ROWS }: { rows?: Row[] }) {
  return (
    <section className="sec" aria-labelledby="t">
      <h2 id="t">Nimbo frente a otras alternativas</h2>
      <p className="lead">Compara lo que incluye cada plan de equipo y elige con datos. Actualizado en septiembre de 2026.</p>
      <div className="wrap" role="region" aria-label="Tabla comparativa, desplázate para ver más columnas" tabIndex={0}>
        <table>
          <caption className="sr">Comparativa de funciones entre Nimbo, Órbita y Cumbre</caption>
          <thead>
            <tr>
              <th scope="col">Función</th>
              {COLS.map(([k, label]) => (
                <th key={k} scope="col" className={k === 'nimbo' ? 'us' : undefined}>
                  {k === 'nimbo' ? <span>{label}</span> : label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.feature}>
                <th scope="row">{r.feature}</th>
                {COLS.map(([k]) => (
                  <td key={k} className={k === 'nimbo' ? 'us' : undefined}><Valor v={r[k]} bold={k === 'nimbo'} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
// CSS: copia las reglas .sec, .wrap, table, th/td, .us, .yes y .no de la pestaña HTML + CSS.
