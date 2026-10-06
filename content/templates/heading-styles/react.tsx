import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode; // h2–h6 y párrafos del artículo
};

export function HeadingStyles({ eyebrow, title, lead, children }: Props) {
  return (
    <article className="doc">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </article>
  );
}

// Ejemplo de uso
export function Demo() {
  return (
    <HeadingStyles
      eyebrow="Guía de marca"
      title="Cómo escribimos para la web"
      lead="Una jerarquía clara ayuda a leer, a escanear y a navegar con lector de pantalla."
    >
      <h2>Estructura de la página</h2>
      <p>Usa un solo h1 por página y no saltes niveles.</p>
      <h3>Secciones principales</h3>
      <h4>Subsecciones</h4>
      <h5>Detalle de apoyo</h5>
      <h6>Nota al pie de sección</h6>
    </HeadingStyles>
  );
}
// CSS: copia las reglas .doc / .eyebrow / .lead y los estilos h1–h6 de la pestaña HTML + CSS, junto con los tokens :root.
