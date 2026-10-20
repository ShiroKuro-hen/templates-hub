import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

type Panel = 'ws' | 'bell' | 'me';

const NOTES = [
  { id: 1, text: 'Ana comentó en Rediseño', when: 'Hace 5 min' },
  { id: 2, text: 'Se completó la tarea «Facturas»', when: 'Hace 1 h' },
  { id: 3, text: 'Invitación aceptada por Marcos', when: 'Ayer' },
];

export function NavbarAppActions() {
  const [open, setOpen] = useState<Panel | null>(null);
  const search = useRef<HTMLInputElement>(null);
  const triggers = {
    ws: useRef<HTMLButtonElement>(null),
    bell: useRef<HTMLButtonElement>(null),
    me: useRef<HTMLButtonElement>(null),
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.wrap')) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        search.current?.focus();
      }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const toggle = (panel: Panel) => setOpen(open === panel ? null : panel);
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && open) {
      triggers[open].current?.focus();
      setOpen(null);
    }
  };

  return (
    <div className="page" onKeyDown={onKeyDown}>
      <header className="bar">
        <a className="brand" href="#"><i aria-hidden="true">N</i><span>Nimbo</span></a>
        <div className="wrap">
          <button
            ref={triggers.ws}
            className="ws"
            type="button"
            aria-expanded={open === 'ws'}
            aria-controls="ws-pop"
            aria-label="Espacio de trabajo: Equipo Nimbo"
            onClick={() => toggle('ws')}
          >
            <span className="ws-mark" aria-hidden="true">E</span>
            <span className="ws-name" aria-hidden="true">Equipo Nimbo</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div className="pop start" id="ws-pop" hidden={open !== 'ws'}>
            <p className="pop-title">Espacios de trabajo</p>
            <ul>
              <li><button type="button" aria-current="true">Equipo Nimbo <span>Activo</span></button></li>
              <li><button type="button">Marketing</button></li>
              <li><button type="button">Clientes beta</button></li>
            </ul>
          </div>
        </div>
        <label className="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
          <input ref={search} id="q" type="search" placeholder="Buscar proyectos" aria-label="Buscar proyectos" autoComplete="off" />
          <kbd>Ctrl K</kbd>
        </label>
        <div className="wrap">
          <button
            ref={triggers.bell}
            className="icon-btn"
            type="button"
            aria-expanded={open === 'bell'}
            aria-controls="bell-pop"
            aria-label={`Notificaciones, ${NOTES.length} sin leer`}
            onClick={() => toggle('bell')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
            <span className="count" aria-hidden="true">{NOTES.length}</span>
          </button>
          <div className="pop end" id="bell-pop" hidden={open !== 'bell'}>
            <p className="pop-title">Notificaciones</p>
            <ul className="notes">
              {NOTES.map((n) => (
                <li key={n.id}><span className="dot" aria-hidden="true" /><div><b>{n.text}</b><span>{n.when}</span></div></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="wrap">
          <button
            ref={triggers.me}
            className="avatar-btn"
            type="button"
            aria-expanded={open === 'me'}
            aria-controls="me-pop"
            aria-label="Cuenta de Lucía Ferrer"
            onClick={() => toggle('me')}
          >
            <span className="avatar" aria-hidden="true">LF</span>
          </button>
          <div className="pop end" id="me-pop" hidden={open !== 'me'}>
            <div className="me"><span className="avatar lg" aria-hidden="true">LF</span><div><b>Lucía Ferrer</b><span>lucia@nimbo.app</span></div></div>
            <ul>
              <li><button type="button">Mi perfil</button></li>
              <li><button type="button">Preferencias</button></li>
              <li><button type="button" className="danger">Cerrar sesión</button></li>
            </ul>
          </div>
        </div>
      </header>
      <main className="content">
        <h1>Proyectos</h1>
        <p>Ocho proyectos activos esta semana. Pulsa Ctrl K para encontrar uno.</p>
      </main>
    </div>
  );
}
// CSS: copia las reglas de .bar / .brand / .ws / .search / .icon-btn / .count / .avatar / .pop / .notes / .me / .content (y la media query de 479px) de la pestaña HTML + CSS.
