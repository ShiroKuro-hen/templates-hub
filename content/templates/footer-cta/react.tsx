type Col = { id: string; title: string; links: string[] };

const COLS: Col[] = [
  { id: 'f1', title: 'Producto', links: ['Automatizaciones', 'Integraciones', 'Seguridad', 'Precios'] },
  { id: 'f2', title: 'Recursos', links: ['Documentación', 'Referencia de la API', 'Blog', 'Comunidad'] },
  { id: 'f3', title: 'Empresa', links: ['Nosotros', 'Empleo', 'Clientes', 'Contacto'] },
  { id: 'f4', title: 'Soporte', links: ['Centro de ayuda', 'Estado del servicio', 'Contactar a soporte'] },
];
const LEGAL = ['Privacidad', 'Términos', 'Cookies'];

export function FooterCta({ cols = COLS }: { cols?: Col[] }) {
  return (
    <div className="page">
      <section className="cta" aria-labelledby="cta-t">
        <div>
          <h2 id="cta-t">Automatiza tu primer flujo hoy</h2>
          <p>Crea tu cuenta en menos de un minuto. Sin tarjeta de crédito y con 14 días del plan Equipo incluidos.</p>
        </div>
        <div className="actions">
          <a className="btn pri" href="#">Empezar gratis</a>
          <a className="btn" href="#">Hablar con ventas</a>
        </div>
      </section>
      <footer>
        <div className="grid">
          <div className="about">
            <a className="brand" href="#" aria-label="Nimbo, inicio">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
                <rect width="24" height="24" rx="6" fill="url(#g)" />
                <path d="M7 16.5a3.5 3.5 0 0 1 .6-6.9A4.5 4.5 0 0 1 16.3 10a3.3 3.3 0 0 1 .7 6.5z" fill="#fff" />
              </svg>
              Nimbo
            </a>
            <p>Automatización para equipos que prefieren resolver antes que repetir.</p>
            <a className="status" href="#">Todos los sistemas operativos</a>
          </div>
          {cols.map((c) => (
            <nav key={c.id} aria-labelledby={c.id}>
              <h3 id={c.id}>{c.title}</h3>
              <ul>{c.links.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </nav>
          ))}
        </div>
        <div className="bottom">
          <span>© 2026 Nimbo, Inc. Todos los derechos reservados.</span>
          <ul>{LEGAL.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
          <label>Idioma <select defaultValue="Español">{['Español', 'English', 'Português'].map((o) => <option key={o}>{o}</option>)}</select></label>
        </div>
      </footer>
    </div>
  );
}
// CSS: copia las reglas .page, .cta, .btn, footer, .grid, .brand, .status, nav, .bottom y select de la pestaña HTML + CSS.
