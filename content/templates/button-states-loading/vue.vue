<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const loading = ref(false);
const msg = ref('');
let timer: number | undefined;

function save() {
  if (loading.value) return; // aria-disabled: conserva el foco, ignora clics
  loading.value = true;
  msg.value = 'Guardando cambios';
  timer = window.setTimeout(() => {
    loading.value = false;
    msg.value = 'Cambios guardados';
  }, 2000);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <button type="button" class="btn" :aria-busy="loading || undefined" :aria-disabled="loading || undefined" @click="save">
    <span v-if="loading" class="spin" aria-hidden="true" />
    {{ loading ? 'Guardando…' : 'Guardar' }}
  </button>
  <p role="status" class="sr">{{ msg }}</p>
</template>

<style scoped>
.btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: 8px; font: 500 14px system-ui, -apple-system, "Segoe UI", sans-serif; padding: 8px 16px;
  border: 1px solid transparent; border-radius: var(--radius); background: var(--accent); color: var(--accent-ink);
  cursor: pointer; transition: filter .14s, box-shadow .14s; }
.btn:hover { filter: brightness(1.1); box-shadow: var(--shadow); }
.btn:active { filter: brightness(.92); box-shadow: none; }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn[aria-busy="true"] { cursor: progress; filter: none; box-shadow: none; }
.btn[aria-busy="true"]::after { content: ""; position: absolute; left: 0; bottom: 0; width: 40%; height: 2px;
  background: linear-gradient(135deg, #22d3ee, #2f5bff); animation: slide 1.1s ease-in-out infinite; }
.spin { width: 14px; height: 14px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%;
  animation: spin .7s linear infinite; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } .spin, .btn[aria-busy="true"]::after { animation: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
