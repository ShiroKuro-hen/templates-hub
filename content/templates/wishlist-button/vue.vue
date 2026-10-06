<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{ product?: string; price?: string; initial?: number }>(),
  { product: 'Reloj Orbit S2', price: '149,00 €', initial: 248 });
const HEART = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
const on = ref(false);
const msg = ref('');
const pill = ref<HTMLButtonElement>();
const n = computed(() => props.initial + +on.value);
const label = computed(() => `Guardar ${props.product} en favoritos`);
let timer = 0;

function toggle(quiet = false) {
  on.value = !on.value;
  clearTimeout(timer);
  if (quiet) { msg.value = ''; return; }
  msg.value = on.value ? 'Añadido a tus favoritos.' : 'Quitado de tus favoritos.';
  timer = window.setTimeout(() => (msg.value = ''), 4000);
}
const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') msg.value = ''; };
onMounted(() => document.addEventListener('keydown', esc));
onBeforeUnmount(() => { document.removeEventListener('keydown', esc); clearTimeout(timer); });
</script>

<template>
  <article class="card">
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
    </svg>
    <div class="img" aria-hidden="true" />
    <button class="fab" type="button" :aria-pressed="on" :aria-label="label" @click="toggle()">
      <svg class="heart" viewBox="0 0 24 24" aria-hidden="true"><path :d="HEART" /></svg>
    </button>
    <div class="info">
      <h2>{{ product }}</h2>
      <p class="price">{{ price }}</p>
      <button ref="pill" class="pill" type="button" :aria-pressed="on" :aria-label="label" @click="toggle()">
        <svg class="heart" viewBox="0 0 24 24" aria-hidden="true"><path :d="HEART" /></svg>
        <span>{{ on ? 'Guardado' : 'Guardar' }}</span><b>{{ n }}</b>
      </button>
    </div>
    <div class="toast" role="status" :hidden="!msg">
      <span>{{ msg }}</span>
      <button type="button" @click="toggle(true); pill?.focus()">Deshacer</button>
    </div>
  </article>
</template>

<style scoped>
.card{position:relative;width:min(100%,280px);overflow:hidden;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.img{aspect-ratio:4/3;background:var(--accent-soft);border-bottom:1px solid var(--border)}
.info{padding:12px 16px 16px}
.info h2{margin:0;font-size:15px}
.price{margin:0 0 12px;color:var(--muted);font-variant-numeric:tabular-nums}
button{font:inherit;color:var(--text);cursor:pointer}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.heart{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round;transition:fill .14s}
[aria-pressed=true] .heart{fill:url(#hg);stroke:var(--accent);animation:pop .16s ease-out}
@keyframes pop{50%{transform:scale(1.25)}}
.fab{position:absolute;top:10px;right:10px;display:grid;place-items:center;width:36px;height:36px;padding:0;background:var(--surface);border:1px solid var(--border);border-radius:999px;box-shadow:var(--shadow);transition:background .14s}
.fab:hover{background:var(--accent-soft)}
.pill{display:inline-flex;align-items:center;gap:8px;padding:6px 12px 6px 10px;background:var(--surface);border:1px solid var(--border);border-radius:999px;transition:background .14s,border-color .14s}
.pill:hover{background:var(--accent-soft)}
.pill[aria-pressed=true]{border-color:var(--accent);background:var(--accent-soft)}
.pill b{min-width:3ch;font-weight:600;font-variant-numeric:tabular-nums}
.toast{position:absolute;left:12px;right:12px;bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);animation:in .16s ease-out}
.toast[hidden]{display:none}
.toast button{padding:0 4px;color:var(--accent);background:none;border:0;text-decoration:underline}
@keyframes in{from{transform:translateY(8px);opacity:0}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
