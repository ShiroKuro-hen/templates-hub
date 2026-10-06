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
.steps { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; margin: 0 0 20px; padding: 0; list-style: none; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
.step { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; font-size: 13px; font-weight: 500; color: var(--muted); }
.step::before { content: ""; position: absolute; top: 17px; right: 50%; width: 100%; height: 2px; background: linear-gradient(90deg, #22d3ee, #2f5bff); }
.step:first-child::before { display: none; }
.dot { position: relative; z-index: 1; display: grid; place-items: center; width: 36px; height: 36px; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; background: var(--surface); color: var(--muted); border: 1px solid var(--border); border-radius: 50%; }
.step[data-state="done"], .step[data-state="current"] { color: var(--text); }
.step[data-state="done"] .dot { background: var(--ok); border-color: var(--ok); color: var(--accent-ink); }
.step[data-state="current"] .dot { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); box-shadow: 0 0 0 4px var(--accent-soft); }
.step[data-state="pending"]::before { background: repeating-linear-gradient(90deg, var(--border) 0 6px, transparent 6px 12px); }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.nav { display: flex; gap: 10px; }
.btn { font: 600 14px system-ui; padding: 8px 16px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; transition: background 140ms, border-color 140ms; }
.btn.primary { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
.btn:hover:not(:disabled) { background: var(--accent-soft); border-color: var(--accent); }
.btn.primary:hover:not(:disabled) { background: var(--accent); filter: brightness(1.1); }
.btn:disabled { opacity: .45; cursor: not-allowed; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
