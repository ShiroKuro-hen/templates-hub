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
.btn { display: inline-flex; align-items: center; gap: 8px; font: 600 14px system-ui, sans-serif; padding: 9px 16px;
  border: 2px solid #17130f; border-radius: 10px; background: #ff5a36; color: #17130f; box-shadow: 4px 4px 0 #17130f;
  cursor: pointer; transition: transform .1s, box-shadow .1s; }
.btn:hover, .btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
.btn:active { background: #ffd84d; }
.btn:focus-visible { outline: 3px solid #ff5a36; outline-offset: 3px; }
.btn[aria-busy="true"] { cursor: progress; transform: none; box-shadow: 4px 4px 0 #17130f; background: #ff5a36; }
.spin { width: 14px; height: 14px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%;
  animation: spin .7s linear infinite; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } .spin { animation: none; } }
</style>
