import { useEffect, useRef, useState } from 'react';

type Action = { label: string; d: string };
const ACTIONS: Action[] = [
  { label: 'Nueva tarea', d: 'M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11' },
  { label: 'Subir archivo', d: 'M12 16V4M7 9l5-5 5 5M4 20h16' },
  { label: 'Invitar persona', d: 'M5 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6' },
];

export function FabMenu({ actions = ACTIONS, onAction }: { actions?: Action[]; onAction?: (label: string) => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const wrap = useRef<HTMLDivElement>(null);
  const fab = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    wrap.current?.querySelector<HTMLButtonElement>('.actions button')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); fab.current?.focus(); } };
    const onClick = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, [open]);

  const choose = (label: string) => {
    setStatus(`Elegiste: ${label}.`);
    setOpen(false);
    fab.current?.focus();
    onAction?.(label);
  };

  return (
    <section className="stage" aria-labelledby="fab-title">
      <h2 id="fab-title">Proyecto Atlas</h2>
      <p>Usa el botón Crear para añadir contenido sin salir de la página.</p>
      <p className="status" role="status">{status}</p>
      <div className="fab-wrap" ref={wrap}>
        <button ref={fab} className="fab" type="button" aria-label="Crear" aria-expanded={open}
                aria-controls="fab-actions" onClick={() => setOpen(!open)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <ul className="actions" id="fab-actions" hidden={!open}>
          {actions.map((a) => (
            <li key={a.label}>
              <button type="button" onClick={() => choose(a.label)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={a.d} /></svg>
                {a.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// CSS: copia las reglas .stage, .fab-wrap, .fab, .actions y button:focus-visible de la pestaña HTML + CSS.
