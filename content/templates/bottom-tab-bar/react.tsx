import type { ReactNode } from 'react';

type Tab = { id: string; label: string; href: string; icon: ReactNode; badge?: number };
const svg = (d: ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
export const TABS: Tab[] = [
  { id: 'inicio', label: 'Inicio', href: '/', icon: svg(<path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" />) },
  { id: 'buscar', label: 'Buscar', href: '/buscar', icon: svg(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>) },
  { id: 'pedidos', label: 'Pedidos', href: '/pedidos', icon: svg(<path d="M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10" />) },
  { id: 'mensajes', label: 'Mensajes', href: '/mensajes', icon: svg(<path d="M4 5h16v11H9l-5 4z" />), badge: 3 },
  { id: 'perfil', label: 'Perfil', href: '/perfil', icon: svg(<><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>) },
];

type Props = { tabs?: Tab[]; current: string; onNavigate?: (id: string) => void };

export function BottomTabBar({ tabs = TABS, current, onNavigate }: Props) {
  return (
    <nav aria-label="Principal">
      <ul className="tabs">
        {tabs.map((t) => (
          <li key={t.id}>
            <a href={t.href} aria-current={t.id === current ? 'page' : undefined}
               onClick={onNavigate && ((e) => { e.preventDefault(); onNavigate(t.id); })}>
              <span className="ico">
                {t.icon}
                {!!t.badge && <span className="badge" aria-hidden="true">{t.badge > 99 ? '99+' : t.badge}</span>}
              </span>
              {t.label}
              {!!t.badge && <span className="sr">, {t.badge} sin leer</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// CSS: copia las reglas .tabs, .ico, .badge y .sr de la pestaña HTML + CSS.
