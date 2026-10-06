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
.box { position: relative; margin-right: 4px; }
.box > svg { position: absolute; left: 12px; top: 50%; width: 20px; height: 20px; transform: translateY(-50%); fill: none; stroke: #17130f; stroke-width: 2; stroke-linecap: round; pointer-events: none; }
input { width: 100%; height: 44px; padding: 0 44px 0 40px; font: inherit; color: #17130f; background: #fffdf8; border: 2px solid #17130f; border-radius: 10px; box-shadow: 4px 4px 0 #17130f; appearance: none; }
input::-webkit-search-cancel-button { display: none; }
input:focus-visible, .clear:focus-visible, ul:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
.clear { position: absolute; right: 6px; top: 50%; display: grid; place-items: center; width: 30px; height: 30px; padding: 0; transform: translateY(-50%); background: #ffd84d; border: 2px solid #17130f; border-radius: 8px; cursor: pointer; }
.clear svg { width: 14px; height: 14px; fill: none; stroke: #17130f; stroke-width: 3; stroke-linecap: round; }
#n { margin: 8px 0; font: 12px ui-monospace, monospace; color: #6b6258; }
ul { margin: 0; padding: 0; max-height: 220px; overflow: auto; list-style: none; border-top: 2px solid #17130f; }
li { display: flex; justify-content: space-between; gap: 8px; padding: 7px 2px; border-bottom: 1px solid #d9d0bd; }
li span { color: #6b6258; font-size: 13px; }
:deep(mark) { color: inherit; background: #ffd84d; border-radius: 3px; }
.empty { padding: 12px 2px; color: #6b6258; }
</style>
