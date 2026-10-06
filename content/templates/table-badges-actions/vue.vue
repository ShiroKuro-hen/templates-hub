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
.wrap { overflow-x: auto; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; font: 14px/1.4 system-ui, sans-serif; color: #17130f; }
.wrap:focus-visible, button:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
table { width: 100%; min-width: 520px; border-collapse: collapse; }
caption { position: absolute; left: -9999px; }
th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #17130f33; white-space: nowrap; }
thead th { background: #ffd84d; border-bottom: 2px solid #17130f; }
tbody tr:last-child > * { border-bottom: 0; }
.num { text-align: right; font-variant-numeric: tabular-nums; }
.badge { display: inline-block; padding: 2px 10px; border: 2px solid #17130f; border-radius: 99px; font: 600 .75rem ui-monospace, monospace; }
.ok { background: #c9efd8; } .warn { background: #ffe9a3; } .err { background: #f9c9cf; } .info { background: #cfd8ff; }
.acts { display: flex; gap: 6px; }
button { font: 600 .8rem system-ui, sans-serif; color: #17130f; background: #fffdf8; border: 2px solid #17130f; border-radius: 10px; padding: 4px 10px; box-shadow: 4px 4px 0 #17130f; cursor: pointer; }
button:hover:not(:disabled), button:active:not(:disabled) { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
button:disabled { opacity: .45; box-shadow: none; cursor: not-allowed; }
.del { background: #f9c9cf; }
p { color: #6b6258; font: .8rem system-ui, sans-serif; }
@media (prefers-reduced-motion: no-preference) { button { transition: transform .1s, box-shadow .1s; } }
</style>
