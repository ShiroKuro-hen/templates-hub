import { useState } from 'react';

const SECTIONS = [
  { title: 'Producto', links: ['Plataforma', 'Automatizaciones', 'Integraciones', 'Precios'] },
  { title: 'Soluciones', links: ['Equipos de marketing', 'Operaciones', 'Ingeniería', 'Ventas'] },
  { title: 'Recursos', links: ['Blog', 'Guías', 'Plantillas', 'Comunidad'] },
  { title: 'Empresa', links: ['Nosotros', 'Clientes', 'Empleo', 'Prensa'] },
  { title: 'Ayuda', links: ['Centro de ayuda', 'Estado del servicio', 'Contacto', 'API'] },
];

export function FooterAccordionSitemap() {
  const [open, setOpen] = useState<string[]>([]);

  const toggle = (title: string) =>
    setOpen((current) => (current.includes(title) ? current.filter((t) => t !== title) : [...current, title]));

  return (
    <footer>
      <div className="head">
        <a className="brand" href="#inicio" aria-label="Nimbo, inicio"><span aria-hidden="true">N</span>Nimbo</a>
        <a className="status" href="#estado"><span className="dot" aria-hidden="true" />Todos los sistemas operativos</a>
      </div>
      <nav className="map" aria-label="Mapa del sitio">
        {SECTIONS.map((section) => {
          const isOpen = open.includes(section.title);
          const panelId = `map-${section.title}`;
          return (
            <div className="col" key={section.title}>
              <h3 className="col-title">{section.title}</h3>
              <h2 className="col-head">
                <button
                  type="button"
                  className="toggle"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(section.title)}
                >
                  {section.title}
                </button>
              </h2>
              <ul className="panel" id={panelId} hidden={!isOpen}>
                {section.links.map((link) => (
                  <li key={link}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
      <div className="base">
        <p>© 2026 Nimbo Software, S.L. Todos los derechos reservados.</p>
        <ul>
          <li><a href="#">Privacidad</a></li>
          <li><a href="#">Términos</a></li>
          <li><a href="#">Cookies</a></li>
          <li><a href="#">Accesibilidad</a></li>
        </ul>
      </div>
    </footer>
  );
}
// CSS: copia las reglas de footer, .head, .brand, .status, .dot, .map, .col, .col-title, .col-head, .toggle, .panel y .base de la pestaña HTML + CSS.
