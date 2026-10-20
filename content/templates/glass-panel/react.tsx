const ENLACES = ['Inicio', 'Proyectos', 'Equipo'];

export function GlassPanel() {
  return (
    <main className="stage">
      <span className="shape s1" aria-hidden="true" />
      <span className="shape s2" aria-hidden="true" />
      <span className="shape s3" aria-hidden="true" />
      <nav className="glass glass-nav" aria-label="Principal">
        <strong className="brand">Aurora</strong>
        <ul className="links">
          {ENLACES.map((texto, i) => (
            <li key={texto}>
              <a href="#" aria-current={i === 0 ? 'page' : undefined}>{texto}</a>
            </li>
          ))}
        </ul>
      </nav>
      <article className="glass glass-card">
        <h2>Plan Pro</h2>
        <p>Acceso a todos los paneles, informes semanales y soporte prioritario.</p>
        <button type="button" className="btn">Cambiar plan</button>
      </article>
      <section className="glass glass-window" aria-labelledby="ajustes">
        <header className="win-bar"><h2 id="ajustes">Ajustes</h2></header>
        <label className="row"><span>Avisos por correo</span><input type="checkbox" className="switch" defaultChecked /></label>
        <label className="row"><span>Sincronizar en segundo plano</span><input type="checkbox" className="switch" /></label>
      </section>
    </main>
  );
}

// CSS: copia .stage, .shape, .s1-.s3, .glass (y su @supports), .glass-nav, .brand, .links, .glass-card, h2, .btn, .glass-window, .win-bar, .row, .switch, :focus-visible y el bloque prefers-reduced-motion de la pestaña HTML + CSS.
