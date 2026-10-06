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
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 2l10 6-10 6z" fill="currentColor" />
              </svg>
              {secondary.label}
            </a>
          )}
        </div>
        {note && <p className="note">{note}</p>}
      </div>
      <svg className="art" viewBox="0 0 320 260" role="img" aria-label="Tablero de tareas con tres columnas">
        <rect x="14" y="14" width="296" height="236" rx="12" fill="#17130f" />
        <rect x="6" y="6" width="296" height="236" rx="12" fill="#fffdf8" stroke="#17130f" strokeWidth="3" />
        <path d="M6 42h296" stroke="#17130f" strokeWidth="3" />
        {[20, 113, 206].map((x) => (
          <rect key={x} x={x} y="58" width="82" height="170" rx="8" fill="#f6f1e7" stroke="#17130f" strokeWidth="3" />
        ))}
        <rect x="28" y="112" width="66" height="44" rx="6" fill="#ffd84d" stroke="#17130f" strokeWidth="3" />
        <rect x="121" y="128" width="66" height="34" rx="6" fill="#3b5bfd" stroke="#17130f" strokeWidth="3" />
        <circle cx="268" cy="52" r="26" fill="#1f9d55" stroke="#17130f" strokeWidth="3" />
        <path d="M256 52l9 9 16-18" fill="none" stroke="#fffdf8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </section>
  );
}
// CSS: copia las reglas .hero / .badge / .sub / .row / .btn / .btn.main / .note / .art de la pestaña HTML + CSS.
