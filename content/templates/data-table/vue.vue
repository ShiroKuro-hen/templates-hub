<script setup lang="ts">
import { computed, ref } from 'vue';

type Row = { nombre: string; plan: string; ventas: number };
const rows: Row[] = [
  { nombre: 'Ana Pérez', plan: 'Pro', ventas: 1240 },
  { nombre: 'Luis Gómez', plan: 'Free', ventas: 310 },
  { nombre: 'Marta Ruiz', plan: 'Pro', ventas: 2890 },
];
const cols = ['nombre', 'plan', 'ventas'] as const;
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
  <table>
    <thead>
      <tr>
        <th v-for="c in cols" :key="c" scope="col" @click="sort(c)"
            :aria-sort="c === key ? (asc ? 'ascending' : 'descending') : 'none'">
          {{ c }} {{ c === key ? (asc ? '▲' : '▼') : '' }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="r in sorted" :key="r.nombre">
        <td>{{ r.nombre }}</td><td>{{ r.plan }}</td><td>{{ r.ventas }}</td>
      </tr>
    </tbody>
  </table>
</template>
