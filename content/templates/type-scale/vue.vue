<script setup lang="ts">
type Step = { name: string; size: string; sample: string; cls: string };

withDefaults(defineProps<{ steps?: Step[] }>(), {
  steps: () => [
    { name: '--step-5', size: '3.4rem', sample: 'Titular', cls: 's5' },
    { name: '--step-4', size: '2.75rem', sample: 'Gran título', cls: 's4' },
    { name: '--step-3', size: '2.2rem', sample: 'Título de sección', cls: 's3' },
    { name: '--step-2', size: '1.76rem', sample: 'Subtítulo destacado', cls: 's2' },
    { name: '--step-1', size: '1.4rem', sample: 'Entradilla o lead de página', cls: 's1' },
    { name: '--step-0', size: '1.125rem', sample: 'Texto base para lectura cómoda.', cls: 's0' },
    { name: '--step--1', size: '0.9rem', sample: 'Texto pequeño para notas y pies.', cls: 's-1' },
  ],
});
</script>

<template>
  <ol class="scale">
    <li v-for="s in steps" :key="s.name">
      <span class="tok"><b>{{ s.name }}</b>{{ s.size }}</span>
      <p :class="['smp', s.cls]">{{ s.sample }}</p>
    </li>
  </ol>
</template>

<style scoped>
.scale {
  --step--1: clamp(0.83rem, 0.8rem + 0.15vw, 0.9rem);
  --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --step-1: clamp(1.2rem, 1.1rem + 0.5vw, 1.4rem);
  --step-2: clamp(1.44rem, 1.28rem + 0.8vw, 1.76rem);
  --step-3: clamp(1.73rem, 1.45rem + 1.3vw, 2.2rem);
  --step-4: clamp(2.07rem, 1.6rem + 2vw, 2.75rem);
  --step-5: clamp(2.49rem, 1.8rem + 3vw, 3.4rem);
  margin: 0; padding: 0; list-style: none; font-family: system-ui, sans-serif; color: #17130f;
  border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f;
}
.scale li { display: grid; grid-template-columns: 5.5rem 1fr; align-items: baseline; gap: 12px; padding: 10px 14px; }
.scale li + li { border-top: 2px solid #17130f; }
.tok { font: 12px ui-monospace, monospace; color: #6b6258; }
.tok b { display: block; color: #17130f; }
.smp { margin: 0; line-height: 1.1; letter-spacing: -0.02em; font-weight: 700; overflow-wrap: anywhere; }
.s-1 { font-size: var(--step--1); font-weight: 400; letter-spacing: 0; line-height: 1.4; }
.s0 { font-size: var(--step-0); font-weight: 400; letter-spacing: 0; line-height: 1.4; }
.s1 { font-size: var(--step-1); } .s2 { font-size: var(--step-2); } .s3 { font-size: var(--step-3); }
.s4 { font-size: var(--step-4); } .s5 { font-size: var(--step-5); }
</style>
