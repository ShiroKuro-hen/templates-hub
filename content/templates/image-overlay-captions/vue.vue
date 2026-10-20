<script setup lang="ts">
type Card = { src: string; alt: string; tag: string; title: string; detail: string };

const captionCards: Card[] = [
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

const barCards: Card[] = [
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
</script>

<template>
  <main class="wrap">
    <h1>Destinos para el fin de semana</h1>
    <h2>Leyenda al pasar o enfocar</h2>
    <div class="grid">
      <article v-for="c in captionCards" :key="c.title" class="card">
        <img :src="c.src" :alt="c.alt" width="640" height="400" loading="lazy" />
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
        <img :src="c.src" :alt="c.alt" width="640" height="400" loading="lazy" />
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
  .card img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}
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
