<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

type Item = { id: number; name: string; size: string };
type Pending = { item: Item; index: number };

const MS = 6000;
const items = ref<Item[]>([
  { id: 1, name: 'propuesta-v3.pdf', size: '2,4 MB' },
  { id: 2, name: 'logo-final.svg', size: '18 KB' },
  { id: 3, name: 'presupuesto-q4.xlsx', size: '96 KB' },
]);
const pending = ref<Pending | null>(null);
const left = ref(MS / 1000);
let tick = 0, end = 0;

function stop() { clearInterval(tick); clearTimeout(end); pending.value = null; }
function remove(item: Item) {
  if (pending.value) stop();
  pending.value = { item, index: items.value.indexOf(item) };
  items.value = items.value.filter((i) => i !== item);
  left.value = MS / 1000;
  tick = window.setInterval(() => left.value--, 1000);
  end = window.setTimeout(stop, MS);
}
function undo() {
  if (!pending.value) return;
  items.value.splice(pending.value.index, 0, pending.value.item);
  stop();
}
onBeforeUnmount(stop);
</script>

<template>
  <ul @keydown.esc="stop">
    <li v-for="i in items" :key="i.id">
      <span>{{ i.name }}</span><small>{{ i.size }}</small>
      <button type="button" class="del" @click="remove(i)">Eliminar</button>
    </li>
  </ul>
  <p v-if="!items.length && !pending" class="empty">No quedan archivos.</p>
  <!-- :key reinicia la barra de cuenta atrás en cada eliminación -->
  <div v-if="pending" :key="pending.item.id" class="snack" role="status" :style="{ '--ms': MS + 'ms' }" @keydown.esc="stop">
    <p>«{{ pending.item.name }}» eliminado</p>
    <button type="button" autofocus @click="undo">Deshacer ({{ left }})</button>
  </div>
</template>

<style scoped>
ul { margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:8px; font:14px/1.4 system-ui, sans-serif; color:#17130f; }
li { display:flex; align-items:center; gap:10px; padding:8px 10px; background:#fffdf8; border:2px solid #17130f; border-radius:10px; }
li span { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
li small { font:12px ui-monospace, monospace; color:#6b6258; }
.del { font:inherit; font-weight:600; padding:4px 10px; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:8px; cursor:pointer; }
.del:hover { background:#ffd84d; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
.empty { color:#6b6258; }
.snack { position:fixed; left:12px; right:12px; bottom:12px; max-width:420px; margin:0 auto; overflow:hidden; display:flex; align-items:center; gap:12px; padding:12px 12px 15px 14px; background:#17130f; color:#f6f1e7; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #ff5a36; animation:up .2s ease-out; }
.snack p { flex:1; margin:0; }
.snack button { font:inherit; font-weight:700; padding:5px 10px; color:#17130f; background:#ffd84d; border:2px solid #ffd84d; border-radius:8px; cursor:pointer; }
.snack button:hover { background:#fff; }
.snack button:focus-visible { outline-color:#f6f1e7; }
.snack::after { content:""; position:absolute; left:0; bottom:0; height:5px; width:100%; background:#ff5a36; transform-origin:left; animation:drain var(--ms) linear forwards; }
@keyframes up { from { transform:translateY(16px); opacity:0; } }
@keyframes drain { to { transform:scaleX(0); } }
@media (prefers-reduced-motion:reduce) { .snack { animation:none; } .snack::after { display:none; } }
</style>
