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
  <svg viewBox="0 0 160 112" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="80" cy="20" r="10" strokeDasharray="3 5" />
    <path className="spark" d="M126 14v14M119 21h14" />
    <path className="lid" d="M26 66l12-16h22l6 16zM134 66l-12-16h-22l-6 16z" />
    <rect className="box" x="26" y="66" width="108" height="34" rx="5" />
    <rect className="slot" x="60" y="77" width="40" height="7" rx="3.5" />
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
// CSS: copia los tokens :root y las reglas .empty / .empty svg (.lid .box .slot .spark) / .actions / .btn / .link / .note de la pestaña HTML + CSS.
