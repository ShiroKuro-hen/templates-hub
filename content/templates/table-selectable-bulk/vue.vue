<script setup lang="ts">
import { computed, ref } from 'vue';

type Invoice = { id: string; cliente: string; importe: string };
const rows = ref<Invoice[]>([
  { id: 'F-1042', cliente: 'Nórdica Labs', importe: '1.240,00 €' },
  { id: 'F-1043', cliente: 'Atlas Energía', importe: '3.890,50 €' },
  { id: 'F-1044', cliente: 'Brío Studio', importe: '760,00 €' },
  { id: 'F-1045', cliente: 'Cobalto SA', importe: '12.300,00 €' },
]);
const sel = ref<string[]>([]);
const n = computed(() => sel.value.length);
const allEl = ref<HTMLInputElement | null>(null);

function toggleAll() {
  sel.value = n.value === rows.value.length ? [] : rows.value.map((r) => r.id);
}
function archive() {
  rows.value = rows.value.filter((r) => !sel.value.includes(r.id));
  sel.value = [];
  allEl.value?.focus();
}
</script>

<template>
  <div class="card">
    <div v-if="n" class="bulk">
      <span class="count" aria-live="polite">{{ n }}</span><span>seleccionados</span>
      <span class="sp" />
      <button type="button" class="btn">Exportar CSV</button>
      <button type="button" class="btn danger" @click="archive">Archivar</button>
    </div>
    <div class="scroll">
      <table>
        <caption hidden>Facturas pendientes. Marca filas para aplicar acciones en bloque.</caption>
        <thead>
          <tr>
            <th scope="col">
              <input ref="allEl" type="checkbox" aria-label="Seleccionar todas las filas"
                :checked="n > 0 && n === rows.length" :indeterminate="n > 0 && n < rows.length"
                :disabled="!rows.length" @change="toggleAll" />
            </th>
            <th scope="col">Factura</th><th scope="col">Cliente</th><th scope="col" class="num">Importe</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length"><td colspan="4" class="empty">No quedan facturas pendientes. Crea una nueva para empezar.</td></tr>
          <tr v-for="r in rows" :key="r.id">
            <td><input v-model="sel" type="checkbox" :value="r.id" :aria-label="`Seleccionar ${r.id}`" /></td>
            <td>{{ r.id }}</td><td>{{ r.cliente }}</td><td class="num">{{ r.importe }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.bulk{display:flex;flex-wrap:wrap;align-items:center;gap:8px;min-height:52px;padding:8px 16px;border-bottom:1px solid;border-image:linear-gradient(90deg,#22d3ee,#2f5bff) 1;background:var(--accent-soft)}
.count{padding:2px 10px;border-radius:999px;background:var(--accent);color:var(--accent-ink);font-weight:600;font-variant-numeric:tabular-nums}
.sp{flex:1}
.btn{font:inherit;padding:6px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s,border-color .14s}
.btn:hover{border-color:var(--accent)}
.btn.danger{color:var(--err)}
.btn.danger:hover{border-color:var(--err);background:var(--err-soft)}
.btn:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.scroll{overflow-x:auto}
table{width:100%;min-width:460px;border-collapse:collapse}
th,td{padding:10px 16px;text-align:left;border-bottom:1px solid var(--border)}
tbody tr:last-child td{border-bottom:0}
th{font-weight:600;color:var(--muted)}
th:first-child,td:first-child{width:20px;padding-right:0}
input[type=checkbox]{width:16px;height:16px;margin:0;accent-color:var(--accent);cursor:pointer}
tbody tr{transition:background .14s}
tbody tr:hover{background:var(--bg)}
tbody tr:has(:checked){background:var(--accent-soft)}
.num{text-align:right;font-variant-numeric:tabular-nums}
.empty{padding:32px 16px;text-align:center;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
