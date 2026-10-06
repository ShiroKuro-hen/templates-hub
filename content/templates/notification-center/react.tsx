import { useEffect, useRef, useState } from 'react';

type Note = { id: number; title: string; time: string; read: boolean };
const DATA: Note[] = [
  { id: 1, title: 'Despliegue completado en producción', time: 'Hace 5 min', read: false },
  { id: 2, title: 'Marta Ruiz te asignó la incidencia #482', time: 'Hace 32 min', read: false },
  { id: 3, title: 'Tu factura de septiembre está disponible', time: 'Hace 2 h', read: false },
  { id: 4, title: 'Se renovó el certificado SSL de api.ion.dev', time: 'Ayer', read: true },
];

export function NotificationCenter({ initial = DATA }: { initial?: Note[] }) {
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const bell = useRef<HTMLButtonElement>(null);
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) { setOpen(false); bell.current?.focus(); } };
    const onClick = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, [open]);

  const markRead = (id?: number) =>
    setItems((list) => list.map((n) => (id === undefined || n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="nc" ref={root}>
      <button ref={bell} className="bell" type="button" aria-expanded={open} aria-controls="nc-panel"
              aria-label={unread ? `Notificaciones, ${unread} sin leer` : 'Notificaciones, todo leído'}
              onClick={() => setOpen(!open)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unread > 0 && <span className="count" aria-hidden="true">{unread}</span>}
      </button>
      <section className="panel" id="nc-panel" aria-labelledby="nc-title" hidden={!open}>
        <header>
          <h2 id="nc-title">Notificaciones</h2>
          <button className="link" type="button" disabled={!unread} onClick={() => markRead()}>Marcar todo como leído</button>
        </header>
        <ul>
          {items.map((n) => (
            <li key={n.id}>
              <button className={n.read ? 'item' : 'item unread'} type="button" onClick={() => markRead(n.id)}>
                <span className="dot">{!n.read && <span className="sr">Sin leer.</span>}</span>
                <strong>{n.title}</strong><small>{n.time}</small>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// CSS: copia las reglas .nc, .bell, .count, .panel, .link, .item, .dot y .sr de la pestaña HTML + CSS.
