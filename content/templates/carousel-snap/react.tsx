import { useCallback, useEffect, useRef, useState } from 'react';

type Slide = { id: string; big: string; title: string; text: string; color: string };

const SLIDES: Slide[] = [
  { id: 'cerros', big: '9 km', title: 'Cerros de Lima', text: 'Sendero suave, 2 h.', color: '#ffd84d' },
  { id: 'valle', big: '14 km', title: 'Valle Sagrado', text: 'Ruta mixta, 5 h.', color: '#ff8a6e' },
  { id: 'churup', big: '6 km', title: 'Laguna Churup', text: 'Subida corta, 3 h.', color: '#9db4ff' },
  { id: 'colca', big: '22 km', title: 'Cañón del Colca', text: 'Día completo, 8 h.', color: '#8fdcaa' },
];

export function Carousel({ slides = SLIDES, label = 'Rutas destacadas' }: { slides?: Slide[]; label?: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ i: 0, start: true, end: false });

  const update = useCallback(() => {
    const t = track.current;
    if (!t || t.children.length < 2) return;
    const step = (t.children[1] as HTMLElement).offsetLeft - (t.children[0] as HTMLElement).offsetLeft;
    const end = t.scrollLeft + t.clientWidth >= t.scrollWidth - 2;
    setState({ i: end ? slides.length - 1 : Math.round(t.scrollLeft / step), start: t.scrollLeft <= 2, end });
  }, [slides.length]);

  useEffect(update, [update]);
  const go = (d: number) => {
    const t = track.current!;
    t.scrollBy({ left: d * ((t.children[1] as HTMLElement).offsetLeft - (t.children[0] as HTMLElement).offsetLeft) });
  };

  return (
    <section aria-roledescription="carrusel" aria-label={label}>
      <div className="head">
        <h1>{label}</h1>
        <div className="ctrl">
          <button type="button" className="btn" aria-label="Anterior" disabled={state.start} onClick={() => go(-1)}>‹</button>
          <span className="count" aria-live="polite">{state.i + 1} / {slides.length}</span>
          <button type="button" className="btn" aria-label="Siguiente" disabled={state.end} onClick={() => go(1)}>›</button>
        </div>
      </div>
      <ul className="track" ref={track} tabIndex={0} onScroll={update} aria-label="Diapositivas, desplázate con las flechas">
        {slides.map((s) => (
          <li className="slide" key={s.id} aria-roledescription="diapositiva">
            <div className="art" style={{ background: s.color }}>{s.big}</div>
            <div><h2>{s.title}</h2><p>{s.text}</p></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
// CSS: copia las reglas .head / .ctrl / .count / .btn / .track / .slide / .art de la pestaña HTML + CSS (usa --c o el style inline en .art).
