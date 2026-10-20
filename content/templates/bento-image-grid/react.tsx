type Tile =
  | { area: string; kind: 'image'; src: string; alt: string; caption: string }
  | { area: string; kind: 'stat'; value: string; label: string };

export const TILES: Tile[] = [
  { area: 't1', kind: 'image', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23dcfce7%22%2F%3E%3Ccircle%20cx%3D%22300%22%20cy%3D%2280%22%20r%3D%2236%22%20fill%3D%22%23facc15%22%2F%3E%3Cpath%20d%3D%22M0%20200Q110%20130%20220%20185T400%20170V300H0Z%22%20fill%3D%22%2316a34a%22%2F%3E%3Cpath%20d%3D%22M0%20250Q150%20200%20260%20240T400%20230V300H0Z%22%20fill%3D%22%2314532d%22%2F%3E%3C%2Fsvg%3E', alt: 'Valle verde con colinas y un sol amarillo al amanecer', caption: 'Valle verde al amanecer' },
  { area: 't2', kind: 'stat', value: '+38%', label: 'conversiones en 90 días tras el rediseño' },
  { area: 't3', kind: 'image', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%231e1b4b%22%2F%3E%3Ccircle%20cx%3D%22330%22%20cy%3D%2260%22%20r%3D%2222%22%20fill%3D%22%23e0e7ff%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%22130%22%20width%3D%2260%22%20height%3D%22170%22%20fill%3D%22%23312e81%22%2F%3E%3Crect%20x%3D%2295%22%20y%3D%2290%22%20width%3D%2250%22%20height%3D%22210%22%20fill%3D%22%234338ca%22%2F%3E%3Crect%20x%3D%22160%22%20y%3D%22150%22%20width%3D%2270%22%20height%3D%22150%22%20fill%3D%22%23312e81%22%2F%3E%3Crect%20x%3D%22245%22%20y%3D%22110%22%20width%3D%2245%22%20height%3D%22190%22%20fill%3D%22%234338ca%22%2F%3E%3Crect%20x%3D%22300%22%20y%3D%22170%22%20width%3D%2280%22%20height%3D%22130%22%20fill%3D%22%23312e81%22%2F%3E%3Crect%20x%3D%22110%22%20y%3D%22120%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23fde68a%22%2F%3E%3Crect%20x%3D%22262%22%20y%3D%22150%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23fde68a%22%2F%3E%3C%2Fsvg%3E', alt: 'Skyline de edificios azules bajo una luna creciente', caption: 'Skyline nocturno' },
  { area: 't4', kind: 'image', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23fce7f3%22%2F%3E%3Ccircle%20cx%3D%22110%22%20cy%3D%22110%22%20r%3D%2270%22%20fill%3D%22%23db2777%22%2F%3E%3Crect%20x%3D%22190%22%20y%3D%22130%22%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22%234f46e5%22%20opacity%3D%22.85%22%2F%3E%3Cpath%20d%3D%22M40%20290L120%20170L200%20290Z%22%20fill%3D%22%23facc15%22%2F%3E%3C%2Fsvg%3E', alt: 'Círculo rosa, cuadrado índigo y triángulo amarillo sobre fondo claro', caption: 'Formas en calma' },
  { area: 't5', kind: 'image', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23bae6fd%22%2F%3E%3Ccircle%20cx%3D%22110%22%20cy%3D%2290%22%20r%3D%2234%22%20fill%3D%22%23fbbf24%22%2F%3E%3Crect%20y%3D%22150%22%20width%3D%22400%22%20height%3D%2290%22%20fill%3D%22%230284c7%22%2F%3E%3Cpath%20d%3D%22M0%20180Q50%20165%20100%20180T200%20180T300%20180T400%20180V190H0Z%22%20fill%3D%22%2338bdf8%22%2F%3E%3Crect%20y%3D%22240%22%20width%3D%22400%22%20height%3D%2260%22%20fill%3D%22%23fde68a%22%2F%3E%3C%2Fsvg%3E', alt: 'Costa con mar azul, sol amarillo y arena', caption: 'Costa al mediodía' },
  { area: 't6', kind: 'image', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23ecfccb%22%2F%3E%3Cpath%20d%3D%22M60%20240L120%20110L180%20240Z%20M160%20240L230%2080L300%20240Z%20M250%20240L310%20130L370%20240Z%22%20fill%3D%22%23166534%22%2F%3E%3Crect%20y%3D%22240%22%20width%3D%22400%22%20height%3D%2260%22%20fill%3D%22%2365a30d%22%2F%3E%3C%2Fsvg%3E', alt: 'Pinos verdes sobre un fondo verde pálido', caption: 'Bosque de pinos' },
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
              <img src={t.src} alt={t.alt} width={400} height={300} loading="lazy" />
              <figcaption>{t.caption}</figcaption>
            </figure>
          ),
        )}
      </div>
    </section>
  );
}
// CSS: copia las reglas .bento / .grid (y media queries) / .t1-.t6 / .tile / .stat / .tile img / .tile figcaption de la pestaña HTML + CSS.
