<script setup lang="ts">
import { ref } from 'vue';

type Ventaja = { texto: string; incluida?: boolean };
const props = withDefaults(defineProps<{
  nombre: string;
  precio: number;
  ventajas: Ventaja[];
  destacado?: boolean;
  cta?: string;
}>(), { destacado: false });
const emit = defineEmits<{ elegir: [nombre: string] }>();

const elegido = ref(false);
function toggle() {
  elegido.value = !elegido.value;
  emit('elegir', props.nombre);
}
</script>

<template>
  <article :class="['plan', { hot: destacado }]">
    <span v-if="destacado" class="badge">Recomendado</span>
    <h2>{{ nombre }}</h2>
    <p class="price">${{ precio }} <small>/mes</small></p>
    <ul>
      <li v-for="v in ventajas" :key="v.texto" :class="{ no: v.incluida === false }">{{ v.texto }}</li>
    </ul>
    <button type="button" :aria-pressed="elegido" @click="toggle">
      {{ elegido ? 'Plan elegido' : (cta ?? `Elegir ${nombre}`) }}
    </button>
    <p role="status" class="sr">{{ elegido ? `Elegiste el plan ${nombre}.` : '' }}</p>
  </article>
</template>

<style scoped>
.plan { position: relative; display: flex; flex-direction: column; gap: 12px; padding: 20px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
.plan.hot { border-color: var(--accent); }
.plan.hot::before { content: ""; position: absolute; inset: -1px -1px auto; height: 3px; border-radius: var(--radius) var(--radius) 0 0; background: linear-gradient(135deg, #22d3ee, #2f5bff); }
.badge { position: absolute; top: -11px; right: 16px; padding: 2px 10px; border: 1px solid var(--accent); border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: 12px; font-weight: 600; }
h2 { margin: 0; font-size: 1rem; font-weight: 600; }
.price { margin: 0; font-size: 2.25rem; font-weight: 700; letter-spacing: -.02em; line-height: 1; font-variant-numeric: tabular-nums; }
.price small { font-size: 13px; font-weight: 500; color: var(--muted); letter-spacing: 0; }
ul { margin: 0; padding: 12px 0 0; border-top: 1px solid var(--border); list-style: none; display: grid; gap: 6px; flex: 1; }
li::before { content: "✓"; display: inline-block; width: 16px; margin-right: 6px; font-weight: 700; color: var(--ok); }
li.no { color: var(--muted); text-decoration: line-through; } li.no::before { content: "✕"; color: var(--muted); }
button { font: 600 14px system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 9px 14px; cursor: pointer; transition: border-color 140ms, background 140ms, filter 140ms; }
button:hover { border-color: var(--accent); }
.hot button { color: var(--accent-ink); background: var(--accent); border-color: var(--accent); }
.hot button:hover { filter: brightness(1.08); }
button[aria-pressed="true"], .hot button[aria-pressed="true"] { color: var(--ok); background: var(--ok-soft); border-color: var(--ok); }
button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (prefers-reduced-motion: reduce) { button { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
