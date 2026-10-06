<script setup lang="ts">
import { computed, ref } from 'vue';

const filters = ['Vegano', 'Sin gluten', 'Rápido', 'Postre', 'Picante'];
const items = [
  { name: 'Ceviche de champiñones', tags: ['Vegano', 'Sin gluten', 'Rápido'] },
  { name: 'Brownie de frijol negro', tags: ['Vegano', 'Postre', 'Sin gluten'] },
  { name: 'Tacos al pastor', tags: ['Picante', 'Rápido'] },
  { name: 'Tiramisú', tags: ['Postre'] },
];
const on = ref<string[]>([]);
const shown = computed(() => items.filter((i) => on.value.every((t) => i.tags.includes(t))));
</script>

<template>
  <fieldset>
    <legend>Recetas</legend>
    <div class="chips">
      <label v-for="f in filters" :key="f" class="chip">
        <input v-model="on" type="checkbox" :value="f" />
        <span>{{ f }}</span>
      </label>
    </div>
  </fieldset>

  <div class="bar">
    <span aria-live="polite">{{ shown.length }} de {{ items.length }} recetas</span>
    <button type="button" @click="on = []">Limpiar filtros</button>
  </div>

  <ul v-if="shown.length">
    <li v-for="i in shown" :key="i.name">{{ i.name }}</li>
  </ul>
  <p v-else class="empty">Ninguna receta cumple todos los filtros. Quita alguno.</p>
</template>

<style scoped>
fieldset { margin: 0; padding: 0; border: 0; }
legend { padding: 0; margin-bottom: 10px; font-size: 18px; font-weight: 600; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { position: relative; }
.chip input { position: absolute; opacity: 0; pointer-events: none; }
.chip span { display: inline-block; padding: 4px 12px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface);
  font-weight: 500; cursor: pointer; user-select: none; transition: background-color .14s, border-color .14s; }
.chip span:hover { background: var(--accent-soft); }
.chip input:checked + span { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
.chip input:checked + span::before { content: "✓ "; }
.chip input:focus-visible + span { outline: 2px solid var(--accent); outline-offset: 2px; }
.bar { display: flex; justify-content: space-between; margin: 12px 0 8px; font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; }
.bar button { font: inherit; color: var(--accent); background: none; border: 0; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; border-radius: 4px; }
.bar button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px 12px; }
li { padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); font-weight: 500; }
.empty { margin: 0; color: var(--muted); }
@media (prefers-reduced-motion: reduce) { .chip span { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
