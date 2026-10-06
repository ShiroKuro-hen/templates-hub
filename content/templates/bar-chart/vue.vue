<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ data: { label: string; value: number }[] }>(); // value: 0-100
const max = computed(() => Math.max(...props.data.map((d) => d.value)));
</script>

<template>
  <div>
    <div class="chart">
      <div v-for="d in data" :key="d.label" class="bar" :class="{ max: d.value === max }" :style="{ '--v': d.value }">
        <b>{{ d.value }}</b>
      </div>
    </div>
    <div class="labels"><span v-for="d in data" :key="d.label">{{ d.label }}</span></div>
  </div>
</template>
<!-- CSS: copia las reglas .chart / .bar / .labels de la pestaña HTML + CSS. -->
