import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';

const isOutside = (e: MouseEvent<HTMLDialogElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
};

export function DialogEnterExit({ producto = 'Web corporativa' }: { producto?: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState('');

  const openDialog = () => {
    setEmail('');
    if (dlg.current) dlg.current.returnValue = '';
    dlg.current?.showModal();
  };

  const onClose = () => {
    trigger.current?.focus();
    if (dlg.current?.returnValue === 'send') setSent(email.trim());
  };

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget && isOutside(e)) dlg.current?.close('cancel');
  };

  return (
    <main className="page">
      <h1>Equipo</h1>
      <p className="lead">Invita a personas al proyecto «{producto}».</p>
      <button ref={trigger} type="button" className="btn primary" aria-haspopup="dialog" onClick={openDialog}>
        Invitar al equipo
      </button>
      <p className="status" role="status">{sent && `Invitación enviada a ${sent}.`}</p>

      <dialog ref={dlg} className="modal" aria-labelledby="dlg-title" aria-describedby="dlg-desc" onClose={onClose} onClick={onBackdropClick}>
        <form method="dialog">
          <h2 id="dlg-title">Invitar a una persona</h2>
          <p id="dlg-desc">Le enviaremos un enlace para unirse al proyecto. Caduca en 7 días.</p>
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" required autoComplete="email" placeholder="nombre@empresa.com" autoFocus
                 value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="actions">
            <button className="btn" type="submit" value="cancel" formNoValidate>Cancelar</button>
            <button className="btn primary" type="submit" value="send">Enviar invitación</button>
          </div>
        </form>
      </dialog>
    </main>
  );
}
// CSS: copia las reglas :root, .page, h1, .lead, .status, .btn (y .primary), :focus-visible, .modal (incluidos @starting-style, ::backdrop y @media) y .actions de la pestaña HTML + CSS.
