type Feature = { title: string; text: string; icon: string[] };

const FEATURES: Feature[] = [
  { title: 'Automatizaciones sin código', text: 'Crea flujos con condiciones y acciones. Pruébalos antes de activarlos.', icon: ['M13 2 4 14h7l-1 8 9-12h-7z'] },
  { title: 'Trabajo en equipo', text: 'Comenta, asigna y aprueba en tiempo real sin salir de la herramienta.',
    icon: ['M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5', 'M9 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z'] },
  { title: 'Seguridad empresarial', text: 'SSO, registro de auditoría y datos cifrados con certificación SOC 2.', icon: ['M12 3 4 6v6c0 4.5 3.2 7.7 8 9 4.8-1.3 8-4.5 8-9V6z', 'm9 12 2 2 4-4'] },
];
const LINKS = ['Producto', 'Soluciones', 'Precios', 'Documentación'];
const CLIENTES = ['Aurora', 'Vértice', 'Kintsu', 'Brújula', 'Lumen'];

export function LandingSaas({ features = FEATURES }: { features?: Feature[] }) {
  return (
    <div className="page">
      <header className="nav">
        <a className="brand" href="#" aria-label="Nimbo, inicio"><i />Nimbo</a>
        <nav aria-label="Principal"><ul className="links">{LINKS.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul></nav>
        <a className="btn" href="#">Iniciar sesión</a><a className="btn pri" href="#">Empezar gratis</a>
      </header>
      <main>
        <section className="hero" aria-labelledby="h">
          <div>
            <h1 id="h">Automatiza lo repetitivo y enfoca a tu equipo en lo importante</h1>
            <p>Nimbo conecta tus herramientas y ejecuta los flujos de trabajo por ti. Configúralo en minutos, sin escribir código.</p>
            <div className="actions"><a className="btn pri" href="#">Empezar gratis</a><a className="btn" href="#">Ver demo</a></div>
          </div>
          <div className="win" role="img" aria-label="Vista previa del panel de Nimbo con tres métricas y una gráfica de tendencia">
            <div className="bar"><b /><b /><b /></div>
            <div className="app">
              <div className="side"><i /><i /><i /><i /></div>
              <div className="main">
                <div className="kpis"><div>Flujos<b>128</b></div><div>Horas<b>342</b></div><div>Errores<b>0,4 %</b></div></div>
                <svg viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs><linearGradient id="l"><stop stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
                  <path d="M0 64 40 52 80 58 120 36 160 42 200 22 240 28 300 8" fill="none" stroke="url(#l)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </section>
        <section className="logos" aria-label="Clientes">
          Más de 4.000 equipos automatizan su trabajo con Nimbo
          <ul>{CLIENTES.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>
        <section className="features" aria-labelledby="f">
          <h2 id="f">Todo lo que tu equipo necesita para avanzar</h2>
          <div className="grid">
            {features.map((f) => (
              <article className="card" key={f.title}>
                <div className="ico"><svg viewBox="0 0 24 24">{f.icon.map((d) => <path key={d} d={d} />)}</svg></div>
                <h3>{f.title}</h3><p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="cta" aria-labelledby="c">
          <h2 id="c">Empieza hoy con 14 días gratis</h2>
          <p>Sin tarjeta de crédito. Cancela cuando quieras.</p>
          <a className="btn" href="#">Crear cuenta gratis</a>
        </section>
      </main>
      <footer><span>© 2026 Nimbo, Inc.</span><ul><li><a href="#">Privacidad</a></li><li><a href="#">Términos</a></li><li><a href="#">Estado</a></li></ul></footer>
    </div>
  );
}
// CSS: copia las reglas .page, .nav, .btn, .hero, .win, .logos, .features, .card, .cta y footer de la pestaña HTML + CSS.
