import { useMemo, useState } from 'react';

type Destino = { nombre: string; pais: string; precio: number; nota: number; foto: string; alt: string };
type Orden = 'precio-asc' | 'precio-desc' | 'valoracion';

const DESTINOS: Destino[] = [
  { nombre: 'Selva Negra', pais: 'Alemania', precio: 280, nota: 4.6, foto: 'sendero-verde', alt: 'Sendero de hierba que atraviesa el bosque' },
  { nombre: 'Cañón del Tara', pais: 'Montenegro', precio: 350, nota: 4.7, foto: 'canon-verde', alt: 'Cañón verde con un arroyo' },
  { nombre: 'Costa Cántabra', pais: 'España', precio: 420, nota: 4.5, foto: 'embarcadero', alt: 'Muelle de madera que se adentra en el mar' },
  { nombre: 'Cassis', pais: 'Francia', precio: 460, nota: 4.4, foto: 'costa-azul', alt: 'Costa con pinos frente al mar' },
  { nombre: 'Zermatt', pais: 'Suiza', precio: 540, nota: 4.8, foto: 'montana-nieve', alt: 'Picos nevados bajo un cielo despejado' },
  { nombre: 'Santorini', pais: 'Grecia', precio: 690, nota: 4.9, foto: 'isla-blanca', alt: 'Pueblo blanco griego junto al mar' },
];
const COMPARA: Record<Orden, (a: Destino, b: Destino) => number> = {
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
  valoracion: (a, b) => b.nota - a.nota,
};
const ETIQUETA: Record<Orden, string> = {
  'precio-asc': 'precio, de menor a mayor',
  'precio-desc': 'precio, de mayor a menor',
  valoracion: 'valoración, de mayor a menor',
};

export function DestinationPhotoCards({ destinos = DESTINOS }: { destinos?: Destino[] }) {
  const [orden, setOrden] = useState<Orden>('precio-asc');
  const [anuncio, setAnuncio] = useState('');
  const [favs, setFavs] = useState<string[]>([]);
  const lista = useMemo(() => [...destinos].sort(COMPARA[orden]), [destinos, orden]);

  const cambiarOrden = (valor: Orden) => {
    setOrden(valor);
    setAnuncio(`Ordenado por ${ETIQUETA[valor]}.`);
  };
  const alternar = (nombre: string) =>
    setFavs((actual) => (actual.includes(nombre) ? actual.filter((n) => n !== nombre) : [...actual, nombre]));

  return (
    <main className="wrap" aria-labelledby="h">
      <header className="head">
        <div>
          <p className="kicker">Escapadas</p>
          <h1 id="h">Destinos para escaparte</h1>
        </div>
        <p className="favs">Favoritos: <output>{favs.length}</output></p>
      </header>
      <div className="tools">
        <label htmlFor="sort">Ordenar por</label>
        <select id="sort" value={orden} onChange={(e) => cambiarOrden(e.target.value as Orden)}>
          <option value="precio-asc">Precio ↑</option>
          <option value="precio-desc">Precio ↓</option>
          <option value="valoracion">Valoración</option>
        </select>
        <p className="sr" aria-live="polite">{anuncio}</p>
      </div>
      <ul className="grid">
        {lista.map((d) => (
          <li key={d.nombre}>
            <article className="card">
              <figure className="photo">
                <img src={`/stock/${d.foto}.webp`} alt={d.alt} width={800} height={533} loading="lazy" decoding="async" />
                <button type="button" className="fav" aria-pressed={favs.includes(d.nombre)} aria-label={`Guardar ${d.nombre} en favoritos`} onClick={() => alternar(d.nombre)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
                  </svg>
                </button>
              </figure>
              <div className="body">
                <h2>{d.nombre}</h2>
                <p className="place">{d.pais}</p>
                <div className="meta">
                  <p className="price">desde {d.precio} €</p>
                  <p className="rating"><span aria-hidden="true">★</span> {d.nota.toLocaleString('es-ES')}<span className="sr"> de 5</span></p>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}

// CSS: copia las reglas .wrap, .head, .kicker, h1, .favs, .tools, select, .grid, .card, .photo, .fav, .body, h2, .place, .meta, .price, .rating y .sr (y sus @media) de la pestaña HTML + CSS.
