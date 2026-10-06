import { useState } from 'react';

type Icon = { name: string; d: string }; // d = contenido interno del <svg> (viewBox 24)

const ICONS: Icon[] = [
  { name: 'inicio', d: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>' },
  { name: 'buscar', d: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>' },
  { name: 'usuario', d: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>' },
  { name: 'correo', d: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>' },
  { name: 'estrella', d: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>' },
  { name: 'aviso', d: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>' },
  { name: 'listo', d: '<path d="M4 12l5 5L20 6"/>' },
  { name: 'cerrar', d: '<path d="M5 5l14 14M19 5L5 19"/>' },
];

const toSvg = (d: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

export function IconSet({ icons = ICONS }: { icons?: Icon[] }) {
  const [copied, setCopied] = useState('');

  const copy = async (icon: Icon) => {
    await navigator.clipboard.writeText(toSvg(icon.d));
    setCopied(icon.name);
  };

  return (
    <section className="iconset">
      <header>
        <h1>Iconos</h1>
        <p id="st" role="status">{copied ? `Copiado: ${copied}` : 'Clic para copiar el SVG'}</p>
      </header>
      <ul className="grid">
        {icons.map((icon) => (
          <li key={icon.name}>
            <button type="button" className="ico" aria-label={`Copiar SVG de ${icon.name}`} onClick={() => copy(icon)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon.d }} />
              <span>{icon.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
// CSS: copia las reglas header / h1 / #st / .grid / .ico (y .ico svg) y los tokens de la pestaña HTML + CSS.
