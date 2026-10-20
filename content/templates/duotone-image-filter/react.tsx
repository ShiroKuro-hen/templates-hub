import { useState, type CSSProperties } from 'react';

type Photo = { title: string; alt: string; src: string };

const PHOTOS: Photo[] = [
  { title: 'Costa de pinos', alt: 'Costa azul con pinos junto al mar', src: '/stock/costa-azul.webp' },
  { title: 'Calle de ciudad', alt: 'Calle de ciudad entre edificios altos', src: '/stock/calle-ciudad.webp' },
  { title: 'Escritorio de madera', alt: 'Escritorio de madera con portátil', src: '/stock/escritorio-madera.webp' },
];

function DuotonePhoto({ photo }: { photo: Photo }) {
  const [duo, setDuo] = useState(true);

  return (
    <figure className={duo ? 'card duo' : 'card'}>
      <div className="frame">
        <img src={photo.src} alt={photo.alt} width={800} height={533} loading="lazy" />
      </div>
      <figcaption className="cap">
        <span className="title">{photo.title}</span>
        <span className="seg" role="group" aria-label={`Modo de color: ${photo.title}`}>
          <button type="button" aria-pressed={!duo} onClick={() => setDuo(false)}>Original</button>
          <button type="button" aria-pressed={duo} onClick={() => setDuo(true)}>Duotono</button>
        </span>
      </figcaption>
    </figure>
  );
}

export function DuotoneImageFilter({ photos = PHOTOS }: { photos?: Photo[] }) {
  const [intensity, setIntensity] = useState(100);

  return (
    <main className="wrap" aria-labelledby="duo-title">
      <header className="head">
        <h1 id="duo-title">Galería en duotono</h1>
        <label className="ctrl">
          Intensidad
          <input type="range" min={0} max={100} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} />
        </label>
      </header>
      <ul className="grid" style={{ '--k': intensity / 100 } as CSSProperties}>
        {photos.map((photo) => (
          <li key={photo.title}>
            <DuotonePhoto photo={photo} />
          </li>
        ))}
      </ul>
    </main>
  );
}
// CSS: copia los tokens :root y las reglas .wrap / .head / .ctrl / .grid / .card / .frame / .cap / .seg (y el duotono .duo) de la pestaña HTML + CSS.
