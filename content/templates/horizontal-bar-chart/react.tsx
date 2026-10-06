type Item = { label: string; value: number };

const DATA: Item[] = [
  { label: 'Plan Pro mensual', value: 980 },
  { label: 'Plan Pro anual', value: 1840 },
  { label: 'Soporte prioritario', value: 388 },
  { label: 'Plan Team', value: 1325 },
  { label: 'Almacenamiento extra', value: 612 },
];
const ROW = 46;
const fmt = new Intl.NumberFormat('es');

export function HorizontalBarChart({ data = DATA, title = 'Productos más vendidos', subtitle = 'Unidades vendidas en septiembre de 2026' }:
  { data?: Item[]; title?: string; subtitle?: string }) {
  const rows = [...data].sort((a, b) => b.value - a.value);
  const max = rows[0]?.value || 1;
  const resumen = rows.map((r, i) => `${i + 1}, ${r.label}, ${fmt.format(r.value)} unidades`).join('; ');

  return (
    <figure>
      <figcaption><strong>{title}</strong><span>{subtitle}</span></figcaption>
      <svg width="100%" height={rows.length * ROW - 12} role="img" aria-label={`Ranking de ventas: ${resumen}`}>
        <defs>
          <linearGradient id="ion-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient>
        </defs>
        {rows.map((r, i) => {
          const y = i * ROW;
          return (
            <g key={r.label}>
              <text className="label" x="0" y={y + 14}><tspan className="rank">{i + 1}{'  '}</tspan>{r.label}</text>
              <text className="val" x="100%" y={y + 14}>{fmt.format(r.value)}</text>
              <rect className="track" x="0" y={y + 22} width="100%" height="10" rx="5" />
              <rect className={i === 0 ? 'bar top' : 'bar'} x="0" y={y + 22} width={`${(r.value / max) * 100}%`} height="10" rx="5" />
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

// CSS: copia las reglas figure, figcaption, svg, .label, .rank, .val, .track y .bar de la pestaña HTML + CSS.
