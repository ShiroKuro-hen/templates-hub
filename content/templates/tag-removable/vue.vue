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
.box { padding: 12px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; }
ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
li { display: inline-flex; align-items: center; gap: 2px; padding: 2px 2px 2px 12px; border: 2px solid #17130f; border-radius: 999px; background: #ffd84d; font-weight: 600; }
li button { display: grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 50%; background: none; font-size: 16px; line-height: 1; color: #17130f; cursor: pointer; }
li button:hover { background: #17130f; color: #ffd84d; }
button:focus-visible, input:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
input { width: 100%; margin-top: 12px; padding: 8px 10px; border: 2px solid #17130f; border-radius: 10px; background: #fff; font: inherit; color: #17130f; }
.empty { margin: 0; color: #6b6258; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
</style>
