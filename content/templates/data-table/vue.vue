<script setup lang="ts">
import { computed, ref } from 'vue';

type Row = { nombre: string; plan: string; ventas: number };
const rows: Row[] = [
  { nombre: 'Ana Pérez', plan: 'Pro', ventas: 1240 },
  { nombre: 'Luis Gómez', plan: 'Free', ventas: 310 },
  { nombre: 'Marta Ruiz', plan: 'Pro', ventas: 2890 },
];
const cols = [['nombre', 'Nombre'], ['plan', 'Plan'], ['ventas', 'Ventas']] as const;
const key = ref<keyof Row>('nombre');
const asc = ref(true);

const sorted = computed(() =>
  [...rows].sort((a, b) => (a[key.value] > b[key.value] ? 1 : -1) * (asc.value ? 1 : -1)),
);
function sort(k: keyof Row) {
  if (k === key.value) asc.value = !asc.value;
  else { key.value = k; asc.value = true; }
}
</script>

<template>
  <div class="wrap">
    <table>
      <caption hidden>Ventas por persona. Usa los encabezados para ordenar.</caption>
      <thead>
        <tr>
          <th v-for="[k, label] in cols" :key="k" scope="col" :class="{ num: k === 'ventas' }"
              :aria-sort="k === key ? (asc ? 'ascending' : 'descending') : 'none'">
            <button type="button" @click="sort(k)">{{ label }}</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in sorted" :key="r.nombre">
          <td>{{ r.nombre }}</td><td>{{ r.plan }}</td><td class="num">{{ r.ventas }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.wrap{max-height:360px;overflow:auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
table{width:100%;border-collapse:separate;border-spacing:0}
th,td{padding:10px 16px;text-align:left;border-bottom:1px solid var(--border)}
tbody tr:last-child td{border-bottom:0}
th{position:sticky;top:0;background:var(--surface);padding:0;font-weight:600;color:var(--muted)}
th button{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:6px;width:100%;padding:10px 16px;cursor:pointer;transition:color .14s}
th button:hover{color:var(--text)}
th button:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
th[aria-sort=ascending] button::after{content:"▲"}
th[aria-sort=descending] button::after{content:"▼"}
th[aria-sort=ascending] button::after,th[aria-sort=descending] button::after{font-size:9px;color:var(--accent)}
th[aria-sort=ascending],th[aria-sort=descending]{color:var(--text);box-shadow:inset 0 -2px 0 var(--accent)}
.num{text-align:right;font-variant-numeric:tabular-nums}
th.num button{justify-content:flex-end}
tbody tr{transition:background .14s}
tbody tr:hover{background:var(--accent-soft)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
