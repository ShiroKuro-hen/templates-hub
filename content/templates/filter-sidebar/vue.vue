<script setup lang="ts">
import { computed, reactive } from 'vue';

type P = [cat: string, brand: string, price: number, rating: number];
const DATA: P[] = [
  ['Zapatillas', 'Aero', 89, 4.6], ['Zapatillas', 'Vento', 129, 4.2], ['Zapatillas', 'Pulse', 74, 3.8], ['Zapatillas', 'Nordik', 159, 4.8],
  ['Ropa', 'Aero', 45, 4.1], ['Ropa', 'Lumen', 62, 3.4], ['Ropa', 'Nordik', 98, 4.5], ['Ropa', 'Pulse', 29, 3.1], ['Ropa', 'Vento', 84, 4.0],
  ['Mochilas', 'Lumen', 39, 4.4], ['Mochilas', 'Nordik', 119, 4.7], ['Mochilas', 'Aero', 55, 3.6],
  ['Accesorios', 'Pulse', 12, 3.9], ['Accesorios', 'Lumen', 24, 4.3], ['Accesorios', 'Vento', 18, 2.9], ['Accesorios', 'Aero', 33, 4.5],
];
const CATS = ['Zapatillas', 'Ropa', 'Mochilas', 'Accesorios'];
const BRANDS = ['Aero', 'Lumen', 'Nordik', 'Pulse', 'Vento'];
const RATES: [number, string, string][] = [[0, 'Todas', ''], [4, '4 estrellas o más', '★★★★'], [3, '3 estrellas o más', '★★★']];
const blank = () => ({ cats: [] as string[], brands: [] as string[], min: '', max: '', rate: 0, q: '' });
const s = reactive(blank());

const bad = computed(() => (s.min === '' ? 0 : +s.min) > (s.max === '' ? Infinity : +s.max));
const n = computed(() => {
  if (bad.value) return 0;
  const min = s.min === '' ? 0 : +s.min, max = s.max === '' ? Infinity : +s.max;
  return DATA.filter(([c, b, p, r]) =>
    (!s.cats.length || s.cats.includes(c)) && (!s.brands.length || s.brands.includes(b)) && p >= min && p <= max && r >= s.rate).length;
});
const active = computed(() => +!!s.cats.length + +!!s.brands.length + +!!(s.min || s.max) + +!!s.rate);
const brands = computed(() => BRANDS.filter((b) => b.toLowerCase().includes(s.q.trim().toLowerCase())));
</script>

<template>
  <form class="side" aria-label="Filtros de la tienda" novalidate @submit.prevent>
    <div class="top">
      <h2>Filtros<span v-if="active" class="badge">{{ active }}</span></h2>
      <button class="link" type="button" @click="Object.assign(s, blank())">Limpiar todo</button>
    </div>
    <details open><summary>Categoría</summary><div class="body">
      <label v-for="c in CATS" :key="c" class="opt"><input v-model="s.cats" type="checkbox" :value="c"> {{ c }}</label>
    </div></details>
    <details open><summary>Precio</summary><div class="body">
      <div class="pair">
        <label>Mínimo (€)<input v-model="s.min" type="number" min="0" max="500" inputmode="numeric" :aria-invalid="bad" aria-describedby="perr"></label>
        <label>Máximo (€)<input v-model="s.max" type="number" min="0" max="500" inputmode="numeric" :aria-invalid="bad" aria-describedby="perr"></label>
      </div>
      <p id="perr" class="err" role="alert" :hidden="!bad">El mínimo supera al máximo. Cambia uno de los dos valores.</p>
    </div></details>
    <details open><summary>Marca</summary><div class="body">
      <input v-model="s.q" type="search" placeholder="Buscar marca" aria-label="Buscar marca">
      <label v-for="b in brands" :key="b" class="opt"><input v-model="s.brands" type="checkbox" :value="b"> {{ b }}</label>
    </div></details>
    <details open><summary>Valoración</summary><div class="body">
      <label v-for="[v, label, stars] in RATES" :key="v" class="opt">
        <input v-model="s.rate" type="radio" name="rate" :value="v">
        <span v-if="stars" class="stars" aria-hidden="true">{{ stars }}</span> {{ label }}
      </label>
    </div></details>
    <div class="foot">
      <button class="go" type="submit" :disabled="!n">{{ n ? `Ver ${n} resultado${n > 1 ? 's' : ''}` : 'Sin resultados' }}</button>
      <div class="meter" aria-hidden="true"><i :style="{ width: (n / DATA.length) * 100 + '%' }" /></div>
    </div>
  </form>
</template>

<style scoped>
.side{width:min(100%,280px);background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.top{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border)}
.top h2{margin:0;font-size:16px}
.badge{margin-left:6px;padding:1px 8px;font-size:12px;font-weight:600;color:var(--accent);background:var(--accent-soft);border-radius:999px}
button{font:inherit;cursor:pointer}
.link{padding:2px 4px;color:var(--accent);background:none;border:0;text-decoration:underline}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
details{border-bottom:1px solid var(--border)}
summary{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;font-weight:600;cursor:pointer;list-style:none;transition:background .14s}
summary::-webkit-details-marker{display:none}
summary::after{content:"";width:7px;height:7px;border:solid var(--muted);border-width:0 1.5px 1.5px 0;transform:rotate(45deg);transition:transform .14s}
details[open] summary::after{transform:rotate(-135deg)}
summary:hover{background:var(--accent-soft)}
.body{padding:0 16px 14px}
.opt{display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer}
.opt input{margin:0;accent-color:var(--accent)}
.stars{color:var(--warn);letter-spacing:1px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.pair label{color:var(--muted);font-size:13px}
input[type=number],input[type=search]{box-sizing:border-box;width:100%;margin-top:2px;padding:7px 9px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
input[type=search]{margin:0 0 6px}
input[aria-invalid=true]{border-color:var(--err)}
.err{margin:6px 0 0;font-size:13px;color:var(--err)}
.foot{padding:14px 16px}
.go{width:100%;padding:9px 14px;font-weight:600;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);transition:filter .14s}
.go:hover:not(:disabled){filter:brightness(1.08)}
.go:disabled{color:var(--muted);background:var(--accent-soft);border-color:var(--border);cursor:not-allowed}
.meter{height:4px;margin-top:10px;border-radius:999px;background:var(--accent-soft);overflow:hidden}
.meter i{display:block;height:100%;background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .16s}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
