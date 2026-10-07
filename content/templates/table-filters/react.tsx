import { useState } from 'react';

type Cliente = { nombre: string; plan: string; estado: 'Activo' | 'Prueba' | 'Suspendido'; mrr: number };
const DATA: Cliente[] = [
  { nombre: 'Textiles Andina', plan: 'Team', estado: 'Activo', mrr: 1240 },
  { nombre: 'Café del Valle', plan: 'Pro', estado: 'Prueba', mrr: 0 },
  { nombre: 'Logística Pacífico', plan: 'Enterprise', estado: 'Activo', mrr: 8900 },
  { nombre: 'Estudio Mirador', plan: 'Pro', estado: 'Activo', mrr: 390 },
  { nombre: 'Agro Sierra', plan: 'Team', estado: 'Suspendido', mrr: 1240 },
  { nombre: 'Clínica San Isidro', plan: 'Enterprise', estado: 'Activo', mrr: 6450 },
  { nombre: 'Bodega Los Olivos', plan: 'Free', estado: 'Prueba', mrr: 0 },
  { nombre: 'Nova Telecom', plan: 'Pro', estado: 'Suspendido', mrr: 390 },
];
const TONO = { Activo: 'ok', Prueba: 'warn', Suspendido: 'err' } as const;
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim();
const money = (n: number) => `S/ ${n.toLocaleString('es-PE')}`;

export function FilterTable({ rows = DATA }: { rows?: Cliente[] }) {
  const [q, setQ] = useState('');
  const [nombre, setNombre] = useState('');
  const [plan, setPlan] = useState('');
  const [estado, setEstado] = useState('');

  const shown = rows.filter((r) =>
    norm(`${r.nombre} ${r.plan} ${r.estado} ${money(r.mrr)}`).includes(norm(q)) &&
    norm(r.nombre).includes(norm(nombre)) && (!plan || r.plan === plan) && (!estado || r.estado === estado));
  const filtered = !!(nombre || plan || estado);
  const clear = () => { setQ(''); setNombre(''); setPlan(''); setEstado(''); };

  return (
    <section className="card" aria-labelledby="t">
      <header>
        <h2 id="t">Clientes</h2>
        <div className="search">
          <label className="sr" htmlFor="q">Buscar en toda la tabla</label>
          <input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar cliente, plan o estado" autoComplete="off" />
        </div>
      </header>
      <div className="scroll">
        <table className={filtered ? 'on' : undefined}>
          <caption className="sr">Clientes. Los filtros bajo cada encabezado reducen las filas al instante.</caption>
          <thead>
            <tr><th scope="col">Cliente</th><th scope="col">Plan</th><th scope="col">Estado</th><th scope="col" className="num">MRR</th></tr>
            <tr className="f">
              <td><input type="text" aria-label="Filtrar por cliente" placeholder="Filtrar" value={nombre} onChange={(e) => setNombre(e.target.value)} /></td>
              <td>
                <select aria-label="Filtrar por plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
                  <option value="">Todos</option>{['Free', 'Pro', 'Team', 'Enterprise'].map((p) => <option key={p}>{p}</option>)}
                </select>
              </td>
              <td>
                <select aria-label="Filtrar por estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                  <option value="">Todos</option>{Object.keys(TONO).map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td />
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.nombre}>
                <th scope="row">{r.nombre}</th><td>{r.plan}</td>
                <td><span className={`b ${TONO[r.estado]}`}>{r.estado}</span></td><td className="num">{money(r.mrr)}</td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr id="none"><td colSpan={4}>Ningún cliente coincide. Cambia los filtros o limpia la búsqueda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <footer>
        <span role="status">{shown.length} de {rows.length} clientes</span>
        {(q || filtered) && <button className="btn" type="button" onClick={clear}>Limpiar filtros</button>}
      </footer>
    </section>
  );
}

// CSS: copia las reglas .card, header, input, select, table, .f, .b, #none y footer de la pestaña HTML + CSS.
