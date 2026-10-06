<script setup lang="ts">
import { computed, useId } from 'vue';

type Status = 'default' | 'error' | 'success';

const props = withDefaults(
  defineProps<{ label: string; help?: string; status?: Status; type?: string; placeholder?: string; disabled?: boolean }>(),
  { status: 'default', type: 'text' }
);
const model = defineModel<string>({ default: '' });

const id = useId();
const helpClass = computed(() => ({ help: true, err: props.status === 'error', good: props.status === 'success' }));
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="{ ok: status === 'success' }"
      :aria-invalid="status === 'error' ? true : undefined"
      :aria-describedby="help ? `${id}-help` : undefined"
    />
    <p v-if="help" :id="`${id}-help`" :class="helpClass">{{ help }}</p>
  </div>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 4px; }
label { font-weight: 600; font-size: 13px; color: var(--text); }
input { width: 100%; height: 38px; padding: 0 10px; font: inherit; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); transition: border-color .14s; }
input::placeholder { color: var(--muted); }
input:hover:not(:disabled) { border-color: var(--muted); }
input:focus { border-color: var(--accent); outline: 2px solid var(--accent); outline-offset: 2px; }
input[aria-invalid=true] { border-color: var(--err); }
input.ok { border-color: var(--ok); }
input:disabled { color: var(--muted); background: var(--bg); cursor: not-allowed; }
.help { display: flex; gap: 4px; margin: 0; font-size: 12px; color: var(--muted); }
.help::before { flex: none; font-weight: 700; }
.err { color: var(--err); } .err::before { content: "✕"; }
.good::before { content: "✓"; color: var(--ok); }
@media (prefers-reduced-motion: reduce) { input { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
