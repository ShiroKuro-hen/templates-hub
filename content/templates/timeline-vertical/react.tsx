type Milestone = {
  date: string; // ISO: 2026-06-20
  label: string; // texto visible: "20 jun 2026"
  title: string;
  text: string;
  status: 'done' | 'now' | 'next';
};

const ITEMS: Milestone[] = [
  { date: '2026-01-12', label: '12 ene 2026', title: 'Prototipo validado', text: 'Probamos el flujo de reserva con 40 clientes de la tienda.', status: 'done' },
  { date: '2026-03-03', label: '3 mar 2026', title: 'Beta privada', text: 'Abrimos el acceso a 200 negocios con lista de espera.', status: 'done' },
  { date: '2026-06-20', label: '20 jun 2026', title: 'Lanzamiento público', text: 'Pagos con tarjeta, facturas automáticas y soporte por chat.', status: 'now' },
  { date: '2026-10-01', label: '1 oct 2026', title: 'App móvil', text: 'Versión para Android e iOS con notificaciones.', status: 'next' },
];

export function Timeline({ items = ITEMS }: { items?: Milestone[] }) {
  return (
    <ol className="tl">
      {items.map((m) => (
        <li key={m.date} className={m.status} aria-current={m.status === 'now' ? 'step' : undefined}>
          <time dateTime={m.date}>{m.label}</time>
          <h2>
            {m.title} {m.status === 'now' && <span className="state">En curso</span>}
          </h2>
          <p>{m.text}</p>
        </li>
      ))}
    </ol>
  );
}
// CSS: copia las reglas .tl / .tl li / .done / .now / .next / time / .tl h2 / .tl p / .state y los tokens :root de la pestaña HTML + CSS.
