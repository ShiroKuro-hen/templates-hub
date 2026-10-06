import { useRef, useState } from 'react';

type Props = { name?: string; detail?: string; word?: string; onConfirm?: () => void };

export function ConfirmDelete({
  name = 'Web corporativa',
  detail = 'Se borrarán 128 archivos y 3 integraciones. Esta acción no se puede deshacer.',
  word = 'ELIMINAR',
  onConfirm,
}: Props) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);

  const open = () => { setTyped(''); if (dlg.current) dlg.current.returnValue = ''; dlg.current?.showModal(); };
  const onClose = () => {
    if (dlg.current?.returnValue !== 'confirm') return;
    setDone(true);
    onConfirm?.();
  };

  return (
    <>
      <section className="zone" aria-labelledby="zone-title">
        <div>
          <h2 id="zone-title">Eliminar proyecto</h2>
          <p>Borra «{name}», sus archivos y su historial. No se puede deshacer.</p>
          <p className="status" role="status">{done ? `Eliminaste «${name}».` : ''}</p>
        </div>
        <button className="btn danger" type="button" onClick={open} disabled={done}>Eliminar proyecto</button>
      </section>

      <dialog ref={dlg} onClose={onClose} aria-labelledby="dlg-title" aria-describedby="dlg-desc">
        <form method="dialog">
          <div className="icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" /></svg>
          </div>
          <h2 id="dlg-title">¿Eliminar «{name}»?</h2>
          <p id="dlg-desc">{detail}</p>
          <label htmlFor="confirm-in">Escribe <b>{word}</b> para confirmar</label>
          <input id="confirm-in" autoComplete="off" spellCheck={false} autoCapitalize="characters"
                 value={typed} onChange={(e) => setTyped(e.target.value)} />
          <div className="actions">
            <button className="btn" type="button" onClick={() => dlg.current?.close()}>Cancelar</button>
            <button className="btn danger" value="confirm" disabled={typed.trim() !== word}>Eliminar proyecto</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

// CSS: copia las reglas .zone, .status, .btn, dialog, .icon y .actions de la pestaña HTML + CSS.
