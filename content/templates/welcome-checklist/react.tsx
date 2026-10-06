import { useState } from 'react';

type Task = { id: string; title: string; detail: string; minutes: number; action?: { label: string; href: string } };

const TASKS: Task[] = [
  { id: 'cuenta', title: 'Crea tu cuenta', detail: 'Tu cuenta está verificada con ana.lopez@lumen.es.', minutes: 1 },
  { id: 'equipo', title: 'Invita a tu equipo', detail: 'Tres personas ya tienen acceso. Puedes invitar a más desde Miembros.', minutes: 2 },
  { id: 'fuente', title: 'Conecta una fuente de datos', detail: 'Importa un CSV o conecta tu base de datos PostgreSQL para ver métricas reales.', minutes: 5, action: { label: 'Conectar fuente', href: '#fuentes' } },
  { id: 'panel', title: 'Crea tu primer panel', detail: 'Parte de la plantilla de ventas o empieza con un panel en blanco.', minutes: 4, action: { label: 'Crear panel', href: '#paneles' } },
  { id: 'alertas', title: 'Configura las alertas', detail: 'Recibe un aviso cuando una métrica cambie más de un 10 % en un día.', minutes: 3, action: { label: 'Configurar alertas', href: '#alertas' } },
];

export function WelcomeChecklist({ tasks = TASKS, initialDone = ['cuenta', 'equipo'] }: { tasks?: Task[]; initialDone?: string[] }) {
  const [done, setDone] = useState<Set<string>>(() => new Set(initialDone));
  const firstPending = tasks.find((t) => !initialDone.includes(t.id))?.id;
  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <section className="card" aria-labelledby="ttl">
      <header className="head">
        <div>
          <h2 id="ttl">Configura tu espacio en Nimbus</h2>
          <p className="sub" aria-live="polite"><b>{done.size}</b> de {tasks.length} pasos completados</p>
        </div>
        <span className="pct" aria-hidden="true">{Math.round((done.size / tasks.length) * 100)}%</span>
      </header>
      <progress max={tasks.length} value={done.size} aria-label="Progreso de configuración" />
      <ol className="tasks">
        {tasks.map((t) => (
          <li key={t.id}>
            <input type="checkbox" checked={done.has(t.id)} onChange={() => toggle(t.id)} aria-label={`Hecho: ${t.title}`} />
            <details open={t.id === firstPending}>
              <summary><span>{t.title}</span><small>{t.minutes} min</small></summary>
              <p>{t.detail}</p>
              {t.action && <a href={t.action.href}>{t.action.label}</a>}
            </details>
          </li>
        ))}
      </ol>
      {done.size === tasks.length && <p className="all-done">Todo listo. Comparte tu primer panel con el equipo.</p>}
    </section>
  );
}

// CSS: copia las reglas .card, .head, progress, .tasks, summary, details y .all-done de la pestaña HTML + CSS.
