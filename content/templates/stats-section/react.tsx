type Stat = { label: string; value: string; context: string; trend?: 'up' | 'down' };

const STATS: Stat[] = [
  { label: 'Disponibilidad', value: '99,98 %', context: 'Últimos 12 meses, sin incidencias graves.' },
  { label: 'Solicitudes al día', value: '2,4 M', context: '18 % más que el trimestre anterior.', trend: 'up' },
  { label: 'Latencia media', value: '38 ms', context: '6 ms menos tras migrar a la región UE.', trend: 'down' },
  { label: 'Equipos activos', value: '4.200', context: 'En 31 países y 9 idiomas.' },
];
const ARROW = { up: 'M12 19V5M5 12l7-7 7 7', down: 'M12 5v14M5 12l7 7 7-7' };

type Props = { title?: string; lead?: string; stats?: Stat[] };

export function StatsSection({
  title = 'La plataforma en cifras',
  lead = 'Datos de producción a 30 de septiembre de 2026, medidos en todas las regiones.',
  stats = STATS,
}: Props) {
  return (
    <section className="stats" aria-labelledby="stats-title">
      <h2 id="stats-title">{title}</h2>
      <p className="lead">{lead}</p>
      <dl>
        {stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd className="value">{s.value}</dd>
            <dd className="ctx">
              {s.trend && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={ARROW[s.trend]} />
                </svg>
              )}
              {s.context}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// CSS: copia las reglas .stats, .lead, dl, dt, .value, .ctx y las media queries de la pestaña HTML + CSS.
