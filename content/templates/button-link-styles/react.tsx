import type { ReactNode } from 'react';

type Props = {
  variant: 'subtle' | 'under' | 'arrow' | 'ext';
  href: string;
  children: ReactNode;
};

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
);

export function LinkButton({ variant, href, children }: Props) {
  const external = variant === 'ext';
  return (
    <a
      className={`l ${variant}`}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {variant === 'arrow' && <Icon d="M5 12h14M13 6l6 6-6 6" />}
      {external && (
        <>
          <Icon d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
          <span className="vh">(se abre en una pestaña nueva)</span>
        </>
      )}
    </a>
  );
}

const ESTILOS = [
  { v: 'subtle', t: 'Sutil', d: 'Acciones secundarias que no deben competir con el contenido.', href: '#historial', label: 'Ver historial' },
  { v: 'under', t: 'Subrayado animado', d: 'Enlaces dentro de un párrafo. Siempre subrayados.', href: '#guia', label: 'Leer la guía de inicio' },
  { v: 'arrow', t: 'Flecha animada', d: 'Invita a avanzar a otra página o sección.', href: '#precios', label: 'Ver precios' },
  { v: 'ext', t: 'Enlace externo', d: 'Sale del sitio. Se abre en una pestaña nueva y lo avisa.', href: 'https://example.com/api', label: 'Documentación de la API' },
] as const;

export function LinkStyles() {
  return (
    <div className="grid">
      {ESTILOS.map((e) => (
        <article key={e.v}>
          <h3>{e.t}</h3>
          <p>{e.d}</p>
          <LinkButton variant={e.v} href={e.href}>{e.label}</LinkButton>
        </article>
      ))}
    </div>
  );
}
// CSS: copia las reglas .grid, article, .l (.subtle, .under, .arrow, .ext) y .vh de la pestaña HTML + CSS.
