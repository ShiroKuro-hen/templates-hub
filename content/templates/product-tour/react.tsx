import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type Step = { id: string; title: string; body: string };
const STEPS: Step[] = [
  { id: 't1', title: 'Busca en todo el panel', body: 'Encuentra pedidos, clientes y facturas con unas pocas letras.' },
  { id: 't2', title: 'Crea un panel nuevo', body: 'Empieza en blanco o parte de una plantilla de ventas.' },
  { id: 't3', title: 'Revisa tus avisos', body: 'Aquí llegan las alertas cuando una métrica cambia.' },
];

export function ProductTour({ steps = STEPS }: { steps?: Step[] }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const last = i === steps.length - 1;
  const hl = (id: string) => (open && steps[i].id === id ? ' hl' : '');

  const go = (n: number) => { setI(n); next.current?.focus({ preventScroll: true }); };
  const end = () => setOpen(false);

  useLayoutEffect(() => {
    const s = stage.current, p = pop.current;
    const el = s?.querySelector<HTMLElement>(`#${steps[i].id}`);
    if (!open || !s || !p || !el) return;
    const sr = s.getBoundingClientRect(), r = el.getBoundingClientRect();
    const x = Math.max(16, Math.min(r.left - sr.left, sr.width - p.offsetWidth - 16));
    const ax = Math.min(Math.max(r.left - sr.left + r.width / 2 - x - 5, 12), p.offsetWidth - 24);
    p.style.cssText = `left:${x}px;top:${r.bottom - sr.top + 14}px;--ax:${ax}px`;
  }, [i, open, steps]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') end();
      else if (e.key === 'ArrowRight' && i < steps.length - 1) go(i + 1);
      else if (e.key === 'ArrowLeft' && i > 0) go(i - 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  return (
    <div className="stage" ref={stage}>
      <div className="tools">
        <button type="button" id="t1" className={`ctl grow${hl('t1')}`}>Buscar pedidos, clientes…</button>
        <button type="button" id="t2" className={`ctl main${hl('t2')}`}>Nuevo panel</button>
        <button type="button" id="t3" className={`ctl${hl('t3')}`} aria-label="Notificaciones, 3 nuevas">Avisos (3)</button>
      </div>
      <div className="sk" style={{ width: '60%' }} /><div className="sk" style={{ width: '85%' }} />
      {!open && <button type="button" className="ctl" id="again" autoFocus onClick={() => { setI(0); setOpen(true); }}>Repetir recorrido</button>}
      <div className="pop" ref={pop} role="dialog" aria-labelledby="tt" aria-describedby="tb" hidden={!open}>
        <h3 id="tt">{steps[i].title}</h3>
        <p id="tb">{steps[i].body}</p>
        <div className="row">
          <small>Paso {i + 1} de {steps.length}</small>
          <span className="dots" aria-hidden="true">{steps.map((s, k) => <i key={s.id} className={k === i ? 'on' : undefined} />)}</span>
        </div>
        <div className="btns">
          <button type="button" className="ctl" disabled={i === 0} onClick={() => go(i - 1)}>Anterior</button>
          <button type="button" className="ctl main" ref={next} onClick={() => (last ? end() : go(i + 1))}>{last ? 'Terminar' : 'Siguiente'}</button>
          <button type="button" className="link" onClick={end}>Omitir</button>
        </div>
        <p className="hint"><kbd>←</kbd> <kbd>→</kbd> para navegar, <kbd>Esc</kbd> para cerrar</p>
      </div>
    </div>
  );
}

// CSS: copia las reglas .stage, .ctl, .hl, .pop, .dots, .btns, .hint y kbd de la pestaña HTML + CSS.
