<script setup lang="ts">
import { computed, ref } from 'vue';

type Cat = 'todas' | 'diseno' | 'producto' | 'tecnologia';
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
  { id: 'diseno', label: 'Diseño' },
  { id: 'producto', label: 'Producto' },
  { id: 'tecnologia', label: 'Tecnología' },
];

const CARDS: CardItem[] = [
  { cat: 'diseno', tag: 'Diseño', title: 'Sistemas de color con contraste AA', excerpt: 'Cómo elegir una paleta que se lea bien en claro y en oscuro sin perder personalidad.', author: 'Laura Medina · 6 min de lectura', initials: 'LM', alt: 'Colinas verdes bajo un sol pálido', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23ccfbf1%22%2F%3E%3Ccircle%20cx%3D%2290%22%20cy%3D%2260%22%20r%3D%2222%22%20fill%3D%22%2314b8a6%22%2F%3E%3Cpath%20d%3D%22M0%20140L80%2085l70%2040%2060-55%20110%2070v40H0Z%22%20fill%3D%22%230f766e%22%2F%3E%3Cpath%20d%3D%22M0%20160l120-30%2090%2022%20110-25v53H0Z%22%20fill%3D%22%23134e4a%22%20opacity%3D%22.6%22%2F%3E%3C%2Fsvg%3E' },
  { cat: 'producto', tag: 'Producto', title: 'Cómo priorizar tu hoja de ruta', excerpt: 'Un método sencillo para decidir qué entra en el próximo trimestre y qué espera.', author: 'Diego Ortiz · 8 min de lectura', initials: 'DO', alt: 'Skyline de la ciudad con edificios y un sol bajo', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23e0f2fe%22%2F%3E%3Ccircle%20cx%3D%22265%22%20cy%3D%2240%22%20r%3D%2214%22%20fill%3D%22%23fbbf24%22%2F%3E%3Cpath%20d%3D%22M20%20180V70h44v110zM70%20180V40h38v140zM114%20180V90h50v90zM170%20180V55h42v125zM218%20180V100h36v80zM260%20180V75h44v105z%22%20fill%3D%22%2364748b%22%2F%3E%3Cpath%20d%3D%22M80%2060h6M80%2080h6M124%20110h8M180%2080h8M180%20100h8%22%20stroke%3D%22%23e0f2fe%22%20stroke-width%3D%224%22%2F%3E%3C%2Fsvg%3E' },
  { cat: 'tecnologia', tag: 'Tecnología', title: 'Migrar a una arquitectura por módulos', excerpt: 'Pasos para separar tu aplicación en piezas pequeñas sin detener las entregas.', author: 'Ana Ruiz · 10 min de lectura', initials: 'AR', alt: 'Formas geométricas de colores sobre fondo lila', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23ede9fe%22%2F%3E%3Ccircle%20cx%3D%22110%22%20cy%3D%2290%22%20r%3D%2260%22%20fill%3D%22%237c3aed%22%2F%3E%3Crect%20x%3D%22180%22%20y%3D%2230%22%20width%3D%22110%22%20height%3D%22110%22%20rx%3D%2220%22%20fill%3D%22%23f472b6%22%20transform%3D%22rotate(12%20235%2085)%22%2F%3E%3Cpath%20d%3D%22M40%20170%2080%20110%20120%20170Z%22%20fill%3D%22%23fbbf24%22%2F%3E%3C%2Fsvg%3E' },
  { cat: 'diseno', tag: 'Diseño', title: 'Tipografía fluida para pantallas pequeñas', excerpt: 'Escalas de texto que crecen con la pantalla y mantienen la legibilidad en el móvil.', author: 'Marta Gil · 5 min de lectura', initials: 'MG', alt: 'Mar con olas suaves y un sol amarillo', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23bae6fd%22%2F%3E%3Ccircle%20cx%3D%22230%22%20cy%3D%2255%22%20r%3D%2226%22%20fill%3D%22%23fde047%22%2F%3E%3Cpath%20d%3D%22M0%20100q40-20%2080%200t80%200%2080%200%2080%200v80H0z%22%20fill%3D%22%230284c7%22%2F%3E%3Cpath%20d%3D%22M0%20130q40-20%2080%200t80%200%2080%200%2080%200v50H0z%22%20fill%3D%22%23075985%22%2F%3E%3C%2Fsvg%3E' },
  { cat: 'producto', tag: 'Producto', title: 'Métricas que sí importan en el onboarding', excerpt: 'Qué medir en los primeros siete días y cómo convertir los datos en decisiones.', author: 'Pablo Vera · 7 min de lectura', initials: 'PV', alt: 'Bosque de pinos con un claro de hierba', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23ecfccb%22%2F%3E%3Crect%20y%3D%22150%22%20width%3D%22320%22%20height%3D%2230%22%20fill%3D%22%2365a30d%22%2F%3E%3Cpath%20d%3D%22M50%20150%2075%2080%20100%20150ZM120%20150%20150%2060%20180%20150ZM200%20150%20225%2085%20250%20150ZM265%20150%20285%20100%20305%20150Z%22%20fill%3D%22%23166534%22%2F%3E%3C%2Fsvg%3E' },
  { cat: 'tecnologia', tag: 'Tecnología', title: 'Pruebas de accesibilidad en cada cambio', excerpt: 'Automatiza comprobaciones básicas de teclado, foco y contraste antes de fusionar.', author: 'Lucía Paz · 4 min de lectura', initials: 'LP', alt: 'Bloques naranjas en cuadrícula sobre fondo crema', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23ffedd5%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%2230%22%20width%3D%2280%22%20height%3D%2260%22%20rx%3D%2210%22%20fill%3D%22%23fb923c%22%2F%3E%3Crect%20x%3D%22120%22%20y%3D%2230%22%20width%3D%2280%22%20height%3D%2260%22%20rx%3D%2210%22%20fill%3D%22%23fdba74%22%2F%3E%3Crect%20x%3D%22210%22%20y%3D%2230%22%20width%3D%2280%22%20height%3D%2260%22%20rx%3D%2210%22%20fill%3D%22%23c2410c%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%22104%22%20width%3D%22260%22%20height%3D%2246%22%20rx%3D%2210%22%20fill%3D%22%239a3412%22%20opacity%3D%22.7%22%2F%3E%3C%2Fsvg%3E' },
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
.wrap { max-width: 960px; margin: 0 auto; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
.head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
h1 { margin: 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { font: 600 13px system-ui, -apple-system, "Segoe UI", sans-serif; padding: 6px 14px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 999px; cursor: pointer; transition: border-color .14s, background .14s, color .14s; }
.chip:hover { border-color: var(--accent); }
.chip[aria-pressed="true"] { color: var(--accent-ink); background: var(--accent); border-color: var(--accent); }
.chip:focus-visible, .card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; margin: 0; padding: 0; list-style: none; }
.card { display: flex; flex-direction: column; height: 100%; overflow: hidden; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); transition: transform .2s ease, border-color .2s ease; }
.card:hover { transform: translateY(-4px); border-color: var(--accent); }
.cover { overflow: hidden; border-bottom: 1px solid var(--border); }
.cover img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; transition: transform .5s ease; }
.card:hover .cover img { transform: scale(1.06); }
.body { display: flex; flex: 1; flex-direction: column; gap: 8px; padding: 14px 16px 16px; }
.tag { align-self: flex-start; padding: 2px 10px; background: var(--accent-soft); color: var(--accent); border-radius: 999px; font-size: 12px; font-weight: 600; }
h2 { margin: 0; font-size: 1rem; font-weight: 600; line-height: 1.3; }
.excerpt { margin: 0; color: var(--muted); font-size: 13px; }
.by { display: flex; align-items: center; gap: 8px; margin: auto 0 0; color: var(--muted); font-size: 12px; }
.av { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--accent-soft); color: var(--accent); font-size: 11px; font-weight: 700; }
@media (prefers-reduced-motion: reduce) { .chip, .card, .cover img { transition: none; } .card:hover { transform: none; } .card:hover .cover img { transform: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
