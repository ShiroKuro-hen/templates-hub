import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

const NODOS = [
  { x: 10, y: 100, w: 80, t: 'Cliente', s: 'Web y móvil' }, { x: 140, y: 100, w: 100, t: 'API Gateway', s: 'Autenticación', g: true },
  { x: 300, y: 20, w: 90, t: 'Usuarios', s: '12 ms' }, { x: 300, y: 100, w: 90, t: 'Pagos', s: '48 ms' }, { x: 300, y: 180, w: 90, t: 'Informes', s: '120 ms' },
];
const ALT = 'Cliente, API Gateway y tres servicios: Usuarios, Pagos e Informes';

// Requiere <linearGradient id="gr"> y <marker id="ah"> en el documento (ver pestaña HTML + CSS).
function Sprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient>
        <marker id="ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" style={{ fill: 'var(--muted)' }} /></marker>
        <symbol id="diag" viewBox="0 0 400 240">
          {NODOS.map((n) => (
            <g key={n.t}>
              <rect className={n.g ? 'g' : 'n'} x={n.x} y={n.y} width={n.w} height="40" rx="8" />
              <text className="t" x={n.x + n.w / 2} y={n.y + 18} textAnchor="middle">{n.t}</text>
              <text className="s" x={n.x + n.w / 2} y={n.y + 31} textAnchor="middle">{n.s}</text>
            </g>
          ))}
          {['M90 120H140', 'M240 120C270 120 270 40 300 40', 'M240 120H300', 'M240 120C270 120 270 200 300 200'].map((d) => <path key={d} className="l" d={d} />)}
        </symbol>
      </defs>
    </svg>
  );
}

export function VistaAmpliada() {
  const dlg = useRef<HTMLDialogElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const drag = useRef<[number, number] | null>(null);
  const [z, setZoom] = useState(100);

  function zoom(v: number) {
    const el = view.current!;
    const rx = (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth, ry = (el.scrollTop + el.clientHeight / 2) / el.scrollHeight;
    setZoom(Math.min(400, Math.max(100, v)));
    requestAnimationFrame(() => { // tras aplicar el nuevo ancho
      el.scrollLeft = rx * el.scrollWidth - el.clientWidth / 2;
      el.scrollTop = ry * el.scrollHeight - el.clientHeight / 2;
    });
  }
  const teclas = (e: KeyboardEvent) => (e.key === '+' || e.key === '=' ? zoom(z + 25) : e.key === '-' ? zoom(z - 25) : e.key === '0' && zoom(100));
  const arrastrar = (e: PointerEvent<HTMLDivElement>) => {
    const el = view.current!;
    if (e.type === 'pointerdown' && e.pointerType === 'mouse') { drag.current = [e.clientX + el.scrollLeft, e.clientY + el.scrollTop]; el.setPointerCapture(e.pointerId); }
    else if (e.type === 'pointermove' && drag.current) { el.scrollLeft = drag.current[0] - e.clientX; el.scrollTop = drag.current[1] - e.clientY; }
    else if (e.type !== 'pointermove') drag.current = null;
  };

  return (
    <>
      <Sprite />
      <div className="card">
        <h1>Arquitectura del servicio</h1>
        <p>Cómo viaja una solicitud desde el cliente hasta cada servicio.</p>
        <button className="thumb" type="button" aria-label="Ampliar diagrama de arquitectura" onClick={() => { dlg.current?.showModal(); zoom(100); }}>
          <svg viewBox="0 0 400 240" role="img" aria-label={ALT}><use href="#diag" width="400" height="240" /></svg><span>Ampliar</span>
        </button>
      </div>
      <dialog ref={dlg} aria-labelledby="lb-titulo" onKeyDown={teclas} onClick={(e) => e.target === dlg.current && dlg.current.close()}>
        <div className="hd"><h2 id="lb-titulo">Arquitectura del servicio</h2><button className="btn" type="button" aria-label="Cerrar" onClick={() => dlg.current?.close()}>×</button></div>
        <div className="view" ref={view} tabIndex={0} role="region" aria-label="Diagrama ampliado. Usa las flechas para desplazarte."
             onPointerDown={arrastrar} onPointerMove={arrastrar} onPointerUp={arrastrar} onPointerCancel={arrastrar}>
          <svg viewBox="0 0 400 240" role="img" aria-label={ALT} style={{ width: `${z}%` }}><use href="#diag" width="400" height="240" /></svg>
        </div>
        <div className="bar">
          <button className="btn" type="button" aria-label="Alejar" onClick={() => zoom(z - 25)}>−</button>
          <input type="range" min={100} max={400} step={25} value={z} aria-label="Nivel de zoom" onChange={(e) => zoom(+e.target.value)} />
          <button className="btn" type="button" aria-label="Acercar" onClick={() => zoom(z + 25)}>+</button>
          <output aria-live="polite">{z} %</output>
          <button className="btn" type="button" onClick={() => zoom(100)}>Restablecer</button>
        </div>
      </dialog>
    </>
  );
}

// CSS: copia las reglas .card, .thumb, .n/.g/.t/.s/.l, dialog, .view, .bar y .btn de la pestaña HTML + CSS.
