import { useState, type ReactNode } from 'react';

type Props = {
  label: string; // nombre accesible base, p. ej. "Notificaciones"
  count?: number; // número; 0 oculta la insignia
  dot?: boolean; // punto sin número
  max?: number; // tope visual (por defecto 99)
  children: ReactNode; // el icono
};

export function BadgeButton({ label, count = 0, dot = false, max = 99, children }: Props) {
  const text = count > max ? `${max}+` : String(count);
  const aria = count ? `${label}, ${count} sin leer` : dot ? `${label}, hay novedades` : label;
  return (
    <button type="button" className="btn icon" aria-label={aria}>
      {children}
      {count > 0 && <span className="count" aria-hidden="true">{text}</span>}
      {dot && !count && <span className="dot" aria-hidden="true" />}
    </button>
  );
}

const Bell = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10 21h4" />
  </svg>
);

export function Demo() {
  const [n, setN] = useState(3);
  return (
    <>
      <BadgeButton label="Notificaciones" count={n}><Bell /></BadgeButton>
      <BadgeButton label="Ajustes" dot><Bell /></BadgeButton>
      <button type="button" onClick={() => setN(n + 1)}>Llegó una notificación</button>
      <button type="button" onClick={() => setN(0)}>Marcar leídas</button>
    </>
  );
}
// CSS: copia las reglas .btn / .icon / .count / .dot de la pestaña HTML + CSS.
