import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

type Kind = 'mention' | 'ok' | 'warn' | 'info' | 'edit';
type Filter = 'todas' | 'sin-leer';
export type Note = { id: string; kind: Kind; text: string; min: number; read: boolean };

const ICON: Record<Kind, string> = { mention: '@', ok: '✓', warn: '!', info: 'i', edit: '✎' };
const TABS: { id: Filter; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'sin-leer', label: 'Sin leer' },
];
const RTF = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
const ago = (min: number) =>
  min < 60 ? RTF.format(-min, 'minute') : min < 1440 ? RTF.format(-Math.round(min / 60), 'hour') : RTF.format(-Math.round(min / 1440), 'day');

const DEFAULTS: Note[] = [
  { id: 'n1', kind: 'mention', text: 'Lucía Ferrer te mencionó en «Presupuesto Q3».', min: 4, read: false },
  { id: 'n2', kind: 'ok', text: 'Tu exportación de informes ya está lista para descargar.', min: 25, read: false },
  { id: 'n3', kind: 'warn', text: 'Tu plan vence en 3 días. Renueva para no perder el acceso.', min: 120, read: false },
  { id: 'n4', kind: 'edit', text: 'Marta Ruiz comentó en la revisión de contratos.', min: 200, read: true },
  { id: 'n5', kind: 'info', text: 'Hay una nueva versión 2.4 con mejoras de velocidad.', min: 600, read: false },
  { id: 'n6', kind: 'mention', text: 'Carlos Díaz te asignó una tarea del equipo.', min: 1500, read: true },
  { id: 'n7', kind: 'ok', text: 'Se completó la importación de 340 contactos.', min: 3000, read: true },
  { id: 'n8', kind: 'edit', text: 'Jorge Salas editó el documento «Política de viajes».', min: 5000, read: false },
];

export function NotificationBellPanel({ initial = DEFAULTS }: { initial?: Note[] }) {
  const [notes, setNotes] = useState(initial);
  const [filter, setFilter] = useState<Filter>('todas');
  const [visible, setVisible] = useState(() => initial.map((n) => n.id));
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<Partial<Record<Filter, HTMLButtonElement | null>>>({});

  const unread = notes.filter((n) => !n.read).length;
  const shown = notes.filter((n) => visible.includes(n.id));

  const applyFilter = (next: Filter, list: Note[]) => {
    setFilter(next);
    setVisible(list.filter((n) => next === 'todas' || !n.read).map((n) => n.id));
  };

  const markRead = (id: string) => setNotes(notes.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () => {
    const all = notes.map((n) => ({ ...n, read: true }));
    setNotes(all);
    applyFilter(filter, all);
    tabRefs.current[filter]?.focus();
  };

  const closePanel = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) bellRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    tabRefs.current[filter]?.focus();
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = TABS[(i + step + TABS.length) % TABS.length].id;
    applyFilter(next, notes);
    tabRefs.current[next]?.focus();
  };

  return (
    <header className="top">
      <div>
        <h1>Panel de control</h1>
        <p>Actividad de tu equipo hoy</p>
      </div>
      <div
        className="wrap"
        ref={wrapRef}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && open) closePanel(true);
        }}
      >
        <button
          ref={bellRef}
          type="button"
          className="bell"
          aria-label="Notificaciones"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="pop"
          onClick={() => (open ? closePanel(true) : setOpen(true))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {unread > 0 && (
            <span className="badge" aria-hidden="true">
              {unread}
            </span>
          )}
        </button>
        <span className="sr" aria-live="polite">
          {unread ? `${unread} sin leer` : 'Sin notificaciones sin leer'}
        </span>
        {open && (
          <div className="pop" id="pop" role="dialog" aria-label="Notificaciones">
            <div className="head">
              <strong>Notificaciones</strong>
              <button type="button" className="link" disabled={!unread} onClick={markAllRead}>
                Marcar todas como leídas
              </button>
            </div>
            <div className="tabs" role="tablist">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[t.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`t-${t.id}`}
                  aria-controls="panel"
                  aria-selected={filter === t.id}
                  tabIndex={filter === t.id ? 0 : -1}
                  className="tab"
                  onClick={() => applyFilter(t.id, notes)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  {t.label}
                  {t.id === 'sin-leer' && <span className="n">{unread}</span>}
                </button>
              ))}
            </div>
            <div role="tabpanel" id="panel" aria-labelledby={`t-${filter}`}>
              <ul className="list">
                {shown.map((n) => (
                  <li key={n.id}>
                    <button type="button" className="item" data-unread={!n.read || undefined} onClick={() => markRead(n.id)}>
                      <span className={`ico ${n.kind}`} aria-hidden="true">
                        {ICON[n.kind]}
                      </span>
                      <span className="txt">
                        {!n.read && <span className="sr">Sin leer: </span>}
                        {n.text}
                        <time className="time">{ago(n.min)}</time>
                      </span>
                      {!n.read && <span className="dot" aria-hidden="true" />}
                    </button>
                  </li>
                ))}
              </ul>
              {shown.length === 0 && (
                <div className="empty">
                  <span className="check" aria-hidden="true">
                    ✓
                  </span>
                  <b>Estás al día</b>
                  No tienes notificaciones sin leer.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
// CSS: copia las reglas de la pestaña HTML + CSS (desde .top hasta .check, la animación pop-in y la media query), sin los tokens.
