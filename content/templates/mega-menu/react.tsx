import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';

type Link = { label: string; desc: string; href: string };
type Column = { title: string; links: Link[] };
type Props = { columns: Column[]; feature: { title: string; text: string; cta: string; href: string } };

export function MegaMenu({ columns, feature }: Props) {
  const [open, setOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (!nav.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const onBtnKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown') return;
    e.preventDefault();
    setOpen(true);
    requestAnimationFrame(() => panel.current?.querySelector('a')?.focus());
  };
  const onNavKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) { setOpen(false); btn.current?.focus(); } };
  const onBlur = (e: FocusEvent) => {
    const t = e.relatedTarget as Node | null;
    if (t && t !== btn.current && !panel.current?.contains(t)) setOpen(false); // Tab fuera del panel
  };

  return (
    <nav aria-label="Principal" ref={nav} onKeyDown={onNavKey} onBlur={onBlur}>
      <span className="brand">Ion Cloud</span>
      <ul>
        <li>
          <button ref={btn} type="button" className="top" aria-expanded={open} aria-controls="panel"
                  onClick={() => setOpen(!open)} onKeyDown={onBtnKey}>
            Productos
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 4.5l3 3 3-3" /></svg>
          </button>
          <div className="panel" id="panel" ref={panel} hidden={!open}>
            {columns.map((c, i) => (
              <div key={c.title}>
                <h3 id={`col-${i}`}>{c.title}</h3>
                <ul aria-labelledby={`col-${i}`}>
                  {c.links.map((l) => <li key={l.label}><a href={l.href}>{l.label}<span>{l.desc}</span></a></li>)}
                </ul>
              </div>
            ))}
            <div className="feature">
              <div className="line" aria-hidden="true" />
              <strong>{feature.title}</strong>
              <p>{feature.text}</p>
              <a href={feature.href}>{feature.cta}</a>
            </div>
          </div>
        </li>
        <li><a className="top" href="#">Precios</a></li>
        <li><a className="top" href="#">Documentación</a></li>
      </ul>
    </nav>
  );
}

// CSS: copia las reglas nav, .brand, .top, .panel, h3, .feature y las media queries de la pestaña HTML + CSS.
