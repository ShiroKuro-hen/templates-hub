<script setup lang="ts">
withDefaults(defineProps<{ min?: number }>(), { min: 160 });
</script>

<template>
  <div class="grid" :style="{ '--min': `${min}px` }">
    <div class="item wide"><slot name="wide">Destacado (2 columnas)</slot></div>
    <slot>
      <div class="item">Uno</div>
      <div class="item">Dos</div>
      <div class="item">Tres</div>
    </slot>
  </div>
</template>

<style scoped>
.grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(var(--min), 1fr)); gap: 16px;
  padding: 20px; background: var(--bg); color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif;
}
.item, :slotted(.item) {
  position: relative; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface);
  box-shadow: var(--shadow); padding: 16px; min-height: 90px; font-weight: 600;
}
.item.wide { grid-column: span 2; background: var(--accent-soft); }
.item.wide::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(135deg, #22d3ee, #2f5bff); }
/* Tokens: ver pestaña HTML + CSS */
</style>
