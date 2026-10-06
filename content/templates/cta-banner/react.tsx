type CtaBannerProps = {
  title: string;
  text?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function CtaBanner({ title, text, primary, secondary }: CtaBannerProps) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <svg className="deco" viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="100" cy="60" r="56" fill="#ffd84d" stroke="#17130f" strokeWidth="3" />
        <circle cx="100" cy="60" r="30" fill="none" stroke="#17130f" strokeWidth="3" />
      </svg>
      <div className="txt">
        <h2 id="cta-title">{title}</h2>
        {text && <p>{text}</p>}
      </div>
      <div className="row">
        <a className="btn" href={primary.href}>{primary.label}</a>
        {secondary && <a className="link" href={secondary.href}>{secondary.label}</a>}
      </div>
    </section>
  );
}

// Uso:
// <CtaBanner title="Empieza hoy con tu primer proyecto." text="Gratis hasta 5 personas."
//   primary={{ label: 'Crear cuenta gratis', href: '#empezar' }} secondary={{ label: 'Hablar con ventas', href: '#ventas' }} />
// CSS: copia las reglas .cta / .deco / .txt / .row / .btn / .link de la pestaña HTML + CSS.
