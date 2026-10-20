import { useEffect, useRef, useState, type FormEvent } from 'react';

export type Product = { name: string; image: string; alt: string; price: string; rating: string; reviews: string };

const PRODUCTS: Product[] = [
  { name: 'Taza de cerámica vintage', image: '/stock/taza-vintage.webp', alt: 'Taza de cerámica roja con estampado vintage', price: '18,50 €', rating: '4,8', reviews: '214' },
  { name: 'Café de tueste artesanal', image: '/stock/cafe-rojo.webp', alt: 'Taza de café sobre fondo rojo', price: '12,90 €', rating: '4,9', reviews: '362' },
  { name: 'Libro de anticuario', image: '/stock/libro-abierto.webp', alt: 'Libro antiguo abierto', price: '24,00 €', rating: '4,6', reviews: '97' },
  { name: 'Tocadiscos de vinilo', image: '/stock/tocadiscos.webp', alt: 'Aguja de un tocadiscos sobre el vinilo', price: '149,00 €', rating: '4,4', reviews: '1.031' },
  { name: 'Tetera de cristal con flores', image: '/stock/tetera-flores.webp', alt: 'Tetera de cristal con flores amarillas', price: '34,90 €', rating: '4,5', reviews: '188' },
  { name: 'Miel de azahar', image: '/stock/miel.webp', alt: 'Cuchara de miel en una taza blanca', price: '8,90 €', rating: '4,7', reviews: '426' },
  { name: 'Cactus en maceta de barro', image: '/stock/cactus.webp', alt: 'Cactus redondo en una maceta', price: '12,50 €', rating: '4,3', reviews: '655' },
  { name: 'Cámara vintage restaurada', image: '/stock/camara-vintage.webp', alt: 'Cámara vintage sobre teclas de piano', price: '89,00 €', rating: '4,6', reviews: '540' },
];

const CATEGORIES = [
  { name: 'Hogar', count: '128', image: '/stock/puerta-antigua.webp', alt: 'Puerta de madera antigua en un muro de piedra' },
  { name: 'Café y té', count: '94', image: '/stock/cafe-rojo.webp', alt: 'Taza de café sobre fondo rojo' },
  { name: 'Cocina', count: '212', image: '/stock/ingredientes.webp', alt: 'Tabla de cortar con verduras y pimientos' },
  { name: 'Iluminación', count: '76', image: '/stock/luces-bokeh.webp', alt: 'Luces de colores desenfocadas' },
  { name: 'Libros', count: '141', image: '/stock/libro-abierto.webp', alt: 'Libro antiguo abierto' },
  { name: 'Exterior', count: '63', image: '/stock/bicicleta-granero.webp', alt: 'Bicicleta verde junto a un granero antiguo' },
];

const FOOTER = [
  { title: 'Tienda', links: ['Novedades', 'Ofertas', 'Regalos'] },
  { title: 'Ayuda', links: ['Envíos y plazos', 'Devoluciones', 'Contacto'] },
  { title: 'Casa Ribera', links: ['Sobre nosotros', 'Nuestros artesanos', 'Aviso legal'] },
];

const TOAST_MS = 2600;

