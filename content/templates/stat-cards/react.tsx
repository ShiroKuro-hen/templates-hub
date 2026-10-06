type Stat = { label: string; value: string; delta: number }; // delta en %, negativo = baja

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <small>{s.label}</small>
          <strong>{s.value}</strong>
          <span className={s.delta >= 0 ? 'up' : 'down'}>{Math.abs(s.delta)}%</span>
        </div>
      ))}
    </div>
  );
}
// CSS: copia las reglas .stats / .stat / .up / .down de la pestaña HTML + CSS.
