import { useState } from 'react';

type Item = { id: string; label: string; icon: string }; // icon = atributo "d" de un path 24x24
type Section = { title: string; items: Item[] };
type Props = { sections?: Section[]; brand?: string; onNavigate?: (id: string) => void };

const SECTIONS: Section[] = [
  {
    title: 'Trabajo',
    items: [
      { id: 'panel', label: 'Panel', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
      { id: 'proyectos', label: 'Proyectos', icon: 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
      { id: 'tareas', label: 'Tareas', icon: 'M4 4h16v16H4zM8 12l3 3 5-6' },
    ],
  },
  {
    title: 'Equipo',
    items: [
      { id: 'miembros', label: 'Miembros', icon: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7' },
      { id: 'ajustes', label: 'Ajustes', icon: 'M4 7h9M17 7h3M4 17h3M11 17h9M13 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0' },
    ],
  },
];

export function Sidebar({ sections = SECTIONS, brand = 'Tinta&Co', onNavigate }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState(sections[0].items[0].id);

  return (
    <aside className={collapsed ? 'side collapsed' : 'side'}>
      <div className="head">
        <span className="brand">{brand}</span>
        <button
          className="toggle"
          type="button"
          aria-expanded={!collapsed}
          aria-controls="menu"
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          onClick={() => setCollapsed(!collapsed)}
        >
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
        </button>
      </div>
      <nav id="menu" aria-label="Lateral">
        {sections.map((s) => (
          <div className="grp" key={s.title}>
            <h2 className="sec">{s.title}</h2>
            <ul>
              {s.items.map((it) => (
                <li key={it.id}>
                  <a
                    href={`#${it.id}`}
                    title={collapsed ? it.label : undefined}
                    aria-current={it.id === current ? 'page' : undefined}
                    onClick={() => { setCurrent(it.id); onNavigate?.(it.id); }}
                  >
                    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d={it.icon} /></svg>
                    <span className="lbl">{it.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
// CSS: copia las reglas .side / .side.collapsed / .head / .brand / .toggle / .grp / .sec / .ic / .lbl de la pestaña HTML + CSS.
