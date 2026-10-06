import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

type Scene = { title: string; bg: string; p: [string, string][] }; // clase de relleno + trazo
const SUN = 'M108 28a12 12 0 1 0 24 0a12 12 0 1 0-24 0';
const SCENES: Scene[] = [
  { title: 'Sierra al amanecer', bg: 'bw', p: [['fw', SUN], ['fa', 'M0 100V70L40 38l28 28 26-22 66 56z'], ['fi', 'M0 100 50 74l40 14 70-18v30z']] },
  { title: 'Costa norte', bg: 'bi', p: [['fw', 'M28 26a10 10 0 1 0 20 0a10 10 0 1 0-20 0'], ['fi', 'M0 62q20-10 40 0t40 0t40 0t40 0V100H0z'], ['fa', 'M0 80q20-10 40 0t40 0t40 0t40 0V100H0z']] },
  { title: 'Ciudad nocturna', bg: 'ba', p: [['fi', 'M122 20a8 8 0 1 0 16 0a8 8 0 1 0-16 0'], ['fa', 'M10 100V50h22v50zM38 100V28h26v72zM70 100V58h20v42zM96 100V40h24v60zM126 100V60h24v40z']] },
  { title: 'Valle verde', bg: 'bo', p: [['fw', SUN], ['fo', 'M0 100V64q40-30 80 0t80 0v36z']] },
  { title: 'Atardecer en la loma', bg: 'be', p: [['fe', 'M60 70a20 20 0 0 1 40 0z'], ['fa', 'M0 100V74l30-10 40 14 40-16 50 12v26z']] },
];
const Pic = ({ s }: { s: Scene }) => (
  <><rect className={s.bg} width="160" height="100" />{s.p.map(([c, d]) => <path key={d} className={c} d={d} />)}</>
);

export function ThumbCarousel({ scenes = SCENES }: { scenes?: Scene[] }) {
  const [n, setN] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const go = (k: number) => setN((k + scenes.length) % scenes.length);

  useEffect(() => {
    const el = strip.current, b = el?.children[n] as HTMLElement | undefined;
    if (!el || !b) return;
    const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    el.scrollTo({ left: b.offsetLeft - (el.clientWidth - b.offsetWidth) / 2, behavior: calm ? 'auto' : 'smooth' });
  }, [n]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(n - 1); else if (e.key === 'ArrowRight') go(n + 1); else return;
    e.preventDefault();
  };

  return (
    <section className="car" role="region" aria-roledescription="carrusel" aria-label="Rutas de senderismo"
             style={{ '--i': n } as CSSProperties} onKeyDown={onKey}>
      <h2>Rutas de senderismo</h2>
      <p className="muted">Elige una miniatura o usa las flechas del teclado.</p>
      <div className="view">
        <div className="track">
          {scenes.map((s, k) => (
            <svg key={s.title} className="slide" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" role="group"
                 aria-roledescription="diapositiva" aria-label={`${k + 1} de ${scenes.length}`} aria-hidden={k !== n}><Pic s={s} /></svg>
          ))}
        </div>
        <button type="button" className="ib prev" aria-label="Imagen anterior" onClick={() => go(n - 1)}><svg viewBox="0 0 24 24"><path d="M15.4 6 14 4.6 6.6 12 14 19.4 15.4 18 9.4 12z" /></svg></button>
        <button type="button" className="ib next" aria-label="Imagen siguiente" onClick={() => go(n + 1)}><svg viewBox="0 0 24 24"><path d="M8.6 6 10 4.6l7.4 7.4-7.4 7.4L8.6 18l6-6z" /></svg></button>
      </div>
      <div className="cap"><b>{scenes[n].title}</b><span aria-live="polite">{n + 1} de {scenes.length}</span></div>
      <div className="strip" ref={strip} role="group" aria-label="Miniaturas">
        {scenes.map((s, k) => (
          <button key={s.title} type="button" className="th" aria-label={`Ver ${s.title}`} aria-current={k === n ? 'true' : undefined} onClick={() => setN(k)}>
            <svg viewBox="0 0 160 100" aria-hidden="true"><Pic s={s} /></svg>
          </button>
        ))}
      </div>
    </section>
  );
}

// CSS: copia las reglas .car, .view, .track, .slide, .ib, .cap, .strip, .th y .bw...fe de la pestaña HTML + CSS.
