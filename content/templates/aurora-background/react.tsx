export function AuroraBackground() {
  return (
    <section className="hero" aria-labelledby="aurora-title">
      <div className="aurora" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>
      <p className="eyebrow">Novedad: panel de equipo</p>
      <h1 id="aurora-title">Todo tu equipo, en una sola vista</h1>
      <p className="lead">Reúne proyectos, plazos y avisos en un solo panel. Empieza en minutos y invita a tus compañeros cuando quieras.</p>
      <div className="actions">
        <button type="button" className="btn btn-primary">Empezar gratis</button>
        <button type="button" className="btn btn-secondary">Ver demo</button>
      </div>
    </section>
  );
}

// CSS: copia .hero, .aurora, .blob, .b1, .b2, .b3, @keyframes drift, .eyebrow, h1, .lead, .actions, .btn, .btn-primary, .btn-secondary, :focus-visible y el bloque prefers-reduced-motion de la pestaña HTML + CSS.
