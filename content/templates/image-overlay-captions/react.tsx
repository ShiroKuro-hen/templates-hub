type Card = { src: string; alt: string; tag: string; title: string; detail: string };

const CAPTION_CARDS: Card[] = [
  {
    src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20160%20100%27%3E%3Crect%20width=%27160%27%20height=%27100%27%20fill=%27%23c9dcf7%27/%3E%3Cpath%20d=%27M0%20100%2042%2038l22%2026%2022-34%2074%2070z%27%20fill=%27%234a6fa5%27/%3E%3Cpath%20d=%27M42%2038l-8%2010h16zM64%2030l-7%209h14z%27%20fill=%27%23fff%27/%3E%3C/svg%3E',
    alt: 'Sierra nevada con cumbres blancas al amanecer',
    tag: 'Montaña',
    title: 'Sierra del Norte en invierno',
    detail: 'Rutas con nieve para todos los niveles, refugios abiertos y guías locales.',
  },
  {
    src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20160%20100%27%3E%3Crect%20width=%27160%27%20height=%27100%27%20fill=%27%23ffd9a8%27/%3E%3Ccircle%20cx=%27118%27%20cy=%2730%27%20r=%2712%27%20fill=%27%23fbf1dc%27/%3E%3Crect%20y=%2758%27%20width=%27160%27%20height=%2724%27%20fill=%27%232f8fb8%27/%3E%3Cpath%20d=%27M0%2082q40-8%2080%200t80%200v18H0z%27%20fill=%27%23f5d28a%27/%3E%3C/svg%3E',
    alt: 'Bahía con playa de arena y mar en calma',
    tag: 'Costa',
    title: 'Bahía de los faros',
    detail: 'Caminos junto al mar, playas tranquilas y cenas con producto local.',
  },
];

const BAR_CARDS: Card[] = [
  {
    src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20160%20100%27%3E%3Crect%20width=%27160%27%20height=%27100%27%20fill=%27%231d2b4f%27/%3E%3Crect%20x=%2710%27%20y=%2744%27%20width=%2724%27%20height=%2756%27%20fill=%27%232c3e6b%27/%3E%3Crect%20x=%2740%27%20y=%2724%27%20width=%2730%27%20height=%2776%27%20fill=%27%2334497a%27/%3E%3Crect%20x=%2776%27%20y=%2754%27%20width=%2722%27%20height=%2746%27%20fill=%27%232c3e6b%27/%3E%3Crect%20x=%27104%27%20y=%2714%27%20width=%2734%27%20height=%2786%27%20fill=%27%2334497a%27/%3E%3Cg%20fill=%27%23ffd166%27%3E%3Crect%20x=%2746%27%20y=%2734%27%20width=%276%27%20height=%278%27/%3E%3Crect%20x=%2758%27%20y=%2734%27%20width=%276%27%20height=%278%27/%3E%3Crect%20x=%27110%27%20y=%2726%27%20width=%276%27%20height=%278%27/%3E%3Crect%20x=%27122%27%20y=%2746%27%20width=%276%27%20height=%278%27/%3E%3Crect%20x=%2782%27%20y=%2764%27%20width=%275%27%20height=%277%27/%3E%3C/g%3E%3C/svg%3E',
    alt: 'Calles de una ciudad de noche con edificios iluminados',
    tag: 'Ciudad',
    title: 'Noche en el casco antiguo',
    detail: '8 min de lectura',
  },
  {
    src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20160%20100%27%3E%3Crect%20width=%27160%27%20height=%27100%27%20fill=%27%23cfe8c9%27/%3E%3Ccircle%20cx=%2736%27%20cy=%2744%27%20r=%2722%27%20fill=%27%232f8a57%27/%3E%3Ccircle%20cx=%2780%27%20cy=%2734%27%20r=%2728%27%20fill=%27%230e9f6e%27/%3E%3Ccircle%20cx=%27126%27%20cy=%2748%27%20r=%2720%27%20fill=%27%232f8a57%27/%3E%3Crect%20y=%2776%27%20width=%27160%27%20height=%2724%27%20fill=%27%237a5a3a%27/%3E%3C/svg%3E',
    alt: 'Bosque de robles con copas verdes',
    tag: 'Bosque',
    title: 'Senderos entre robles',
    detail: '5 min de lectura',
  },
];

function CaptionCard({ card }: { card: Card }) {
  return (
    <article className="card">
      <img src={card.src} alt={card.alt} width={640} height={400} loading="lazy" />
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
      <img src={card.src} alt={card.alt} width={640} height={400} loading="lazy" />
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
