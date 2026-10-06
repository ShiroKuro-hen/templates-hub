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
  padding: 20px; background: #f6f1e7; color: #17130f; font: 14px system-ui, sans-serif;
}
.item, :slotted(.item) {
  border: 2px solid #17130f; border-radius: 10px; background: #fffdf8;
  box-shadow: 4px 4px 0 #17130f; padding: 16px; min-height: 90px; font-weight: 700;
}
.item.wide { grid-column: span 2; background: #ffd84d; }
</style>
