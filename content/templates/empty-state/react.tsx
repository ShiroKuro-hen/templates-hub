import { ReactNode, useState } from 'react';

type Props = {
  title?: string;
  description?: string;
  actionLabel?: string;
  secondaryLabel?: string;
  onAction?: () => string | void; // el texto devuelto se anuncia con role="status"
  illustration?: ReactNode;
};

const EmptyBox = () => (
  <svg viewBox="0 0 160 112" fill="none" stroke="#17130f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="80" cy="104" rx="46" ry="5" fill="#17130f1f" stroke="none" />
    <circle cx="80" cy="20" r="10" strokeDasharray="4 6" />
    <path d="M126 14v14M119 21h14" stroke="#3b5bfd" />
    <path d="M26 66l12-16h22l6 16zM134 66l-12-16h-22l-6 16z" fill="#ffd84d" />
    <rect x="26" y="66" width="108" height="34" rx="5" fill="#fffdf8" />
    <rect x="60" y="76" width="40" height="9" rx="4.5" fill="#ff5a36" />
  </svg>
);

export function EmptyState({
  title = 'Aún no tienes proyectos',
  description = 'Crea el primero para empezar a organizar tu trabajo.',
  actionLabel = 'Crear proyecto',
  secondaryLabel = 'Importar desde CSV',
  onAction,
  illustration = <EmptyBox />,
}: Props) {
  const [note, setNote] = useState('');

  return (
    <section className="empty" aria-labelledby="empty-title">
      {illustration}
      <h2 id="empty-title">{title}</h2>
      <p>{description}</p>
      <div className="actions">
        <button className="btn" type="button" onClick={() => setNote(onAction?.() || 'Proyecto creado: «Sin título».')}>
          {actionLabel}
        </button>
        {secondaryLabel && <button className="link" type="button">{secondaryLabel}</button>}
      </div>
      <p className="note" role="status">{note}</p>
    </section>
  );
}
// CSS: copia las reglas .empty / .empty svg / .actions / .btn / .link / .note de la pestaña HTML + CSS.
