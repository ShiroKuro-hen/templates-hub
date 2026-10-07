import { useEffect, useState } from 'react';

type Order = { id: string; cliente: string; estado: string; tono: 'ok' | 'warn' | 'err'; total: string };
const ORDERS: Order[] = [
  { id: '#4821', cliente: 'Textiles Andina', estado: 'Pagado', tono: 'ok', total: 'S/ 2,480.00' },
  { id: '#4820', cliente: 'Café del Valle', estado: 'Pendiente', tono: 'warn', total: 'S/ 960.50' },
  { id: '#4819', cliente: 'Logística Pacífico', estado: 'Pagado', tono: 'ok', total: 'S/ 5,310.00' },
  { id: '#4818', cliente: 'Estudio Mirador', estado: 'Fallido', tono: 'err', total: 'S/ 740.00' },
  { id: '#4817', cliente: 'Agro Sierra', estado: 'Pagado', tono: 'ok', total: 'S/ 1,125.80' },
];
const WIDTHS = [38, 70, 52, 64, 46];

export function SkeletonTable() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <section className="card" aria-labelledby="t" aria-busy={loading}>
      <header>
        <h2 id="t">Pedidos recientes</h2>
        <button className="btn" type="button" aria-disabled={loading} onClick={() => !loading && setLoading(true)}>
          Recargar
        </button>
      </header>
      <div className="scroll">
        <table>
          <caption className="sr">Últimos pedidos de clientes con estado y total.</caption>
          <thead>
            <tr><th scope="col">Pedido</th><th scope="col">Cliente</th><th scope="col">Estado</th><th scope="col" className="num">Total</th></tr>
          </thead>
          <tbody>
            {loading
              ? WIDTHS.map((w) => (
                  <tr key={w} aria-hidden="true">
                    <td><span className="sk" style={{ width: `${w}%` }} /></td>
                    <td><span className="sk" style={{ width: '70%' }} /></td>
                    <td><span className="sk" style={{ width: 72 }} /></td>
                    <td><span className="sk" style={{ width: '60%', marginLeft: 'auto' }} /></td>
                  </tr>
                ))
              : ORDERS.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td><td>{o.cliente}</td>
                    <td><span className={`b ${o.tono}`}>{o.estado}</span></td>
                    <td className="num">{o.total}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <p className="sr" role="status">{loading ? 'Cargando pedidos…' : 'Pedidos cargados.'}</p>
    </section>
  );
}

// CSS: copia las reglas .card, header, .btn, table, .b, .sk y .sr de la pestaña HTML + CSS.
