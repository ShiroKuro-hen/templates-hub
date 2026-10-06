import { useState } from 'react';

type Estado = 'Pagado' | 'Pendiente' | 'Fallido' | 'Enviado';
type Pedido = { id: string; cliente: string; estado: Estado; total: number };

const CLASE: Record<Estado, string> = { Pagado: 'ok', Pendiente: 'warn', Fallido: 'err', Enviado: 'info' };
const DATA: Pedido[] = [
  { id: '#1042', cliente: 'Ana Pérez', estado: 'Pagado', total: 128 },
  { id: '#1043', cliente: 'Luis Gómez', estado: 'Pendiente', total: 54.9 },
  { id: '#1044', cliente: 'Marta Ruiz', estado: 'Fallido', total: 310 },
  { id: '#1045', cliente: 'Carlos Díaz', estado: 'Enviado', total: 76.25 },
];

export function OrdersTable({ initial = DATA }: { initial?: Pedido[] }) {
  const [rows, setRows] = useState(initial);
  const [msg, setMsg] = useState('');

  const pay = (id: string) => {
    setRows((r) => r.map((p) => (p.id === id ? { ...p, estado: 'Pagado' } : p)));
    setMsg(`Pedido ${id} marcado como pagado.`);
  };
  const remove = (id: string) => {
    setRows((r) => r.filter((p) => p.id !== id));
    setMsg(`Pedido ${id} quitado.`);
  };

  return (
    <>
      <div className="wrap" role="region" aria-labelledby="cap" tabIndex={0}>
        <table>
          <caption id="cap">Pedidos con su estado y acciones</caption>
          <thead>
            <tr>
              <th scope="col">Pedido</th><th scope="col">Cliente</th><th scope="col">Estado</th>
              <th scope="col" className="num">Total</th><th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <th scope="row">{p.id}</th>
                <td>{p.cliente}</td>
                <td><span className={`badge ${CLASE[p.estado]}`}>{p.estado}</span></td>
                <td className="num">${p.total.toFixed(2)}</td>
                <td>
                  <div className="acts">
                    <button disabled={p.estado === 'Pagado'} onClick={() => pay(p.id)} aria-label={`Marcar pagado el pedido ${p.id}`}>
                      Marcar pagado
                    </button>
                    <button className="del" onClick={() => remove(p.id)} aria-label={`Quitar el pedido ${p.id}`}>Quitar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p id="msg" role="status">{msg}</p>
    </>
  );
}
// CSS: copia las reglas .wrap / table / .num / .badge (.ok .warn .err .info) / .acts / button / .del / #msg de la pestaña HTML + CSS.
