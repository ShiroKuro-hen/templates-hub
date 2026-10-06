<script setup lang="ts">
type Item = { label: string; value: number }; // value 0-100

defineProps<{ items: Item[] }>();
const tone = (v: number) => (v >= 75 ? 'hi' : v >= 40 ? 'mid' : 'lo');
</script>

<template>
  <div class="bars">
    <div v-for="(it, i) in items" :key="it.label" class="row">
      <label :for="`pb-${i}`">{{ it.label }}</label>
      <progress :id="`pb-${i}`" :class="tone(it.value)" max="100" :value="it.value" />
      <output :for="`pb-${i}`">{{ it.value }}%</output>
    </div>
  </div>
</template>

<style scoped>
.bars { padding: 20px; background: #f6f1e7; color: #17130f; font: 14px system-ui, sans-serif; }
.row { display: grid; grid-template-columns: 110px 1fr 48px; align-items: center; gap: 12px; margin-bottom: 14px; font-weight: 600; }
.row output { text-align: right; font-variant-numeric: tabular-nums; }
progress { appearance: none; width: 100%; height: 18px; border: 2px solid #17130f; border-radius: 999px; background: #fffdf8; overflow: hidden; }
progress::-webkit-progress-bar { background: #fffdf8; }
progress::-webkit-progress-value { background: var(--c); }
progress::-moz-progress-bar { background: var(--c); }
.lo { --c: #d6293e; }
.mid { --c: #e0a800; }
.hi { --c: #1f9d55; }
</style>
