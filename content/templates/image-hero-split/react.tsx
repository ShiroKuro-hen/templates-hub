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
          <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23dbeafe%22%2F%3E%3Ccircle%20cx%3D%22290%22%20cy%3D%2290%22%20r%3D%2238%22%20fill%3D%22%23fbbf24%22%2F%3E%3Cpath%20d%3D%22M0%20230Q100%20150%20200%20215T400%20190V300H0Z%22%20fill%3D%22%232563eb%22%2F%3E%3Cpath%20d%3D%22M0%20265Q120%20205%20240%20258T400%20245V300H0Z%22%20fill%3D%22%231e3a8a%22%2F%3E%3C%2Fsvg%3E" alt="Colinas al atardecer con un sol bajo y dos capas de montañas" width={400} height={300} loading="lazy" />
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
