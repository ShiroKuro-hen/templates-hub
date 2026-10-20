import { useRef, useState, type CSSProperties, type MouseEvent } from 'react';

type Shot = { src: string; alt: string; caption: string; ar: string; w: number; h: number };

const SHOTS: Shot[] = [
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23fde68a%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22170%22%20r%3D%2270%22%20fill%3D%22%23f97316%22%2F%3E%3Cpath%20d%3D%22M0%20220Q120%20170%20220%20210T400%20200V300H0Z%22%20fill%3D%22%237c2d12%22%2F%3E%3C%2Fsvg%3E', alt: 'Valle con colinas y un sol naranja al atardecer', caption: 'Valle al atardecer', ar: '4/3', w: 400, h: 300 },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22400%22%20viewBox%3D%220%200%20300%20400%22%3E%3Crect%20width%3D%22300%22%20height%3D%22400%22%20fill%3D%22%23e0f2fe%22%2F%3E%3Crect%20x%3D%22110%22%20y%3D%2260%22%20width%3D%2280%22%20height%3D%22340%22%20fill%3D%22%230c4a6e%22%2F%3E%3Crect%20x%3D%22130%22%20y%3D%2230%22%20width%3D%2240%22%20height%3D%2230%22%20fill%3D%22%230c4a6e%22%2F%3E%3Cpath%20d%3D%22M120%20100h60M120%20140h60M120%20180h60M120%20220h60M120%20260h60%22%20stroke%3D%22%237dd3fc%22%20stroke-width%3D%226%22%2F%3E%3C%2Fsvg%3E', alt: 'Torre alta de cristal azul entre nubes', caption: 'Torre del centro', ar: '3/4', w: 300, h: 400 },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22300%22%20viewBox%3D%220%200%20300%20300%22%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20fill%3D%22%23fce7f3%22%2F%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22100%22%20r%3D%2270%22%20fill%3D%22%23db2777%22%20opacity%3D%22.85%22%2F%3E%3Crect%20x%3D%22150%22%20y%3D%22150%22%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22%234338ca%22%20opacity%3D%22.8%22%2F%3E%3Cpath%20d%3D%22M20%20280%20110%20170%20200%20280Z%22%20fill%3D%22%23facc15%22%2F%3E%3C%2Fsvg%3E', alt: 'Composición geométrica con círculo, cuadrado y triángulo', caption: 'Composición geométrica', ar: '1/1', w: 300, h: 300 },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22480%22%20height%3D%22270%22%20viewBox%3D%220%200%20480%20270%22%3E%3Crect%20width%3D%22480%22%20height%3D%22270%22%20fill%3D%22%23a7f3d0%22%2F%3E%3Ccircle%20cx%3D%22380%22%20cy%3D%2270%22%20r%3D%2230%22%20fill%3D%22%23fef08a%22%2F%3E%3Cpath%20d%3D%22M0%20170q60-30%20120%200t120%200%20120%200%20120%200v100H0z%22%20fill%3D%22%230d9488%22%2F%3E%3Cpath%20d%3D%22M0%20210q60-30%20120%200t120%200%20120%200%20120%200v60H0z%22%20fill%3D%22%23115e59%22%2F%3E%3C%2Fsvg%3E', alt: 'Costa con olas suaves y sol bajo', caption: 'Costa norte', ar: '16/9', w: 480, h: 270 },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22450%22%20viewBox%3D%220%200%20300%20450%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23d9f99d%22%2F%3E%3Cpath%20d%3D%22M150%2040%20230%20200H70Z%22%20fill%3D%22%2314532d%22%2F%3E%3Cpath%20d%3D%22M150%20120%20245%20300H55Z%22%20fill%3D%22%23166534%22%2F%3E%3Cpath%20d%3D%22M150%20200%20260%20400H40Z%22%20fill%3D%22%2315803d%22%2F%3E%3Crect%20y%3D%22400%22%20width%3D%22300%22%20height%3D%2250%22%20fill%3D%22%23713f12%22%2F%3E%3C%2Fsvg%3E', alt: 'Bosque de pinos alto sobre tierra marrón', caption: 'Bosque de pinos', ar: '2/3', w: 300, h: 450 },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22400%22%20viewBox%3D%220%200%20320%20400%22%3E%3Crect%20width%3D%22320%22%20height%3D%22400%22%20fill%3D%22%23312e81%22%2F%3E%3Ccircle%20cx%3D%22250%22%20cy%3D%2270%22%20r%3D%2222%22%20fill%3D%22%23e0e7ff%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%22180%22%20width%3D%2260%22%20height%3D%22220%22%20fill%3D%22%231e1b4b%22%2F%3E%3Crect%20x%3D%22100%22%20y%3D%22120%22%20width%3D%2270%22%20height%3D%22280%22%20fill%3D%22%231e1b4b%22%2F%3E%3Crect%20x%3D%22180%22%20y%3D%22210%22%20width%3D%2250%22%20height%3D%22190%22%20fill%3D%22%231e1b4b%22%2F%3E%3Crect%20x%3D%22240%22%20y%3D%22150%22%20width%3D%2260%22%20height%3D%22250%22%20fill%3D%22%231e1b4b%22%2F%3E%3Cpath%20d%3D%22M118%20150h12M118%20180h12M195%20240h12M195%20270h12%22%20stroke%3D%22%23fde68a%22%20stroke-width%3D%226%22%2F%3E%3C%2Fsvg%3E', alt: 'Calle nocturna con edificios iluminados', caption: 'Calle nocturna', ar: '4/5', w: 320, h: 400 },
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
      <h1 id="gallery-title">Galería de proyectos</h1>
      <p className="lead">Pasa el cursor o usa el teclado para ver el pie. Pulsa una imagen para ampliarla.</p>
      <ul className="masonry">
        {shots.map((s) => (
          <li key={s.caption}>
            <button type="button" className="shot" style={{ '--ar': s.ar } as CSSProperties} aria-haspopup="dialog" onClick={(e) => show(s, e)}>
              <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" />
              <span className="cap">{s.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dlg} aria-label="Imagen ampliada" onClose={onClose}>
        {open && (
          <figure>
            <img src={open.src} alt={open.alt} width={open.w} height={open.h} loading="lazy" />
            <figcaption>{open.caption}</figcaption>
          </figure>
        )}
        <button type="button" className="close" aria-label="Cerrar imagen" onClick={() => dlg.current?.close()}>×</button>
      </dialog>
    </main>
  );
}
// CSS: copia los tokens :root y las reglas .gal / .masonry / .shot / .cap / dialog / .close de la pestaña HTML + CSS.
