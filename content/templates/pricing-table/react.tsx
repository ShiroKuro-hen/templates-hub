type Valor = boolean | string;
type Plan = { nombre: string; precio: string; destacado?: boolean };
type Fila = { caracteristica: string; valores: Valor[] }; // un valor por plan

const PLANES: Plan[] = [
  { nombre: 'Free', precio: '$0/mes' },
  { nombre: 'Pro', precio: '$12/mes', destacado: true },
  { nombre: 'Team', precio: '$39/mes' },
];
const FILAS: Fila[] = [
  { caracteristica: 'Proyectos', valores: ['3', 'Ilimitados', 'Ilimitados'] },
  { caracteristica: 'Exportar a PDF', valores: [false, true, true] },
  { caracteristica: 'Dominio propio', valores: [false, true, true] },
  { caracteristica: 'Usuarios', valores: ['1', '1', 'Hasta 10'] },
  { caracteristica: 'Soporte prioritario', valores: [false, false, true] },
];

function Celda({ v }: { v: Valor }) {
  if (typeof v === 'string') return <>{v}</>;
  return (
    <>
      <span className={v ? 'yes' : 'no'} aria-hidden="true">{v ? '✓' : '✕'}</span>
      <span className="sr">{v ? 'Incluido' : 'No incluido'}</span>
    </>
  );
}

export function PricingTable({ planes = PLANES, filas = FILAS }: { planes?: Plan[]; filas?: Fila[] }) {
  return (
    <div className="wrap" role="region" aria-labelledby="cap" tabIndex={0}>
      <table>
        <caption id="cap">Comparativa de planes</caption>
        <thead>
          <tr>
            <td />
            {planes.map((p) => (
              <th key={p.nombre} scope="col" className={p.destacado ? 'hl' : undefined}>
                {p.destacado && <span className="tag">Recomendado</span>}
                <span className="plan">{p.nombre}</span>
                <span className="price">{p.precio}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.caracteristica}>
              <th scope="row">{f.caracteristica}</th>
              {f.valores.map((v, i) => (
                <td key={i} className={planes[i]?.destacado ? 'hl' : undefined}><Celda v={v} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// CSS: copia las reglas .wrap / table / th / td / .plan / .price / .tag / .hl / .yes / .no / .sr de la pestaña HTML + CSS.
