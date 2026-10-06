<script setup lang="ts">
import { ref } from 'vue';

const tags = ref(['diseño', 'accesibilidad', 'css', 'tutorial']);
const draft = ref('');
const msg = ref('');
const input = ref<HTMLInputElement>();

function remove(tag: string, e: Event) {
  const li = (e.currentTarget as HTMLElement).closest('li')!;
  const next = (li.nextElementSibling ?? li.previousElementSibling)?.querySelector('button');
  tags.value = tags.value.filter((x) => x !== tag);
  (next ?? input.value)?.focus(); // el vecino sigue montado, se puede enfocar ya
  msg.value = `Etiqueta ${tag} eliminada`;
}
function add() {
  const v = draft.value.trim();
  if (!v) return;
  const dup = tags.value.some((t) => t.toLowerCase() === v.toLowerCase());
  if (!dup) tags.value.push(v);
  msg.value = dup ? `La etiqueta ${v} ya existe` : `Etiqueta ${v} añadida`;
  draft.value = '';
}
</script>

<template>
  <div class="box">
    <ul aria-label="Etiquetas actuales">
      <li v-for="t in tags" :key="t">
        <span>{{ t }}</span>
        <button type="button" :aria-label="`Quitar etiqueta ${t}`" @click="remove(t, $event)"
                @keydown.delete.prevent="remove(t, $event)">×</button>
      </li>
    </ul>
    <p v-if="!tags.length" class="empty">Sin etiquetas. Escribe una y pulsa Enter.</p>
    <input ref="input" v-model="draft" type="text" aria-label="Añadir etiqueta" placeholder="Añadir etiqueta y pulsar Enter" @keydown.enter.prevent="add" />
    <p class="sr" role="status">{{ msg }}</p>
  </div>
</template>

<style scoped>
.box { padding: 12px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); }
ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
li { display: inline-flex; align-items: center; gap: 2px; padding: 2px 2px 2px 12px; border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 999px; background: var(--accent-soft); color: var(--text); font-weight: 500; }
li button { display: grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 50%; background: none; font-size: 16px; line-height: 1; color: var(--muted); cursor: pointer; transition: background-color .14s, color .14s; }
li button:hover { background: var(--accent); color: var(--accent-ink); }
button:focus-visible, input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
input { width: 100%; margin-top: 12px; padding: 8px 10px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); font: inherit; color: var(--text); }
.empty { margin: 0; color: var(--muted); }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (prefers-reduced-motion: reduce) { li button { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
