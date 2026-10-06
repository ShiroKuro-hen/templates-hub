import { useEffect, useRef, useState } from 'react';

type NavLink = { label: string; href: string };
type Props = { brand?: string; links?: NavLink[]; cta?: NavLink };

const LINKS: NavLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#productos' },
  { label: 'Precios', href: '#precios' },
  { label: 'Contacto', href: '#contacto' },
];

export function NavbarResponsive({ brand = 'Nexo', links = LINKS, cta = { label: 'Crear cuenta', href: '#registro' } }: Props) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(links[0]?.href);
  const burger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); burger.current?.focus(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="nav">
      <a className="brand" href="/">{brand}</a>
      <button
        ref={burger}
        className="burger"
        type="button"
        aria-expanded={open}
        aria-controls="menu"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setOpen(!open)}
      >
        <span />
      </button>
      <nav id="menu" className={open ? 'menu open' : 'menu'} aria-label="Principal">
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={l.href === current ? 'page' : undefined}
                onClick={() => { setCurrent(l.href); setOpen(false); }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn" href={cta.href}>{cta.label}</a>
      </nav>
    </header>
  );
}
// CSS: copia las reglas .nav / .brand / .menu / .menu.open / .btn / .burger (y su @media max-width:560px) y los tokens de la pestaña HTML + CSS.
