import { KeyboardEvent, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

const PANELS = [
  { tab: 'Resumen', titulo: 'Resumen del equipo', texto: 'Actividad de las últimas 24 horas en todos tus proyectos.', items: ['Despliegues: 18', 'Incidencias abiertas: 2', 'Cobertura de pruebas: 91 %'] },
  { tab: 'Equipo', titulo: 'Miembros del equipo', texto: 'Personas con acceso a este espacio de trabajo.', items: ['Ana Pérez · Administradora', 'Luis Gómez · Editor', 'Marta Ruiz · Lectora'] },
  { tab: 'Facturación', titulo: 'Facturación', texto: 'Plan y próximos cobros de tu organización.', items: ['Plan: Profesional (anual)', 'Próximo cobro: 5 de enero', 'Pago con tarjeta terminada en 4821'] },
];

type VT = Document & { startViewTransition?: (cb: () => void) => unknown };
const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function targetIndex(key: string, cur: number, n: number): number | undefined {
  switch (key) {
    case 'ArrowRight': return (cur + 1) % n;
    case 'ArrowLeft': return (cur + n - 1) % n;
    case 'Home': return 0;
    case 'End': return n - 1;
    default: return undefined;
  }
}

export function TabContentSlide() {
  const [cur, setCur] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLElement>(null);

  function select(k: number) {
    if (k === cur) return;
    const dir = Math.sign(k - cur), doc = document as VT;
    document.documentElement.style.setProperty('--d', String(dir));
    if (calm) setCur(k);
    else if (doc.startViewTransition) doc.startViewTransition(() => flushSync(() => setCur(k)));
    else {
      setCur(k);
      panel.current?.animate([{ opacity: 0, transform: `translateX(${dir * 24}px)` }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'ease' });
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const k = targetIndex(e.key, cur, PANELS.length);
    if (k === undefined) return;
    e.preventDefault();
    select(k);
    tabs.current[k]?.focus();
  }

  const v = PANELS[cur];
  return (
    <div className="app">
      <div className="tabs" role="tablist" aria-label="Secciones" onKeyDown={onKeyDown}>
        {PANELS.map((p, k) => (
          <button
            key={p.tab}
            ref={(el) => {
              tabs.current[k] = el;
            }}
            id={`t${k}`}
            className="tab"
            role="tab"
            type="button"
            aria-controls="panel"
            aria-selected={k === cur}
            tabIndex={k === cur ? 0 : -1}
            onClick={() => select(k)}
          >
            {p.tab}
          </button>
        ))}
      </div>
      <section ref={panel} id="panel" className="panel" role="tabpanel" aria-labelledby={`t${cur}`} tabIndex={0}>
        <h2>{v.titulo}</h2>
        <p>{v.texto}</p>
        <ul>
          {v.items.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </section>
    </div>
  );
}
// CSS: copia las reglas .app, .tabs, .tab, .panel (con view-transition-name), h2, p, ul, li, html{--d} y los ::view-transition-* de la pestaña HTML + CSS.
