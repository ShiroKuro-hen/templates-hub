import { useState, type CSSProperties, type KeyboardEvent } from 'react';

type Photo = { title: string; alt: string; src: string };

const PHOTOS: Photo[] = [
  { title: 'Isla blanca', alt: 'Pueblo blanco griego junto al mar', src: '/stock/isla-blanca.webp' },
  { title: 'Montañas nevadas', alt: 'Picos nevados bajo el cielo', src: '/stock/montana-nieve.webp' },
  { title: 'Sendero verde', alt: 'Sendero de hierba entre el bosque', src: '/stock/sendero-verde.webp' },
  { title: 'Embarcadero', alt: 'Muelle de madera que se adentra en el mar', src: '/stock/embarcadero.webp' },
];

const STEPS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

export function ImageStackFan({ photos = PHOTOS }: { photos?: Photo[] }) {
  const [order, setOrder] = useState(photos);
  const [open, setOpen] = useState(false);

  const rotate = (step: number) =>
    setOrder((prev) => {
      const k = (step + prev.length) % prev.length;
      return [...prev.slice(k), ...prev.slice(0, k)];
    });

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key in STEPS) {
      e.preventDefault();
      rotate(STEPS[e.key]);
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  return (
    <main className="wrap" aria-labelledby="fan-title">
      <h1 id="fan-title">Pila de fotos</h1>
      <p className="hint" id="fan-hint">
        Pasa el cursor, toca la pila o enfócala para abrirla. Enter o Espacio la abren y las flechas cambian la foto de arriba.
      </p>
      <div className="stage">
        <div
          className="stack"
          role="group"
          tabIndex={0}
          aria-label="Pila de fotos"
          aria-describedby="fan-hint"
          data-open={open}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
        >
          {order.map((photo, p) => (
            <figure key={photo.title} className="card" style={{ '--p': p } as CSSProperties}>
              <img src={photo.src} alt={photo.alt} width={800} height={533} loading="lazy" />
              <figcaption>{photo.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="bar">
        <p id="now" aria-live="polite">Arriba: {order[0].title}</p>
        <button type="button" className="btn" onClick={() => rotate(1)}>
          Barajar
        </button>
      </div>
    </main>
  );
}
// CSS: copia los tokens :root y las reglas .wrap / .stage / .stack / .card (con la rotación y el abanico) / .bar / .btn de la pestaña HTML + CSS.
