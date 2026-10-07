<script setup lang="ts">
type Estado = 'Pagada' | 'Pendiente' | 'Vencida';
const rows: { id: string; cliente: string; fecha: string; estado: Estado; importe: number }[] = [
  { id: 'F-2041', cliente: 'Textiles Andina', fecha: '3 oct 2026', estado: 'Pagada', importe: 2480 },
  { id: 'F-2040', cliente: 'Café del Valle', fecha: '1 oct 2026', estado: 'Pendiente', importe: 960.5 },
  { id: 'F-2039', cliente: 'Logística Pacífico', fecha: '28 sep 2026', estado: 'Pagada', importe: 5310 },
  { id: 'F-2038', cliente: 'Estudio Mirador', fecha: '25 sep 2026', estado: 'Vencida', importe: 740 },
];
const tono = { Pagada: 'ok', Pendiente: 'warn', Vencida: 'err' };
const money = (n: number) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
</script>

<template>
  <section class="card" aria-labelledby="t">
    <h2 id="t">Facturas de octubre</h2>
    <table role="table" aria-labelledby="t">
      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader" scope="col">Factura</th><th role="columnheader" scope="col">Cliente</th>
          <th role="columnheader" scope="col">Fecha</th><th role="columnheader" scope="col">Estado</th>
          <th role="columnheader" scope="col" class="num">Importe</th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        <tr v-for="r in rows" :key="r.id" role="row">
          <th role="rowheader" scope="row">{{ r.id }}</th>
          <td role="cell" data-label="Cliente">{{ r.cliente }}</td>
          <td role="cell" data-label="Fecha">{{ r.fecha }}</td>
          <td role="cell" data-label="Estado"><span class="b" :class="tono[r.estado]">{{ r.estado }}</span></td>
          <td role="cell" data-label="Importe" class="num">{{ money(r.importe) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.card{position:relative;max-width:820px;margin:0 auto;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card::before{content:"";position:absolute;inset:0 0 auto;height:1px;background:linear-gradient(90deg,transparent,#22d3ee,#2f5bff,transparent)}
h2{margin:0;padding:16px 20px;font-size:16px;border-bottom:1px solid var(--border)}
table{width:100%;border-collapse:collapse}
th,td{padding:12px 20px;text-align:left;border-bottom:1px solid var(--border)}
thead th{color:var(--muted);font-weight:600}
tbody tr:last-child>*{border-bottom:0}
tbody tr:hover{background:var(--accent-soft)}
tbody th{font-weight:600}
.num{text-align:right;font-variant-numeric:tabular-nums}
.b{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;color:var(--text)}
.b::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.b.ok{background:var(--ok-soft)} .b.ok::before{color:var(--ok)}
.b.warn{background:var(--warn-soft)} .b.warn::before{color:var(--warn)}
.b.err{background:var(--err-soft)} .b.err::before{color:var(--err)}
@media (max-width:639px){
  table,tbody,tr{display:block}
  thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  tbody{display:grid;gap:12px;padding:12px}
  tr{padding:0 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
  tbody tr:hover{background:var(--surface)}
  tbody tr:last-child>*{border-bottom:1px solid var(--border)}
  tbody tr>:last-child{border-bottom:0!important}
  th,td{padding:10px 0}
  td{display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:right}
  td::before{content:attr(data-label);color:var(--muted);text-align:left}
  tbody th{display:block;font-size:15px}
}
/* Tokens: ver pestaña HTML + CSS */
</style>
