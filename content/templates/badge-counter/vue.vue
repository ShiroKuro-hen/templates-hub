<script setup lang="ts">
import { computed, ref } from 'vue';

const count = ref(3);
const text = computed(() => (count.value > 99 ? '99+' : String(count.value)));
const label = computed(() =>
  count.value ? `Notificaciones, ${count.value} sin leer` : 'Notificaciones, ninguna sin leer',
);
</script>

<template>
  <button type="button" class="btn icon" :aria-label="label">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21h4" />
    </svg>
    <span v-if="count > 0" class="count" aria-hidden="true">{{ text }}</span>
  </button>

  <button type="button" class="tool" @click="count++">Llegó una notificación</button>
  <button type="button" class="tool" @click="count = 0">Marcar leídas</button>
</template>

<style scoped>
.btn { position: relative; display: grid; place-items: center; width: 40px; height: 40px; padding: 0; border: 1px solid var(--border);
  border-radius: var(--radius); background: var(--surface); color: var(--text); cursor: pointer; transition: background-color .14s; }
.btn:hover { background: var(--accent-soft); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.count { position: absolute; top: -8px; right: -8px; min-width: 20px; height: 20px; padding: 0 5px; display: grid; place-items: center;
  border-radius: 999px; background: var(--err); color: var(--accent-ink); box-shadow: 0 0 0 2px var(--bg);
  font: 600 11px system-ui, -apple-system, "Segoe UI", sans-serif; font-variant-numeric: tabular-nums; }
.tool { margin-left: 12px; padding: 5px 10px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text);
  font: 500 12px system-ui, -apple-system, "Segoe UI", sans-serif; cursor: pointer; }
.tool:hover { background: var(--accent-soft); }
.tool:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
