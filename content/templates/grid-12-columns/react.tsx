import { useState, type CSSProperties } from 'react';

type Col = [sm: number, md?: number, lg?: number];
const fix = (...n: number[]): Col[] => n.map((v) => [v]);
const EJEMPLOS: [titulo: string, descripcion: string, cols: Col[]][] = [
  ['Una columna', '12', fix(12)],
  ['Mitad y mitad', '6 + 6', fix(6, 6)],
  ['Tercios', '4 + 4 + 4', fix(4, 4, 4)],
  ['Contenido y lateral', '8 + 4', fix(8, 4)],
  ['Cuartos', '3 + 3 + 3 + 3', fix(3, 3, 3, 3)],
  ['Centrado', '2 + 8 + 2', fix(2, 8, 2)],
  ['Tarjetas adaptables', 'sm 12, md 6, lg 3', [[12, 6, 3], [12, 6, 3], [12, 6, 3], [12, 6, 3]]],
  ['Lateral adaptable', 'sm 12, md 4 y 8, lg 3 y 9', [[12, 4, 3], [12, 8, 9]]],
];
const BREAKPOINTS = [['sm', '0 a 639 px', '--sm'], ['md', '640 a 899 px', '--md'], ['lg', '900 px o más', '--lg']];

export function Grid12Columns() {
  const [guias, setGuias] = useState(true);
  return (
    <section className="card" aria-labelledby="t">
      <div className="head">
        <div><h2 id="t">Sistema de 12 columnas</h2><p>Punto de quiebre actual:<span className="bp" /></p></div>
        <label className="sw"><input type="checkbox" id="gd" checked={guias} onChange={(e) => setGuias(e.target.checked)} />Mostrar columnas</label>
      </div>
      {EJEMPLOS.map(([titulo, desc, cols]) => (
        <div className="ex" key={titulo}>
          <p className="lb"><b>{titulo}</b><code>{desc}</code></p>
          <div className="row">
            {cols.map(([sm, md, lg], i) => (
              <div key={i} className="col" style={{ '--sm': sm, ...(md ? { '--md': md, '--lg': lg } : {}) } as CSSProperties}>
                {md ? i + 1 : `col-${sm}`}
              </div>
            ))}
          </div>
        </div>
      ))}
      <table aria-label="Puntos de quiebre">
        <thead><tr><th scope="col">Nombre</th><th scope="col">Ancho del contenedor</th><th scope="col">Regla</th></tr></thead>
        <tbody>
          {BREAKPOINTS.map(([n, ancho, v]) => (
            <tr key={n} className={n}><th scope="row">{n}</th><td>{ancho}</td><td><code>{v}</code></td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
// CSS: copia las reglas .card, .head, .sw, .bp, .ex, .lb, .row, .col, table, tr.sm/md/lg y los @container de la pestaña HTML + CSS (las guías usan :has sobre #gd).
