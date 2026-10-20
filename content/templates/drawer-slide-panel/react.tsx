import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';

type Side = 'left' | 'right' | 'bottom';
const SIDES: [Side, string][] = [['left', 'Izquierda'], ['right', 'Derecha'], ['bottom', 'Abajo']];

const isOutside = (e: MouseEvent<HTMLDialogElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
};

export function DrawerSlidePanel({ producto = 'Web corporativa' }: { producto?: string }) {
  const [side, setSide] = useState<Side>('right');
  const [msg, setMsg] = useState('');
  const page = useRef<HTMLElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  const openDrawer = () => {
    form.current?.reset();
    if (page.current) page.current.inert = true;
    dlg.current?.showModal();
  };

  const onClose = () => {
    if (page.current) page.current.inert = false;
    trigger.current?.focus();
    if (dlg.current?.returnValue === 'save') setMsg(`Ajustes guardados para ${nameInput.current?.value.trim() ?? ''}.`);
  };

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget && isOutside(e)) dlg.current?.close('cancel');
  };

  return (
    <>
      <main ref={page} className="page">
        <h1>Preferencias</h1>
        <p className="lead">Elige desde qué borde aparece el panel y ábrelo para editar tus ajustes de «{producto}».</p>
        <fieldset>
          <legend>Posición del panel</legend>
          <div className="segmented">
            {SIDES.map(([value, label]) => (
              <label key={value}>
                <input type="radio" name="side" value={value} checked={side === value} onChange={() => setSide(value)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button ref={trigger} type="button" className="btn primary" aria-haspopup="dialog" onClick={openDrawer}>
          Abrir ajustes
        </button>
        <p className="status" role="status">{msg}</p>
      </main>

      <dialog ref={dlg} className="drawer" data-side={side} aria-labelledby="dr-title" onClose={onClose} onClick={onBackdropClick}>
        <form ref={form} method="dialog">
          <header className="head">
            <div>
              <h2 id="dr-title">Ajustes de cuenta</h2>
              <p>Los cambios se aplican a tu perfil.</p>
            </div>
            <button type="submit" value="cancel" className="x" aria-label="Cerrar ajustes" formNoValidate>×</button>
          </header>
          <div className="body">
            <label htmlFor="name">Nombre para mostrar</label>
            <input ref={nameInput} id="name" name="name" required autoComplete="name" defaultValue="Lucía Torres" autoFocus />
            <label htmlFor="mail">Correo electrónico</label>
            <input id="mail" name="mail" type="email" required autoComplete="email" defaultValue="lucia@empresa.com" />
            <label className="check"><input type="checkbox" name="digest" defaultChecked /> Recibir un resumen semanal</label>
          </div>
          <footer className="foot">
            <button type="submit" value="cancel" className="btn" formNoValidate>Cancelar</button>
            <button type="submit" value="save" className="btn primary">Guardar</button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
// CSS: copia las reglas de la pestaña HTML + CSS (:root, .page, h1, .lead, fieldset, legend, .segmented, .status, .btn, .btn.primary, :focus-visible, .drawer con sus [data-side], [open], @starting-style, ::backdrop y @media, .head, .x, .body, .check, .foot).
