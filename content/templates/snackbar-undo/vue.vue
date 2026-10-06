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
  <p v-if="!items.length && !pending" class="empty">No quedan archivos. Sube uno nuevo para empezar.</p>
  <!-- :key reinicia la barra de cuenta atrás en cada eliminación -->
  <div v-if="pending" :key="pending.item.id" class="snack" role="status" :style="{ '--ms': MS + 'ms' }" @keydown.esc="stop">
    <p>«{{ pending.item.name }}» eliminado</p>
    <button type="button" autofocus @click="undo">Deshacer ({{ left }})</button>
  </div>
</template>

<style scoped>
ul { margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:8px; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
li { display:flex; align-items:center; gap:12px; padding:8px 12px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
li span { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
li small { font-size:12px; color:var(--muted); font-variant-numeric:tabular-nums; }
.del { font:inherit; font-weight:600; padding:4px 12px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; transition:border-color .14s, color .14s; }
.del:hover { color:var(--err); border-color:var(--err); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.empty { color:var(--muted); }
.snack { position:fixed; left:12px; right:12px; bottom:12px; max-width:420px; margin:0 auto; overflow:hidden; display:flex; align-items:center; gap:12px; padding:12px 12px 15px 16px; background:var(--text); color:var(--bg); border-radius:var(--radius); box-shadow:var(--shadow); animation:up .16s ease-out; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
.snack p { flex:1; margin:0; }
.snack button { font:inherit; font-weight:600; padding:5px 12px; color:var(--bg); background:transparent; border:1px solid var(--bg); border-radius:var(--radius); cursor:pointer; transition:background .14s, color .14s; font-variant-numeric:tabular-nums; }
.snack button:hover { background:var(--bg); color:var(--text); }
.snack button:focus-visible { outline-color:var(--accent); }
.snack::after { content:""; position:absolute; left:0; bottom:0; height:3px; width:100%; background:linear-gradient(135deg,#22d3ee,#2f5bff); transform-origin:left; animation:drain var(--ms) linear forwards; }
@keyframes up { from { transform:translateY(16px); opacity:0; } }
@keyframes drain { to { transform:scaleX(0); } }
@media (prefers-reduced-motion:reduce) { .snack { animation:none; } .snack::after { display:none; } * { transition:none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
