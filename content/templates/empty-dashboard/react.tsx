import { useState } from 'react';

type Kpi = { label: string; value: string; delta: string };
const KPIS: Kpi[] = [
  { label: 'Ingresos', value: '48.920 €', delta: '+12 % frente al mes anterior' },
  { label: 'Pedidos', value: '1.284', delta: '+8 % frente al mes anterior' },
  { label: 'Conversión', value: '3,8 %', delta: '+0,4 puntos' },
];

export function EmptyDashboard({ kpis = KPIS }: { kpis?: Kpi[] }) {
  const [demo, setDemo] = useState(false);

  return (
    <section className="dash" aria-labelledby="ttl">
      <header className="top">
        <div>
          <h2 id="ttl">Resumen de ventas</h2>
          <p className="sub">{demo ? 'Mostrando datos de ejemplo.' : 'Aún no hay fuentes conectadas.'}</p>
        </div>
        <span className="chip">Últimos 30 días</span>
      </header>

      <dl className="kpis">
        {kpis.map((k) => (
          <div key={k.label} className={`kpi panel${demo ? ' on' : ''}`}>
            <dt>{k.label}</dt>
            <dd><b>{demo ? k.value : '—'}</b><small>{demo ? k.delta : 'Sin datos'}</small></dd>
          </div>
        ))}
      </dl>

      <div className={`chart panel${demo ? ' demo' : ''}`}>
        <svg viewBox="0 0 600 210" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
          <path className="grid" d="M0 50H600M0 100H600M0 150H600" />
          <path className="line" d="M20 150C80 140 110 90 170 100S260 150 320 110 420 50 480 70 560 40 585 30" />
        </svg>
        {!demo && (
          <div className="invite">
            <h3>Conecta tus datos para ver métricas</h3>
            <p>Tus paneles se llenarán en cuanto conectes una fuente. Tarda unos 5 minutos.</p>
            <div className="btns">
              <a className="btn main" href="#conectar">Conectar fuente de datos</a>
              <a className="btn" href="#csv">Importar CSV</a>
            </div>
          </div>
        )}
      </div>

      <ul className="cards">
        <li><a className="card panel" href="#conectar"><strong>Conectar una base de datos</strong><span>PostgreSQL, MySQL o BigQuery.</span><small>5 min</small></a></li>
        <li><a className="card panel" href="#csv"><strong>Importar un archivo CSV</strong><span>Sube un archivo de hasta 50 MB.</span><small>2 min</small></a></li>
        <li>
          <button type="button" className="card panel" aria-pressed={demo} onClick={() => setDemo(!demo)}>
            <strong>Explorar con datos de ejemplo</strong><span>Mira cómo quedaría tu panel sin conectar nada.</span><small>Al instante</small>
          </button>
        </li>
      </ul>
    </section>
  );
}

// CSS: copia las reglas .dash, .panel, .kpis, .chart, .invite, .btn y .cards de la pestaña HTML + CSS.
