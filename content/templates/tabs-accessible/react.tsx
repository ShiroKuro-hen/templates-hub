import { KeyboardEvent, ReactNode, useRef, useState } from 'react';

type Tab = { id: string; label: string; content: ReactNode };
type Props = { tabs?: Tab[]; label?: string };

const DEMO: Tab[] = [
  { id: 'resumen', label: 'Resumen', content: <p>Entrega prevista el 14 de noviembre. 18 de 24 tareas completadas.</p> },
  { id: 'actividad', label: 'Actividad', content: <p>Marta subió 3 mockups y Luis cerró la tarea «Carrito».</p> },
  { id: 'ajustes', label: 'Ajustes', content: <p>Nombre, miembros del equipo y notificaciones.</p> },
];

export function Tabs({ tabs = DEMO, label = 'Detalle del proyecto' }: Props) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number) => {
    setActive(i);
    refs.current[i]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const n = tabs.length;
    const next = { ArrowRight: (active + 1) % n, ArrowLeft: (active - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    go(next);
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            id={`tab-${t.id}`}
            type="button"
            aria-selected={i === active}
            aria-controls={`panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <section key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} tabIndex={0} hidden={i !== active}>
          {t.content}
        </section>
      ))}
    </div>
  );
}
// CSS: copia las reglas [role="tablist"] / [role="tab"] / [role="tabpanel"] (y .tabs) de la pestaña HTML + CSS.
