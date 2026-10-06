type Cta = { label: string; href: string };

type HeroProps = {
  badge?: string;
  title: string;
  subtitle: string;
  primary: Cta;
  secondary?: Cta;
  note?: string;
};

export function Hero({ badge, title, subtitle, primary, secondary, note }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div>
        {badge && <p className="badge">{badge}</p>}
        <h1 id="hero-title">{title}</h1>
        <p className="sub">{subtitle}</p>
        <div className="row">
          <a className="btn main" href={primary.href}>{primary.label}</a>
          {secondary && (
            <a className="btn" href={secondary.href}>
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 2l10 6-10 6z" fill="currentColor" />
              </svg>
              {secondary.label}
            </a>
          )}
        </div>
        {note && <p className="note">{note}</p>}
      </div>
      <svg className="art" viewBox="0 0 320 260" role="img" aria-label="Tablero de tareas con tres columnas">
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#2f5bff" />
          </linearGradient>
        </defs>
        <rect className="win" x="6" y="6" width="308" height="244" rx="10" />
        {[18, 115, 212].map((x) => (
          <rect key={x} className="col" x={x} y="56" width="90" height="182" rx="8" />
        ))}
        <rect className="hot" x="26" y="112" width="74" height="46" rx="6" />
        <rect className="card" x="123" y="68" width="74" height="50" rx="6" />
        <g className="pop">
          <circle cx="268" cy="52" r="22" fill="url(#hg)" />
          <path d="M258 52l7 7 13-14" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </section>
  );
}
// CSS: copia las reglas .hero / .badge / .sub / .row / .btn / .btn.main / .note / .art (y .art .win/.col/.card/.hot) de la pestaña HTML + CSS, junto con los tokens :root.
