<script setup lang="ts">
type Stat = { label: string; value: string; delta: number }; // delta en %, negativo = baja

defineProps<{ stats: Stat[] }>();
</script>

<template>
  <div class="stats">
    <div v-for="s in stats" :key="s.label" class="stat">
      <small>{{ s.label }}</small>
      <strong>{{ s.value }}</strong>
      <span :class="s.delta >= 0 ? 'up' : 'down'">
        <span class="sr-only">{{ s.delta >= 0 ? 'Sube' : 'Baja' }} </span>{{ Math.abs(s.delta) }}%
      </span>
    </div>
  </div>
</template>

<style scoped>
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px; padding: 20px; background: #f6f1e7; color: #17130f; font: 14px system-ui, sans-serif; }
.stat { border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; padding: 16px; }
.stat small { color: #6b6258; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
.stat strong { display: block; font-size: 2rem; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.up { color: #1f9d55; }
.down { color: #d6293e; }
.up::before { content: "▲ "; }
.down::before { content: "▼ "; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
