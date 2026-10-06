<script setup lang="ts">
import { useId } from 'vue';

// kind: checkbox | radio | switch. Úsalo con v-model (boolean para checkbox/switch; valor para radio).
withDefaults(defineProps<{ kind: 'checkbox' | 'radio' | 'switch'; label: string; name?: string; value?: string; disabled?: boolean }>(), {});
const model = defineModel<boolean | string>();
const id = useId();
</script>

<template>
  <label class="opt" :for="id">
    <input
      :id="id"
      v-model="model"
      :type="kind === 'radio' ? 'radio' : 'checkbox'"
      :role="kind === 'switch' ? 'switch' : undefined"
      :name="name"
      :value="value"
      :disabled="disabled"
    />
    {{ label }}
  </label>
</template>

<style scoped>
.opt { display: flex; align-items: center; gap: 10px; min-height: 34px; cursor: pointer; color: var(--text); }
.opt:has(:disabled) { color: var(--muted); cursor: not-allowed; }
input { flex: none; position: relative; appearance: none; margin: 0; width: 20px; height: 20px; background: var(--surface); border: 1px solid var(--muted); cursor: inherit; }
input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
input:disabled { opacity: .5; }
input::before { content: ""; position: absolute; opacity: 0; }
input:checked::before { opacity: 1; }
[type=checkbox] { border-radius: 5px; }
[type=checkbox]:checked { background: var(--accent); border-color: var(--accent); }
[type=checkbox]::before { left: 6px; top: 2px; width: 5px; height: 10px; border: solid var(--accent-ink); border-width: 0 2px 2px 0; transform: rotate(45deg); }
[type=radio] { border-radius: 50%; }
[type=radio]::before { inset: 4px; border-radius: 50%; background: var(--accent); }
[type=radio]:checked { border-color: var(--accent); }
[role=switch] { width: 40px; height: 24px; border-radius: 12px; background: var(--border); border-color: transparent; }
[role=switch]::before { opacity: 1; left: 2px; top: 2px; width: 18px; height: 18px; border-radius: 50%; background: var(--muted); }
[role=switch]:checked { background: linear-gradient(135deg, #22d3ee, #2f5bff); }
[role=switch]:checked::before { transform: translateX(16px); background: #fff; }
@media (prefers-reduced-motion: no-preference) { input, input::before { transition: transform .14s, background-color .14s, border-color .14s; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
