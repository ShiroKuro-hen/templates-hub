import { useRef, useState, type FormEvent } from 'react';

type Pedido = [cliente: string, ciudad: string, estado: string, total: number];
type Vista = { n: string; q: string; s: string };

const D: Pedido[] = [
  ['Café Andino', 'Lima', 'Pagado', 1280], ['Textiles Sur', 'Arequipa', 'Pendiente', 640],
  ['Logística Norte', 'Lima', 'Pendiente', 2150], ['Panadería Sol', 'Cusco', 'Pagado', 310],
  ['Distribuidora Pacífico', 'Lima', 'Cancelado', 980], ['Hotel Valle', 'Cusco', 'Pendiente', 3890],
];
const money = (v: number) => v.toLocaleString('es', { style: 'currency', currency: 'USD' });

export function SavedViews() {
  const [q, setQ] = useState('');
  const [s, setS] = useState('');
  const [views, setViews] = useState<Vista[]>([{ n: 'Pendientes de pago', q: '', s: 'Pendiente' }, { n: 'Pedidos de Lima', q: 'Lima', s: '' }]);
  const [nombre, setNombre] = useState('');
  const [msg, setMsg] = useState({ t: '', bad: false });
  const nm = useRef<HTMLInputElement>(null);
  const qq = q.trim();
  const hits = D.filter(([n, c, e]) => (!qq || (n + c).toLowerCase().includes(qq.toLowerCase())) && (!s || e === s));

  const say = (t: string, bad = false) => setMsg({ t, bad });
  const guardar = (e: FormEvent) => {
    e.preventDefault();
    const n = nombre.trim();
    if (!n) return say('Escribe un nombre para la vista.', true);
    if (!qq && !s) return say('Aplica al menos un filtro antes de guardar.', true);
    if (views.some((v) => v.n.toLowerCase() === n.toLowerCase())) return say('Ya existe una vista con ese nombre. Elige otro.', true);
    setViews([...views, { n, q: qq, s }]); setNombre(''); say(`Vista «${n}» guardada.`);
  };
  const aplicar = (v: Vista) => { setQ(v.q); setS(v.s); say(`Vista «${v.n}» aplicada.`); };
  const borrar = (v: Vista) => { setViews(views.filter((x) => x !== v)); say(`Vista «${v.n}» eliminada.`); nm.current?.focus(); };

  return (
    <div className="sv">
      <aside aria-labelledby="vh">
        <h2 id="vh">Vistas guardadas</h2>
        <ul>
          {views.map((v) => (
            <li className="v" key={v.n}>
              <button type="button" className="apply" aria-pressed={v.q === qq && v.s === s} onClick={() => aplicar(v)}>
                {v.n}<small>{[v.q && `“${v.q}”`, v.s].filter(Boolean).join(', ') || 'Sin filtros'}</small>
              </button>
              <button type="button" className="del" aria-label={`Eliminar vista ${v.n}`} onClick={() => borrar(v)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m2 2 8 8M10 2l-8 8" /></svg>
              </button>
            </li>
          ))}
          {!views.length && <li className="none">Aún no hay vistas. Aplica filtros y guarda la primera.</li>}
        </ul>
        <form onSubmit={guardar}>
          <label htmlFor="nm">Guardar filtros como vista</label>
          <div className="row">
            <input id="nm" ref={nm} autoComplete="off" placeholder="Nombre de la vista" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <button className="go">Guardar</button>
          </div>
          <p className={msg.bad ? 'msg bad' : 'msg'} aria-live="polite">{msg.t}</p>
        </form>
      </aside>
      <section aria-label="Pedidos">
        <div className="filters">
          <label>Buscar<input type="search" placeholder="Cliente o ciudad" value={q} onChange={(e) => setQ(e.target.value)} /></label>
          <label>Estado
            <select value={s} onChange={(e) => setS(e.target.value)}>
              <option value="">Todos</option><option>Pagado</option><option>Pendiente</option><option>Cancelado</option>
            </select>
          </label>
        </div>
        <p className="head" aria-live="polite">{hits.length} pedidos</p>
        <ul id="list">
          {hits.map(([n, c, e, t]) => <li key={n}><span>{n}<small>{c}, {e}</small></span><output>{money(t)}</output></li>)}
          {!hits.length && <li className="empty">Ningún pedido coincide. Cambia los filtros o aplica otra vista.</li>}
        </ul>
      </section>
    </div>
  );
}

// CSS: copia las reglas .sv, .v, .apply, .del, form, .row, .go, .msg, .filters y #list de la pestaña HTML + CSS.
