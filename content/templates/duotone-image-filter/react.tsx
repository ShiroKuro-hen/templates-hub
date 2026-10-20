import { useState, type CSSProperties } from 'react';

type Photo = { title: string; alt: string; src: string };

const PHOTOS: Photo[] = [
  { title: 'Colinas al atardecer', alt: 'Colinas y montañas al atardecer', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23f4d58d%22%2F%3E%3Ccircle%20cx%3D%22240%22%20cy%3D%2262%22%20r%3D%2226%22%20fill%3D%22%23e76f51%22%2F%3E%3Cpath%20d%3D%22M0%20150l70-70%2055%2050%2045-40%2060%2060%2090-70v120H0z%22%20fill%3D%22%232a9d8f%22%2F%3E%3Cpath%20d%3D%22M0%20200v-30l110-30%2080%2020%20130-25v65z%22%20fill%3D%22%23264653%22%2F%3E%3C%2Fsvg%3E' },
  { title: 'Ciudad iluminada', alt: 'Edificios con ventanas iluminadas', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%238ecae6%22%2F%3E%3Ccircle%20cx%3D%2260%22%20cy%3D%2250%22%20r%3D%2218%22%20fill%3D%22%23fefae0%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2290%22%20width%3D%2250%22%20height%3D%22110%22%20fill%3D%22%23023047%22%2F%3E%3Crect%20x%3D%2280%22%20y%3D%2260%22%20width%3D%2260%22%20height%3D%22140%22%20fill%3D%22%23219ebc%22%2F%3E%3Crect%20x%3D%22150%22%20y%3D%22100%22%20width%3D%2245%22%20height%3D%22100%22%20fill%3D%22%23126782%22%2F%3E%3Crect%20x%3D%22205%22%20y%3D%2245%22%20width%3D%2270%22%20height%3D%22155%22%20fill%3D%22%23023047%22%2F%3E%3Crect%20x%3D%22225%22%20y%3D%2270%22%20width%3D%228%22%20height%3D%2210%22%20fill%3D%22%23ffb703%22%2F%3E%3Crect%20x%3D%22242%22%20y%3D%2270%22%20width%3D%228%22%20height%3D%2210%22%20fill%3D%22%23ffb703%22%2F%3E%3Crect%20x%3D%22225%22%20y%3D%22100%22%20width%3D%228%22%20height%3D%2210%22%20fill%3D%22%23ffb703%22%2F%3E%3C%2Fsvg%3E' },
  { title: 'Formas de color', alt: 'Círculos de colores superpuestos', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23e9e3ff%22%2F%3E%3Ccircle%20cx%3D%22110%22%20cy%3D%22100%22%20r%3D%2270%22%20fill%3D%22%237b61ff%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%2290%22%20r%3D%2260%22%20fill%3D%22%23ff8fab%22%20opacity%3D%22.85%22%2F%3E%3Ccircle%20cx%3D%22160%22%20cy%3D%22150%22%20r%3D%2240%22%20fill%3D%22%233ddbd9%22%20opacity%3D%22.8%22%2F%3E%3C%2Fsvg%3E' },
];

function DuotonePhoto({ photo }: { photo: Photo }) {
  const [duo, setDuo] = useState(true);

  return (
    <figure className={duo ? 'card duo' : 'card'}>
      <div className="frame">
        <img src={photo.src} alt={photo.alt} width={320} height={200} loading="lazy" />
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
