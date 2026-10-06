type Faq = { q: string; a: string };

const FAQS: Faq[] = [
  { q: '¿Puedo probar Nimbo antes de pagar?', a: 'Sí. Tienes 14 días con todas las funciones y no pedimos tarjeta.' },
  { q: '¿Cuántas personas pueden usarlo?', a: 'El plan gratuito admite hasta 5 personas. En los de pago no hay límite.' },
  { q: '¿Puedo importar mis proyectos actuales?', a: 'Importa desde CSV o desde otras herramientas. Conservamos responsables y fechas.' },
  { q: '¿Cómo cancelo mi suscripción?', a: 'Desde Ajustes, en Facturación. La cancelación es inmediata.' },
];

type Props = { faqs?: Faq[]; title?: string; contactHref?: string };

export function FaqSection({ faqs = FAQS, title = 'Preguntas frecuentes', contactHref = '#contacto' }: Props) {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div>
        <h2 id="faq-title">{title}</h2>
        <p className="intro">¿No encuentras tu duda? <a href={contactHref}>Escríbenos</a> y respondemos en menos de un día.</p>
      </div>
      <div className="list">
        {faqs.map((f, i) => (
          <details name="faq" key={f.q} open={i === 0}>
            <summary>
              {f.q}
              <svg className="plus" viewBox="0 0 22 22" aria-hidden="true"><path d="M11 3v16M3 11h16" fill="none" /></svg>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
// CSS: copia las reglas .faq / .intro / .list / details / summary / .plus de la pestaña HTML + CSS.
