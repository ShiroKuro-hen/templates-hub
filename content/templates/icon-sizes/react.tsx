import { useState } from 'react';
import type { CSSProperties } from 'react';

// [token, icono px, trazo px, texto px]
const SIZES: [string, number, number, number][] = [
  ['xs', 12, 1.25, 12], ['sm', 16, 1.5, 14], ['md', 20, 1.75, 16],
  ['lg', 24, 2, 20], ['xl', 32, 2.5, 28], ['2xl', 48, 3, 40],
];
const fmt = (n: number) => String(n).replace('.', ',');

function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="i-search" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" vectorEffect="non-scaling-stroke" />
        <path d="m20 20-3.5-3.5" vectorEffect="non-scaling-stroke" />
      </symbol>
    </svg>
  );
}

export function IconSizes() {
  const [guides, setGuides] = useState(false);
  return (
    <section className={`card${guides ? ' guides' : ''}`} aria-labelledby="t">
      <Sprite />
      <div className="head">
        <div>
          <h2 id="t">Tamaños y trazos de iconos</h2>
          <p className="sub">Cada tamaño tiene su propio grosor de trazo, en píxeles reales.</p>
        </div>
        <label className="chk">
          <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} /> Mostrar guías
        </label>
      </div>
      <ul>
        {SIZES.map(([k, s, w, f]) => (
          <li key={k} style={{ '--s': `${s}px`, '--w': `${w}px`, '--f': `${f}px` } as CSSProperties}>
            <div className="tk"><b>{k}</b><span>{s} px, trazo {fmt(w)}</span></div>
            <div className="ic"><svg aria-hidden="true"><use href="#i-search" /></svg></div>
            <span className="t"><svg aria-hidden="true"><use href="#i-search" /></svg>{f === 40 ? 'Buscar' : 'Buscar clientes'}</span>
          </li>
        ))}
      </ul>
      <p className="rule">Junto a texto, el icono mide 1,2 veces el cuerpo y se centra con <code>align-items: center</code>.</p>
    </section>
  );
}
// CSS: copia las reglas .card, .head, li, .ic, .t y .guides (sustituye :has(#g:checked) por .guides) de la pestaña HTML + CSS.
