import { useEffect, useRef, useState, type CSSProperties } from 'react';

const TEXT =
  'Cada palabra del párrafo cambia de tono a medida que avanzas por el recuadro. Así sabes con un vistazo cuánto llevas leído y cuánto te queda por delante. Los informes trimestrales resumen las ventas, los costes y los objetivos de cada equipo. Revisa primero las cifras clave, compara el avance con el mes anterior y comparte las conclusiones antes del viernes. Si algún dato no cuadra, abre el detalle de la categoría y revisa las transacciones una a una. Con el tiempo, cada cifra quedará documentada en el mismo lugar para que cualquiera del equipo pueda seguir el hilo.';
const WORDS = TEXT.split(' ');
const LAG = 4;

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const revealAt = (index: number, progress: number) =>
  clamp((progress * (WORDS.length + LAG) - index) / LAG).toFixed(3);

export function ScrollTextReveal() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => {
      const max = box.scrollHeight - box.clientHeight;
      setProgress(max > 0 ? box.scrollTop / max : 1);
    };
    update();
    box.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      box.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <p className="hint" id="reveal-hint">
        Desplázate dentro del recuadro para leer. Con teclado, enfócalo y usa las flechas.
      </p>
      <div className="reveal" ref={boxRef} tabIndex={0} role="region" aria-labelledby="reveal-hint">
        <p className="reveal-text">
          {WORDS.map((word, i) => (
            <span key={i} className="w" style={{ '--r': revealAt(i, progress) } as CSSProperties}>
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </>
  );
}

// CSS: copia .hint, .reveal, .reveal-text, .w, :focus-visible y el bloque prefers-reduced-motion de la pestaña HTML + CSS.
