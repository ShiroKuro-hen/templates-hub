<script setup lang="ts">
import { ref } from 'vue';

type Estado = 'Pagado' | 'Pendiente' | 'Fallido' | 'Enviado';
type Pedido = { id: string; cliente: string; estado: Estado; total: number };

const clase: Record<Estado, string> = { Pagado: 'ok', Pendiente: 'warn', Fallido: 'err', Enviado: 'info' };
const rows = ref<Pedido[]>([
  { id: '#1042', cliente: 'Ana Pérez', estado: 'Pagado', total: 128 },
  { id: '#1043', cliente: 'Luis Gómez', estado: 'Pendiente', total: 54.9 },
  { id: '#1044', cliente: 'Marta Ruiz', estado: 'Fallido', total: 310 },
  { id: '#1045', cliente: 'Carlos Díaz', estado: 'Enviado', total: 76.25 },
]);
const msg = ref('');

function pay(p: Pedido) {
  p.estado = 'Pagado';
  msg.value = `Pedido ${p.id} marcado como pagado.`;
}
function remove(p: Pedido) {
  rows.value = rows.value.filter((r) => r.id !== p.id);
  msg.value = `Pedido ${p.id} quitado.`;
}
</script>

<template>
  <div class="wrap" role="region" aria-labelledby="cap" tabindex="0">
    <table>
      <caption id="cap">Pedidos con su estado y acciones</caption>
      <thead>
        <tr>
          <th scope="col">Pedido</th><th scope="col">Cliente</th><th scope="col">Estado</th>
          <th scope="col" class="num">Total</th><th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in rows" :key="p.id">
          <th scope="row">{{ p.id }}</th>
          <td>{{ p.cliente }}</td>
          <td><span :class="['badge', clase[p.estado]]">{{ p.estado }}</span></td>
          <td class="num">${{ p.total.toFixed(2) }}</td>
          <td>
            <div class="acts">
              <button :disabled="p.estado === 'Pagado'" :aria-label="`Marcar pagado el pedido ${p.id}`" @click="pay(p)">Marcar pagado</button>
              <button class="del" :aria-label="`Quitar el pedido ${p.id}`" @click="remove(p)">Quitar</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <p role="status">{{ msg }}</p>
</template>

<style scoped>
.wrap{overflow-x:auto;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text)}
.wrap:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
table{width:100%;min-width:520px;border-collapse:collapse}
caption{position:absolute;left:-9999px}
th,td{padding:10px 16px;text-align:left;border-bottom:1px solid var(--border);white-space:nowrap}
thead th{color:var(--muted);font-weight:600}
tbody th{font-weight:500}
tbody tr:last-child>*{border-bottom:0}
.num{text-align:right;font-variant-numeric:tabular-nums}
.badge{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600}
.badge::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.ok{background:var(--ok-soft);color:var(--ok)} .warn{background:var(--warn-soft);color:var(--warn)}
.err{background:var(--err-soft);color:var(--err)} .info{background:var(--info-soft);color:var(--info)}
.acts{display:flex;gap:8px}
button{font:500 13px system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:4px 12px;cursor:pointer;transition:background .14s,border-color .14s}
button:hover:not(:disabled){background:var(--accent-soft);border-color:var(--accent)}
button:disabled{opacity:.45;cursor:not-allowed}
.del{color:var(--err)}
.del:hover:not(:disabled){background:var(--err-soft);border-color:var(--err)}
p{margin:12px 0 0;color:var(--muted);font:13px system-ui,-apple-system,"Segoe UI",sans-serif;min-height:1.5em}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
