<script setup lang="ts">
import { computed, ref } from 'vue';

type Destino = { nombre: string; pais: string; precio: number; nota: number; foto: string; alt: string };
type Orden = 'precio-asc' | 'precio-desc' | 'valoracion';

const props = withDefaults(defineProps<{ destinos?: Destino[] }>(), {
  destinos: () => [
    { nombre: 'Selva Negra', pais: 'Alemania', precio: 280, nota: 4.6, foto: 'sendero-verde', alt: 'Sendero de hierba que atraviesa el bosque' },
    { nombre: 'Cañón del Tara', pais: 'Montenegro', precio: 350, nota: 4.7, foto: 'canon-verde', alt: 'Cañón verde con un arroyo' },
    { nombre: 'Costa Cántabra', pais: 'España', precio: 420, nota: 4.5, foto: 'embarcadero', alt: 'Muelle de madera que se adentra en el mar' },
    { nombre: 'Cassis', pais: 'Francia', precio: 460, nota: 4.4, foto: 'costa-azul', alt: 'Costa con pinos frente al mar' },
    { nombre: 'Zermatt', pais: 'Suiza', precio: 540, nota: 4.8, foto: 'montana-nieve', alt: 'Picos nevados bajo un cielo despejado' },
    { nombre: 'Santorini', pais: 'Grecia', precio: 690, nota: 4.9, foto: 'isla-blanca', alt: 'Pueblo blanco griego junto al mar' },
  ],
});

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

const orden = ref<Orden>('precio-asc');
const anuncio = ref('');
const favs = ref<string[]>([]);
const lista = computed(() => [...props.destinos].sort(COMPARA[orden.value]));

function cambiarOrden(e: Event) {
  orden.value = (e.target as HTMLSelectElement).value as Orden;
  anuncio.value = `Ordenado por ${ETIQUETA[orden.value]}.`;
}
function alternar(nombre: string) {
  favs.value = favs.value.includes(nombre) ? favs.value.filter((n) => n !== nombre) : [...favs.value, nombre];
}
</script>

<template>
  <main class="wrap" aria-labelledby="h">
    <header class="head">
      <div>
        <p class="kicker">Escapadas</p>
        <h1 id="h">Destinos para escaparte</h1>
      </div>
      <p class="favs">Favoritos: <output>{{ favs.length }}</output></p>
    </header>
    <div class="tools">
      <label for="sort">Ordenar por</label>
      <select id="sort" :value="orden" @change="cambiarOrden">
        <option value="precio-asc">Precio ↑</option>
        <option value="precio-desc">Precio ↓</option>
        <option value="valoracion">Valoración</option>
      </select>
      <p class="sr" aria-live="polite">{{ anuncio }}</p>
    </div>
    <ul class="grid">
      <li v-for="d in lista" :key="d.nombre">
        <article class="card">
          <figure class="photo">
            <img :src="`/stock/${d.foto}.webp`" :alt="d.alt" width="800" height="533" loading="lazy" decoding="async" />
            <button type="button" class="fav" :aria-pressed="favs.includes(d.nombre)" :aria-label="`Guardar ${d.nombre} en favoritos`" @click="alternar(d.nombre)">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              </svg>
            </button>
          </figure>
          <div class="body">
            <h2>{{ d.nombre }}</h2>
            <p class="place">{{ d.pais }}</p>
            <div class="meta">
              <p class="price">desde {{ d.precio }} €</p>
              <p class="rating"><span aria-hidden="true">★</span> {{ d.nota.toLocaleString('es-ES') }}<span class="sr"> de 5</span></p>
            </div>
          </div>
        </article>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.wrap{max-width:960px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:12px;margin-bottom:16px}
.kicker{margin:0 0 4px;color:var(--accent);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
h1{margin:0;font-size:1.5rem;font-weight:700;letter-spacing:-.02em}
.favs{margin:0;color:var(--muted)}
.favs output{color:var(--text);font-weight:700;font-variant-numeric:tabular-nums}
.tools{display:flex;align-items:center;gap:10px;margin-bottom:16px}
.tools label{color:var(--muted);font-weight:600}
select{font:inherit;padding:6px 10px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;margin:0;padding:0;list-style:none}
.card{height:100%;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);transition:border-color .2s ease}
.card:hover{border-color:var(--accent)}
.photo{position:relative;margin:0;aspect-ratio:3/2;overflow:hidden;border-bottom:1px solid var(--border)}
.photo img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.card:hover .photo img,.card:focus-within .photo img{transform:scale(1.06)}
.fav{position:absolute;top:10px;right:10px;display:grid;place-items:center;width:36px;height:36px;padding:0;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:50%;cursor:pointer}
.fav svg{width:18px;height:18px}
.fav[aria-pressed=true]{color:var(--err)}
.fav[aria-pressed=true] path{fill:currentColor}
.body{padding:14px 16px 16px}
h2{margin:0;font-size:1.05rem;font-weight:600}
.place{margin:2px 0 12px;color:var(--muted);font-size:13px}
.meta{display:flex;align-items:center;justify-content:space-between;gap:8px}
.price{margin:0;font-weight:700;font-variant-numeric:tabular-nums}
.rating{margin:0;color:var(--muted);font-size:13px;font-variant-numeric:tabular-nums}
.rating span{color:var(--warn)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}.card:hover .photo img,.card:focus-within .photo img{transform:none}}
/* Tokens: ver pestaña HTML + CSS */
</style>
