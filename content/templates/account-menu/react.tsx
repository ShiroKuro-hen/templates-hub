import { Fragment, useEffect, useRef, useState, type KeyboardEvent } from 'react';

type Item = { label: string; d: string; kbd?: string; danger?: boolean };
const ITEMS: Item[] = [
  { label: 'Mi perfil', d: 'M16 8a4 4 0 1 0-8 0a4 4 0 1 0 8 0M4 21a8 8 0 0 1 16 0' },
  { label: 'Facturación', d: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18' },
  { label: 'Equipo', d: 'M12.5 8a3.5 3.5 0 1 0-7 0a3.5 3.5 0 1 0 7 0M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5' },
  { label: 'Atajos de teclado', kbd: '?', d: 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10' },
  { label: 'Cerrar sesión', danger: true, d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' },
];
const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

type Props = { name?: string; email?: string; plan?: string; used?: number; total?: number; onSelect?: (label: string) => void };

export function AccountMenu({ name = 'Lucía Ferrer', email = 'lucia.ferrer@norte.cloud', plan = 'Plan Business', used = 6.4, total = 10, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState('Abre el menú desde tu avatar.');
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const initials = name.split(' ').map((w) => w[0]).join('');
  const focusItem = (i: number) => requestAnimationFrame(() => items.current.at(i)?.focus());

  useEffect(() => {
    if (!open) return;
    const out = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('click', out);
    return () => document.removeEventListener('click', out);
  }, [open]);

  function trigger(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); focusItem(e.key === 'ArrowDown' ? 0 : -1); }
  }
  function menu(e: KeyboardEvent) {
    const n = ITEMS.length, i = items.current.indexOf(document.activeElement as HTMLButtonElement);
    const to = ({ ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
    if (to !== undefined) { e.preventDefault(); items.current[to]?.focus(); }
    else if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); }
    else if (e.key === 'Tab') setOpen(false);
  }
  function pick(it: Item) {
    setLog(it.danger ? 'Cerraste la sesión.' : `Elegiste «${it.label}».`);
    onSelect?.(it.label); setOpen(false); btn.current?.focus();
  }

  return (
    <main>
      <header className="bar">
        <span className="brand"><span className="logo" aria-hidden="true" />Norte Cloud</span>
        <div className="wrap" ref={wrap}>
          <button ref={btn} className="trigger" type="button" aria-haspopup="menu" aria-expanded={open} aria-controls="pop"
                  onClick={() => { setOpen(!open); if (!open) focusItem(0); }} onKeyDown={trigger}>
            <span className="avatar" aria-hidden="true">{initials}</span>{name}
            <Icon d="m6 9 6 6 6-6" />
          </button>
          <div id="pop" className="pop" hidden={!open} onKeyDown={menu}>
            <div className="head"><span className="avatar lg" aria-hidden="true">{initials}</span><div><strong>{name}</strong><span className="mail">{email}</span></div></div>
            <div className="plan">
              <p><span className="badge">{plan}</span><span>{used.toLocaleString('es')} de {total} GB</span></p>
              <div className="meter" aria-hidden="true"><i style={{ width: `${(used / total) * 100}%` }} /></div>
            </div>
            <div role="menu" aria-label="Acciones de la cuenta">
              {ITEMS.map((it, i) => (
                <Fragment key={it.label}>
                  {it.danger && <hr role="separator" />}
                  <button ref={(el) => { items.current[i] = el; }} className={it.danger ? 'item danger' : 'item'} role="menuitem" tabIndex={-1} type="button" onClick={() => pick(it)}>
                    <Icon d={it.d} />{it.label}{it.kbd && <kbd aria-hidden="true">{it.kbd}</kbd>}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </header>
      <p className="log" role="status">{log}</p>
    </main>
  );
}

// CSS: copia las reglas main, .bar, .brand, .logo, .wrap, .trigger, .avatar, .pop, .head, .plan, .badge, .meter, .item y kbd de la pestaña HTML + CSS.
