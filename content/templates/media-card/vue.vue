<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  titulo: string;
  fecha: string;
  lectura: string; // p. ej. "5 min de lectura"
  fondo?: string; // color del placeholder SVG; por defecto var(--accent-soft)
}>();
const emit = defineEmits<{ leer: [] }>();

const guardado = ref(false);
</script>

<template>
  <article class="media" :aria-label="titulo">
    <svg viewBox="0 0 160 90" aria-hidden="true" focusable="false">
      <rect class="sky" width="160" height="90" :style="fondo ? { fill: fondo } : undefined" />
      <circle class="sun" cx="118" cy="30" r="12" />
      <path class="far" d="M0 90V62l34-26 30 28 28-18 68 36z" />
      <path class="near" d="M0 90V74l30-14 34 16 40-12 56 26z" />
    </svg>
    <div class="body">
      <h2>{{ titulo }}</h2>
      <p class="meta"><span>{{ fecha }}</span><span>{{ lectura }}</span></p>
      <div class="acts">
        <button type="button" class="main" :aria-label="`Leer el artículo ${titulo}`" @click="emit('leer')">Leer artículo</button>
        <button type="button" :aria-pressed="guardado" @click="guardado = !guardado">{{ guardado ? 'Guardado' : 'Guardar' }}</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.media { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
.media svg { display: block; width: 100%; height: auto; aspect-ratio: 16/9; border-bottom: 1px solid var(--border); color: var(--muted); }
.sky { fill: var(--accent-soft); }
.sun { fill: var(--accent); }
.far { fill: currentColor; opacity: .35; }
.near { fill: currentColor; opacity: .7; }
.body { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px 16px; flex: 1; }
h2 { margin: 0; font-size: 1rem; font-weight: 600; letter-spacing: -.01em; }
.meta { display: flex; flex-wrap: wrap; gap: 2px 12px; margin: 0; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.acts { display: flex; gap: 8px; margin-top: auto; padding-top: 12px; }
button { font: 600 13px system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 7px 14px; cursor: pointer; transition: background 140ms, border-color 140ms, filter 140ms; }
button:hover { border-color: var(--accent); }
.main { color: var(--accent-ink); background: var(--accent); border-color: var(--accent); }
.main:hover { filter: brightness(1.08); }
button[aria-pressed="true"] { color: var(--accent); background: var(--accent-soft); border-color: var(--accent); }
button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { button { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
