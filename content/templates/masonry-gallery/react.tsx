import { useRef, useState, type CSSProperties, type MouseEvent } from 'react';

type Shot = { src: string; alt: string; caption: string; ar: string; w: number; h: number };

const SHOTS: Shot[] = [
  { src: '/stock/costa-azul.webp', alt: 'Costa con pinos y mar azul', caption: 'Costa azul con pinos', ar: '16/9', w: 800, h: 533 },
  { src: '/stock/valle-bruma.webp', alt: 'Valle verde cubierto de bruma', caption: 'Valle con bruma', ar: '4/5', w: 800, h: 533 },
  { src: '/stock/calle-ciudad.webp', alt: 'Calle de la ciudad entre edificios altos', caption: 'Calle entre edificios', ar: '1/1', w: 800, h: 533 },
  { src: '/stock/montana-nieve.webp', alt: 'Picos montañosos cubiertos de nieve', caption: 'Picos nevados', ar: '3/4', w: 800, h: 533 },
  { src: '/stock/puente-noche.webp', alt: 'Puente y skyline de noche en blanco y negro', caption: 'Puente de noche', ar: '2/3', w: 800, h: 533 },
  { src: '/stock/canon-verde.webp', alt: 'Cañón verde con un arroyo', caption: 'Cañón verde', ar: '4/3', w: 800, h: 533 },
  { src: '/stock/isla-blanca.webp', alt: 'Pueblo blanco frente al mar', caption: 'Pueblo blanco junto al mar', ar: '4/5', w: 800, h: 533 },
  { src: '/stock/puerta-antigua.webp', alt: 'Puerta de madera antigua en un muro de piedra', caption: 'Puerta antigua', ar: '3/4', w: 800, h: 533 },
];

export function MasonryGallery({ shots = SHOTS }: { shots?: Shot[] }) {
  const [open, setOpen] = useState<Shot | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const show = (s: Shot, e: MouseEvent<HTMLButtonElement>) => {
    opener.current = e.currentTarget;
    setOpen(s);
    dlg.current?.showModal();
  };
  const onClose = () => {
    setOpen(null);
    opener.current?.focus();
  };

  return (
    <main className="gal" aria-labelledby="gallery-title">
      <h1 id="gallery-title">Galería de paisajes y ciudad</h1>
      <p className="lead">Pasa el cursor o usa el teclado para ver el pie. Pulsa una imagen para ampliarla.</p>
      <ul className="masonry">
        {shots.map((s) => (
          <li key={s.caption}>
            <button type="button" className="shot" style={{ '--ar': s.ar } as CSSProperties} aria-haspopup="dialog" onClick={(e) => show(s, e)}>
              <img src={s.src} alt={s.alt} width={s.w} height={s.h} decoding="async" />
              <span className="cap">{s.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dlg} aria-label="Imagen ampliada" onClose={onClose}>
        {open && (
          <figure>
            <img src={open.src} alt={open.alt} width={open.w} height={open.h} />
            <figcaption>{open.caption}</figcaption>
          </figure>
        )}
        <button type="button" className="close" aria-label="Cerrar imagen" onClick={() => dlg.current?.close()}>×</button>
      </dialog>
    </main>
  );
}
// CSS: copia los tokens :root y las reglas .gal / .masonry / .shot / .cap / dialog / .close de la pestaña HTML + CSS.
