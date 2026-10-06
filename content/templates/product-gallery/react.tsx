import { useState, type KeyboardEvent } from 'react';

const VIEWS = ['Frontal', 'Perfil', 'Correa', 'Caja'];
const ART = [
  <><rect x="38" y="6" width="24" height="24" rx="6" /><rect x="38" y="70" width="24" height="24" rx="6" /><circle cx="50" cy="50" r="26" /><circle cx="50" cy="50" r="20" /><path d="M50 50V37M50 50l9 5" /></>,
  <><rect x="34" y="28" width="32" height="44" rx="8" /><rect x="66" y="45" width="7" height="10" rx="2" /><path d="M42 28L46 8h8l4 20M42 72l4 20h8l4-20" /></>,
  <><rect x="34" y="6" width="32" height="88" rx="14" />{[30, 42, 54, 66].map((y) => <circle key={y} cx="50" cy={y} r="2.5" />)}</>,
  <><rect x="14" y="34" width="72" height="42" rx="6" /><path d="M14 48h72" /><circle cx="50" cy="62" r="6" /></>,
];
const Art = ({ i }: { i: number }) => (
  <svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">{ART[i]}</svg>
);

export function ProductGallery({ label = 'Reloj Orbit S2' }: { label?: string }) {
  const [cur, setCur] = useState(0);
  const n = VIEWS.length;
  const go = (i: number) => setCur((i + n) % n);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : d !== undefined ? (cur + d + n) % n : null;
    if (next === null) return;
    e.preventDefault();
    setCur(next);
    (e.currentTarget.children[next] as HTMLElement).focus();
  }

  return (
    <section className="gallery" aria-roledescription="galería" aria-label={label}>
      <figure>
        <div className="stage" data-t={cur}><Art i={cur} /></div>
        <button className="nav prev" type="button" aria-label="Imagen anterior" onClick={() => go(cur - 1)}>&lsaquo;</button>
        <button className="nav next" type="button" aria-label="Imagen siguiente" onClick={() => go(cur + 1)}>&rsaquo;</button>
        <figcaption aria-live="polite">{VIEWS[cur]} ({cur + 1} de {n})</figcaption>
      </figure>
      <div className="thumbs" role="group" aria-label="Miniaturas. Usa las flechas para cambiar de imagen." onKeyDown={onKey}>
        {VIEWS.map((v, i) => (
          <button key={v} className="thumb" type="button" aria-label={`${v}, imagen ${i + 1} de ${n}`}
                  aria-current={i === cur} tabIndex={i === cur ? 0 : -1} onClick={() => setCur(i)}>
            <Art i={i} />
          </button>
        ))}
      </div>
    </section>
  );
}

// CSS: copia las reglas .gallery, figure, .stage, figcaption, .nav, .thumbs y .thumb de la pestaña HTML + CSS.
