<script setup lang="ts">
import { computed, ref } from 'vue';

const count = ref(3);
const text = computed(() => (count.value > 99 ? '99+' : String(count.value)));
const label = computed(() =>
  count.value ? `Notificaciones, ${count.value} sin leer` : 'Notificaciones, ninguna sin leer',
);
</script>

<template>
  <button type="button" class="btn icon" :aria-label="label">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21h4" />
    </svg>
    <span v-if="count > 0" class="count" aria-hidden="true">{{ text }}</span>
  </button>

  <button type="button" class="tool" @click="count++">Llegó una notificación</button>
  <button type="button" class="tool" @click="count = 0">Marcar leídas</button>
</template>

<style scoped>
.btn { position: relative; display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 2px solid #17130f;
  border-radius: 10px; background: #fffdf8; color: #17130f; box-shadow: 4px 4px 0 #17130f; cursor: pointer; transition: transform .1s, box-shadow .1s; }
.btn:hover, .btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
.btn:focus-visible { outline: 3px solid #ff5a36; outline-offset: 3px; }
svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.count { position: absolute; top: -9px; right: -9px; min-width: 22px; height: 22px; padding: 0 5px; display: grid; place-items: center;
  border: 2px solid #17130f; border-radius: 999px; background: #ff5a36; color: #17130f; font: 700 11px system-ui, sans-serif; }
.tool { margin-left: 12px; padding: 5px 10px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; font: 600 12px system-ui, sans-serif; cursor: pointer; }
.tool:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
</style>
