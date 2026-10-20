type Tile =
  | { area: string; kind: 'image'; src: string; alt: string; caption: string }
  | { area: string; kind: 'stat'; value: string; label: string };

export const TILES: Tile[] = [
  { area: 't1', kind: 'image', src: '/stock/costa-azul.webp', alt: 'Costa con pinos y mar azul', caption: 'Costa azul con pinos' },
  { area: 't2', kind: 'stat', value: '+38%', label: 'conversiones en 90 días tras el rediseño' },
  { area: 't3', kind: 'image', src: '/stock/calle-ciudad.webp', alt: 'Calle de la ciudad entre edificios altos', caption: 'Calle entre edificios' },
  { area: 't4', kind: 'image', src: '/stock/escritorio-diseno.webp', alt: 'Escritorio visto desde arriba con materiales de diseño y un teléfono', caption: 'Mesa de diseño' },
  { area: 't5', kind: 'image', src: '/stock/montana-nieve.webp', alt: 'Picos montañosos cubiertos de nieve', caption: 'Picos nevados' },
  { area: 't6', kind: 'image', src: '/stock/cafeteria-mesa.webp', alt: 'Larga mesa de madera de una cafetería', caption: 'Mesa de cafetería' },
];

export function BentoImageGrid({ tiles = TILES }: { tiles?: Tile[] }) {
  return (
    <section className="bento" aria-labelledby="bento-title">
      <h1 id="bento-title">Proyectos recientes</h1>
      <p className="lead">Trabajos de este trimestre, con una cifra de resultados.</p>
      <div className="grid">
        {tiles.map((t) =>
          t.kind === 'stat' ? (
            <div key={t.area} className={`tile stat ${t.area}`}>
              <strong>{t.value}</strong>
              <span>{t.label}</span>
            </div>
          ) : (
            <figure key={t.area} className={`tile ${t.area}`}>
              <img src={t.src} alt={t.alt} width={800} height={533} decoding="async" />
              <figcaption>{t.caption}</figcaption>
            </figure>
          ),
        )}
      </div>
    </section>
  );
}
// CSS: copia las reglas .bento / .grid (y media queries) / .t1-.t6 / .tile / .stat / .tile img / .tile figcaption de la pestaña HTML + CSS.
