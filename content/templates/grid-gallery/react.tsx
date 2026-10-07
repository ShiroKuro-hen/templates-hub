import { useState, type CSSProperties } from 'react';

type Modo = 'rows' | 'sq' | 'r43' | 'r169';
type Item = { title: string; cat: string; c1: string; c2: string; ink: string; s: 'c' | 's' | 't'; wide?: boolean };

const MODOS: [Modo, string][] = [['rows', 'Filas'], ['sq', '1:1'], ['r43', '4:3'], ['r169', '16:9']];
const CODIGO: Record<Modo, string> = {
  rows: 'grid-auto-rows: 170px', sq: 'aspect-ratio: 1 / 1', r43: 'aspect-ratio: 4 / 3', r169: 'aspect-ratio: 16 / 9',
};
const ITEMS: Item[] = [
  { title: 'Rediseño de la app móvil', cat: 'Producto', c1: 'accent-soft', c2: 'info-soft', ink: 'accent', s: 'c', wide: true },
  { title: 'Identidad Aurora', cat: 'Marca', c1: 'info-soft', c2: 'ok-soft', ink: 'info', s: 's' },
  { title: 'Sistema de iconos', cat: 'Diseño de sistemas', c1: 'ok-soft', c2: 'warn-soft', ink: 'ok', s: 't' },
  { title: 'Campaña de otoño', cat: 'Marketing', c1: 'warn-soft', c2: 'err-soft', ink: 'warn', s: 'c' },
  { title: 'Panel de analítica', cat: 'Producto', c1: 'err-soft', c2: 'accent-soft', ink: 'err', s: 's', wide: true },
  { title: 'Portal de clientes', cat: 'Producto', c1: 'accent-soft', c2: 'ok-soft', ink: 'accent', s: 't' },
  { title: 'Guía de estilo', cat: 'Marca', c1: 'info-soft', c2: 'accent-soft', ink: 'info', s: 'c' },
  { title: 'Tienda en línea', cat: 'Comercio', c1: 'ok-soft', c2: 'info-soft', ink: 'ok', s: 's' },
  { title: 'Onboarding guiado', cat: 'Producto', c1: 'warn-soft', c2: 'accent-soft', ink: 'warn', s: 't' },
  { title: 'Kit de ilustraciones', cat: 'Marca', c1: 'err-soft', c2: 'warn-soft', ink: 'err', s: 'c' },
];

export function GridGallery({ items = ITEMS }: { items?: Item[] }) {
  const [modo, setModo] = useState<Modo>('rows');
  return (
    <section className="card" aria-labelledby="t">
      <div className="head">
        <div><h2 id="t">Galería de proyectos</h2><p>Diez entregas recientes del estudio.</p></div>
        <fieldset>
          <legend>Disposición de la galería</legend>
          {MODOS.map(([v, l]) => (
            <label key={v}><input type="radio" name="m" value={v} checked={modo === v} onChange={() => setModo(v)} /><span>{l}</span></label>
          ))}
        </fieldset>
      </div>
      <p className="info" aria-live="polite">
        <span className={`i-${modo}`}>{modo === 'rows' ? 'Filas de altura uniforme' : 'Proporción fija'}: <code>{CODIGO[modo]}</code></span>
      </p>
      <ul className="grid">
        {items.map((i, k) => (
          <li key={i.title} className={i.wide ? 'w' : undefined}>
            <figure className="tile">
              <div className="art" data-s={i.s} style={{ '--c1': `var(--${i.c1})`, '--c2': `var(--${i.c2})`, '--ink': `var(--${i.ink})` } as CSSProperties}>
                {k === 0 && <span className="tag">Destacado</span>}
              </div>
              <figcaption><b>{i.title}</b><small>{i.cat}</small></figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
// CSS: copia las reglas .card, .head, fieldset, .info, .grid, .tile, .w, .art, .tag y figcaption de la pestaña HTML + CSS (el cambio de modo usa :has sobre los radios).
