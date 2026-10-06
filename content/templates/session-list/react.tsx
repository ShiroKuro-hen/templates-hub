import { useRef, useState } from 'react';

type Kind = 'laptop' | 'phone' | 'desktop' | 'tablet';
type Session = { id: string; name: string; detail: string; seen: string; kind: Kind; current?: boolean };

const ICON: Record<Kind, string> = {
  laptop: 'M5 5h14v10H5zM2 19h20',
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  desktop: 'M3 4h18v12H3zM9 20h6M12 16v4',
  tablet: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
};
const INITIAL: Session[] = [
  { id: '1', name: 'MacBook Pro 14"', detail: 'Chrome 126 en macOS, Lima, Perú', seen: 'Activa ahora', kind: 'laptop', current: true },
  { id: '2', name: 'iPhone 15', detail: 'App Norte Cloud 4.2 en iOS 18, Lima, Perú', seen: 'Hace 2 horas', kind: 'phone' },
  { id: '3', name: 'Equipo de oficina', detail: 'Edge 125 en Windows 11, Bogotá, Colombia', seen: 'Ayer a las 18:42', kind: 'desktop' },
  { id: '4', name: 'iPad Air', detail: 'Safari 17 en iPadOS, Madrid, España', seen: 'Hace 6 días', kind: 'tablet' },
];

export function SessionList({ initial = INITIAL, onRevoke }: { initial?: Session[]; onRevoke?: (ids: string[]) => Promise<void> }) {
  const [list, setList] = useState(initial);
  const [live, setLive] = useState('');
  const dlg = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const others = list.filter((s) => !s.current);
  const plural = (n: number, a: string, b: string) => `${n} ${n === 1 ? a : b}`;

  async function revoke(ids: string[], msg: string) {
    await onRevoke?.(ids);
    setList((l) => l.filter((s) => !ids.includes(s.id)));
    setLive(msg); title.current?.focus();
  }

  return (
    <main className="card" aria-labelledby="t">
      <header>
        <div>
          <h1 id="t" ref={title} tabIndex={-1}>Sesiones activas <span className="meta">{plural(list.length, 'sesión activa', 'sesiones activas')}</span></h1>
          <p>Estos dispositivos tienen la sesión abierta. Cierra los que no reconozcas.</p>
        </div>
        <button className="btn danger" type="button" disabled={!others.length}
                onClick={() => { if (dlg.current) dlg.current.returnValue = ''; dlg.current?.showModal(); }}>Cerrar las demás sesiones</button>
      </header>
      <ul>
        {list.map((s) => (
          <li key={s.id} className="row">
            <span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON[s.kind]} /></svg></span>
            <div>
              <p className="name">{s.name}{s.current && <span className="badge">Este dispositivo</span>}</p>
              <p className="meta">{s.detail}</p>
              <p className="meta">{s.current && <span className="dot" aria-hidden="true" />}{s.seen}</p>
            </div>
            {!s.current && (
              <button className="btn" type="button" aria-label={`Cerrar sesión en ${s.name}`}
                      onClick={() => revoke([s.id], `Sesión cerrada en ${s.name}.`)}>Cerrar sesión</button>
            )}
          </li>
        ))}
      </ul>
      {!others.length && <p className="empty">No hay otras sesiones abiertas. Tu cuenta solo está activa en este dispositivo.</p>}
      <dialog ref={dlg} aria-labelledby="dt"
              onClose={(e) => { if (e.currentTarget.returnValue === 'ok') revoke(others.map((s) => s.id), 'Cerraste las demás sesiones.'); }}>
        <form method="dialog">
          <h2 id="dt">¿Cerrar {plural(others.length, 'sesión', 'sesiones')}?</h2>
          <p>Se cerrará la sesión en los demás dispositivos. Tendrás que iniciar sesión de nuevo en cada uno.</p>
          <div className="actions"><button className="btn" value="cancel">Cancelar</button><button className="btn fill" value="ok">Cerrar sesiones</button></div>
        </form>
      </dialog>
      <p className="sr" role="status" aria-live="polite">{live}</p>
    </main>
  );
}

// CSS: copia las reglas .card, header, h1, .row, .ico, .name, .meta, .badge, .dot, .btn, .empty, dialog, .actions y .sr de la pestaña HTML + CSS.
