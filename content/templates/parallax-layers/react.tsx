import { useEffect, useRef, type CSSProperties } from 'react';

const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
// --s: píxeles que recorre cada capa con el scroll completo (negativo sube, positivo baja).
const s = (n: number) => ({ '--s': n }) as CSSProperties;

export function ParallaxLayers() {
  const sc = useRef<HTMLDivElement>(null);

  // Alternativa con JS solo si el navegador no admite animation-timeline.
  useEffect(() => {
    const el = sc.current;
    if (!el || calm || CSS.supports('animation-timeline', 'scroll()')) return;
    const onScroll = () => el.style.setProperty('--t', String(el.scrollTop / (el.scrollHeight - el.clientHeight)));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section>
      <div className="scroller" ref={sc} tabIndex={0} role="region" aria-label="Escena con capas de profundidad">
        <div className="scene">
          <div className="layer sun" style={s(60)} />
          <svg className="layer far" style={s(-24)} viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 90 50 50l60 35 60-50 70 45 60-35 100 50v105H0Z" /></svg>
          <svg className="layer mid" style={s(-56)} viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 70 30l60 40 80-45 70 50 60-30 60 20v145H0Z" /></svg>
          <svg className="layer near" style={s(-100)} viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60C60 20 110 20 170 55s120 20 230-15v160H0Z" /></svg>
          <div className="copy" style={s(-70)}>
            <h1>Capas con profundidad</h1>
            <p>Cada capa se mueve a su propia velocidad mientras te desplazas.</p>
          </div>
        </div>
        <div className="spacer" />
      </div>
      <div className="bar">
        <p>Desplaza dentro del recuadro para separar las capas.</p>
        <button className="btn" type="button" onClick={() => sc.current?.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' })}>Volver al inicio</button>
      </div>
    </section>
  );
}

// CSS: copia @property --t, .scroller, .scene, .layer, .copy y el bloque @supports (animation-timeline) de la pestaña HTML + CSS.
