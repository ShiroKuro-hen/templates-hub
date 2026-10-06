<script setup lang="ts">
type Item = { label: string; value: number }; // value 0-100

defineProps<{ items: Item[] }>();
const tone = (v: number) => (v >= 75 ? 'hi' : v >= 40 ? 'mid' : 'lo');
</script>

<template>
  <div class="card">
    <div v-for="(it, i) in items" :key="it.label" class="row">
      <label :for="`pb-${i}`">{{ it.label }}</label>
      <progress :id="`pb-${i}`" :class="tone(it.value)" max="100" :value="it.value" />
      <output :for="`pb-${i}`">{{ it.value }}%</output>
    </div>
  </div>
</template>

<style scoped>
.card{padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.row{display:grid;grid-template-columns:110px 1fr 48px;align-items:center;gap:12px;margin-bottom:16px}
.row:last-child{margin-bottom:0}
.row label{font-weight:500}
.row output{text-align:right;color:var(--muted);font-variant-numeric:tabular-nums}
progress{appearance:none;width:100%;height:8px;border:0;border-radius:999px;background:var(--border);overflow:hidden}
progress::-webkit-progress-bar{background:var(--border)}
progress::-webkit-progress-value{background:var(--c);border-radius:999px}
progress::-moz-progress-bar{background:var(--c);border-radius:999px}
.lo{--c:var(--err)} .mid{--c:var(--warn)} .hi{--c:var(--ok)}
/* Tokens: ver pestaña HTML + CSS */
</style>
