import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  tip: string;
  below?: boolean; // muestra el tooltip debajo en vez de encima
  children: ReactNode;
};

// Tooltip solo CSS: React solo conecta aria-describedby con el role="tooltip".
export function TipButton({ tip, below = false, children, className = 'btn', ...rest }: Props) {
  const id = useId();
  return (
    <span className={`tip${below ? ' below' : ''}`}>
      <button type="button" className={className} aria-describedby={id} {...rest}>
        {children}
      </button>
      <span role="tooltip" id={id}>{tip}</span>
    </span>
  );
}

// Uso: <TipButton tip="Copia el enlace al portapapeles">Copiar</TipButton>
//      <TipButton tip="Archivar oculta el proyecto" below className="btn help" aria-label="Ayuda">?</TipButton>
// CSS: copia las reglas .btn / .help / .tip / .tip [role="tooltip"] (y sus ::before / ::after) / .tip.below / .tip:hover / .tip:has(:focus-visible) de la pestaña HTML + CSS.
