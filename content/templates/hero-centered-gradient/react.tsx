// CSS: copia las reglas .hero (y ::before/::after), .pill, h1, .grad, .sub, .row, .btn, .stats y la animación shift de la pestaña HTML + CSS.

const STATS: [string, string][] = [
  ['Equipos activos', '12 mil'],
  ['Valoración media', '4,9/5'],
  ['Disponibilidad', '99,9 %'],
  ['Respuesta de soporte', '< 2 h'],
];

export function HeroCenteredGradient() {
  return (
    <section className="hero" aria-labelledby="h">
      <a className="pill" href="#novedades">
        <b>Nuevo</b> Plantillas 3.0 ya disponibles <span aria-hidden="true">→</span>
      </a>
      <h1 id="h">
        Diseña landings que <span className="grad">convierten</span> desde el primer día
      </h1>
      <p className="sub">
        Lumen reúne plantillas, datos y pruebas A/B en un solo lugar para que cada visita se convierta en una venta.
      </p>
      <div className="row">
        <a className="btn main" href="#empezar">Empezar gratis</a>
        <a className="btn" href="#demo">Ver demo</a>
      </div>
      <dl className="stats">
        {STATS.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
