import { useEffect, useId, useRef, type ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: (returnValue: string) => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
};

export function Modal({ open, onClose, title, children, confirmLabel = 'Eliminar' }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();

  // Sincroniza el estado de React con el <dialog> nativo.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { d.returnValue = ''; d.showModal(); }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
      onClose={(e) => onClose(e.currentTarget.returnValue)} // Esc y form method="dialog"
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close('cancel')} // clic en el fondo
    >
      <form method="dialog">
        <h2 id={`${id}-t`}>{title}</h2>
        <p id={`${id}-d`}>{children}</p>
        <div className="actions">
          <button className="btn" value="cancel" autoFocus>Cancelar</button>
          <button className="btn danger" value="delete">{confirmLabel}</button>
        </div>
      </form>
    </dialog>
  );
}

// Uso: <Modal open={open} onClose={(v) => { setOpen(false); if (v === 'delete') borrar(); }} title="¿Eliminar «Rediseño web»?">Se borrarán sus 24 archivos.</Modal>
// El foco vuelve solo al botón que abrió el modal (comportamiento nativo de showModal).
// CSS: copia las reglas .btn / .btn.danger / dialog / dialog::backdrop / dialog form / dialog h2 / dialog p / .actions y @keyframes pop de la pestaña HTML + CSS.
