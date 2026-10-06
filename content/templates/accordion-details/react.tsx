type Item = { id: string; pregunta: string; respuesta: string };

const ITEMS: Item[] = [
  { id: 'plan', pregunta: '¿Puedo cambiar de plan en cualquier momento?', respuesta: 'Sí. El cambio se aplica al instante y cobramos solo la diferencia prorrateada.' },
  { id: 'baja', pregunta: '¿Cómo cancelo mi suscripción?', respuesta: 'Desde Ajustes → Facturación. Conservas el acceso hasta el final del período pagado.' },
  { id: 'ruc', pregunta: '¿Ofrecen facturas con RUC?', respuesta: 'Claro: añade tus datos fiscales en Facturación y las emitiremos cada mes.' },
];

type Props = {
  items?: Item[];
  name?: string; // mismo name = acordeón exclusivo
  defaultOpenId?: string;
};

export function Accordion({ items = ITEMS, name = 'faq', defaultOpenId = items[0]?.id }: Props) {
  return (
    <div className="acc">
      {items.map((it) => (
        <details key={it.id} name={name} open={it.id === defaultOpenId}>
          <summary>{it.pregunta}</summary>
          <p>{it.respuesta}</p>
        </details>
      ))}
    </div>
  );
}
// CSS: copia las reglas .acc / .acc details / .acc summary / .acc p y ::details-content de la pestaña HTML + CSS.
