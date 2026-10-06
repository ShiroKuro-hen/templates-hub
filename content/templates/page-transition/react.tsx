import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

const VISTAS = [
  { tab: 'Resumen', titulo: 'Resumen del equipo', texto: 'Actividad de las últimas 24 horas en todos tus proyectos.', filas: [['Despliegues', '18'], ['Incidencias abiertas', '2'], ['Cobertura de pruebas', '91 %']] },
  { tab: 'Proyectos', titulo: 'Proyectos activos', texto: 'Tres proyectos con entregas este mes.', filas: [['Portal de clientes', 'En curso'], ['App móvil', 'En revisión'], ['API pública', 'Estable']] },
  { tab: 'Ajustes', titulo: 'Ajustes del espacio', texto: 'Define quién puede ver y editar cada proyecto.', filas: [['Miembros', '12'], ['Roles personalizados', '3'], ['Verificación en dos pasos', 'Activa']] },
];
type VT = Document & { startViewTransition?: (cb: () => void) => unknown };
const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function PageTransition() {
  const [cur, setCur] = useState(0);
  const main = useRef<HTMLElement>(null);

  function go(k: number) {
    if (k === cur) return;
    const dir = k > cur ? 1 : -1, doc = document as VT;
    document.documentElement.style.setProperty('--d', String(dir));
    if (calm) setCur(k);                                                   // alternativa estática
    else if (doc.startViewTransition) doc.startViewTransition(() => flushSync(() => setCur(k)));
    else {                                                                 // alternativa: Web Animations
      setCur(k);
      main.current?.animate([{ opacity: 0, transform: `translateX(${dir * 24}px)` }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'ease' });
    }
  }

  const v = VISTAS[cur];
  return (
    <div className="app">
      <nav className="tabs" aria-label="Vistas">
        {VISTAS.map((x, k) => (
          <button key={x.tab} className="tab" type="button" aria-current={k === cur ? 'page' : undefined} onClick={() => go(k)}>{x.tab}</button>
        ))}
      </nav>
      <main className="view" ref={main} aria-live="polite">
        <h2>{v.titulo}</h2><p>{v.texto}</p>
        <dl className="rows">{v.filas.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
      </main>
    </div>
  );
}

// CSS: copia las reglas .tabs, .tab, .view (con view-transition-name), .rows y los ::view-transition-* de la pestaña HTML + CSS.
