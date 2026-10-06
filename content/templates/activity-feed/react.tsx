type Kind = 'deploy' | 'comment' | 'alert' | 'check';
type Item = { kind: Kind; who: string; what: string; time: string; quote?: string; isNew?: boolean };
type Group = { day: string; items: Item[] };

const ICON: Record<Kind, string> = {
  deploy: 'M12 19V5M5 12l7-7 7 7',
  comment: 'M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z',
  alert: 'M12 3l10 18H2zM12 10v4M12 17.5h.01',
  check: 'M5 13l4 4L19 7',
};

const FEED: Group[] = [
  { day: 'Hoy', items: [
    { kind: 'deploy', who: 'Ana Pérez', what: 'desplegó v2.4.1 en producción.', time: '10:42', isNew: true },
    { kind: 'comment', who: 'Luis Gómez', what: 'comentó en «Migrar pagos a Stripe».', time: '09:15', isNew: true,
      quote: '¿Podemos revisar los webhooks antes del viernes?' },
    { kind: 'alert', who: 'Monitor', what: 'detectó una latencia de API superior a 800 ms en eu-west.', time: '08:03' },
  ] },
  { day: 'Ayer', items: [
    { kind: 'check', who: 'Marta Ruiz', what: 'completó «Revisión de accesibilidad».', time: '18:30' },
    { kind: 'check', who: 'Carlos Díaz', what: 'fusionó el pull request #482 en main.', time: '16:12' },
    { kind: 'comment', who: 'Sofía Vega', what: 'comentó en «Rediseño del panel».', time: '11:48',
      quote: 'Subí la nueva versión de los iconos.' },
  ] },
];

export function ActivityFeed({ feed = FEED }: { feed?: Group[] }) {
  return (
    <section className="feed" aria-labelledby="af-t">
      <h2 id="af-t">Actividad reciente</h2>
      <p>Lo último que ha pasado en el proyecto Portal de clientes.</p>
      {feed.map((g) => (
        <div key={g.day}>
          <h3>{g.day}</h3>
          <ol>
            {g.items.map((i) => (
              <li key={g.day + i.time} className={i.isNew ? `${i.kind} new` : i.kind}>
                <span className="ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d={ICON[i.kind]} /></svg>
                </span>
                <div>
                  <p>{i.isNew && <span className="sr">Nuevo. </span>}<b>{i.who}</b> {i.what}</p>
                  {i.quote && <blockquote>{i.quote}</blockquote>}
                  <time>{i.time}</time>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
// CSS: copia las reglas .feed / h2 / h3 / ol / li / .ic / .deploy / .comment / .alert / .check / .new / blockquote / time / .sr de la pestaña HTML + CSS.
