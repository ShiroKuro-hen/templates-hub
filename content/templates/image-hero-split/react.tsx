type Cta = { label: string; href: string };

type ImageHeroSplitProps = {
  pill: string;
  title: string;
  subtitle: string;
  primary: Cta;
  secondary: Cta;
  note: string;
  floatTitle: string;
  floatText: string;
};

export function ImageHeroSplit({ pill, title, subtitle, primary, secondary, note, floatTitle, floatText }: ImageHeroSplitProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="copy">
        <p className="pill">{pill}</p>
        <h1 id="hero-title">{title}</h1>
        <p className="sub">{subtitle}</p>
        <div className="row">
          <a className="btn main" href={primary.href}>{primary.label}</a>
          <a className="btn" href={secondary.href}>{secondary.label}</a>
        </div>
        <p className="note">{note}</p>
      </div>
      <figure className="frame">
        <div className="pic">
          <img src="/stock/isla-blanca.webp" alt="Pueblo blanco de una isla griega junto al mar" width={800} height={533} fetchPriority="high" />
        </div>
        <div className="float">
          <i aria-hidden="true">✓</i>
          <span><b>{floatTitle}</b><small>{floatText}</small></span>
        </div>
      </figure>
    </section>
  );
}
// CSS: copia los tokens :root y las reglas .hero / .copy / .frame / .pill / h1 / .sub / .row / .btn / .note / .pic / .float (y su i, b, small) de la pestaña HTML + CSS.
