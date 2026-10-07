import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

const LINKS = ['Guías', 'Referencia API', 'Cambios', 'Estado'];

export function NavbarSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('Pulsa / para buscar. Esc cierra el buscador.');
  const input = useRef<HTMLInputElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const tag = document.activeElement?.tagName ?? '';
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(tag)) { e.preventDefault(); setOpen(true); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const close = () => { setOpen(false); setQ(''); };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { close(); toggle.current?.focus(); } };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    setMsg(v ? `Mostrando resultados para «${v}».` : 'Escribe qué quieres buscar, por ejemplo «webhooks».');
  };

  return (
    <>
      <nav className={open ? 'nav searching' : 'nav'} aria-label="Principal">
        <a className="brand" href="#inicio"><i aria-hidden="true" /><span>Nimbo Docs</span></a>
        <ul className="links">
          {LINKS.map((l, i) => (
            <li key={l}><a href={`#${l.toLowerCase()}`} aria-current={i === 0 ? 'page' : undefined}>{l}</a></li>
          ))}
        </ul>
        <form className={open ? 's open' : 's'} role="search" onSubmit={submit}>
          <button ref={toggle} type="button" aria-label="Buscar" aria-expanded={open} aria-controls="q"
                  aria-keyshortcuts="/" onClick={() => (open ? close() : setOpen(true))}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
          </button>
          <input ref={input} id="q" type="search" name="q" value={q} onChange={(e) => setQ(e.target.value)}
                 onKeyDown={onKey} placeholder="Buscar en la documentación" aria-label="Buscar en la documentación" autoComplete="off" />
        </form>
      </nav>
      <p className="res" role="status">{msg}</p>
    </>
  );
}

// CSS: copia las reglas .nav, .brand, .links, .s, .res y kbd de la pestaña HTML + CSS.
