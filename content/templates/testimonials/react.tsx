type Testimonial = { quote: string; name: string; role: string; color?: string };

const DATA: Testimonial[] = [
  { quote: 'Pasamos de cinco herramientas a una. Las revisiones semanales duran la mitad.', name: 'Lucía Méndez', role: 'Directora de operaciones, Finca Norte', color: '#c9d3ff' },
  { quote: 'Las automatizaciones nos ahorran unas ocho horas por semana.', name: 'Javier Ruiz', role: 'Líder de producto, Orbita Labs', color: '#fffdf8' },
  { quote: 'Enseñamos el avance real a los clientes, sin preparar presentaciones.', name: 'Sofía Paredes', role: 'Fundadora, Estudio Tramo', color: '#ff5a36' },
];

const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export function Testimonials({ items = DATA, title = 'Equipos que ya trabajan con Nimbo' }: { items?: Testimonial[]; title?: string }) {
  return (
    <section className="quotes" aria-labelledby="quotes-title">
      <h2 id="quotes-title">{title}</h2>
      <ul className="list">
        {items.map((t, i) => (
          <li key={t.name}>
            <figure>
              <svg className="mark" viewBox="0 0 30 24" aria-hidden="true">
                <path d="M2 22V11C2 5 6 2 11 2v5C8 7 7 9 7 11h4v11zM17 22V11c0-6 4-9 9-9v5c-3 0-4 2-4 4h4v11z" />
              </svg>
              <blockquote><p>{t.quote}</p></blockquote>
              <figcaption>
                <span className="av" style={{ ['--c' as string]: t.color ?? '#fffdf8' }} aria-hidden="true">{initials(t.name)}</span>
                <span>
                  <span className="who">{t.name}</span>
                  <span className="role">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
// CSS: copia las reglas .quotes / .list / figure / .mark / blockquote / figcaption / .av / .who / .role de la pestaña HTML + CSS.
