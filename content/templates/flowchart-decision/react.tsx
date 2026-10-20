import { useState } from 'react';

type Nodo = { id: string; tipo: 'term' | 'proc' | 'dec'; cx: number; cy: number; w: number; h: number; lineas: string[] };
type Arista = {
  from: string;
  to: string;
  d: string;
  etiqueta?: { x: number; y: number; texto: string; anchor: 'start' | 'middle' };
};

const NODOS: Nodo[] = [
  { id: 'inicio', tipo: 'term', cx: 150, cy: 30, w: 220, h: 40, lineas: ['Inicio: pedido recibido'] },
  { id: 'validar', tipo: 'proc', cx: 150, cy: 110, w: 220, h: 44, lineas: ['Validar datos del pedido'] },
  { id: 'datos', tipo: 'dec', cx: 150, cy: 200, w: 200, h: 80, lineas: ['¿Datos completos?'] },
  { id: 'reenviar', tipo: 'proc', cx: 335, cy: 200, w: 110, h: 52, lineas: ['Pedir datos', 'al cliente'] },
  { id: 'importe', tipo: 'dec', cx: 150, cy: 310, w: 200, h: 80, lineas: ['¿Importe > 1.000 €?'] },
  { id: 'gerente', tipo: 'proc', cx: 150, cy: 410, w: 220, h: 44, lineas: ['Aprobación del gerente'] },
  { id: 'fin', tipo: 'term', cx: 150, cy: 500, w: 220, h: 40, lineas: ['Fin: pedido aprobado'] },
];

const ARISTAS: Arista[] = [
  { from: 'inicio', to: 'validar', d: 'M150 50V88' },
  { from: 'validar', to: 'datos', d: 'M150 132V160' },
  { from: 'datos', to: 'importe', d: 'M150 240V270', etiqueta: { x: 160, y: 255, texto: 'Sí', anchor: 'start' } },
  { from: 'datos', to: 'reenviar', d: 'M250 200H280', etiqueta: { x: 265, y: 188, texto: 'No', anchor: 'middle' } },
  { from: 'reenviar', to: 'validar', d: 'M335 174V110H260', etiqueta: { x: 297, y: 99, texto: 'Reenviar', anchor: 'middle' } },
  { from: 'importe', to: 'gerente', d: 'M150 350V388', etiqueta: { x: 160, y: 369, texto: 'Sí', anchor: 'start' } },
  { from: 'importe', to: 'fin', d: 'M250 310H320V500H260', etiqueta: { x: 285, y: 298, texto: 'No', anchor: 'middle' } },
  { from: 'gerente', to: 'fin', d: 'M150 432V480' },
];

function Forma({ nodo }: { nodo: Nodo }) {
  const { cx, cy, w, h } = nodo;
  if (nodo.tipo === 'dec') {
    return <polygon points={`${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`} />;
  }
  return <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={nodo.tipo === 'term' ? h / 2 : 6} />;
}

export function FlujoDecisiones() {
  const [foco, setFoco] = useState<string | null>(null);
  const enlazada = (a: Arista) => a.from === foco || a.to === foco;
  const vecinos = new Set(foco ? [foco, ...ARISTAS.filter(enlazada).flatMap((a) => [a.from, a.to])] : []);

  return (
    <figure className="card">
      <figcaption>
        <h1>Aprobación de pedidos</h1>
        <p>Pasa el ratón o el foco sobre un nodo para ver su camino.</p>
      </figcaption>
      <svg viewBox="0 0 400 540" role="img" aria-labelledby="flow-t flow-d" className={foco ? 'flow active' : 'flow'} onPointerLeave={() => setFoco(null)}>
        <title id="flow-t">Flujo de aprobación de pedidos</title>
        <desc id="flow-d">El pedido se valida. Si faltan datos, se piden al cliente y se vuelve a validar. Si el importe supera 1.000 euros, lo aprueba el gerente; en otro caso queda aprobado.</desc>
        <defs>
          <marker id="ah" markerUnits="userSpaceOnUse" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path className="arrow" d="M0 0L9 5L0 10z" /></marker>
          <marker id="ah-hot" markerUnits="userSpaceOnUse" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path className="arrow hot" d="M0 0L9 5L0 10z" /></marker>
        </defs>
        {ARISTAS.map((a) => (
          <path key={`${a.from}-${a.to}`} className={enlazada(a) ? 'edge hot' : 'edge'} d={a.d} />
        ))}
        {ARISTAS.map((a) => a.etiqueta && (
          <text key={`t-${a.from}-${a.to}`} className={enlazada(a) ? 'lbl hot' : 'lbl'} x={a.etiqueta.x} y={a.etiqueta.y} textAnchor={a.etiqueta.anchor}>
            {a.etiqueta.texto}
          </text>
        ))}
        {NODOS.map((n) => (
          <g key={n.id} className={['node', n.tipo === 'term' ? 'term' : '', n.tipo === 'dec' ? 'dec' : '', vecinos.has(n.id) ? 'hot' : ''].filter(Boolean).join(' ')}
             tabIndex={0} role="group" aria-label={n.lineas.join(' ')}
             onPointerOver={() => setFoco(n.id)} onFocus={() => setFoco(n.id)} onBlur={() => setFoco(null)}>
            <Forma nodo={n} />
            {n.lineas.map((t, i) => (
              <text key={t} x={n.cx} y={n.cy + (i - (n.lineas.length - 1) / 2) * 16}>{t}</text>
            ))}
          </g>
        ))}
      </svg>
    </figure>
  );
}

// CSS: copia las reglas .card, h1, p, svg, .edge, .arrow, .lbl, .node, .term, .dec, .hot, :focus-visible y .active de la pestaña HTML + CSS.
