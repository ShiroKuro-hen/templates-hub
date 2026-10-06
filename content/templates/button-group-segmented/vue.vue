<script setup lang="ts">
import { ref } from 'vue';

const periodos = ['Día', 'Semana', 'Mes', 'Año'];
const periodo = ref('Semana');

const formatos = ['Negrita', 'Cursiva', 'Subrayado'];
const activos = ref<string[]>([]);
const toggle = (f: string) =>
  (activos.value = activos.value.includes(f) ? activos.value.filter((x) => x !== f) : [...activos.value, f]);
</script>

<template>
  <!-- Selección única -->
  <div class="seg" role="group" aria-label="Periodo del informe">
    <button v-for="p in periodos" :key="p" type="button" :aria-pressed="p === periodo" @click="periodo = p">
      {{ p }}
    </button>
  </div>
  <p aria-live="polite">Mostrando: {{ periodo }}</p>

  <!-- Selección múltiple -->
  <div class="seg" role="group" aria-label="Formato de texto">
    <button v-for="f in formatos" :key="f" type="button" :aria-pressed="activos.includes(f)" @click="toggle(f)">
      {{ f }}
    </button>
  </div>
</template>

<style scoped>
.seg { display: inline-flex; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; }
.seg button { font: 600 14px system-ui, sans-serif; padding: 8px 16px; border: 0; background: transparent; color: #17130f; cursor: pointer; }
.seg button + button { border-left: 2px solid #17130f; }
.seg button:first-child { border-radius: 8px 0 0 8px; }
.seg button:last-child { border-radius: 0 8px 8px 0; }
.seg button:hover { background: #ffd84d; }
.seg button[aria-pressed="true"] { background: #17130f; color: #fffdf8; }
.seg button:focus-visible { outline: 3px solid #ff5a36; outline-offset: -6px; }
.seg button[aria-pressed="true"]:focus-visible { outline-color: #ffd84d; }
</style>
