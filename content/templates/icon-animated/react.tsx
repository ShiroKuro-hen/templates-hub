import { useState } from 'react';
import type { CSSProperties } from 'react';

const d = (dl: string) => ({ '--dl': dl }) as CSSProperties;

// Reinicia la animación: apaga la clase "run" un fotograma y la vuelve a encender.
function useReplay() {
  const [run, setRun] = useState(true);
  const replay = () => { setRun(false); requestAnimationFrame(() => setRun(true)); };
  return [run, replay] as const;
}

export function IconAnimated() {
  const [okRun, okReplay] = useReplay();
  const [errRun, errReplay] = useReplay();
  const [copied, setCopied] = useState(false);
  const [label, setLabel] = useState('Copiar enlace');

  const copy = async () => {
    try { await navigator.clipboard.writeText('https://app.ejemplo.com/informes/q3'); setLabel('Copiado'); setCopied(true); }
    catch { setLabel('No se pudo copiar'); }
    setTimeout(() => { setLabel('Copiar enlace'); setCopied(false); }, 1600);
  };

  return (
    <div className="grid">
      <article>
        <div className="vis load"><svg role="img" aria-label="Cargando" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" opacity=".2" />
          <circle cx="12" cy="12" r="9" pathLength={1} strokeDasharray=".28 .72" />
        </svg></div>
        <h3>Cargando</h3><p>Gira mientras la tarea sigue en curso.</p>
      </article>
      <article>
        <div className={`vis ok${okRun ? ' run' : ''}`}><svg aria-hidden="true" viewBox="0 0 24 24">
          <circle className="d" pathLength={1} cx="12" cy="12" r="10" />
          <path className="d" pathLength={1} d="m7.5 12.5 3 3 6-6.5" style={d('.3s')} />
        </svg></div>
        <h3>Éxito</h3><p>El trazo se dibuja al confirmar.</p>
        <button type="button" onClick={okReplay}>Repetir animación</button>
      </article>
      <article>
        <div className={`vis err${errRun ? ' run' : ''}`}><svg aria-hidden="true" viewBox="0 0 24 24">
          <circle className="d" pathLength={1} cx="12" cy="12" r="10" />
          <path className="d" pathLength={1} d="m9 9 6 6" style={d('.3s')} />
          <path className="d" pathLength={1} d="m15 9-6 6" style={d('.4s')} />
        </svg></div>
        <h3>Error</h3><p>Se dibuja y vibra una vez.</p>
        <button type="button" onClick={errReplay}>Repetir animación</button>
      </article>
      <article>
        <div className={`vis cp${copied ? ' run' : ''}`}><svg aria-hidden="true" viewBox="0 0 24 24">
          <g className="a"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></g>
          <path className="b" d="m5 12.5 4.5 4.5L19 7.5" />
        </svg></div>
        <h3>Copiar</h3><p>Cambia a una marca al copiar.</p>
        <button type="button" aria-live="polite" onClick={copy}>{label}</button>
      </article>
    </div>
  );
}
// CSS: copia las reglas .grid, article, .vis, svg, .d, .run, .cp y @keyframes (spin, draw, shake) de la pestaña HTML + CSS.
