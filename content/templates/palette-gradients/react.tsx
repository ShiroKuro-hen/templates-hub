import { useState } from 'react';
import type { CSSProperties } from 'react';

const GRADS = [
  { id: 'ultramar', name: 'Ultramar', use: 'Marca principal. Úsalo en encabezados y llamadas a la acción.' },
  { id: 'aurora', name: 'Aurora', use: 'Estados positivos, métricas en crecimiento y logros.' },
  { id: 'brasa', name: 'Brasa', use: 'Avisos destacados y ofertas con fecha límite.' },
  { id: 'nebulosa', name: 'Nebulosa', use: 'Campañas y lanzamientos. Úsalo poco.' },
];

function CopyCss({ id, name }: { id: string; name: string }) {
  const css = `background: var(--grad-${id});`;
  const [label, setLabel] = useState('Copiar');
  const copy = async () => {
    try { await navigator.clipboard.writeText(css); setLabel('Copiado'); }
    catch { setLabel('Sin acceso'); }
    setTimeout(() => setLabel('Copiar'), 1500);
  };
  return (
    <div className="copy">
      <code>{css}</code>
      <button type="button" onClick={copy} aria-label={`Copiar CSS de ${name}`}>{label}</button>
    </div>
  );
}

export function GradientCatalog() {
  return (
    <div className="grid">
      {GRADS.map(({ id, name, use }) => (
        <article key={id} style={{ '--g': `var(--grad-${id})` } as CSSProperties}>
          <div className="fill" role="img" aria-label={`Muestra del degradado ${name}`} />
          <h3>{name}</h3>
          <p>{use}</p>
          <div className="uses">
            <div className="ring">Borde degradado</div>
            <div className="bar" role="img" aria-label={`Barra con degradado ${name}`} />
          </div>
          <CopyCss id={id} name={name} />
        </article>
      ))}
    </div>
  );
}
// CSS: copia las reglas .grid, article, .fill, .ring, .bar y .copy (y las variables --grad-*) de la pestaña HTML + CSS.
