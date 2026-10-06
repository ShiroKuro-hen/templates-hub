import { useState, type CSSProperties } from 'react';

type Product = { nombre: string; detalle: string; precio: number; antes?: number; nota: number; resenas: number };
const DEMO: Product = { nombre: 'Auriculares Aura 2', detalle: 'Cancelación de ruido, 40 h de batería', precio: 149, antes: 189, nota: 4.5, resenas: 1284 };
const eur = (n: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const num = (n: number) => n.toLocaleString('es-ES');

export function ProductCard({ p = DEMO, onAdd }: { p?: Product; onAdd?: () => void }) {
  const [n, setN] = useState(0);
  const add = () => { setN(n + 1); onAdd?.(); };

  return (
    <article className="product" aria-labelledby="p-title">
      <div className="media">
        <span className="badge">Nuevo</span>
        <svg viewBox="0 0 120 120" role="img" aria-label={p.nombre}>
          <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
          <path d="M22 70V60a38 38 0 0 1 76 0v10" fill="none" stroke="url(#g)" strokeWidth="7" strokeLinecap="round" />
          <rect x="14" y="64" width="22" height="36" rx="8" fill="currentColor" />
          <rect x="84" y="64" width="22" height="36" rx="8" fill="currentColor" />
        </svg>
      </div>
      <div className="body">
        <h3 id="p-title">{p.nombre}</h3>
        <p className="sub">{p.detalle}</p>
        <div className="rating">
          <span className="stars" style={{ '--r': `${(p.nota / 5) * 100}%` } as CSSProperties}
            role="img" aria-label={`Valoración: ${num(p.nota)} de 5`} />
          <span aria-hidden="true">{num(p.nota)}</span><span>({num(p.resenas)} reseñas)</span>
        </div>
        <div className="buy">
          <p className="price" style={{ margin: 0 }}>
            {eur(p.precio)}
            {p.antes && <s aria-label={`Precio anterior ${eur(p.antes)}`}>{eur(p.antes)}</s>}
          </p>
          <button type="button" className="btn" data-n={n || undefined} onClick={add}>
            {n ? `Añadir otro (${n} en carrito)` : 'Añadir al carrito'}
          </button>
        </div>
        <p className="sr" role="status">{n ? `Añadido al carrito. Tienes ${n}.` : ''}</p>
      </div>
    </article>
  );
}

// CSS: copia las reglas .product, .media, .badge, .body, .rating, .stars, .buy, .price, .btn y .sr de la pestaña HTML + CSS.
