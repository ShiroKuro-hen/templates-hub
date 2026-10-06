import type { ReactNode } from 'react';

type NavItem = { href: string; label: string };
type Props = {
  titulo?: string;
  nav?: NavItem[];
  actual?: string; // href activo
  aside?: ReactNode;
  children: ReactNode; // contenido principal
};

const NAV: NavItem[] = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#pedidos', label: 'Pedidos' },
  { href: '#clientes', label: 'Clientes' },
  { href: '#ajustes', label: 'Ajustes' },
];

export function HolyGrail({ titulo = 'Taller Luna', nav = NAV, actual = '#inicio', aside, children }: Props) {
  return (
    <>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <div className="page">
        <header>
          <h1>{titulo}</h1>
          <span className="tag">Panel</span>
        </header>
        <nav aria-label="Principal">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} aria-current={n.href === actual ? 'page' : undefined}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <main id="contenido">{children}</main>
        <aside aria-label="Avisos">{aside}</aside>
        <footer><small>© 2026 {titulo}. Todos los derechos reservados.</small></footer>
      </div>
    </>
  );
}
// CSS: copia las reglas .page (grid-template-areas) / header / nav / main / aside / footer / .skip / .tag y los tokens :root de la pestaña HTML + CSS.
