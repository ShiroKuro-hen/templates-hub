import { useState, type CSSProperties, type KeyboardEvent } from 'react';

type Photo = { title: string; alt: string; src: string };

const PHOTOS: Photo[] = [
  { title: 'Montañas', alt: 'Montañas bajo un cielo anaranjado', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23ffd6a5%22%2F%3E%3Ccircle%20cx%3D%22160%22%20cy%3D%22110%22%20r%3D%2240%22%20fill%3D%22%23ff9770%22%2F%3E%3Cpath%20d%3D%22M0%20200L90%20110l60%2050%2070-70%20100%20110z%22%20fill%3D%22%236d597a%22%2F%3E%3C%2Fsvg%3E' },
  { title: 'Olas', alt: 'Olas azules bajo un sol rosado', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23bde0fe%22%2F%3E%3Ccircle%20cx%3D%22250%22%20cy%3D%2250%22%20r%3D%2222%22%20fill%3D%22%23ffc8dd%22%2F%3E%3Cpath%20d%3D%22M0%20120q40-20%2080%200t80%200%2080%200%2080%200v80H0z%22%20fill%3D%22%233a86ff%22%2F%3E%3Cpath%20d%3D%22M0%20150q40-20%2080%200t80%200%2080%200%2080%200v50H0z%22%20fill%3D%22%231d4ed8%22%2F%3E%3C%2Fsvg%3E' },
  { title: 'Bosque', alt: 'Bosque de pinos con hierba clara', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23d8f3dc%22%2F%3E%3Cpath%20d%3D%22M40%20170L70%2090l30%2080zM110%20170l30-110%2030%20110zM190%20170l30-85%2030%2085zM260%20170l25-65%2025%2065z%22%20fill%3D%22%232d6a4f%22%2F%3E%3Crect%20y%3D%22170%22%20width%3D%22320%22%20height%3D%2230%22%20fill%3D%22%2374c69d%22%2F%3E%3C%2Fsvg%3E' },
  { title: 'Bloques', alt: 'Bloques de colores redondeados', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23fde2e4%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%2230%22%20width%3D%22110%22%20height%3D%2270%22%20rx%3D%2212%22%20fill%3D%22%23e63946%22%2F%3E%3Crect%20x%3D%22160%22%20y%3D%2230%22%20width%3D%22130%22%20height%3D%2250%22%20rx%3D%2212%22%20fill%3D%22%23f4a261%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%22120%22%20width%3D%22260%22%20height%3D%2250%22%20rx%3D%2212%22%20fill%3D%22%23457b9d%22%2F%3E%3C%2Fsvg%3E' },
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
              <img src={photo.src} alt={photo.alt} width={320} height={200} loading="lazy" />
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
