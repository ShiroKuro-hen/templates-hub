<script setup lang="ts">
import { computed, ref } from 'vue';

type Cat = 'todas' | 'naturaleza' | 'ciudad' | 'viajes' | 'trabajo' | 'hogar' | 'montana';
type CardItem = {
  cat: Exclude<Cat, 'todas'>;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  initials: string;
  alt: string;
  src: string;
};

const CHIPS: { id: Cat; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'naturaleza', label: 'Naturaleza' },
  { id: 'ciudad', label: 'Ciudad' },
  { id: 'viajes', label: 'Viajes' },
  { id: 'trabajo', label: 'Trabajo' },
  { id: 'hogar', label: 'Hogar' },
  { id: 'montana', label: 'Montaña' },
];

const CARDS: CardItem[] = [
  { cat: 'naturaleza', tag: 'Naturaleza', title: 'Rutas cortas para caminar en el bosque', excerpt: 'Senderos señalizados para una mañana tranquila entre árboles.', author: 'Laura Medina · 6 min de lectura', initials: 'LM', alt: 'Sendero de hierba que atraviesa un bosque', src: '/stock/sendero-verde.webp' },
  { cat: 'ciudad', tag: 'Ciudad', title: 'Recorrer una ciudad sin plano', excerpt: 'Pistas para descubrir barrios a pie, entre calles estrechas y fachadas antiguas.', author: 'Diego Ortiz · 8 min de lectura', initials: 'DO', alt: 'Calle de ciudad entre edificios altos', src: '/stock/calle-ciudad.webp' },
  { cat: 'viajes', tag: 'Viajes', title: 'Pueblos blancos junto al mar', excerpt: 'Qué ver en una isla de casas encaladas y cómo organizar tu semana allí.', author: 'Ana Ruiz · 10 min de lectura', initials: 'AR', alt: 'Pueblo blanco junto al mar en una isla', src: '/stock/isla-blanca.webp' },
  { cat: 'trabajo', tag: 'Trabajo', title: 'Un escritorio que ayuda a crear', excerpt: 'Materiales, pantalla y pausas para organizar tu espacio de diseño.', author: 'Marta Gil · 5 min de lectura', initials: 'MG', alt: 'Escritorio visto desde arriba con materiales de diseño y un teléfono', src: '/stock/escritorio-diseno.webp' },
  { cat: 'hogar', tag: 'Hogar', title: 'Mesas de madera para cada día', excerpt: 'Cómo elegir y cuidar una mesa larga que dure años en casa o en el local.', author: 'Pablo Vera · 7 min de lectura', initials: 'PV', alt: 'Mesa larga de madera en una cafetería', src: '/stock/cafeteria-mesa.webp' },
  { cat: 'montana', tag: 'Montaña', title: 'Preparar una ruta con nieve', excerpt: 'Equipo, horarios y señales para subir a cumbres nevadas con seguridad.', author: 'Lucía Paz · 4 min de lectura', initials: 'LP', alt: 'Picos nevados bajo el cielo', src: '/stock/montana-nieve.webp' },
];

const filter = ref<Cat>('todas');
const visible = computed(() => CARDS.filter((c) => filter.value === 'todas' || c.cat === filter.value));
</script>

<template>
  <main class="wrap" aria-labelledby="cards-title">
    <header class="head">
      <h1 id="cards-title">Lecturas para tu equipo</h1>
      <div class="filters" role="group" aria-label="Filtrar por categoría">
        <button v-for="c in CHIPS" :key="c.id" type="button" class="chip" :aria-pressed="filter === c.id" @click="filter = c.id">
          {{ c.label }}
        </button>
      </div>
    </header>
    <ul class="grid">
      <li v-for="c in visible" :key="c.title">
        <article class="card">
          <div class="cover">
            <img :src="c.src" :alt="c.alt" width="320" height="180" loading="lazy" />
          </div>
          <div class="body">
            <span class="tag">{{ c.tag }}</span>
            <h2>{{ c.title }}</h2>
            <p class="excerpt">{{ c.excerpt }}</p>
            <p class="by"><span class="av" aria-hidden="true">{{ c.initials }}</span>{{ c.author }}</p>
          </div>
        </article>
      </li>
    </ul>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
[hidden]{display:none!important}
.wrap{max-width:960px;margin:0 auto}
.head{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:12px;margin-bottom:18px}
h1{margin:0;font-size:1.5rem;font-weight:700;letter-spacing:-.02em}
.filters{display:flex;flex-wrap:wrap;gap:8px}
.chip{font:600 13px system-ui,-apple-system,"Segoe UI",sans-serif;padding:6px 14px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:999px;cursor:pointer;transition:border-color .14s,background .14s,color .14s}
.chip:hover{border-color:var(--accent)}
.chip[aria-pressed="true"]{color:var(--accent-ink);background:var(--accent);border-color:var(--accent)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;margin:0;padding:0;list-style:none}
.card{display:flex;flex-direction:column;height:100%;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);transition:transform .2s ease,border-color .2s ease}
.card:hover{transform:translateY(-4px);border-color:var(--accent)}
.cover{overflow:hidden;border-bottom:1px solid var(--border)}
.cover img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;transition:transform .5s ease}
.card:hover .cover img{transform:scale(1.06)}
.body{display:flex;flex:1;flex-direction:column;gap:8px;padding:14px 16px 16px}
.tag{align-self:flex-start;padding:2px 10px;background:var(--accent-soft);color:var(--accent);border-radius:999px;font-size:12px;font-weight:600}
h2{margin:0;font-size:1rem;font-weight:600;line-height:1.3}
.excerpt{margin:0;color:var(--muted);font-size:13px}
.by{display:flex;align-items:center;gap:8px;margin:auto 0 0;color:var(--muted);font-size:12px}
.av{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--accent-soft);color:var(--accent);font-size:11px;font-weight:700}
@media (prefers-reduced-motion:reduce){*{transition:none!important}.card:hover{transform:none}.card:hover .cover img{transform:none}}
</style>
