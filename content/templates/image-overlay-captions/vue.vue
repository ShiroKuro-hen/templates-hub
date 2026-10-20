<script setup lang="ts">
type Card = { src: string; alt: string; tag: string; title: string; detail: string };

const captionCards: Card[] = [
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

const barCards: Card[] = [
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
</script>

<template>
  <main class="wrap">
    <h1>Destinos para el fin de semana</h1>
    <h2>Leyenda al pasar o enfocar</h2>
    <div class="grid">
      <article v-for="c in captionCards" :key="c.title" class="card">
        <img :src="c.src" :alt="c.alt" width="800" height="533" decoding="async" />
        <span class="tag">{{ c.tag }}</span>
        <div class="cap">
          <h3><a href="#">{{ c.title }}</a></h3>
          <p class="more">{{ c.detail }}</p>
        </div>
      </article>
    </div>
    <h2>Barra inferior</h2>
    <div class="grid">
      <article v-for="c in barCards" :key="c.title" class="card">
        <img :src="c.src" :alt="c.alt" width="800" height="533" decoding="async" />
        <span class="tag">{{ c.tag }}</span>
        <div class="bar">
          <h3><a href="#">{{ c.title }}</a></h3>
          <span>{{ c.detail }}</span>
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>

  *{box-sizing:border-box}
  .wrap{max-width:760px;margin:0 auto}
  h1{margin:0 0 4px;font-size:20px;font-weight:600}
  h2{margin:24px 0 10px;font-size:14px;font-weight:600;color:var(--muted)}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
  .card{position:relative;display:grid;grid-template-columns:1fr;grid-template-rows:1fr;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);transition:border-color .14s}
  .card:hover{border-color:var(--accent)}
  .card:has(a:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
  .card>*{grid-area:1/1}
  .card img{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover}
  .card a{color:inherit;text-decoration:none;outline:0}
  .card a::after{content:"";position:absolute;inset:0}
  .card:hover a{text-decoration:underline;text-underline-offset:3px}
  .tag{justify-self:start;align-self:start;margin:10px;padding:1px 10px;border-radius:999px;background:var(--accent);color:var(--accent-ink);font-size:12px;font-weight:600}
  .cap{align-self:end;padding:40px 14px 12px;color:rgb(255 255 255);background:linear-gradient(to top,rgb(0 0 0 / .9),rgb(0 0 0 / .75) 70%,rgb(0 0 0 / .45))}
  .cap h3{margin:0;font-size:16px;line-height:1.3;font-weight:600}
  .more{margin:6px 0 0;font-size:13px;opacity:0;max-height:0;overflow:hidden;transition:opacity .16s,max-height .16s}
  .card:hover .more,.card:focus-within .more{opacity:1;max-height:6em}
  .bar{align-self:end;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;background:var(--surface);border-top:1px solid var(--border)}
  .bar h3{min-width:0;margin:0;font-size:15px;font-weight:600}
  .bar span{flex:none;color:var(--muted);font-size:13px}
  :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
  @media (prefers-reduced-motion:reduce){*{transition:none!important}}

</style>
