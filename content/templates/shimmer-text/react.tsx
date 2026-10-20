export function ShimmerText() {
  return (
    <>
      <section className="card" aria-labelledby="shimmer-title">
        <span className="badge"><span className="shine">Nuevo</span></span>
        <h1 id="shimmer-title" className="shine">Informes que se escriben solos</h1>
        <p className="lead">Conecta tus datos y recibe cada lunes un resumen claro, con cifras y próximos pasos.</p>
        <a className="link" href="#">Ver novedades</a>
      </section>
      <div className="skeleton" role="status">
        <span className="sr">Cargando resumen</span>
        <span className="sk sk-title" aria-hidden="true" />
        <span className="sk" aria-hidden="true" />
        <span className="sk sk-short" aria-hidden="true" />
      </div>
    </>
  );
}

// CSS: copia .card, .skeleton, .badge, h1, .shine, .lead, .link, .sk, .sk-title, .sk-short, .sr, :focus-visible y el bloque prefers-reduced-motion de la pestaña HTML + CSS.
