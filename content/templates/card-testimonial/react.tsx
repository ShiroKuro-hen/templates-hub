type Testimonio = {
  id: string; cita: string; puntos: number; cifra: string; resultado: string;
  nombre: string; cargo: string; empresa: string;
};

const TESTIMONIOS: Testimonio[] = [
  { id: 't1', puntos: 5, cifra: '38%', resultado: 'menos tickets de soporte en tres meses',
    cita: 'Pasamos de gestionar incidencias por correo a verlas todas en un solo panel. El equipo responde en minutos y dejamos de perder pedidos.',
    nombre: 'Ana Pérez', cargo: 'Directora de Operaciones', empresa: 'Meridian Logística' },
  { id: 't2', puntos: 4, cifra: '99,98%', resultado: 'de disponibilidad desde el cambio',
    cita: 'La migración tomó un fin de semana y el lunes nadie notó el cambio. El soporte fue claro y directo en cada duda.',
    nombre: 'Jorge Salazar', cargo: 'Jefe de Tecnología', empresa: 'Andina Retail' },
];

const iniciales = (n: string) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');

function Estrellas({ puntos }: { puntos: number }) {
  return (
    <div className="rate" role="img" aria-label={`${puntos} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={i <= puntos ? 'st on' : 'st'} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </div>
  );
}

export function CardTestimonial({ items = TESTIMONIOS }: { items?: Testimonio[] }) {
  return (
    <div className="grid">
      {items.map((t) => (
        <figure key={t.id} className="card">
          <svg className="q" viewBox="0 0 32 24" aria-hidden="true">
            <path d="M0 24V13.5C0 6 4.2 1.2 11 0l1.2 3.6C8.4 4.8 6.6 7.2 6.4 10H12v14zM18 24V13.5C18 6 22.2 1.2 29 0l1.2 3.6C26.4 4.8 24.6 7.2 24.4 10H30v14z" />
          </svg>
          <Estrellas puntos={t.puntos} />
          <blockquote><p>“{t.cita}”</p></blockquote>
          <p className="kpi"><b>{t.cifra}</b> {t.resultado}</p>
          <figcaption>
            <span className="av" aria-hidden="true">{iniciales(t.nombre)}</span>
            <span className="who"><b>{t.nombre}</b><span>{t.cargo}</span><span>{t.empresa}</span></span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

// CSS: copia las reglas .grid, .card, .q, .rate, .st, .kpi, figcaption, .av y .who de la pestaña HTML + CSS.
