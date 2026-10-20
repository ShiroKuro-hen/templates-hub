import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

type Estado = 'curso' | 'riesgo' | 'listo';
type Proyecto = {
  id: string; titulo: string; responsable: string; estado: Estado; avance: number;
  entrega: string; presupuesto: string; equipo: string; descripcion: string;
};

const ETIQUETA: Record<Estado, [string, string]> = { curso: ['En curso', 'badge'], riesgo: ['En riesgo', 'badge warn'], listo: ['Completado', 'badge ok'] };

const PROYECTOS: Proyecto[] = [
  { id: 'nube', titulo: 'Migración a la nube', responsable: 'Marta Ruiz', estado: 'curso', avance: 68, entrega: '30 abr 2026',
    presupuesto: 'S/ 84.000', equipo: '7 personas', descripcion: 'Traslado de servidores y bases de datos a la nube, por fases y sin cortes de servicio.' },
  { id: 'panel', titulo: 'Rediseño del panel de clientes', responsable: 'Luis Gómez', estado: 'riesgo', avance: 41, entrega: '18 may 2026',
    presupuesto: 'S/ 52.500', equipo: '4 personas', descripcion: 'Nueva vista de cuentas y actividad para el equipo comercial, con filtros por región.' },
  { id: 'audit', titulo: 'Auditoría de seguridad anual', responsable: 'Carlos Díaz', estado: 'listo', avance: 100, entrega: '28 feb 2026',
    presupuesto: 'S/ 31.200', equipo: '3 personas', descripcion: 'Revisión de accesos, dependencias y configuración, con informe final firmado.' },
];

const EASE = 'cubic-bezier(.2,.7,.2,1)';
const mapTo = (src: DOMRect, dst: DOMRect) =>
  `translate(${dst.left - src.left}px, ${dst.top - src.top}px) scale(${dst.width / src.width}, ${dst.height / src.height})`;

export function SharedElementFlip({ proyectos = PROYECTOS }: { proyectos?: Proyecto[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const grid = useRef<HTMLUListElement>(null);
  const detail = useRef<HTMLElement>(null);
  const active = useRef<HTMLElement | null>(null);
  const current = proyectos.find((p) => p.id === openId);

  const animate = (keyframes: Keyframe[]) => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    return detail.current!.animate(keyframes, { duration: reduced ? 0 : 320, easing: EASE });
  };

  function open(p: Proyecto, card: HTMLElement) {
    detail.current?.getAnimations().forEach((a) => a.cancel());
    const first = card.getBoundingClientRect();
    flushSync(() => setOpenId(p.id));
    active.current = card;
    grid.current!.toggleAttribute('inert', true);
    card.style.visibility = 'hidden';
    const last = detail.current!.getBoundingClientRect();
    animate([{ transform: mapTo(last, first), opacity: 0.6 }, { transform: 'none', opacity: 1 }]);
    detail.current!.querySelector<HTMLElement>('button')?.focus();
  }

  function close() {
    const card = active.current;
    if (!card) return;
    active.current = null;
    detail.current!.getAnimations().forEach((a) => a.cancel());
    const first = detail.current!.getBoundingClientRect();
    card.style.visibility = '';
    const last = card.getBoundingClientRect();
    animate([{ transform: 'none', opacity: 1 }, { transform: mapTo(first, last), opacity: 0 }]).onfinish = () => {
      grid.current!.toggleAttribute('inert', false);
      card.focus();
      setOpenId(null);
    };
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  return (
    <>
      <ul ref={grid} className="grid">
        {proyectos.map((p) => {
          const [etiqueta, clase] = ETIQUETA[p.estado];
          return (
            <li key={p.id}>
              <button type="button" className="card" aria-haspopup="dialog" onClick={(e) => open(p, e.currentTarget)}>
                <span className="ttl">{p.titulo}</span>
                <span className="own">Responsable: {p.responsable}</span>
                <span className={clase}>{etiqueta}</span>
                <span className="bar"><i style={{ ['--p' as string]: p.avance }} />{p.avance}% completado</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="layer" hidden={openId === null} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <section ref={detail} className="detail" role="dialog" aria-modal="true" aria-labelledby="detail-title">
          {current && (
            <>
              <div className="det-head">
                <div>
                  <h2 id="detail-title">{current.titulo}</h2>
                  <span className="own">Responsable: {current.responsable}</span>
                </div>
                <button type="button" className="close" aria-label="Cerrar" onClick={close}>×</button>
              </div>
              <p>{current.descripcion}</p>
              <dl>
                <div><dt>Entrega</dt><dd>{current.entrega}</dd></div>
                <div><dt>Presupuesto</dt><dd>{current.presupuesto}</dd></div>
                <div><dt>Equipo</dt><dd>{current.equipo}</dd></div>
              </dl>
            </>
          )}
        </section>
      </div>
    </>
  );
}
// CSS: copia las reglas :root, .grid, .card (y :hover), .ttl, .own, .badge (y .warn/.ok), .bar, .layer, [hidden], .detail, .det-head, .close, p, dl/dt/dd, :focus-visible y @media de la pestaña HTML + CSS.
