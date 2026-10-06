import { useEffect, useRef, type FormEvent, type ReactNode } from 'react';

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  onApply?: (data: FormData) => void;
  children: ReactNode; // los campos del formulario
};

export function Drawer({ open, title, onClose, onApply, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const submit = (e: FormEvent<HTMLFormElement>) => onApply?.(new FormData(e.currentTarget));

  return (
    <dialog
      ref={ref}
      aria-labelledby="drawer-title"
      onClose={onClose} // Esc, × y Aplicar pasan por aquí
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()} // clic en el fondo
    >
      <header>
        <h2 id="drawer-title">{title}</h2>
        <button type="button" className="x" aria-label="Cerrar filtros" onClick={() => ref.current?.close()}>×</button>
      </header>
      <form method="dialog" style={{ display: 'contents' }} onSubmit={submit}>
        <div className="body">{children}</div>
        <footer>
          <button type="reset" className="btn">Limpiar</button>
          <button className="btn main">Aplicar filtros</button>
        </footer>
      </form>
    </dialog>
  );
}

// Uso: <Drawer open={open} title="Filtros" onClose={() => setOpen(false)} onApply={(d) => console.log(d.getAll('estado'))}>
//        <fieldset><legend>Estado</legend><label><input type="checkbox" name="estado" value="Enviado" /> Enviado</label></fieldset>
//      </Drawer>
// CSS: copia las reglas .btn / .btn.main / dialog / dialog::backdrop / header (y ::after) / footer / h2 / .x / .body / fieldset / legend / label / input y @keyframes slide de la pestaña HTML + CSS.
