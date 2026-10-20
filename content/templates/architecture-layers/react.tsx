import { useState } from 'react';

type Layer = { id: string; name: string; detail: string; tone: 'info' | 'accent' | 'ok'; via?: string };

const LAYERS: Layer[] = [
  { id: 'cliente', name: 'Cliente', detail: 'Web SPA · App móvil', tone: 'info', via: 'HTTPS' },
  { id: 'edge', name: 'Edge / CDN', detail: 'CDN · WAF · Balanceador', tone: 'info', via: 'HTTPS · JSON' },
  { id: 'api', name: 'API', detail: 'Gateway · Autenticación · REST', tone: 'accent', via: 'gRPC' },
  { id: 'servicios', name: 'Servicios', detail: 'Pedidos · Catálogo · Pagos', tone: 'accent', via: 'SQL · caché' },
  { id: 'datos', name: 'Datos', detail: 'PostgreSQL · Redis · S3', tone: 'ok' },
];
const LEGEND: [Layer['tone'], string][] = [['info', 'Entrada'], ['accent', 'Lógica de negocio'], ['ok', 'Persistencia']];
const Y = (i: number) => 20 + i * 100;

export function ArchitectureLayers({ layers = LAYERS }: { layers?: Layer[] }) {
  const [active, setActive] = useState<number | null>(null);
  const nodeOn = (i: number) => active !== null && Math.abs(i - active) <= 1;
  const edgeOn = (i: number) => active === i || active === i + 1;

  return (
    <figure className="card">
      <figcaption>
        <h2>Arquitectura por capas</h2>
        <p>Cada capa solo llama a la inmediatamente inferior. Pasa el cursor o enfoca una capa para ver sus dependencias.</p>
      </figcaption>
      <div className="scroll" role="region" tabIndex={0} aria-label="Diagrama desplazable horizontalmente">
      <svg className={active !== null ? 'active' : undefined} viewBox="0 0 560 500" role="img" aria-labelledby="arch-t arch-d">
        <title id="arch-t">Arquitectura en cinco capas</title>
        <desc id="arch-d">Cliente, Edge y CDN, API, Servicios y Datos, unidas de arriba abajo por flechas que indican la dependencia.</desc>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" style={{ fill: 'var(--muted)' }} />
          </marker>
          <marker id="arr-hl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" style={{ fill: 'var(--accent)' }} />
          </marker>
        </defs>
        {layers.slice(0, -1).map((l, i) => (
          <g key={`edge-${l.id}`}>
            <path className={edgeOn(i) ? 'edge hl' : 'edge'} d={`M280,${Y(i) + 56} V${Y(i + 1)}`} />
            <text className={edgeOn(i) ? 'lb hl' : 'lb'} x={292} y={Y(i) + 82}>{l.via}</text>
          </g>
        ))}
        {layers.map((l, i) => (
          <g key={l.id} className={nodeOn(i) ? 'node hl' : 'node'} tabIndex={0} role="group" aria-label={`${l.name}: ${l.detail}`}
             onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
             onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
            <rect className="box" x={40} y={Y(i)} width={480} height={56} rx={6} />
            <rect x={40} y={Y(i)} width={4} height={56} style={{ fill: `var(--${l.tone})` }} />
            <text className="name" x={60} y={Y(i) + 24}>{l.name}</text>
            <text className="detail" x={60} y={Y(i) + 44}>{l.detail}</text>
          </g>
        ))}
      </svg>
      </div>
      <ul className="legend" aria-label="Leyenda">
        {LEGEND.map(([tone, label]) => (
          <li key={tone}><i style={{ ['--c' as string]: `var(--${tone})` }} />{label}</li>
        ))}
      </ul>
    </figure>
  );
}
