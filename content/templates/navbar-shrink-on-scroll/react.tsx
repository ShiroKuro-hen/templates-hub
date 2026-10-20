import { useState, type UIEvent } from 'react';

const LINKS = ['Producto', 'Precios', 'Documentación', 'Equipo'];
const CARDS = [
  ['Proyectos activos', '12 en curso y 3 pendientes de revisión.'],
  ['Equipo', '8 personas y 2 invitaciones enviadas esta semana.'],
  ['Facturación', 'El plan Pro se renueva el 5 de noviembre.'],
  ['Incidencias', 'Ninguna abierta. El último cierre fue hace cuatro días.'],
];

export function NavbarShrinkOnScroll() {
  const [scrolled, setScrolled] = useState(false);
  const onScroll = (e: UIEvent<HTMLDivElement>) => setScrolled(e.currentTarget.scrollTop > 8);

  return (
    <div className="frame" onScroll={onScroll}>
      <header className="nav" id="arriba" data-scrolled={scrolled ? '' : undefined}>
        <a className="brand" href="#arriba"><i aria-hidden="true" />Atlas</a>
        <nav className="links" aria-label="Principal">
          <ul>
            {LINKS.map((label, i) => (
              <li key={label}>
                <a href="#arriba" aria-current={i === 0 ? 'page' : undefined}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn" href="#arriba">Empezar</a>
      </header>
      <main className="content">
        <h1>Resumen de octubre</h1>
        <p>Desplázate por el contenido: al bajar, la barra se reduce, se vuelve translúcida y gana sombra.</p>
        <div className="cards">
          {CARDS.map(([title, text]) => (
            <article key={title} className="card"><b>{title}</b><span>{text}</span></article>
          ))}
        </div>
        <p>Los cambios se guardan solos y puedes deshacerlos desde el historial durante 30 días.</p>
        <a className="top" href="#arriba">Ir arriba ↑</a>
      </main>
    </div>
  );
}
// CSS: copia las reglas .frame / .nav (y [data-scrolled]) / .brand / .links / .btn / .content / .card / .top de la pestaña HTML + CSS.
