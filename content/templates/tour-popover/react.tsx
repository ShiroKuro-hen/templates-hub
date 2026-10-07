import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

type Paso = { id: string; titulo: string; texto: string; lado: 'right' | 'bottom' };

const PASOS: Paso[] = [
  { id: 't-rep', titulo: 'Informes', texto: 'Cruza ingresos y usuarios por periodo y exporta a PDF o CSV.', lado: 'right' },
  { id: 't-eq', titulo: 'Equipo', texto: 'Invita a tus compañeros y define quién puede editar.', lado: 'right' },
  { id: 't-bus', titulo: 'Búsqueda', texto: 'Encuentra proyectos, informes y personas por nombre.', lado: 'bottom' },
  { id: 't-kpi', titulo: 'Tus métricas', texto: 'Cada tarjeta resume un indicador clave del mes.', lado: 'bottom' },
];

export function TourPopover({ pasos = PASOS }: { pasos?: Paso[] }) {
  const [i, setI] = useState<number | null>(0); // null = recorrido cerrado
  const pop = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const start = useRef<HTMLButtonElement>(null);
  const ultimo = pasos.length - 1;

  useEffect(() => { // muestra, ancla el popover y mueve el foco
    const p = pop.current!;
    if (i === null) { if (p.matches(':popover-open')) p.hidePopover(); return; }
    if (!p.matches(':popover-open')) p.showPopover();
    const t = document.getElementById(pasos[i].id)!.getBoundingClientRect(), s = stage.current!.getBoundingClientRect();
    const w = p.offsetWidth, h = p.offsetHeight, right = pasos[i].lado === 'right' && innerWidth >= 520;
    Object.assign(spot.current!.style, { left: `${t.left - s.left - 4}px`, top: `${t.top - s.top - 4}px`, width: `${t.width + 8}px`, height: `${t.height + 8}px` });
    let x = right ? t.right + 16 : t.left + t.width / 2 - w / 2, y = right ? t.top + t.height / 2 - h / 2 : t.bottom + 16;
    if (!right && y + h > innerHeight - 8) y = t.top - h - 16;
    p.style.left = `${Math.max(8, Math.min(x, innerWidth - w - 8))}px`;
    p.style.top = `${Math.max(8, Math.min(y, innerHeight - h - 8))}px`;
  }, [i, pasos]);

  const teclas = (e: KeyboardEvent) => {
    if (i === null) return;
    if (e.key === 'ArrowRight') setI(Math.min(ultimo, i + 1));
    if (e.key === 'ArrowLeft') setI(Math.max(0, i - 1));
  };
  const paso = i === null ? null : pasos[i];

  return (
    <>
      <div className="stage" ref={stage}>
        <nav className="side" aria-label="Navegación principal"><ul>
          <li className="on">Panel</li><li id="t-rep">Informes</li><li id="t-eq">Equipo</li>
        </ul></nav>
        <main>
          <div className="top">
            <input id="t-bus" type="search" placeholder="Buscar proyectos y personas" aria-label="Buscar" />
            <button className="btn main" type="button" ref={start} onClick={() => setI(0)}>Iniciar recorrido</button>
          </div>
          <div className="kpis">
            <div className="kpi" id="t-kpi"><small>Ingresos del mes</small><b>$ 48.200</b></div>
            <div className="kpi"><small>Usuarios activos</small><b>3.412</b></div>
          </div>
        </main>
        <div className="spot" ref={spot} hidden={i === null} />
      </div>
      <div id="pop" ref={pop} popover="auto" role="dialog" aria-labelledby="pt" onKeyDown={teclas}
           onToggle={(e) => { if (!e.currentTarget.matches(':popover-open') && i !== null) { setI(null); start.current?.focus(); } }}>
        <div className="seg" aria-hidden="true">{pasos.map((p, k) => <i key={p.id} className={i !== null && k <= i ? 'on' : ''} />)}</div>
        <p className="step">Paso <span>{(i ?? 0) + 1}</span> de {pasos.length}</p>
        <div aria-live="polite"><h3 id="pt">{paso?.titulo}</h3><p>{paso?.texto}</p></div>
        <div className="acts">
          <button className="link" type="button" onClick={() => setI(null)}>Omitir</button>
          <button className="btn" type="button" disabled={i === 0} onClick={() => setI(Math.max(0, (i ?? 0) - 1))}>Anterior</button>
          <button className="btn main" type="button" autoFocus onClick={() => setI(i === ultimo ? null : (i ?? 0) + 1)}>
            {i === ultimo ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </>
  );
}

// CSS: copia las reglas .stage, .side, main, .kpi, .btn, .spot, #pop, .seg y .acts de la pestaña HTML + CSS.
