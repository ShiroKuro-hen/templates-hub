type Row = { region: string; valores: number[] };

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];
const DATA: Row[] = [
  { region: 'Norte', valores: [124, 131, 140, 138, 152, 160, 149, 171] },
  { region: 'Centro', valores: [210, 198, 225, 231, 240, 236, 219, 250] },
  { region: 'Sur', valores: [96, 104, 99, 112, 118, 125, 130, 121] },
  { region: 'Este', valores: [143, 150, 147, 155, 162, 158, 166, 174] },
];
const fmt = new Intl.NumberFormat('es-ES');

export function StickyTable({ rows = DATA, cols = MESES }: { rows?: Row[]; cols?: string[] }) {
  return (
    <>
      <div className="wrap" tabIndex={0} role="region" aria-labelledby="cap">
        <table>
          <caption id="cap" hidden>Ingresos mensuales por región en miles de euros</caption>
          <thead>
            <tr>
              <th scope="col" className="fix">Región</th>
              {cols.map((c) => <th key={c} scope="col" className="num">{c}</th>)}
              <th scope="col" className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.region}>
                <th scope="row" className="fix">{r.region}</th>
                {r.valores.map((v, i) => <td key={i} className="num">{fmt.format(v)}</td>)}
                <td className="num">{fmt.format(r.valores.reduce((a, b) => a + b, 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint">Desplaza la tabla en horizontal; la región y la cabecera se quedan fijas.</p>
    </>
  );
}

// CSS: copia las reglas .wrap, table, th, td, .fix, .num y .hint de la pestaña HTML + CSS.
