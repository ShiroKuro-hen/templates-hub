<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{ steps?: string[]; initial?: number }>(), {
  steps: () => ['Carrito', 'Envío', 'Pago', 'Listo'],
  initial: 1,
});
const cur = ref(props.initial);
const LABEL = { done: 'completado', current: 'paso actual', pending: 'pendiente' } as const;
const stateOf = (i: number) => (i < cur.value ? 'done' : i === cur.value ? 'current' : 'pending');
</script>

<template>
  <nav aria-label="Progreso">
    <ol class="steps">
      <li v-for="(name, i) in steps" :key="name" class="step" :data-state="stateOf(i)"
          :aria-current="stateOf(i) === 'current' ? 'step' : undefined">
        <span class="dot">{{ stateOf(i) === 'done' ? '✓' : i + 1 }}</span>
        {{ name }}
        <span class="sr">({{ LABEL[stateOf(i)] }})</span>
      </li>
    </ol>
  </nav>
  <div class="nav">
    <button type="button" class="btn" :disabled="cur === 0" @click="cur--">Atrás</button>
    <button type="button" class="btn primary" :disabled="cur === steps.length - 1" @click="cur++">Continuar</button>
  </div>
</template>

<style scoped>
.steps { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; margin: 0 0 20px; padding: 0; list-style: none; font: 14px/1.4 system-ui, sans-serif; }
.step { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; font-size: 13px; font-weight: 600; color: #6b6258; }
.step::before { content: ""; position: absolute; top: 17px; right: 50%; width: 100%; height: 4px; background: #17130f; }
.step:first-child::before { display: none; }
.dot { position: relative; z-index: 1; display: grid; place-items: center; width: 38px; height: 38px; font: 700 15px ui-monospace, monospace; background: #fffdf8; color: #17130f; border: 2px solid #17130f; border-radius: 50%; }
.step[data-state="done"], .step[data-state="current"] { color: #17130f; }
.step[data-state="done"] .dot { background: #1f9d55; color: #fff; }
.step[data-state="current"] .dot { background: #ff5a36; box-shadow: 3px 3px 0 #17130f; }
.step[data-state="pending"]::before { background: repeating-linear-gradient(90deg, #17130f 0 6px, transparent 6px 12px); }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.nav { display: flex; gap: 10px; }
.btn { font: 600 14px system-ui; padding: 8px 14px; color: #17130f; background: #fffdf8; border: 2px solid #17130f; border-radius: 10px; box-shadow: 4px 4px 0 #17130f; cursor: pointer; }
.btn.primary { background: #ffd84d; }
.btn:hover:not(:disabled) { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
.btn:disabled { opacity: .45; box-shadow: none; cursor: not-allowed; }
:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
</style>
