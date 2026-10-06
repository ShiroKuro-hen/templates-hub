import type { ReactNode } from 'react';

type Props = {
  title: string;
  meta?: string;
  quote?: { text: string; author: string };
  children: ReactNode; // párrafos, h2, listas…
};

export function ProseArticle({ title, meta, quote, children }: Props) {
  return (
    <article className="prose">
      <h1>{title}</h1>
      {meta && <p className="meta">{meta}</p>}
      {children}
      {quote && (
        <blockquote>
          {quote.text}
          <cite>{quote.author}</cite>
        </blockquote>
      )}
    </article>
  );
}

export function Demo() {
  return (
    <ProseArticle
      title="Por qué el texto largo necesita aire"
      meta="12 de marzo · 6 min de lectura"
      quote={{ text: 'Diseñar es decidir qué se queda fuera de la página.', author: 'Marta Ruiz, directora de arte' }}
    >
      <p>
        Limitamos el ancho con <code>max-width: 65ch</code> y subimos el <mark>interlineado a 1.7</mark>.
      </p>
      <h2>Tres reglas rápidas</h2>
      <ul>
        <li>Mide el ancho en caracteres, no en píxeles.</li>
        <li>Mantén un contraste mínimo de 4.5:1.</li>
      </ul>
    </ProseArticle>
  );
}
// CSS: copia las reglas .prose (y sus hijos: h1, h2, .meta, a, blockquote, ul/ol, code, hr, mark) de la pestaña HTML + CSS.
