import { useEffect, useRef, useState, type FormEvent } from 'react';

export type Product = { id: number; name: string; price: number; rating: number; reviews: number; shape: string };

const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
const num = (n: number) => n.toLocaleString('es-ES');
const uri = (shape: string) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="rgba(255,255,255,.95)" stroke="rgba(255,255,255,.95)" stroke-width="3" stroke-linejoin="round">${shape}</g></svg>`);

const PRODUCTS: Product[] = [
  { id: 1, name: 'Taza de cerámica artesanal', price: 18.5, rating: 4.8, reviews: 214, shape: '<path d="M10 20h34v20a14 14 0 0 1-14 14H24A14 14 0 0 1 10 40z"/><path d="M44 27h4a7 7 0 0 1 0 14h-4" fill="none"/>' },
  { id: 2, name: 'Lámpara de mesa de lino', price: 64, rating: 4.6, reviews: 97, shape: '<path d="M22 8h20l10 26H12z"/><rect x="30" y="34" width="4" height="16"/><rect x="20" y="50" width="24" height="4" rx="2"/>' },
  { id: 3, name: 'Cuaderno de tapa dura A5', price: 12.9, rating: 4.9, reviews: 362, shape: '<rect x="16" y="8" width="32" height="48" rx="3"/><path d="M24 20h16M24 28h16M24 36h10" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="2.5" stroke-linecap="round"/>' },
  { id: 4, name: 'Auriculares inalámbricos Aura', price: 89, rating: 4.4, reviews: 1031, shape: '<path d="M14 38v-8a18 18 0 0 1 36 0v8" fill="none" stroke-width="5"/><rect x="9" y="36" width="11" height="18" rx="4"/><rect x="44" y="36" width="11" height="18" rx="4"/>' },
  { id: 5, name: 'Mochila urbana 20 L', price: 49.95, rating: 4.5, reviews: 188, shape: '<rect x="18" y="14" width="28" height="40" rx="10"/><path d="M26 14V10h12v4" fill="none" stroke-width="3"/><rect x="24" y="34" width="16" height="10" rx="3" fill="rgba(0,0,0,.2)" stroke="none"/>' },
  { id: 6, name: 'Set de velas de soja', price: 24.9, rating: 4.7, reviews: 426, shape: '<rect x="12" y="30" width="16" height="24" rx="2"/><rect x="36" y="22" width="16" height="32" rx="2"/><path d="M44 10q4 6 0 10" fill="none" stroke-width="3"/>' },
  { id: 7, name: 'Zapatillas Ruta Ligera', price: 79.95, rating: 4.3, reviews: 655, shape: '<path d="M8 44V24h12l8 12 18 4 10 2v2z"/>' },
  { id: 8, name: 'Botella térmica 750 ml', price: 22, rating: 4.6, reviews: 540, shape: '<rect x="24" y="6" width="16" height="8" rx="2"/><path d="M26 14h12v6l5 8v22a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4V28l5-8z"/>' },
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
          <p className="eyebrow">Colección de otoño</p>
          <h1 id="hero-title">Hasta un 30 % en textil y cocina para tu casa</h1>
          <p>Piezas hechas a mano por artesanos españoles. Envío en 24 h a península.</p>
          <div className="actions">
            <a className="btn pri" href="#productos">Ver ofertas</a>
            <a className="btn" href="#">Nuevas llegadas</a>
          </div>
        </section>

        <nav aria-label="Categorías">
          <ul className="cats">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <a href="#">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: c.icon }} />
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
              <li key={p.id} className="card">
                <div className="thumb"><img src={uri(p.shape)} alt="" width={96} height={96} /></div>
                <div className="info">
                  <h3>{p.name}</h3>
                  <p className="rating"><span className="star" aria-hidden="true">★</span> {num(p.rating)} <span>({num(p.reviews)} reseñas)</span></p>
                  <div className="buy">
                    <span className="price">{eur(p.price)}</span>
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

const CATEGORIES = [
  { name: 'Hogar', count: 128, icon: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>' },
  { name: 'Cocina', count: 94, icon: '<path d="M4 11h16v3a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7zM8 7l1.5 2M16 7l-1.5 2"/>' },
  { name: 'Moda', count: 212, icon: '<path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z"/>' },
  { name: 'Tecnología', count: 76, icon: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>' },
  { name: 'Deporte', count: 63, icon: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/>' },
  { name: 'Papelería', count: 141, icon: '<path d="M4 20l4-1L19 8l-3-3L5 16z"/>' },
];

const FOOTER = [
  { title: 'Tienda', links: ['Novedades', 'Ofertas', 'Regalos'] },
  { title: 'Ayuda', links: ['Envíos y plazos', 'Devoluciones', 'Contacto'] },
  { title: 'Casa Ribera', links: ['Sobre nosotros', 'Nuestros artesanos', 'Aviso legal'] },
];

// CSS: copia las reglas de la pestaña HTML + CSS (.page, .promo, .nav, .brand, .search, .cart, .count, .hero, .cats, .sec, .grid, .card, .toast, .benefits, .news, .foot, .sr, .btn…) y el @keyframes bump.
