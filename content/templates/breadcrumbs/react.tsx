import { Fragment, useState } from 'react';

type Crumb = { label: string; href?: string }; // la última miga es la página actual
type Props = { items: Crumb[]; maxVisible?: number };

export function Breadcrumbs({ items, maxVisible = 4 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const collapse = !expanded && items.length > maxVisible;
  // Con colapso: primera miga, «…», y las (maxVisible - 2) últimas
  const hiddenCount = items.length - (maxVisible - 1);
  const visible = collapse ? [items[0], ...items.slice(hiddenCount + 1)] : items;

  return (
    <nav className="crumbs" aria-label="Migas de pan">
      <ol>
        {visible.map((c, i) => {
          const last = c === items[items.length - 1];
          return (
            <Fragment key={c.label}>
              {collapse && i === 1 && (
                <li>
                  <button type="button" aria-label={`Mostrar ${hiddenCount} niveles ocultos`} onClick={() => setExpanded(true)}>…</button>
                </li>
              )}
              <li>
                {last || !c.href ? <span aria-current={last ? 'page' : undefined}>{c.label}</span> : <a href={c.href}>{c.label}</a>}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

// Uso: <Breadcrumbs items={[{label:'Inicio',href:'/'},{label:'Tienda',href:'/tienda'},{label:'Calzado',href:'/calzado'},{label:'Zapatillas',href:'/z'},{label:'Modelo Aurora'}]} />
// CSS: copia las reglas .crumbs (ol, li, li + li::before, a, [aria-current], button) de la pestaña HTML + CSS.
