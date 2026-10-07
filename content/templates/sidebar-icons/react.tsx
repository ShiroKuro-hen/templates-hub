import { useState } from 'react';

type Item = { id: string; label: string; aria?: string; d: string; icon: string; badge?: number };
const TOP: Item[] = [
  { id: 'inicio', label: 'Inicio', d: 'Resumen de actividad de tu equipo esta semana.', icon: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1z' },
  { id: 'proyectos', label: 'Proyectos', d: 'Tienes 8 proyectos activos y 2 por revisar.', icon: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'mensajes', label: 'Mensajes', aria: 'Mensajes, 3 sin leer', badge: 3, d: 'Tienes 3 mensajes sin leer.', icon: 'M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { id: 'analitica', label: 'Analítica', d: 'Las visitas subieron un 12 % frente a la semana pasada.', icon: 'M4 20V10M10 20V4M16 20v-7M21 20H3' },
  { id: 'equipo', label: 'Equipo', d: '12 personas en 3 equipos. Invita a alguien nuevo.', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8' },
];
const BOTTOM: Item[] = [
  { id: 'ajustes', label: 'Ajustes', d: 'Gestiona tu cuenta, el plan y las integraciones.',
    icon: 'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M13 6a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0M15 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0' },
];

export function SidebarIcons() {
  const [cur, setCur] = useState(TOP[0]);
  const [esc, setEsc] = useState(false);

  const list = (items: Item[]) => (
    <ul>
      {items.map((it) => (
        <li key={it.id}>
          <a href={`#${it.id}`} data-tip={it.label} aria-label={it.aria ?? it.label}
             aria-current={cur.id === it.id ? 'page' : undefined}
             onClick={(e) => { e.preventDefault(); setCur(it); }}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={it.icon} /></svg>
            {it.badge && <span className="n" aria-hidden="true">{it.badge}</span>}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="app">
      <nav className="rail" aria-label="Principal" data-esc={esc ? '' : undefined}
           onKeyDown={(e) => e.key === 'Escape' && setEsc(true)}
           onMouseOver={() => esc && setEsc(false)} onFocus={() => esc && setEsc(false)}>
        <span className="logo" aria-hidden="true" />
        {list(TOP)}
        {list(BOTTOM)}
      </nav>
      <main>
        <h1>{cur.label}</h1>
        <p aria-live="polite">{cur.d}</p>
      </main>
    </div>
  );
}

// CSS: copia las reglas .app, .rail, .logo, .n, main y h1 de la pestaña HTML + CSS.
