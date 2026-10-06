type State = 'done' | 'now' | 'next';
type Milestone = { title: string; date: string; state: State };
type Person = { name: string; role: string };
type Project = {
  name: string; due: string; progress: number;
  stats: [string, string][]; milestones: Milestone[]; team: Person[];
};

const PROJECT: Project = {
  name: 'Rediseño del portal de clientes',
  due: 'Entrega prevista el 14 de noviembre.',
  progress: 68,
  stats: [['Tareas', '34 de 50'], ['Presupuesto', '62 %'], ['Días restantes', '39']],
  milestones: [
    { title: 'Descubrimiento e investigación', date: '12 sep', state: 'done' },
    { title: 'Diseño de interfaz', date: '26 sep', state: 'done' },
    { title: 'Desarrollo del front-end', date: '20 oct', state: 'now' },
    { title: 'Pruebas de accesibilidad', date: '3 nov', state: 'next' },
    { title: 'Lanzamiento', date: '14 nov', state: 'next' },
  ],
  team: [
    { name: 'Ana Pérez', role: 'Dirección del proyecto' },
    { name: 'Marta Ruiz', role: 'Diseño de producto' },
    { name: 'Carlos Díaz', role: 'Desarrollo front-end' },
  ],
};

const LABEL: Record<State, string> = { done: 'Completado el', now: 'Vence el', next: 'Previsto el' };
const initials = (n: string) => n.split(' ').map((p) => p[0]).join('');

export function ProjectSummary({ project: p = PROJECT }: { project?: Project }) {
  return (
    <section className="proj" aria-labelledby="ps-t">
      <div className="head">
        <div><h2 id="ps-t">{p.name}</h2><p>{p.due}</p></div>
        <span className="badge">En curso</span>
      </div>
      <div className="pg">
        <div><label htmlFor="ps-p">Avance general</label><span>{p.progress} %</span></div>
        <progress id="ps-p" value={p.progress} max={100}>{p.progress} %</progress>
      </div>
      <dl className="stats">
        {p.stats.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <div className="cols">
        <div>
          <h3>Hitos</h3>
          <ol className="ms">
            {p.milestones.map((m) => (
              <li key={m.title} className={m.state} aria-current={m.state === 'now' ? 'step' : undefined}>
                <span className="m" aria-hidden="true">
                  {m.state === 'done' && <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                </span>
                <div><b>{m.title}</b><small>{LABEL[m.state]} {m.date}</small></div>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3>Responsables</h3>
          <ul className="team">
            {p.team.map((t) => (
              <li key={t.name}>
                <span className="av" aria-hidden="true">{initials(t.name)}</span>
                <div><b>{t.name}</b><small>{t.role}</small></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
// CSS: copia las reglas .proj / .head / .badge / .pg / progress / .stats / .cols / .ms / .m / .team / .av de la pestaña HTML + CSS.
