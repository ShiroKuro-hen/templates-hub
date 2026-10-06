import { useState } from 'react';

type Kpi = { label: string; value: string; delta: string; good: boolean };
type Order = { cliente: string; pedido: string; estado: 'Pagado' | 'Pendiente' | 'En revisión'; importe: string };

const NAV = [
  ['Resumen', 'M4 11l8-7 8 7v9h-5v-6H9v6H4z'],
  ['Proyectos', 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18'],
  ['Informes', 'M5 20V10M12 20V4M19 20v-7'],
  ['Equipo', 'M9 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6'],
  ['Ajustes', 'M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6M12 2v3M12 19v3M2 12h3M19 12h3'],
] as const;
const BADGE = { Pagado: 'b-ok', Pendiente: 'b-warn', 'En revisión': 'b-info' } as const;

const KPIS: Kpi[] = [
  { label: 'Ingresos mensuales', value: '48 250 €', delta: '+12,4 %', good: true },
  { label: 'Usuarios activos', value: '3 812', delta: '+5,1 %', good: true },
  { label: 'Conversión', value: '4,7 %', delta: '−0,3 %', good: false },
  { label: 'Incidencias abiertas', value: '17', delta: '−6', good: true },
];
const ORDERS: Order[] = [
  { cliente: 'Altamira Logística', pedido: '#10482', estado: 'Pagado', importe: '1 240,00 €' },
  { cliente: 'Grupo Sendero', pedido: '#10481', estado: 'Pendiente', importe: '890,50 €' },
  { cliente: 'Estudio Faro', pedido: '#10479', estado: 'En revisión', importe: '2 310,00 €' },
];

export function DashboardShell({ kpis = KPIS, orders = ORDERS, active = 'Resumen' }: { kpis?: Kpi[]; orders?: Order[]; active?: string }) {
  const [q, setQ] = useState('');
  const rows = orders.filter((o) => `${o.cliente} ${o.pedido}`.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="app">
      <nav className="side" aria-label="Principal">
        <div className="brand"><span className="logo" aria-hidden="true" />Nimbo</div>
        <ul>
          {NAV.map(([label, d]) => (
            <li key={label}>
              <a href="#" aria-current={label === active ? 'page' : undefined}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={d} /></svg>
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="main">
        <header className="top">
          <div className="search" role="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar clientes o pedidos" aria-label="Buscar clientes o pedidos" />
          </div>
          <button className="icon" type="button" aria-label="Notificaciones, 3 sin leer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" /></svg>
          </button>
          <button className="avatar" type="button" aria-label="Cuenta de Laura Méndez">LM</button>
        </header>
        <main className="content">
          <div className="head">
            <div><h1>Resumen</h1><p>Datos de los últimos 30 días.</p></div>
            <button className="btn" type="button">Nuevo proyecto</button>
          </div>
          <dl className="kpis">
            {kpis.map((k) => (
              <div className="kpi" key={k.label}>
                <dt>{k.label}</dt>
                <dd><strong>{k.value}</strong><span className={`delta ${k.good ? 'up' : 'down'}`}>{k.delta}</span></dd>
              </div>
            ))}
          </dl>
          <section className="panel" aria-labelledby="recent">
            <h2 id="recent">Actividad reciente</h2>
            <table>
              <thead><tr><th scope="col">Cliente</th><th scope="col">Pedido</th><th scope="col">Estado</th><th scope="col" className="num">Importe</th></tr></thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.pedido}>
                    <td>{o.cliente}</td><td>{o.pedido}</td>
                    <td><span className={`badge ${BADGE[o.estado]}`}>{o.estado}</span></td>
                    <td className="num">{o.importe}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr className="empty"><td colSpan={4}>No hay resultados. Prueba con otro nombre o número de pedido.</td></tr>}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}

// CSS: copia las reglas .app, .side, .main, .top, .search, .icon, .avatar, .content, .kpis, .kpi, .delta, .panel, table y .badge de la pestaña HTML + CSS.
