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
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
.stat { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 4px; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.stat:first-child::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(135deg, #22d3ee, #2f5bff); }
.stat small { color: var(--muted); font-size: .8125rem; font-weight: 500; }
.stat strong { font-size: 2rem; font-weight: 700; line-height: 1.1; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.up, .down { align-self: flex-start; padding: 2px 8px; border-radius: 999px; font-size: .75rem; font-weight: 600; font-variant-numeric: tabular-nums; }
.up { background: var(--ok-soft); color: var(--ok); }
.down { background: var(--err-soft); color: var(--err); }
.up::before { content: "▲ "; }
.down::before { content: "▼ "; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
/* Tokens: ver pestaña HTML + CSS */
</style>
