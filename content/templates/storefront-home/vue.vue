<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';

type Product = { name: string; image: string; alt: string; price: string; rating: string; reviews: string };

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

const promo = ref(true);
const query = ref('');
const count = ref(0);
const toast = ref('');
const newsMsg = ref('');
const brand = ref<HTMLAnchorElement>();
const shown = computed(() => PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.value.trim().toLowerCase())));

let timer: ReturnType<typeof setTimeout> | undefined;
onUnmounted(() => clearTimeout(timer));

function add(p: Product) {
  count.value++;
  toast.value = `Añadido: ${p.name}`;
  clearTimeout(timer);
  timer = setTimeout(() => (toast.value = ''), TOAST_MS);
}

function closePromo() {
  promo.value = false;
  brand.value?.focus();
}

function subscribe(e: SubmitEvent) {
  newsMsg.value = '¡Listo! Confirma tu suscripción en el correo que te enviamos.';
  (e.currentTarget as HTMLFormElement).reset();
}
</script>

<template>
  <div class="page">
    <aside v-if="promo" class="promo" aria-label="Anuncio">
      <p>Envío gratis desde 49 € · Devoluciones sin coste en 30 días</p>
      <button type="button" aria-label="Cerrar anuncio" @click="closePromo">×</button>
    </aside>

    <header class="nav">
      <a ref="brand" class="brand" href="#"><i aria-hidden="true"></i>Casa Ribera</a>
      <form class="search" role="search" @submit.prevent>
        <label class="sr" for="q">Buscar productos</label>
        <input id="q" v-model="query" type="search" placeholder="Buscar productos…" autocomplete="off">
      </form>
      <button type="button" class="cart">
        Carrito <span :key="count" :class="['count', { bump: count > 0 }]">{{ count }}</span>
      </button>
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-title">
        <div>
          <p class="eyebrow">Colección de otoño · hasta un 30 %</p>
          <h1 id="hero-title">Hogar, café y objetos con historia</h1>
          <p class="lead">Piezas seleccionadas por artesanos españoles. Envío en 24 h a península.</p>
          <div class="actions">
            <a class="btn pri" href="#productos">Ver ofertas</a>
            <a class="btn" href="#">Nuevas llegadas</a>
          </div>
        </div>
        <img src="/stock/cafeteria-mesa.webp" alt="Mesa larga de madera en una cafetería" width="800" height="533" fetchpriority="high">
      </section>

      <nav aria-label="Categorías">
        <ul class="cats">
          <li v-for="c in CATEGORIES" :key="c.name">
            <a href="#">
              <img :src="c.image" :alt="c.alt" width="800" height="533" loading="lazy" decoding="async">
              <span>{{ c.name }}</span>
              <small>{{ c.count }} productos</small>
            </a>
          </li>
        </ul>
      </nav>

      <section class="sec" id="productos" aria-labelledby="prod-title">
        <div class="sec-head">
          <h2 id="prod-title">Más vendidos</h2>
          <a href="#">Ver todo</a>
        </div>
        <ul class="grid">
          <li v-for="p in shown" :key="p.name" class="card">
            <img :src="p.image" :alt="p.alt" width="800" height="533" loading="lazy" decoding="async">
            <div class="info">
              <h3>{{ p.name }}</h3>
              <p class="rating"><span class="star" aria-hidden="true">★</span> {{ p.rating }} <span>({{ p.reviews }} reseñas)</span></p>
              <div class="buy">
                <span class="price">{{ p.price }}</span>
                <button type="button" class="add" :aria-label="`Añadir ${p.name} al carrito`" @click="add(p)">Añadir</button>
              </div>
            </div>
          </li>
        </ul>
        <p v-if="!shown.length" class="none">No hay productos que coincidan con tu búsqueda.</p>
      </section>

      <ul class="benefits" aria-label="Ventajas de comprar aquí">
        <li><b>Envío en 24 h</b><span>Gratis a partir de 49 €</span></li>
        <li><b>Devoluciones fáciles</b><span>Hasta 30 días, sin preguntas</span></li>
        <li><b>Pago seguro</b><span>Tarjeta, PayPal y Bizum</span></li>
      </ul>

      <section class="news" aria-labelledby="news-title">
        <div>
          <h2 id="news-title">Ofertas antes que nadie</h2>
          <p>Un correo al mes con novedades y códigos exclusivos. Sin spam.</p>
        </div>
        <div>
          <form id="news" @submit.prevent="subscribe">
            <label class="sr" for="mail">Correo electrónico</label>
            <input id="mail" type="email" required placeholder="tu@correo.com" autocomplete="email">
            <button class="btn pri" type="submit">Suscribirme</button>
            <p class="note" role="status">{{ newsMsg }}</p>
          </form>
        </div>
      </section>
    </main>

    <footer class="foot">
      <div class="cols">
        <div v-for="col in FOOTER" :key="col.title">
          <h3>{{ col.title }}</h3>
          <ul><li v-for="l in col.links" :key="l"><a href="#">{{ l }}</a></li></ul>
        </div>
      </div>
      <p class="legal">© 2026 Casa Ribera, S.L. · Precios con IVA incluido.</p>
    </footer>

    <p class="toast" aria-live="polite" :data-show="toast ? '' : undefined">{{ toast }}</p>
  </div>
</template>

