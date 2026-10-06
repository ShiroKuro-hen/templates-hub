<script setup lang="ts">
import { ref } from 'vue';

const periodos = ['Día', 'Semana', 'Mes', 'Año'];
const periodo = ref('Semana');

const formatos = ['Negrita', 'Cursiva', 'Subrayado'];
const activos = ref<string[]>([]);
const toggle = (f: string) =>
  (activos.value = activos.value.includes(f) ? activos.value.filter((x) => x !== f) : [...activos.value, f]);
</script>

<template>
  <!-- Selección única -->
  <div class="seg" role="group" aria-label="Periodo del informe">
    <button v-for="p in periodos" :key="p" type="button" :aria-pressed="p === periodo" @click="periodo = p">
      {{ p }}
    </button>
  </div>
  <p class="out" aria-live="polite">Mostrando: {{ periodo }}</p>

  <!-- Selección múltiple -->
  <div class="seg" role="group" aria-label="Formato de texto">
    <button v-for="f in formatos" :key="f" type="button" :aria-pressed="activos.includes(f)" @click="toggle(f)">
      {{ f }}
    </button>
  </div>
</template>

<style scoped>
.seg { display: inline-flex; gap: 2px; padding: 3px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); }
.seg button { font: 500 14px system-ui, -apple-system, "Segoe UI", sans-serif; padding: 6px 16px; border: 0; border-radius: 6px; background: transparent; color: var(--muted); cursor: pointer; transition: background .14s, color .14s; }
.seg button:hover { background: var(--accent-soft); color: var(--text); }
.seg button[aria-pressed="true"] { background: var(--accent); color: var(--accent-ink); }
.seg button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.out { margin: 12px 0; color: var(--muted); font-size: 13px; }
@media (prefers-reduced-motion: reduce) { .seg button { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
