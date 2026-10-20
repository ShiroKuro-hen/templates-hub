type Props = { titulo?: string; texto?: string; accion?: string };

export function GradientBorderGlow({
  titulo = 'Plan Empresa',
  texto = 'Informes avanzados, soporte prioritario y espacios ilimitados.',
  accion = 'Activar notificaciones',
}: Props) {
  return (
    <main className="stage">
      <article className="gbg gbg-card">
        <div className="gbg-face">
          <h3>{titulo}</h3>
          <p>{texto}</p>
        </div>
      </article>
      <button type="button" className="gbg gbg-btn">
        <span className="gbg-face">{accion}</span>
      </button>
    </main>
  );
}

// CSS: copia las reglas .stage, .gbg (con ::before/::after), .gbg-card, .gbg-face, .gbg-btn, @property, @keyframes y prefers-reduced-motion de la pestaña HTML + CSS.
