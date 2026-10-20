import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

const OBRAS = [
  { t: 'Costa al amanecer', d: 'Luz cálida sobre la bahía en las primeras horas del día.', s: '<circle cx="118" cy="30" r="12" fill="rgba(255,255,255,.85)"/><path d="M0 80 50 40 90 70 120 52 160 80V100H0Z" fill="rgba(255,255,255,.35)"/>' },
  { t: 'Olas de verano', d: 'Crestas suaves que se repiten hasta el horizonte.', s: '<path d="M0 60Q40 30 80 60T160 60V100H0Z" fill="rgba(255,255,255,.4)"/><rect x="34" y="18" width="58" height="28" rx="6" fill="rgba(255,255,255,.85)"/>' },
  { t: 'Ritmo urbano', d: 'Barras de una ciudad que crece con los años.', s: '<rect x="22" y="48" width="18" height="42" rx="3" fill="rgba(255,255,255,.5)"/><rect x="50" y="26" width="18" height="64" rx="3" fill="rgba(255,255,255,.85)"/><rect x="78" y="58" width="18" height="32" rx="3" fill="rgba(255,255,255,.5)"/><rect x="106" y="36" width="18" height="54" rx="3" fill="rgba(255,255,255,.85)"/>' },
  { t: 'Órbitas', d: 'Dos círculos que giran alrededor del mismo centro.', s: '<circle cx="62" cy="50" r="30" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="4"/><circle cx="104" cy="50" r="18" fill="rgba(255,255,255,.4)"/>' },
  { t: 'Noche estrellada', d: 'Un cielo sereno con una estrella más brillante.', s: '<path d="M80 16 86 36 106 36 90 48 96 68 80 56 64 68 70 48 54 36 74 36Z" fill="rgba(255,255,255,.9)"/>' },
  { t: 'Bloques', d: 'Composición de formas sencillas en equilibrio.', s: '<rect x="20" y="18" width="50" height="62" rx="8" fill="rgba(255,255,255,.4)"/><rect x="86" y="34" width="54" height="46" rx="8" fill="rgba(255,255,255,.85)"/>' },
];

type VT = Document & { startViewTransition?: (cb: () => void) => unknown };
const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const uri = (s: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">${s}</svg>`)}`;

export function ViewTransitionGallery() {
  const [cur, setCur] = useState<number | null>(null);
  const app = useRef<HTMLElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const hero = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  function clearNames() {
    [hero.current, ...thumbs.current].forEach((el) => {
      if (el) el.style.viewTransitionName = '';
    });
  }

  function swap(from: HTMLElement | null, to: HTMLElement | null, change: () => void) {
    if (calm) return change();
    const doc = document as VT;
    if (!doc.startViewTransition) {
      change();
      app.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease' });
      return;
    }
    clearNames();
    if (from) from.style.viewTransitionName = 'card';
    doc.startViewTransition(() => {
      clearNames();
      change();
      if (to) to.style.viewTransitionName = 'card';
    });
  }

  function go(next: number | null) {
    if (next === cur) return;
    const index = next ?? cur ?? 0;
    swap(
      next === null ? hero.current : thumbs.current[next],
      next === null ? thumbs.current[index] : hero.current,
      () => {
        flushSync(() => setCur(next));
        (next === null ? thumbs.current[index] : heading.current)?.focus();
      },
    );
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') go(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const shown = OBRAS[cur ?? 0];
  return (
    <main className="app" ref={app}>
      <ul className="grid" hidden={cur !== null}>
        {OBRAS.map((o, i) => (
          <li key={o.t}>
            <button
              className="thumb"
              type="button"
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              onClick={() => go(i)}
            >
              <span className={`tile t${i}`}>
                <img alt="" width={160} height={100} src={uri(o.s)} />
              </span>
              <span className="cap">{o.t}</span>
            </button>
          </li>
        ))}
      </ul>
      <article className="detail" hidden={cur === null}>
        <button className="back" type="button" onClick={() => go(null)}>
          ← Volver a la galería
        </button>
        <div ref={hero} className={`tile t${cur ?? 0}`}>
          <img alt="" width={160} height={100} src={uri(shown.s)} />
        </div>
        <h2 ref={heading} tabIndex={-1}>{shown.t}</h2>
        <p>{shown.d}</p>
      </article>
    </main>
  );
}
// CSS: copia las reglas .app, .grid, .thumb, .tile, .t0-.t5, .cap, .detail, .back, h2, p, [hidden] y ::view-transition-* de la pestaña HTML + CSS.
