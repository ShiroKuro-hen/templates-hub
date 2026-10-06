import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = 'secondary', className = '', type = 'button', ...rest }: Props) {
  const mod = variant === 'secondary' ? '' : ` btn--${variant}`;
  return <button type={type} className={`btn${mod} ${className}`.trim()} {...rest} />;
}

// Ejemplo de uso
export function Demo() {
  return (
    <div className="grid">
      <Button variant="primary">Guardar cambios</Button>
      <Button>Cancelar</Button>
      <Button variant="ghost">Omitir por ahora</Button>
      <Button variant="danger">Eliminar cuenta</Button>
      <Button variant="link">Ver detalles</Button>
    </div>
  );
}
// CSS: copia las reglas .grid / .btn / .btn--primary / .btn--danger / .btn--ghost / .btn--link de la pestaña HTML + CSS.
