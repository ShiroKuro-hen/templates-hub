import { useState } from 'react';

type Tone = 'accent' | 'ok' | 'warn' | 'info' | 'err';
type Branch = { id: string; name: string; tone: Tone; x: number; y: number; leaves: [text: string, x: number, y: number][] };
type Point = [number, number];

const BRANCHES: Branch[] = [
  { id: 'producto', name: 'Producto', tone: 'accent', x: 380, y: 110, leaves: [['Catálogo', 200, 50], ['Inventario', 560, 50]] },
  { id: 'clientes', name: 'Clientes', tone: 'ok', x: 640, y: 190, leaves: [['Cuentas', 640, 250], ['Soporte', 640, 300]] },
  { id: 'ventas', name: 'Ventas', tone: 'warn', x: 620, y: 410, leaves: [['Pedidos', 530, 500], ['Cobros', 690, 500]] },
  { id: 'operaciones', name: 'Operaciones', tone: 'info', x: 140, y: 410, leaves: [['Logística', 75, 500], ['Compras', 230, 500]] },
  { id: 'equipo', name: 'Equipo', tone: 'err', x: 120, y: 190, leaves: [['Roles', 80, 120], ['Formación', 80, 280]] },
];
const CENTER: Point = [380, 280];

const curve = ([x1, y1]: Point, [x2, y2]: Point) => {
  const k = 0.18, dx = x2 - x1, dy = y2 - y1;
  return `M${x1},${y1} Q${(x1 + x2) / 2 - dy * k},${(y1 + y2) / 2 + dx * k} ${x2},${y2}`;
};

export function MindMap({ branches = BRANCHES }: { branches?: Branch[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const focus = hover ?? pinned;
  const cls = (id: string, base: string) => (focus === id ? `${base} on` : base);
  const toggle = (id: string) => setPinned((p) => (p === id ? null : id));

  return (
    <figure className="card">
      <figcaption>
        <h2>Mapa mental de la tienda online</h2>
        <p>Cinco ramas principales con sus áreas. Pasa el cursor o enfoca una rama para destacarla; Enter la fija.</p>
      </figcaption>
      <div className="scroll" role="region" tabIndex={0} aria-label="Diagrama desplazable horizontalmente">
      <svg className={focus ? 'active' : undefined} viewBox="0 0 760 560" role="img" aria-labelledby="map-t map-d">
        <title id="map-t">Mapa mental de la tienda online</title>
        <desc id="map-d">Tema central Tienda online con cinco ramas: Producto, Clientes, Ventas, Operaciones y Equipo, cada una con dos áreas.</desc>
        {branches.map((b) => (
          <g key={`links-${b.id}`}>
            <path className={cls(b.id, 'link')} style={{ stroke: `var(--${b.tone})` }} d={curve(CENTER, [b.x, b.y])} />
            {b.leaves.map(([, x, y]) => (
              <path key={`${x}-${y}`} className={cls(b.id, 'link')} style={{ stroke: `var(--${b.tone})` }} d={curve([b.x, b.y], [x, y])} />
            ))}
          </g>
        ))}
        <g className="center">
          <rect className="shape" x={292} y={252} width={176} height={56} rx={28} />
          <text className="label" x={380} y={285} textAnchor="middle">Tienda online</text>
        </g>
        {branches.map((b) => (
          <g key={b.id}>
            <g className={cls(b.id, 'branch')} role="button" tabIndex={0} aria-pressed={pinned === b.id} aria-label={`Rama ${b.name}`}
               onMouseEnter={() => setHover(b.id)} onMouseLeave={() => setHover(null)}
               onFocus={() => setHover(b.id)} onBlur={() => setHover(null)} onClick={() => toggle(b.id)}
               onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(b.id); } }}>
              <rect className="shape" x={b.x - 75} y={b.y - 18} width={150} height={36} rx={18}
                    style={{ fill: `var(--${b.tone}-soft)`, stroke: `var(--${b.tone})` }} />
              <text className="label" x={b.x} y={b.y + 5} textAnchor="middle">{b.name}</text>
            </g>
            {b.leaves.map(([text, x, y]) => (
              <g key={text} className={cls(b.id, 'leaf')}>
                <rect className="shape" x={x - 65} y={y - 13} width={130} height={26} rx={13} />
                <text className="label" x={x} y={y + 4} textAnchor="middle">{text}</text>
              </g>
            ))}
          </g>
        ))}
      </svg>
      </div>
    </figure>
  );
}
