import { useEffect, useRef, useState } from 'react';

type Item = [nombre: string, valor: number, categoria: string];
type Tile = { d: Item; x: number; y: number; w: number; h: number };

const CATS: Record<string, [string, string]> = {
  Software: ['--accent-soft', '--accent'], Infraestructura: ['--info-soft', '--info'], Servicios: ['--ok-soft', '--ok'], Hardware: ['--warn-soft', '--warn'],
};
const ITEMS: Item[] = [
  ['Plataforma en la nube', 420, 'Infraestructura'], ['Ciberseguridad', 260, 'Software'], ['Analítica de datos', 210, 'Software'],
  ['IA aplicada', 180, 'Software'], ['Consultoría', 150, 'Servicios'], ['Redes', 120, 'Infraestructura'],
  ['Soporte gestionado', 90, 'Servicios'], ['Dispositivos', 70, 'Hardware'], ['Capacitación', 40, 'Servicios'],
];
const H = 340;
const f = (n: number) => n.toLocaleString('es');

// Partición binaria: dos mitades de peso similar, corte por el lado más largo.
function lay(a: Item[], x: number, y: number, w: number, h: number, out: Tile[]) {
  if (a.length === 1) { out.push({ d: a[0], x, y, w, h }); return; }
  const tot = a.reduce((s, i) => s + i[1], 0);
  let k = 1, acc = a[0][1];
  while (k < a.length - 1 && acc < tot / 2) acc += a[k++][1];
  const r = acc / tot;
  if (w >= h) { lay(a.slice(0, k), x, y, w * r, h, out); lay(a.slice(k), x + w * r, y, w * (1 - r), h, out); }
  else { lay(a.slice(0, k), x, y, w, h * r, out); lay(a.slice(k), x, y + h * r, w, h * (1 - r), out); }
}

export function Treemap({ items = ITEMS }: { items?: Item[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(560);
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width || 560));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);

  const total = items.reduce((a, i) => a + i[1], 0);
  const pc = (n: number) => `${((n / total) * 100).toLocaleString('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
  const tiles: Tile[] = [];
  lay(items, 0, 0, W, H, tiles);
  const d = items[sel];

  return (
    <figure className="card">
      <figcaption className="head">
        <div><h2>Ingresos por línea de negocio</h2><p>El área de cada bloque es proporcional a su aporte. Selecciona uno para ver el detalle.</p></div>
        <div className="key" aria-hidden="true">
          {Object.entries(CATS).map(([n, c]) => <span key={n}><i style={{ background: `var(${c[1]})` }} />{n}</span>)}
        </div>
      </figcaption>
      <svg ref={ref} className="map" viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Mapa de árbol de ingresos por línea de negocio">
        {tiles.map(({ d: t, x, y, w, h }, i) => {
          const [soft, ink] = CATS[t[2]];
          return (
            <svg key={t[0]} className={i === sel ? 't sel' : 't'} x={x} y={y} width={w} height={h} tabIndex={0} role="button" aria-pressed={i === sel}
                 aria-label={`${t[0]}, ${t[2]}: ${f(t[1])} millones de USD, ${pc(t[1])} del total`} onClick={() => setSel(i)}
                 onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(i))}>
              <title>{`${t[0]}: ${f(t[1])} M USD`}</title>
              <rect className="bg" x={1} y={1} width={w - 2} height={h - 2} rx={4} style={{ fill: `var(${soft})` }} />
              <rect x={1} y={1} width={w - 2} height={3} rx={1.5} style={{ fill: `var(${ink})` }} />
              {w > 80 && h > 44 && (<><text className="nm" x={10} y={26}>{t[0]}</text><text className="vl" x={10} y={44}>{`${f(t[1])} M USD, ${pc(t[1])}`}</text></>)}
            </svg>
          );
        })}
      </svg>
      <div className="detail" aria-live="polite">
        <div className="row"><span><b>{d[0]}</b><span className="cat">{d[2]}</span></span><span className="num">{f(d[1])} M USD</span></div>
        <div className="bar"><i style={{ width: `${(d[1] / total) * 100}%` }} /></div>
        <small>{pc(d[1])} de los {f(total)} M USD facturados</small>
      </div>
    </figure>
  );
}
// CSS: copia las reglas .card, .head, .key, svg.map, .t, .bg, .nm, .vl, .detail y .bar de la pestaña HTML + CSS.
