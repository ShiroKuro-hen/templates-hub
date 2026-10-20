import { useState } from 'react';

type Attr = [key: string, name: string];
type Entity = { id: string; name: string; x: number; y: number; attrs: Attr[] };
type Rel = { a: string; b: string; d: string; labels: [x: number, y: number, text: string, anchor: 'start' | 'end'][] };

const ENTITIES: Entity[] = [
  { id: 'cliente', name: 'Cliente', x: 20, y: 20, attrs: [['PK', 'id_cliente'], ['', 'nombre'], ['', 'correo']] },
  { id: 'pedido', name: 'Pedido', x: 255, y: 20, attrs: [['PK', 'id_pedido'], ['FK', 'id_cliente'], ['', 'fecha'], ['', 'estado']] },
  { id: 'pago', name: 'Pago', x: 490, y: 20, attrs: [['PK', 'id_pago'], ['FK', 'id_pedido'], ['', 'importe'], ['', 'método']] },
  { id: 'linea', name: 'Línea', x: 255, y: 230, attrs: [['PK', 'id_linea'], ['FK', 'id_pedido'], ['FK', 'id_producto'], ['', 'cantidad']] },
  { id: 'producto', name: 'Producto', x: 490, y: 230, attrs: [['PK', 'id_producto'], ['', 'nombre'], ['', 'precio']] },
];
const RELS: Rel[] = [
  { a: 'cliente', b: 'pedido', d: 'M190,68 H255', labels: [[196, 60, '1', 'start'], [249, 60, 'N', 'end']] },
  { a: 'pedido', b: 'pago', d: 'M425,68 H490', labels: [[431, 60, '1', 'start'], [484, 60, '0..N', 'end']] },
  { a: 'pedido', b: 'linea', d: 'M340,136 V230', labels: [[346, 160, '1', 'start'], [346, 220, 'N', 'start']] },
  { a: 'linea', b: 'producto', d: 'M425,290 H490', labels: [[431, 284, 'N', 'start'], [484, 284, '1', 'end']] },
];
const HEAD = 28, ROW = 20, W = 170;

export function ErDiagram({ entities = ENTITIES, rels = RELS }: { entities?: Entity[]; rels?: Rel[] }) {
  const [active, setActive] = useState<string | null>(null);
  const linked = (r: Rel) => active !== null && (r.a === active || r.b === active);
  const ends = active === null ? null : new Set([active, ...rels.filter(linked).flatMap((r) => [r.a, r.b])]);

  return (
    <figure className="card">
      <figcaption>
        <h2>Modelo de datos de la tienda</h2>
        <p>Un cliente tiene muchos pedidos, y cada pedido tiene varias líneas. Pasa el cursor o enfoca una entidad para ver sus relaciones.</p>
      </figcaption>
      <div className="scroll" role="region" tabIndex={0} aria-label="Diagrama desplazable horizontalmente">
      <svg className={active !== null ? 'active' : undefined} viewBox="0 0 680 370" role="img" aria-labelledby="erd-t erd-d">
        <title id="erd-t">Entidad-relación de la tienda</title>
        <desc id="erd-d">Cliente 1 a N Pedido; Pedido 1 a 0..N Pago; Pedido 1 a N Línea; Producto 1 a N Línea.</desc>
        {rels.map((r) => (
          <g key={`${r.a}-${r.b}`}>
            <path className={linked(r) ? 'rel hl' : 'rel'} d={r.d} />
            {r.labels.map(([x, y, text, anchor]) => (
              <text key={`${x}-${y}`} className={linked(r) ? 'card-lbl hl' : 'card-lbl'} x={x} y={y} textAnchor={anchor}>{text}</text>
            ))}
          </g>
        ))}
        {entities.map((e) => (
          <g key={e.id} className={ends?.has(e.id) ? 'ent hl' : 'ent'} tabIndex={0} role="group" aria-label={e.name}
             onMouseEnter={() => setActive(e.id)} onMouseLeave={() => setActive(null)}
             onFocus={() => setActive(e.id)} onBlur={() => setActive(null)}>
            <rect className="box" x={e.x} y={e.y} width={W} height={HEAD + e.attrs.length * ROW + 8} rx={6} />
            <rect className="head" x={e.x} y={e.y} width={W} height={HEAD} rx={6} />
            <text className="head-t" x={e.x + 12} y={e.y + 19}>{e.name}</text>
            {e.attrs.map(([key, name], i) => {
              const y = e.y + HEAD + i * ROW + 15;
              return (
                <g key={name}>
                  {key && <text className={`k-${key.toLowerCase()}`} x={e.x + 12} y={y}>{key}</text>}
                  <text className="attr" x={e.x + 44} y={y}>{name}</text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
      </div>
      <ul className="legend" aria-label="Leyenda">
        <li><b>PK</b> clave primaria</li>
        <li><b>FK</b> clave externa</li>
        <li><b>1</b> y <b>N</b> cardinalidad</li>
      </ul>
    </figure>
  );
}
