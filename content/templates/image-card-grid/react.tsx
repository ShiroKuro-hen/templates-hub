import { useState } from 'react';

type Cat = 'todas' | 'naturaleza' | 'ciudad' | 'viajes' | 'trabajo' | 'hogar' | 'montana';
type CardItem = {
  cat: Exclude<Cat, 'todas'>;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  initials: string;
  alt: string;
  src: string;
};

const CHIPS: { id: Cat; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'naturaleza', label: 'Naturaleza' },
  { id: 'ciudad', label: 'Ciudad' },
  { id: 'viajes', label: 'Viajes' },
  { id: 'trabajo', label: 'Trabajo' },
  { id: 'hogar', label: 'Hogar' },
  { id: 'montana', label: 'Montaña' },
];

const CARDS: CardItem[] = [
  { cat: 'naturaleza', tag: 'Naturaleza', title: 'Rutas cortas para caminar en el bosque', excerpt: 'Senderos señalizados para una mañana tranquila entre árboles.', author: 'Laura Medina · 6 min de lectura', initials: 'LM', alt: 'Sendero de hierba que atraviesa un bosque', src: '/stock/sendero-verde.webp' },
  { cat: 'ciudad', tag: 'Ciudad', title: 'Recorrer una ciudad sin plano', excerpt: 'Pistas para descubrir barrios a pie, entre calles estrechas y fachadas antiguas.', author: 'Diego Ortiz · 8 min de lectura', initials: 'DO', alt: 'Calle de ciudad entre edificios altos', src: '/stock/calle-ciudad.webp' },
  { cat: 'viajes', tag: 'Viajes', title: 'Pueblos blancos junto al mar', excerpt: 'Qué ver en una isla de casas encaladas y cómo organizar tu semana allí.', author: 'Ana Ruiz · 10 min de lectura', initials: 'AR', alt: 'Pueblo blanco junto al mar en una isla', src: '/stock/isla-blanca.webp' },
  { cat: 'trabajo', tag: 'Trabajo', title: 'Un escritorio que ayuda a crear', excerpt: 'Materiales, pantalla y pausas para organizar tu espacio de diseño.', author: 'Marta Gil · 5 min de lectura', initials: 'MG', alt: 'Escritorio visto desde arriba con materiales de diseño y un teléfono', src: '/stock/escritorio-diseno.webp' },
  { cat: 'hogar', tag: 'Hogar', title: 'Mesas de madera para cada día', excerpt: 'Cómo elegir y cuidar una mesa larga que dure años en casa o en el local.', author: 'Pablo Vera · 7 min de lectura', initials: 'PV', alt: 'Mesa larga de madera en una cafetería', src: '/stock/cafeteria-mesa.webp' },
  { cat: 'montana', tag: 'Montaña', title: 'Preparar una ruta con nieve', excerpt: 'Equipo, horarios y señales para subir a cumbres nevadas con seguridad.', author: 'Lucía Paz · 4 min de lectura', initials: 'LP', alt: 'Picos nevados bajo el cielo', src: '/stock/montana-nieve.webp' },
];

export function ImageCardGrid({ cards = CARDS }: { cards?: CardItem[] }) {
  const [filter, setFilter] = useState<Cat>('todas');
  const visible = cards.filter((c) => filter === 'todas' || c.cat === filter);

  return (
    <main className="wrap" aria-labelledby="cards-title">
      <header className="head">
        <h1 id="cards-title">Lecturas para tu equipo</h1>
        <div className="filters" role="group" aria-label="Filtrar por categoría">
          {CHIPS.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      </header>
      <ul className="grid">
        {visible.map((c) => (
          <li key={c.title}>
            <article className="card">
              <div className="cover">
                <img src={c.src} alt={c.alt} width={320} height={180} loading="lazy" />
              </div>
              <div className="body">
                <span className="tag">{c.tag}</span>
                <h2>{c.title}</h2>
                <p className="excerpt">{c.excerpt}</p>
                <p className="by"><span className="av" aria-hidden="true">{c.initials}</span>{c.author}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
// CSS: copia los tokens :root y las reglas .wrap / .head / .filters / .chip / .grid / .card (y .cover, .body, .tag, .excerpt, .by, .av) de la pestaña HTML + CSS.
