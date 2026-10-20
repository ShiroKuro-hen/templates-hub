type Card = { src: string; alt: string; tag: string; title: string; detail: string };

const CAPTION_CARDS: Card[] = [
  {
    src: '/stock/montana-nieve.webp',
    alt: 'Picos montañosos cubiertos de nieve',
    tag: 'Montaña',
    title: 'Sierra del Norte en invierno',
    detail: 'Rutas con nieve para todos los niveles, refugios abiertos y guías locales.',
  },
  {
    src: '/stock/costa-azul.webp',
    alt: 'Costa con pinos y mar azul',
    tag: 'Costa',
    title: 'Bahía de los faros',
    detail: 'Caminos junto al mar, playas tranquilas y cenas con producto local.',
  },
];

const BAR_CARDS: Card[] = [
  {
    src: '/stock/puente-noche.webp',
    alt: 'Puente y skyline de noche en blanco y negro',
    tag: 'Ciudad',
    title: 'Noche en la ciudad',
    detail: '8 min de lectura',
  },
  {
    src: '/stock/canon-verde.webp',
    alt: 'Cañón verde con un arroyo',
    tag: 'Naturaleza',
    title: 'Ruta junto al arroyo',
    detail: '5 min de lectura',
  },
];

function CaptionCard({ card }: { card: Card }) {
  return (
    <article className="card">
      <img src={card.src} alt={card.alt} width={800} height={533} decoding="async" />
      <span className="tag">{card.tag}</span>
      <div className="cap">
        <h3><a href="#">{card.title}</a></h3>
        <p className="more">{card.detail}</p>
      </div>
    </article>
  );
}

function BarCard({ card }: { card: Card }) {
  return (
    <article className="card">
      <img src={card.src} alt={card.alt} width={800} height={533} decoding="async" />
      <span className="tag">{card.tag}</span>
      <div className="bar">
        <h3><a href="#">{card.title}</a></h3>
        <span>{card.detail}</span>
      </div>
    </article>
  );
}

export function ImageOverlayCaptions() {
  return (
    <main className="wrap">
      <h1>Destinos para el fin de semana</h1>
      <h2>Leyenda al pasar o enfocar</h2>
      <div className="grid">
        {CAPTION_CARDS.map((c) => <CaptionCard key={c.title} card={c} />)}
      </div>
      <h2>Barra inferior</h2>
      <div className="grid">
        {BAR_CARDS.map((c) => <BarCard key={c.title} card={c} />)}
      </div>
    </main>
  );
}

// CSS: copia las reglas de la pestaña HTML + CSS (.grid, .card, .tag, .cap, .more, .bar y sus pseudo-elementos).
