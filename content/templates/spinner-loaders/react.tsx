type Variant = 'ring' | 'dots' | 'bars';
type SpinnerProps = { variant?: Variant; label?: string };

const PARTS: Record<Variant, number> = { ring: 0, dots: 3, bars: 5 };

export function Spinner({ variant = 'ring', label = 'Cargando' }: SpinnerProps) {
  return (
    <div className={variant} role="status">
      {Array.from({ length: PARTS[variant] }, (_, i) => <i key={i} />)}
      <span className="sr">{label}</span>
    </div>
  );
}

export function SpinnerShowcase() {
  return (
    <div className="grid">
      {(['ring', 'dots', 'bars'] as const).map((v) => (
        <figure className="card" key={v}>
          <div className="stage"><Spinner variant={v} /></div>
          <figcaption>{{ ring: 'Aro', dots: 'Puntos', bars: 'Barras' }[v]}</figcaption>
        </figure>
      ))}
    </div>
  );
}
// CSS: copia las reglas .grid / .card / .stage / .sr / .ring / .dots / .bars y los @keyframes spin, hop y stretch de la pestaña HTML + CSS.
