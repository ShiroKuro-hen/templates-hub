<script setup lang="ts">
import { computed, ref } from 'vue';

type Review = { id: number; r: number; d: string; a: string; t: string; x: string; v: boolean; h: number };
const reviews: Review[] = [
  { id: 0, r: 5, d: '2026-09-28', a: 'Laura M.', t: 'Justo lo que buscaba', x: 'Llegó en dos días y la batería dura toda la semana. La app es clara y el ajuste de la correa es muy cómodo.', v: true, h: 14 },
  { id: 1, r: 4, d: '2026-09-15', a: 'Carlos R.', t: 'Muy buena relación calidad-precio', x: 'Pantalla nítida y buen GPS. Echo en falta más esferas gratuitas.', v: true, h: 9 },
  { id: 2, r: 3, d: '2026-08-21', a: 'Javier P.', t: 'Cumple, sin más', x: 'Funciona bien, pero las notificaciones tardan unos segundos en aparecer.', v: false, h: 3 },
  { id: 3, r: 2, d: '2026-08-10', a: 'Elena T.', t: 'La correa se despegó', x: 'A los dos meses la correa empezó a soltarse. El soporte la cambió, pero tardó diez días.', v: true, h: 11 },
  { id: 4, r: 5, d: '2026-06-25', a: 'Íñigo L.', t: 'Batería excelente', x: 'Con uso normal llego a nueve días sin cargar.', v: true, h: 4 },
  { id: 5, r: 1, d: '2026-06-03', a: 'Rosa D.', t: 'No encendía', x: 'Llegó sin carga y no respondía al cargador. Pedí la devolución.', v: true, h: 1 },
];
const filter = ref(0);
const sort = ref<'new' | 'high' | 'low' | 'help'>('new');
const liked = ref(new Set<number>());
const votes = (x: Review) => x.h + +liked.value.has(x.id);
const avg = reviews.reduce((s, x) => s + x.r, 0) / reviews.length;
const count = (n: number) => reviews.filter((x) => x.r === n).length;
const fmt = (d: string) => new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
const rows = computed(() => {
  const cmp = { new: (a: Review, b: Review) => b.d.localeCompare(a.d), high: (a: Review, b: Review) => b.r - a.r,
                low: (a: Review, b: Review) => a.r - b.r, help: (a: Review, b: Review) => votes(b) - votes(a) };
  return reviews.filter((x) => !filter.value || x.r === filter.value).sort(cmp[sort.value]);
});
function toggle(id: number) { liked.value.has(id) ? liked.value.delete(id) : liked.value.add(id); }
</script>

<template>
  <section class="reviews" aria-label="Reseñas de clientes">
    <div class="card summary">
      <div class="score" role="img" :aria-label="`Valoración media ${avg.toFixed(1)} de 5, ${reviews.length} reseñas`">
        <b>{{ avg.toFixed(1).replace('.', ',') }}</b>
        <span class="stars">{{ '★'.repeat(Math.round(avg)) }}<span class="off">{{ '★'.repeat(5 - Math.round(avg)) }}</span></span><br>
        <span>{{ reviews.length }} reseñas</span>
      </div>
      <div class="dist" role="group" aria-label="Filtrar por valoración">
        <button v-for="n in [5, 4, 3, 2, 1]" :key="n" type="button" :disabled="!count(n)" :aria-pressed="filter === n"
                :aria-label="`${n} estrellas, ${count(n)} reseñas`" @click="filter = filter === n ? 0 : n">
          <span aria-hidden="true">{{ n }} ★</span>
          <span class="track" aria-hidden="true"><i :style="{ '--p': (count(n) / reviews.length) * 100 }" /></span>
          <span class="num" aria-hidden="true">{{ count(n) }}</span>
        </button>
      </div>
    </div>
    <div class="bar">
      <span role="status">Mostrando {{ rows.length }} de {{ reviews.length }}<button v-if="filter" class="link" type="button" @click="filter = 0">Quitar filtro</button></span>
      <label>Ordenar por
        <select v-model="sort">
          <option value="new">Más recientes</option><option value="high">Mejor valoradas</option>
          <option value="low">Menos valoradas</option><option value="help">Más útiles</option>
        </select>
      </label>
    </div>
    <ol>
      <li v-for="x in rows" :key="x.id">
        <article class="card">
          <header>
            <span class="stars" role="img" :aria-label="`${x.r} de 5 estrellas`">{{ '★'.repeat(x.r) }}<span class="off">{{ '★'.repeat(5 - x.r) }}</span></span>
            <time class="who" :datetime="x.d">{{ fmt(x.d) }}</time>
          </header>
          <h3>{{ x.t }}</h3><p>{{ x.x }}</p>
          <div class="who">{{ x.a }}<span v-if="x.v" class="ok">Compra verificada</span></div>
          <button class="help" type="button" :aria-pressed="liked.has(x.id)" @click="toggle(x.id)">Me resulta útil <span class="num">{{ votes(x) }}</span></button>
        </article>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.reviews{max-width:680px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.summary{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center;padding:20px}
@media (max-width:480px){.summary{grid-template-columns:1fr;gap:16px}}
.score{text-align:center}
.score b{display:block;font-size:44px;line-height:1;font-weight:600;font-variant-numeric:tabular-nums}
.score>span:not(.stars){color:var(--muted)}
.stars{color:var(--warn);letter-spacing:1px;white-space:nowrap}
.stars .off{color:var(--border)}
.dist{display:grid;gap:2px}
.dist button{display:grid;grid-template-columns:44px 1fr 28px;gap:10px;align-items:center;padding:3px 6px;font:inherit;color:var(--text);text-align:left;background:none;border:1px solid transparent;border-radius:var(--radius);cursor:pointer;transition:background .14s}
.dist button:hover:not(:disabled){background:var(--accent-soft)}
.dist button[aria-pressed=true]{border-color:var(--accent);background:var(--accent-soft)}
.dist button:disabled{color:var(--muted);cursor:default}
.track{height:6px;border-radius:999px;background:var(--accent-soft);overflow:hidden}
.dist button[aria-pressed=true] .track{background:var(--surface)}
.track i{display:block;height:100%;width:calc(var(--p) * 1%);background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.num{font-variant-numeric:tabular-nums;text-align:right;color:var(--muted)}
.bar{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;justify-content:space-between;margin:16px 0 8px}
.bar select{margin-left:6px;padding:6px 8px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.link{padding:0 4px;font:inherit;color:var(--accent);background:none;border:0;text-decoration:underline;cursor:pointer}
ol{list-style:none;margin:0;padding:0;display:grid;gap:12px}
article{padding:16px 20px}
article header{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 12px}
article h3{margin:6px 0 4px;font-size:15px}
article p{margin:0;max-width:62ch}
.who{color:var(--muted)}
.ok{margin-left:8px;padding:1px 8px;font-size:12px;color:var(--ok);background:var(--ok-soft);border-radius:999px}
.help{display:inline-flex;gap:6px;margin-top:10px;padding:4px 10px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s}
.help:hover{background:var(--accent-soft)}
.help[aria-pressed=true]{color:var(--accent);border-color:var(--accent);background:var(--accent-soft)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
