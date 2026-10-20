import { useState } from 'react';

type Cat = 'todas' | 'diseno' | 'producto' | 'tecnologia';
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
  { id: 'diseno', label: 'Diseño' },
  { id: 'producto', label: 'Producto' },
  { id: 'tecnologia', label: 'Tecnología' },
];

const CARDS: CardItem[] = [
  { cat: 'diseno', tag: 'Diseño', title: 'Sistemas de color con contraste AA', excerpt: 'Cómo elegir una paleta que se lea bien en claro y en oscuro sin perder personalidad.', author: 'Laura Medina · 6 min de lectura', initials: 'LM', alt: 'Colinas verdes bajo un sol pálido', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23ccfbf1%22%2F%3E%3Ccircle%20cx%3D%2290%22%20cy%3D%2260%22%20r%3D%2222%22%20fill%3D%22%2314b8a6%22%2F%3E%3Cpath%20d%3D%22M0%20140L80%2085l70%2040%2060-55%20110%2070v40H0Z%22%20fill%3D%22%230f766e%22%2F%3E%3Cpath%20d%3D%22M0%20160l120-30%2090%2022%20110-25v53H0Z%22%20fill%3D%22%23134e4a%22%20opacity%3D%22.6%22%2F%3E%3C%2Fsvg%3E' },
  { cat: 'producto', tag: 'Producto', title: 'Cómo priorizar tu hoja de ruta', excerpt: 'Un método sencillo para decidir qué entra en el próximo trimestre y qué espera.', author: 'Diego Ortiz · 8 min de lectura', initials: 'DO', alt: 'Skyline de la ciudad con edificios y un sol bajo', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23e0f2fe%22%2F%3E%3Ccircle%20cx%3D%22265%22%20cy%3D%2240%22%20r%3D%2214%22%20fill%3D%22%23fbbf24%22%2F%3E%3Cpath%20d%3D%22M20%20180V70h44v110zM70%20180V40h38v140zM114%20180V90h50v90zM170%20180V55h42v125zM218%20180V100h36v80zM260%20180V75h44v105z%22%20fill%3D%22%2364748b%22%2F%3E%3Cpath%20d%3D%22M80%2060h6M80%2080h6M124%20110h8M180%2080h8M180%20100h8%22%20stroke%3D%22%23e0f2fe%22%20stroke-width%3D%224%22%2F%3E%3C%2Fsvg%3E' },
  { cat: 'tecnologia', tag: 'Tecnología', title: 'Migrar a una arquitectura por módulos', excerpt: 'Pasos para separar tu aplicación en piezas pequeñas sin detener las entregas.', author: 'Ana Ruiz · 10 min de lectura', initials: 'AR', alt: 'Formas geométricas de colores sobre fondo lila', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23ede9fe%22%2F%3E%3Ccircle%20cx%3D%22110%22%20cy%3D%2290%22%20r%3D%2260%22%20fill%3D%22%237c3aed%22%2F%3E%3Crect%20x%3D%22180%22%20y%3D%2230%22%20width%3D%22110%22%20height%3D%22110%22%20rx%3D%2220%22%20fill%3D%22%23f472b6%22%20transform%3D%22rotate(12%20235%2085)%22%2F%3E%3Cpath%20d%3D%22M40%20170%2080%20110%20120%20170Z%22%20fill%3D%22%23fbbf24%22%2F%3E%3C%2Fsvg%3E' },
  { cat: 'diseno', tag: 'Diseño', title: 'Tipografía fluida para pantallas pequeñas', excerpt: 'Escalas de texto que crecen con la pantalla y mantienen la legibilidad en el móvil.', author: 'Marta Gil · 5 min de lectura', initials: 'MG', alt: 'Mar con olas suaves y un sol amarillo', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23bae6fd%22%2F%3E%3Ccircle%20cx%3D%22230%22%20cy%3D%2255%22%20r%3D%2226%22%20fill%3D%22%23fde047%22%2F%3E%3Cpath%20d%3D%22M0%20100q40-20%2080%200t80%200%2080%200%2080%200v80H0z%22%20fill%3D%22%230284c7%22%2F%3E%3Cpath%20d%3D%22M0%20130q40-20%2080%200t80%200%2080%200%2080%200v50H0z%22%20fill%3D%22%23075985%22%2F%3E%3C%2Fsvg%3E' },
  { cat: 'producto', tag: 'Producto', title: 'Métricas que sí importan en el onboarding', excerpt: 'Qué medir en los primeros siete días y cómo convertir los datos en decisiones.', author: 'Pablo Vera · 7 min de lectura', initials: 'PV', alt: 'Bosque de pinos con un claro de hierba', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23ecfccb%22%2F%3E%3Crect%20y%3D%22150%22%20width%3D%22320%22%20height%3D%2230%22%20fill%3D%22%2365a30d%22%2F%3E%3Cpath%20d%3D%22M50%20150%2075%2080%20100%20150ZM120%20150%20150%2060%20180%20150ZM200%20150%20225%2085%20250%20150ZM265%20150%20285%20100%20305%20150Z%22%20fill%3D%22%23166534%22%2F%3E%3C%2Fsvg%3E' },
  { cat: 'tecnologia', tag: 'Tecnología', title: 'Pruebas de accesibilidad en cada cambio', excerpt: 'Automatiza comprobaciones básicas de teclado, foco y contraste antes de fusionar.', author: 'Lucía Paz · 4 min de lectura', initials: 'LP', alt: 'Bloques naranjas en cuadrícula sobre fondo crema', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23ffedd5%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%2230%22%20width%3D%2280%22%20height%3D%2260%22%20rx%3D%2210%22%20fill%3D%22%23fb923c%22%2F%3E%3Crect%20x%3D%22120%22%20y%3D%2230%22%20width%3D%2280%22%20height%3D%2260%22%20rx%3D%2210%22%20fill%3D%22%23fdba74%22%2F%3E%3Crect%20x%3D%22210%22%20y%3D%2230%22%20width%3D%2280%22%20height%3D%2260%22%20rx%3D%2210%22%20fill%3D%22%23c2410c%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%22104%22%20width%3D%22260%22%20height%3D%2246%22%20rx%3D%2210%22%20fill%3D%22%239a3412%22%20opacity%3D%22.7%22%2F%3E%3C%2Fsvg%3E' },
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