<style scoped>
  .page{max-width:1100px;margin:0 auto}
  a{color:inherit;text-decoration:none}
  button,input{font:inherit;color:inherit}
  button{cursor:pointer}
  p,h1,h2,h3{margin:0}
  :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .btn,.add{display:inline-block;font-weight:600;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:border-color .14s,filter .14s}
  .btn{padding:9px 16px}
  .btn:hover,.cats a:hover{border-color:var(--accent)}
  .pri,.add{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
  .pri:hover,.add:hover{filter:brightness(1.08)}
  .promo{display:flex;align-items:center;justify-content:center;gap:10px;padding:8px 12px;background:var(--accent);color:var(--accent-ink);font-size:13px;border-radius:var(--radius)}
  .promo p{text-align:center}
  .promo button{flex:none;padding:2px 6px;border:0;background:none;color:inherit;font-size:18px;line-height:1;border-radius:min(var(--radius),6px)}
  .nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;padding:16px 0;border-bottom:1px solid var(--border)}
  .brand{display:inline-flex;align-items:center;gap:8px;margin-right:auto;font-size:18px;font-weight:700;letter-spacing:-.01em}
  .brand i{width:24px;height:24px;border-radius:min(var(--radius),6px);background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff))}
  .search{flex:1 1 100%;order:3}
  .search input{width:100%;padding:9px 14px;background:var(--surface);border:1px solid var(--border);border-radius:999px}
  .cart{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;font-weight:600;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
  .count{min-width:24px;padding:1px 7px;border-radius:999px;background:var(--accent);color:var(--accent-ink);font-size:12px;text-align:center;font-variant-numeric:tabular-nums}
  .count.bump{animation:bump .32s ease-out}
  @keyframes bump{40%{transform:scale(1.35)}}
  .hero{display:grid;gap:24px;align-items:center;margin-top:20px;padding:clamp(20px,5vw,40px);background:var(--accent-soft);border:1px solid var(--border);border-radius:var(--radius)}
  .hero img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;border-radius:var(--radius)}
  .eyebrow{margin:0 0 10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
  .hero h1{margin:0 0 12px;max-width:16ch;font-size:clamp(28px,5vw,44px);line-height:1.1;letter-spacing:-.02em;text-wrap:balance}
  .lead{max-width:52ch;color:var(--muted)}
  .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
  .cats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:28px 0 0;padding:0;list-style:none}
  .cats a{display:flex;flex-direction:column;height:100%;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:border-color .14s}
  .cats img{display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}
  .cats span{padding:10px 12px 0;font-weight:600}
  .cats small{padding:0 12px 12px;color:var(--muted);font-size:12px}
  .sec{margin-top:36px}
  .sec-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:14px}
  .sec-head h2{font-size:20px;letter-spacing:-.01em}
  .sec-head a{color:var(--accent);font-weight:600;font-size:14px}
  .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:0;padding:0;list-style:none}
  .card{display:flex;flex-direction:column;min-width:0;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
  .card img{display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}
  .info{display:flex;flex:1;flex-direction:column;gap:6px;padding:12px}
  .info h3{font-size:14px;line-height:1.3}
  .rating{font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
  .star{color:var(--warn)}
  .buy{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-top:auto;padding-top:6px}
  .price{font-weight:700;font-variant-numeric:tabular-nums}
  .add{padding:7px 12px;font-size:13px}
  .none{padding:24px;text-align:center;color:var(--muted)}
  .toast{position:fixed;left:50%;bottom:20px;z-index:2;width:max-content;max-width:calc(100vw - 40px);padding:10px 16px;background:var(--text);color:var(--bg);border-radius:var(--radius);box-shadow:var(--shadow);font-size:14px;font-weight:600;opacity:0;visibility:hidden;transform:translate(-50%,12px);transition:opacity .2s,transform .2s,visibility .2s}
  .toast[data-show]{opacity:1;visibility:visible;transform:translate(-50%,0)}
  .benefits{display:grid;gap:10px;margin:28px 0 0;padding:0;list-style:none}
  .benefits li{display:flex;flex-direction:column;gap:2px;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:var(--radius)}
  .benefits b{font-size:15px}
  .benefits span{color:var(--muted);font-size:13px}
  .news{display:grid;gap:16px;margin-top:36px;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
  .news h2{margin:0 0 4px;font-size:18px}
  .news p{color:var(--muted)}
  .news form{display:flex;flex-wrap:wrap;gap:8px}
  .news input{flex:1 1 200px;min-width:0;padding:9px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
  .news .note{flex-basis:100%;color:var(--ok);font-weight:600}
  .foot{margin-top:40px;padding:28px 0 8px;border-top:1px solid var(--border)}
  .cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
  .cols h3{margin:0 0 8px;font-size:14px}
  .cols ul{margin:0;padding:0;list-style:none;color:var(--muted)}
  .cols li{padding:3px 0}
  .cols a:hover{color:var(--text);text-decoration:underline}
  .legal{margin:24px 0 0;font-size:12px;color:var(--muted)}
  @media (min-width:768px){
    .brand{margin-right:0}
    .search{flex:1 1 auto;order:0;max-width:340px;margin-left:auto}
    .hero{grid-template-columns:1fr 1fr}
    .cats{grid-template-columns:repeat(3,minmax(0,1fr))}
    .grid{grid-template-columns:repeat(4,minmax(0,1fr))}
    .benefits{grid-template-columns:repeat(3,minmax(0,1fr))}
    .news{grid-template-columns:1fr 1fr;align-items:center}
    .cols{grid-template-columns:repeat(3,minmax(0,1fr))}
  }
  @media (min-width:1000px){.cats{grid-template-columns:repeat(6,minmax(0,1fr))}}
  @media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>
