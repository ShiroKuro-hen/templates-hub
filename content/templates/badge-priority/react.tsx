import type { CSSProperties } from 'react';

type Priority = 'alta' | 'media' | 'baja';
type TagColor = 'accent' | 'ok' | 'info' | 'warn';
type Task = { title: string; priority: Priority; tags: { label: string; color: TagColor }[] };

const LABEL: Record<Priority, string> = { alta: 'Alta', media: 'Media', baja: 'Baja' };
const TASKS: Task[] = [
  { title: 'Corregir pago duplicado en el checkout', priority: 'alta', tags: [{ label: 'Backend', color: 'accent' }] },
  { title: 'Revisar textos del onboarding', priority: 'media', tags: [{ label: 'Diseño', color: 'ok' }, { label: 'Documentación', color: 'info' }] },
  { title: 'Actualizar dependencias de pruebas', priority: 'baja', tags: [{ label: 'Infraestructura', color: 'warn' }] },
];

export function PriorityBadge({ level }: { level: Priority }) {
  return (
    <span className={`pri ${level}`}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
        <rect y="8" width="3" height="4" rx=".5" /><rect x="4.5" y="5" width="3" height="7" rx=".5" /><rect x="9" y="2" width="3" height="10" rx=".5" />
      </svg>
      <span className="sr">Prioridad </span>{LABEL[level]}
    </span>
  );
}

export function Tag({ label, color }: { label: string; color: TagColor }) {
  return <li className="tag" style={{ '--c': `var(--${color})` } as CSSProperties}>{label}</li>;
}

export function SprintTasks({ tasks = TASKS }: { tasks?: Task[] }) {
  return (
    <section className="card" aria-labelledby="sprint">
      <h2 id="sprint">Tareas del sprint</h2>
      <ul>
        {tasks.map((t) => (
          <li className="item" key={t.title}>
            <div>
              <span className="title">{t.title}</span>
              <ul className="tags" aria-label="Etiquetas">{t.tags.map((g) => <Tag key={g.label} {...g} />)}</ul>
            </div>
            <PriorityBadge level={t.priority} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// CSS: copia las reglas .card, .item, .tags, .tag, .pri y .sr de la pestaña HTML + CSS.
