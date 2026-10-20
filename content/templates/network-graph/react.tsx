import { useState } from 'react';

type Tipo = 'servicio' | 'almacen' | 'cola';
type Nodo = { id: string; nombre: string; tipo: Tipo; cx: number; cy: number };
type Enlace = { de: string; a: string; d: string };

const TIPOS: Record<Tipo, string> = { servicio: 'Servicio', almacen: 'Almacén de datos', cola: 'Cola de mensajes' };
const NODOS: Nodo[] = [
  { id: 'cdn', nombre: 'CDN', tipo: 'servicio', cx: 110, cy: 240 },
  { id: 'api', nombre: 'API', tipo: 'servicio', cx: 300, cy: 240 },
  { id: 'auth', nombre: 'Auth', tipo: 'servicio', cx: 300, cy: 100 },
  { id: 'cache', nombre: 'Caché', tipo: 'almacen', cx: 300, cy: 380 },
  { id: 'cola', nombre: 'Cola', tipo: 'cola', cx: 490, cy: 240 },
  { id: 'w1', nombre: 'Worker 1', tipo: 'servicio', cx: 680, cy: 100 },
  { id: 'w2', nombre: 'Worker 2', tipo: 'servicio', cx: 680, cy: 380 },
  { id: 'db', nombre: 'Base de datos', tipo: 'almacen', cx: 680, cy: 240 },
];
const ENLACES: Enlace[] = [
  { de: 'cdn', a: 'api', d: 'M185 240H225' },
  { de: 'api', a: 'auth', d: 'M300 210V130' },
  { de: 'api', a: 'cache', d: 'M300 270V348' },
  { de: 'api', a: 'cola', d: 'M375 240H420' },
  { de: 'cola', a: 'w1', d: 'M490 214V100H605' },
  { de: 'cola', a: 'w2', d: 'M490 266V380H605' },
  { de: 'w1', a: 'db', d: 'M680 130V208' },
  { de: 'w2', a: 'db', d: 'M680 350V272' },
];

const cilindro = (x: number, y: number) =>
  `M${x} ${y + 8}A75 8 0 0 0 ${x + 150} ${y + 8}V${y + 56}A75 8 0 0 1 ${x} ${y + 56}Z`;
const tapa = (x: number, y: number) => `M${x} ${y + 8}A75 8 0 0 1 ${x + 150} ${y + 8}A75 8 0 0 1 ${x} ${y + 8}Z`;

function Forma({ nodo }: { nodo: Nodo }) {
  const { cx, cy, tipo } = nodo;
  if (tipo === 'cola') return <rect className="forma" x={cx - 70} y={cy - 26} width={140} height={52} rx={26} />;
  if (tipo === 'almacen') {
    return (
      <>
        <path className="forma" d={cilindro(cx - 75, cy - 32)} />
        <path className="forma" d={tapa(cx - 75, cy - 32)} />
      </>
    );
  }
  return <rect className="forma" x={cx - 75} y={cy - 30} width={150} height={60} rx={6} />;
}

export function NetworkGraph() {
  const [foco, setFoco] = useState<string | null>(null);
  const cercanos = new Set(foco ? [foco, ...ENLACES.filter((l) => l.de === foco || l.a === foco).flatMap((l) => [l.de, l.a])] : []);
  const conecta = (l: Enlace) => l.de === foco || l.a === foco;

  return (
    <figure className="card">
      <figcaption>
        <h2>Topología de servicios</h2>
        <p>Pasa el ratón o enfoca un nodo para ver con qué se conecta; el resto se atenúa.</p>
      </figcaption>
      <div className="scroll" role="region" tabIndex={0} aria-label="Diagrama desplazable horizontalmente">
      <svg id="red" className={foco ? 'active' : undefined} viewBox="0 0 800 480" role="img" aria-labelledby="red-t red-d" onPointerLeave={() => setFoco(null)}>
        <title id="red-t">Topología de servicios</title>
        <desc id="red-d">El CDN envía las peticiones a la API, que consulta Auth y Caché y encola trabajos en la Cola. Dos workers consumen la cola y escriben en la base de datos.</desc>
        <defs>
          <marker id="ah" markerUnits="userSpaceOnUse" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path className="arrow" d="M0 0L9 5L0 10z" /></marker>
          <marker id="ah-hot" markerUnits="userSpaceOnUse" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path className="arrow hot" d="M0 0L9 5L0 10z" /></marker>
        </defs>
        {ENLACES.map((l) => (
          <path key={`${l.de}-${l.a}`} className={conecta(l) ? 'link hot' : 'link'} data-de={l.de} data-a={l.a} d={l.d} />
        ))}
        {NODOS.map((n) => (
          <g key={n.id} className={['node', n.tipo, cercanos.has(n.id) ? 'on' : ''].filter(Boolean).join(' ')}
             data-node={n.id} tabIndex={0} role="group" aria-label={`${n.nombre}, ${TIPOS[n.tipo].toLowerCase()}`}
             onPointerOver={() => setFoco(n.id)} onFocus={() => setFoco(n.id)} onBlur={() => setFoco(null)}>
            <Forma nodo={n} />
            <text className="nombre" x={n.cx} y={n.cy - 3}>{n.nombre}</text>
            <text className="tipo" x={n.cx} y={n.cy + 15}>{TIPOS[n.tipo]}</text>
          </g>
        ))}
        <g className="servicio">
          <rect className="forma" x={35} y={446} width={24} height={14} rx={3} />
          <text className="leyenda" x={68} y={457}>Servicio</text>
        </g>
        <g className="almacen">
          <path className="forma" d="M150 449A12 3 0 0 0 174 449V457A12 3 0 0 1 150 457Z" />
          <path className="forma" d="M150 449A12 3 0 0 1 174 449A12 3 0 0 1 150 449Z" />
          <text className="leyenda" x={182} y={457}>Almacén de datos</text>
        </g>
        <g className="cola">
          <rect className="forma" x={300} y={446} width={24} height={14} rx={7} />
          <text className="leyenda" x={332} y={457}>Cola de mensajes</text>
        </g>
      </svg>
      </div>
    </figure>
  );
}

// CSS: copia las reglas .card, h2, p, svg, .scroll, .link, .arrow, .node, .forma, tipos, .nombre, .tipo, .leyenda y .active de la pestaña HTML + CSS.
