<script setup lang="ts">
import { ref } from 'vue';

const orders = [
  { id: '#4821', cliente: 'Textiles Andina', estado: 'Pagado', tono: 'ok', total: 'S/ 2,480.00' },
  { id: '#4820', cliente: 'Café del Valle', estado: 'Pendiente', tono: 'warn', total: 'S/ 960.50' },
  { id: '#4819', cliente: 'Logística Pacífico', estado: 'Pagado', tono: 'ok', total: 'S/ 5,310.00' },
  { id: '#4818', cliente: 'Estudio Mirador', estado: 'Fallido', tono: 'err', total: 'S/ 740.00' },
  { id: '#4817', cliente: 'Agro Sierra', estado: 'Pagado', tono: 'ok', total: 'S/ 1,125.80' },
];
const widths = [38, 70, 52, 64, 46];
const loading = ref(true);

function load() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 1800);
}
load();
</script>

<template>
  <section class="card" aria-labelledby="t" :aria-busy="loading">
    <header>
      <h2 id="t">Pedidos recientes</h2>
      <button class="btn" type="button" :aria-disabled="loading" @click="!loading && load()">Recargar</button>
    </header>
    <div class="scroll">
      <table>
        <caption class="sr">Últimos pedidos de clientes con estado y total.</caption>
        <thead>
          <tr><th scope="col">Pedido</th><th scope="col">Cliente</th><th scope="col">Estado</th><th scope="col" class="num">Total</th></tr>
        </thead>
        <tbody v-if="loading">
          <tr v-for="w in widths" :key="w" aria-hidden="true">
            <td><span class="sk" :style="{ width: w + '%' }" /></td>
            <td><span class="sk" style="width: 70%" /></td>
            <td><span class="sk" style="width: 72px" /></td>
            <td><span class="sk" style="width: 60%; margin-left: auto" /></td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="o in orders" :key="o.id">
            <td>{{ o.id }}</td><td>{{ o.cliente }}</td>
            <td><span class="b" :class="o.tono">{{ o.estado }}</span></td>
            <td class="num">{{ o.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="sr" role="status">{{ loading ? 'Cargando pedidos…' : 'Pedidos cargados.' }}</p>
  </section>
</template>

<style scoped>
.card{max-width:760px;margin:0 auto;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border)}
h2{margin:0;font-size:16px}
.btn{font:inherit;padding:8px 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn[aria-disabled=true]{cursor:progress;opacity:.6}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.scroll{overflow-x:auto}
table{width:100%;min-width:520px;border-collapse:collapse}
th,td{padding:12px 20px;text-align:left;border-bottom:1px solid var(--border)}
tbody tr:last-child td{border-bottom:0}
th{font-weight:600;color:var(--muted)}
.num{text-align:right;font-variant-numeric:tabular-nums}
.b{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;color:var(--text)}
.b::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.b.ok{background:var(--ok-soft)} .b.ok::before{color:var(--ok)}
.b.warn{background:var(--warn-soft)} .b.warn::before{color:var(--warn)}
.b.err{background:var(--err-soft)} .b.err::before{color:var(--err)}
.sk{display:block;height:12px;border-radius:999px;background:linear-gradient(90deg,var(--accent-soft),var(--info-soft),var(--accent-soft));background-size:200% 100%;animation:sh 1.4s linear infinite}
@keyframes sh{from{background-position:200% 0}to{background-position:-200% 0}}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}.sk{animation:none}}
/* Tokens: ver pestaña HTML + CSS */
</style>
