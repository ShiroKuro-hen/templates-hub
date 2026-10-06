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
label { font-weight: 700; font-size: 13px; letter-spacing: -.01em; }
input { width: 100%; height: 38px; padding: 0 10px; font: inherit; color: #17130f; background: #fffdf8; border: 2px solid #17130f; border-radius: 10px; }
input::placeholder { color: #6b6258; }
input:focus { outline: 3px solid #ff5a36; outline-offset: 1px; }
input[aria-invalid=true] { border-color: #d6293e; background: #fff3f4; }
input.ok { border-color: #1f9d55; }
input:disabled { color: #6b6258; background: #ebe4d4; border-style: dashed; cursor: not-allowed; }
.help { display: flex; gap: 4px; margin: 0; font-size: 12px; color: #6b6258; }
.help::before { flex: none; font-weight: 800; }
.err { color: #d6293e; } .err::before { content: "✕"; }
.good::before { content: "✓"; color: #1f9d55; }
</style>
