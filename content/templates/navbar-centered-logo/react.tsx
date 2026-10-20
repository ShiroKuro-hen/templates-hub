import { useRef, useState, type KeyboardEvent } from 'react';

const LEFT = ['Inicio', 'Productos'];
const RIGHT = ['Precios', 'Contacto'];

export function NavbarCenteredLogo() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('Inicio');
  const burger = useRef<HTMLButtonElement>(null);

  const choose = (label: string) => {
    setCurrent(label);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      burger.current?.focus();
    }
  };

  const item = (label: string) => (
    <li key={label}>
      <a href="#" aria-current={label === current ? 'page' : undefined} onClick={(e) => { e.preventDefault(); choose(label); }}>
        {label}
      </a>
    </li>
  );

  return (
    <div className="page" onKeyDown={onKeyDown}>
      <header className="bar">
        <a className="brand" href="#"><i aria-hidden="true" />Nexo</a>
        <button
          ref={burger}
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen(!open)}
        >
          <svg className="m" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          <svg className="x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <nav id="menu" className={open ? 'menu open' : 'menu'} aria-label="Principal">
          <ul className="l">{LEFT.map(item)}</ul>
          <ul className="r">
            {RIGHT.map(item)}
            <li><a className="btn" href="#">Crear cuenta</a></li>
          </ul>
        </nav>
      </header>
      <main className="content">
        <h1>{current}</h1>
        <p>En pantallas estrechas, el botón abre el menú a ancho completo. Esc lo cierra y el foco vuelve al botón.</p>
      </main>
    </div>
  );
}
// CSS: copia las reglas de .page / .bar / .brand / .burger / .menu / .btn / .content de la pestaña HTML + CSS (tokens incluidos).
