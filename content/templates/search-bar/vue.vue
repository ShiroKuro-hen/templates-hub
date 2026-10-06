<script setup lang="ts">
import { computed, ref, h, type FunctionalComponent } from 'vue';

type Item = { name: string; detail: string };

const props = withDefaults(defineProps<{ items: Item[]; placeholder?: string }>(), { placeholder: 'Busca un país o una capital' });

const value = ref('');
const input = ref<HTMLInputElement>();
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const term = computed(() => norm(value.value.trim()));
const rows = computed(() => props.items.filter((it) => norm(`${it.name} ${it.detail}`).includes(term.value)));

// Resalta la coincidencia con <mark> sin usar v-html.
const Hl: FunctionalComponent<{ text: string }> = ({ text }) => {
  const i = term.value ? norm(text).indexOf(term.value) : -1;
  if (i < 0) return text;
  const end = i + term.value.length;
  return [text.slice(0, i), h('mark', text.slice(i, end)), text.slice(end)];
};

function clear() { value.value = ''; input.value?.focus(); }
</script>

<template>
  <form class="box" role="search" @submit.prevent>
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
    <input ref="input" v-model="value" type="search" :placeholder="placeholder" aria-label="Buscar" autocomplete="off" @keydown.esc="clear" />
    <button v-if="value" type="button" class="clear" aria-label="Limpiar búsqueda" @click="clear">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
    </button>
  </form>
  <p id="n" role="status">{{ rows.length === 1 ? '1 resultado' : `${rows.length} resultados` }}</p>
  <ul tabindex="0" aria-label="Resultados">
    <li v-for="it in rows" :key="it.name"><Hl :text="it.name" /><span><Hl :text="it.detail" /></span></li>
    <li v-if="!rows.length" class="empty">Sin resultados para «{{ value.trim() }}». Prueba con otra palabra.</li>
  </ul>
</template>

<style scoped>
.box { position: relative; }
.box::after { content: ""; position: absolute; left: 10px; right: 10px; bottom: 0; height: 2px; border-radius: 2px; background: linear-gradient(135deg, #22d3ee, #2f5bff); opacity: 0; transition: opacity .14s; pointer-events: none; }
.box:focus-within::after { opacity: 1; }
.box > svg { position: absolute; left: 12px; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); fill: none; stroke: var(--muted); stroke-width: 2; stroke-linecap: round; pointer-events: none; }
input { width: 100%; height: 42px; padding: 0 44px 0 40px; font: inherit; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); appearance: none; }
input::-webkit-search-cancel-button { display: none; }
input::placeholder { color: var(--muted); }
input:focus-visible, .clear:focus-visible, ul:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.clear { position: absolute; right: 6px; top: 50%; display: grid; place-items: center; width: 28px; height: 28px; padding: 0; transform: translateY(-50%); color: var(--muted); background: var(--accent-soft); border: 0; border-radius: var(--radius); cursor: pointer; }
.clear svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; }
#n { margin: 8px 0; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
ul { margin: 0; padding: 0; max-height: 220px; overflow: auto; list-style: none; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
li { display: flex; justify-content: space-between; gap: 8px; padding: 9px 14px; border-bottom: 1px solid var(--border); }
li:last-child { border-bottom: 0; }
li span { color: var(--muted); font-size: 13px; }
:deep(mark) { color: var(--accent); background: var(--accent-soft); font-weight: 600; border-radius: 3px; }
.empty { display: block; padding: 16px 14px; color: var(--muted); }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
