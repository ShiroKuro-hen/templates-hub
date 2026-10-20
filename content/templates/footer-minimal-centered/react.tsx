const LINKS = ['Producto', 'Precios', 'Blog', 'Empleo', 'Contacto', 'Privacidad'];

export function FooterMinimalCentered() {
  return (
    <footer>
      <a className="logo" href="#inicio" aria-label="Nimbo, inicio"><span className="mark" aria-hidden="true">N</span>Nimbo</a>
      <nav aria-label="Enlaces del pie">
        <ul>
          {LINKS.map((link) => (
            <li key={link}><a href="#">{link}</a></li>
          ))}
        </ul>
      </nav>
      <ul className="social">
        <li><a href="#correo" aria-label="Escríbenos por correo"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2.5" /><path d="M5 8l7 5 7-5" /></svg></a></li>
        <li><a href="#rss" aria-label="Feed RSS del blog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11a8 8 0 0 1 8 8M5 5.5a13.5 13.5 0 0 1 13.5 13.5" /><circle cx="6" cy="18" r="1.3" fill="currentColor" stroke="none" /></svg></a></li>
        <li><a href="#discord" aria-label="Comunidad en Discord"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5h14v9H11l-4 3v-3H5z" /></svg></a></li>
      </ul>
      <div className="prefs">
        <label>Idioma <select><option>Español</option><option>English</option><option>Português</option></select></label>
        <p className="hint">El tema sigue la configuración de tu dispositivo.</p>
      </div>
      <p className="copy">© 2026 Nimbo Software, S.L. Todos los derechos reservados.</p>
    </footer>
  );
}
// CSS: copia las reglas de footer, a, nav, .logo, .mark, .social, .prefs, select, .hint y .copy de la pestaña HTML + CSS.
