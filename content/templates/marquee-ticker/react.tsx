import { useState, type CSSProperties } from 'react';

const LOGOS = ['Norte Labs', 'Vértice', 'Kairos', 'Alba Cloud', 'Órbita', 'Lumen', 'Pivote', 'Sierra Data'];
const AVISOS = [
  { tono: 'on', texto: 'Todos los sistemas operativos' },
  { tono: 'info', texto: 'Nueva región disponible: Santiago' },
  { tono: 'warn', texto: 'Mantenimiento el 14 oct a las 02:00 (30 min)' },
  { tono: 'ok', texto: 'API v3 estable desde el 28 sep' },
  { tono: 'info', texto: 'Webinar de seguridad el jueves a las 17:00' },
];
const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Dos copias de la lista (la segunda oculta a lectores) dan el bucle sin saltos.
function Cinta({ label, rev, dur, children }: { label: string; rev?: boolean; dur: number; children: (copia: boolean) => JSX.Element }) {
  return (
    <div className={`marquee${rev ? ' rev' : ''}`} role="group" aria-label={label}>
      <div className="track" style={{ '--d': `${dur}s` } as CSSProperties}>
        {children(false)}
        {!calm && children(true)}
      </div>
    </div>
  );
}

export function MarqueeTicker() {
  const [paused, setPaused] = useState(false);
  return (
    <section className={`panel${calm ? '' : ' live'}`} {...(paused ? { 'data-paused': '' } : {})}>
      <div className="head">
        <div><h1>Empresas que usan Aurora</h1><p>La cinta se detiene al pasar el cursor o al enfocar un logo.</p></div>
        {!calm && <button className="btn" type="button" onClick={() => setPaused(!paused)}>{paused ? 'Reanudar' : 'Pausar'}</button>}
      </div>
      <Cinta label="Clientes" dur={34}>
        {(copia) => (
          <ul aria-hidden={copia || undefined}>
            {LOGOS.map((n) => <li key={n}><a className="logo" href="#" tabIndex={copia ? -1 : undefined}>{n}</a></li>)}
          </ul>
        )}
      </Cinta>
      <Cinta label="Estado del servicio" rev dur={44}>
        {(copia) => (
          <ul aria-hidden={copia || undefined}>
            {AVISOS.map((a) => <li key={a.texto} className="msg"><span className={`dot ${a.tono}`} />{a.texto}</li>)}
          </ul>
        )}
      </Cinta>
    </section>
  );
}

// CSS: copia las reglas .panel, .head, .btn, .track, .logo, .msg, .dot y .live de la pestaña HTML + CSS (los iconos SVG de cada logo son opcionales).
