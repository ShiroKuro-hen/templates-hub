<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ data: { label: string; value: number }[] }>(); // value: 0-100
const max = computed(() => Math.max(...props.data.map((d) => d.value)));
const resumen = computed(() => props.data.map((d) => `${d.label} ${d.value}`).join(', '));
</script>

<template>
  <figure>
    <div class="chart" role="img" :aria-label="`Valores por periodo: ${resumen}`">
      <div v-for="d in data" :key="d.label" class="bar" :class="{ max: d.value === max }" :style="{ '--v': d.value }">
        <b>{{ d.value }}</b>
      </div>
    </div>
    <div class="labels" aria-hidden="true"><span v-for="d in data" :key="d.label">{{ d.label }}</span></div>
  </figure>
</template>

<style scoped>
figure{margin:0;padding:20px 20px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.chart{display:flex;align-items:flex-end;gap:16px;height:220px;padding:24px 8px 0;border-bottom:1px solid var(--border);
       background:repeating-linear-gradient(to top,transparent 0 51px,var(--border) 51px 52px)}
.bar{flex:1;height:calc(var(--v) * 1%);background:var(--accent-soft);border:1px solid var(--accent);border-bottom:0;border-radius:4px 4px 0 0;position:relative;transition:filter .14s}
.bar:hover{filter:brightness(.96)}
.bar.max{background:linear-gradient(135deg,#22d3ee,#2f5bff);border-color:transparent}
.bar b{position:absolute;top:-22px;left:0;right:0;text-align:center;font-weight:600;font-variant-numeric:tabular-nums}
.labels{display:flex;gap:16px;padding:8px 8px 0;color:var(--muted)}
.labels span{flex:1;text-align:center}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
