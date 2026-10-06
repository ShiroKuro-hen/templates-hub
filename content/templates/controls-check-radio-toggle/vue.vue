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
.opt { display: flex; align-items: center; gap: 10px; min-height: 34px; cursor: pointer; }
.opt:has(:disabled) { color: #6b6258; cursor: not-allowed; }
input { flex: none; position: relative; appearance: none; margin: 0; width: 22px; height: 22px; background: #fffdf8; border: 2px solid #17130f; cursor: inherit; }
input:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
input:disabled { border-style: dashed; background: #ebe4d4; }
input::before { content: ""; position: absolute; opacity: 0; }
input:checked::before { opacity: 1; }
[type=checkbox] { border-radius: 6px; }
[type=checkbox]:checked { background: #ffd84d; }
[type=checkbox]::before { left: 5px; top: 2px; width: 6px; height: 11px; border: solid #17130f; border-width: 0 2.5px 2.5px 0; transform: rotate(45deg); }
[type=radio] { border-radius: 50%; }
[type=radio]::before { inset: 3px; border-radius: 50%; background: #17130f; }
[type=radio]:checked { background: #ffd84d; }
[role=switch] { width: 44px; height: 26px; border-radius: 13px; }
[role=switch]::before { opacity: 1; left: 2px; top: 2px; width: 18px; height: 18px; border-radius: 50%; background: #17130f; }
[role=switch]:checked { background: #ff5a36; }
[role=switch]:checked::before { transform: translateX(18px); background: #fffdf8; }
@media (prefers-reduced-motion: no-preference) { input, input::before { transition: transform .15s, background .15s; } }
</style>
