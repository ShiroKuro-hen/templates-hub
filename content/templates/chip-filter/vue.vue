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
legend { padding: 0; margin-bottom: 10px; font-size: 1.2rem; font-weight: 700; letter-spacing: -.02em; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { position: relative; }
.chip input { position: absolute; opacity: 0; pointer-events: none; }
.chip span { display: inline-block; padding: 4px 12px; border: 2px solid #17130f; border-radius: 999px; background: #fffdf8;
  font-weight: 600; cursor: pointer; user-select: none; }
.chip span:hover { background: #fff1bf; }
.chip input:checked + span { background: #ffd84d; box-shadow: 2px 2px 0 #17130f; }
.chip input:checked + span::before { content: "✓ "; }
.chip input:focus-visible + span { outline: 3px solid #ff5a36; outline-offset: 2px; }
.bar { display: flex; justify-content: space-between; margin: 12px 0 8px; font: 12px ui-monospace, monospace; color: #6b6258; }
.bar button { font: inherit; color: #17130f; background: none; border: 0; text-decoration: underline 2px #ff5a36; text-underline-offset: 3px; cursor: pointer; }
.bar button:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 6px 12px; }
li { padding: 6px 10px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; font-weight: 600; }
.empty { margin: 0; color: #6b6258; }
</style>