export function StorefrontHome({ products = PRODUCTS }: { products?: Product[] }) {
  const [promo, setPromo] = useState(true);
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(0);
  const [toast, setToast] = useState('');
  const [newsMsg, setNewsMsg] = useState('');
  const brandRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), TOAST_MS);
    return () => clearTimeout(t);
  }, [toast]);

  const shown = products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  const add = (p: Product) => {
    setCount((c) => c + 1);
    setToast(`Añadido: ${p.name}`);
  };

  const closePromo = () => {
    setPromo(false);
    brandRef.current?.focus();
  };

  const subscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsMsg('¡Listo! Confirma tu suscripción en el correo que te enviamos.');
    e.currentTarget.reset();
  };

  return (
    <div className="page">
      {promo && (
        <aside className="promo" aria-label="Anuncio">
          <p>Envío gratis desde 49 € · Devoluciones sin coste en 30 días</p>
          <button type="button" aria-label="Cerrar anuncio" onClick={closePromo}>×</button>
        </aside>
      )}

      <header className="nav">
        <a className="brand" href="#" ref={brandRef}><i aria-hidden="true" />Casa Ribera</a>
        <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
          <label className="sr" htmlFor="q">Buscar productos</label>
          <input id="q" type="search" placeholder="Buscar productos…" autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
        </form>
        <button type="button" className="cart">
          Carrito <span key={count} className={count ? 'count bump' : 'count'}>{count}</span>
        </button>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div>
            <p className="eyebrow">Colección de otoño · hasta un 30 %</p>
            <h1 id="hero-title">Hogar, café y objetos con historia</h1>
            <p className="lead">Piezas seleccionadas por artesanos españoles. Envío en 24 h a península.</p>
            <div className="actions">
              <a className="btn pri" href="#productos">Ver ofertas</a>
              <a className="btn" href="#">Nuevas llegadas</a>
            </div>
          </div>
          <img src="/stock/cafeteria-mesa.webp" alt="Mesa larga de madera en una cafetería" width={800} height={533} fetchPriority="high" />
        </section>

        <nav aria-label="Categorías">
          <ul className="cats">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <a href="#">
                  <img src={c.image} alt={c.alt} width={800} height={533} loading="lazy" decoding="async" />
                  <span>{c.name}</span>
                  <small>{c.count} productos</small>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section className="sec" id="productos" aria-labelledby="prod-title">
          <div className="sec-head">
            <h2 id="prod-title">Más vendidos</h2>
            <a href="#">Ver todo</a>
          </div>
          <ul className="grid">
            {shown.map((p) => (
              <li key={p.name} className="card">
                <img src={p.image} alt={p.alt} width={800} height={533} loading="lazy" decoding="async" />
                <div className="info">
                  <h3>{p.name}</h3>
                  <p className="rating"><span className="star" aria-hidden="true">★</span> {p.rating} <span>({p.reviews} reseñas)</span></p>
                  <div className="buy">
                    <span className="price">{p.price}</span>
                    <button type="button" className="add" aria-label={`Añadir ${p.name} al carrito`} onClick={() => add(p)}>Añadir</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {shown.length === 0 && <p className="none">No hay productos que coincidan con tu búsqueda.</p>}
        </section>

        <ul className="benefits" aria-label="Ventajas de comprar aquí">
          <li><b>Envío en 24 h</b><span>Gratis a partir de 49 €</span></li>
          <li><b>Devoluciones fáciles</b><span>Hasta 30 días, sin preguntas</span></li>
          <li><b>Pago seguro</b><span>Tarjeta, PayPal y Bizum</span></li>
        </ul>

        <section className="news" aria-labelledby="news-title">
          <div>
            <h2 id="news-title">Ofertas antes que nadie</h2>
            <p>Un correo al mes con novedades y códigos exclusivos. Sin spam.</p>
          </div>
          <div>
            <form id="news" onSubmit={subscribe}>
              <label className="sr" htmlFor="mail">Correo electrónico</label>
              <input id="mail" type="email" required placeholder="tu@correo.com" autoComplete="email" />
              <button className="btn pri" type="submit">Suscribirme</button>
              <p className="note" role="status">{newsMsg}</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="cols">
          {FOOTER.map((col) => (
            <div key={col.title}>
              <h3>{col.title}</h3>
              <ul>{col.links.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <p className="legal">© 2026 Casa Ribera, S.L. · Precios con IVA incluido.</p>
      </footer>

      <p className="toast" aria-live="polite" data-show={toast ? '' : undefined}>{toast}</p>
    </div>
  );
}

// CSS: copia las reglas de la pestaña HTML + CSS (.page, .promo, .nav, .hero, .cats, .sec, .grid, .card, .toast, .benefits, .news, .foot, .sr, .btn…) y el @keyframes bump.
