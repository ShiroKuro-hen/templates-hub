type LinkItem = { label: string; href: string };
type Column = { title: string; links: LinkItem[] };
type Social = { name: string; href: string; paths: string[] }; // paths = atributos "d" 24x24

type FooterProps = {
  columns: Column[];
  socials?: Social[];
  tagline?: string;
  legal?: LinkItem[];
};

export function SiteFooter({ columns, socials = [], tagline, legal = [] }: FooterProps) {
  return (
    <footer>
      <div className="top">
        <div>
          <a className="brand" href="#inicio" aria-label="Nimbo, inicio">
            <span aria-hidden="true">N</span>Nimbo
          </a>
          {tagline && <p className="tag">{tagline}</p>}
          <ul className="social">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} aria-label={`Nimbo en ${s.name}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {s.paths.map((d) => <path key={d} d={d} />)}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav className="cols" aria-label="Pie de página">
          {columns.map((c) => (
            <div className="col" key={c.title}>
              <h2>{c.title}</h2>
              <ul>
                {c.links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="legal">
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} Nimbo Software, S.L. Todos los derechos reservados.</p>
        <ul>{legal.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul>
      </div>
    </footer>
  );
}
// CSS: copia las reglas footer / .top / .brand / .tag / .social / .cols / .col / h2 / .legal de la pestaña HTML + CSS.
