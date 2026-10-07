<script setup lang="ts">
import { computed, ref } from 'vue';

type Key = 'ok' | 'warn' | 'err' | 'info' | 'idle';
const states: Record<Key, { name: string; color: string; live: boolean }> = {
  ok: { name: 'Operativo', color: 'var(--ok)', live: true },
  warn: { name: 'Degradado', color: 'var(--warn)', live: true },
  err: { name: 'Incidente', color: 'var(--err)', live: true },
  info: { name: 'Mantenimiento', color: 'var(--info)', live: false },
  idle: { name: 'Pausado', color: 'var(--muted)', live: false },
};
const keys = Object.keys(states) as Key[];
const services: [string, Key, string][] = [
  ['API pública', 'ok', 'hace 1 min'], ['Panel web', 'ok', 'hace 3 min'], ['Pagos', 'warn', 'hace 12 min'],
  ['Correo transaccional', 'err', 'hace 4 min'], ['Base de datos', 'info', 'hace 25 min'],
  ['Webhooks', 'ok', 'hace 2 min'], ['Exportaciones', 'idle', 'hace 3 h'],
];
const filter = ref<Key | null>(null);
const rows = computed(() => services.filter(([, k]) => !filter.value || k === filter.value));
const live = computed(() => filter.value
  ? `Mostrando ${rows.value.length} con estado ${states[filter.value].name.toLowerCase()}.`
  : `Mostrando los ${rows.value.length} servicios.`);
const toggle = (k: Key) => (filter.value = filter.value === k ? null : k);
const count = (k: Key) => services.filter(([, s]) => s === k).length;
</script>

<template>
  <section class="card" aria-labelledby="t">
    <h2 id="t">Estado de los servicios</h2>
    <p class="sub">Filtra por estado. Cada punto va acompañado de su nombre.</p>
    <ul class="legend">
      <li v-for="k in keys" :key="k">
        <button type="button" :aria-pressed="filter === k" @click="toggle(k)">
          <span :class="['dot', k, { live: states[k].live }]" :style="{ '--c': states[k].color }" aria-hidden="true" />{{ states[k].name }} <b>{{ count(k) }}</b>
        </button>
      </li>
    </ul>
    <p class="sub" role="status" style="margin: 8px 0 0">{{ live }}</p>
    <ul class="list">
      <li v-for="[name, k, t] in rows" :key="name">
        <span :class="['dot', k, { live: states[k].live }]" :style="{ '--c': states[k].color }" aria-hidden="true" />
        <span>{{ name }}</span>
        <span class="meta"><span class="st">{{ states[k].name }}</span><time>{{ t }}</time></span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.card{padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:18px}
.sub{margin:2px 0 16px;color:var(--muted)}
.legend{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 8px;padding:0;list-style:none}
.legend button{display:flex;align-items:center;gap:8px;padding:4px 12px 4px 10px;border:1px solid var(--border);border-radius:999px;background:var(--surface);color:var(--text);font:inherit;cursor:pointer;transition:background .14s,border-color .14s}
.legend button:hover{border-color:var(--accent)}
.legend button[aria-pressed=true]{background:var(--accent-soft);border-color:var(--accent)}
.legend button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.legend b{color:var(--muted);font-weight:600;font-variant-numeric:tabular-nums}
.dot{position:relative;flex:none;width:8px;height:8px;border-radius:50%;background:var(--c)}
.dot.live::after{content:"";position:absolute;inset:0;border-radius:50%;background:var(--c);animation:pulse 1.8s ease-out infinite}
.dot.err.live::after{animation-duration:1.1s}
@keyframes pulse{from{transform:scale(1);opacity:.55}to{transform:scale(2.8);opacity:0}}
.list{list-style:none;margin:0;padding:0}
.list li{display:grid;grid-template-columns:8px 1fr auto;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--border)}
.st,time{color:var(--muted)}
time{font-variant-numeric:tabular-nums;min-width:7ch;text-align:right}
.meta{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:0 12px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
