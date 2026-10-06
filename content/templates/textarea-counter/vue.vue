<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';

const props = withDefaults(defineProps<{ label: string; max?: number; placeholder?: string }>(), { max: 140 });
const value = defineModel<string>({ default: '' });

const id = useId();
const live = ref('');
const len = computed(() => value.value.length);
const rest = computed(() => props.max - len.value);
const band = computed(() => (rest.value <= 0 ? 'full' : len.value / props.max >= 0.85 ? 'warn' : ''));

// Anuncia solo al cambiar de umbral, no en cada tecla.
watch(band, (b) => {
  live.value = b === 'full' ? 'Has alcanzado el límite de caracteres.' : b ? `Quedan ${rest.value} caracteres.` : '';
});
</script>

<template>
  <div>
    <label :for="id">{{ label }}</label>
    <textarea :id="id" v-model="value" :maxlength="max" :placeholder="placeholder" />
    <div :class="['meta', band]" aria-hidden="true">
      <progress :max="max" :value="len" />
      <span><b>{{ len }}</b> / {{ max }}</span>
      <span id="left">{{ rest <= 0 ? 'Límite alcanzado' : band ? `Te quedan ${rest}` : '' }}</span>
    </div>
    <p class="sr" role="status">{{ live }}</p>
  </div>
</template>

<style scoped>
label { display: block; margin-bottom: 6px; font-weight: 600; color: var(--text); }
textarea { display: block; width: 100%; height: 130px; padding: 10px 12px; resize: vertical; font: inherit; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); box-sizing: border-box; }
textarea:focus-visible { border-color: var(--accent); outline: 2px solid var(--accent); outline-offset: 2px; }
.meta { display: flex; align-items: center; gap: 12px; margin-top: 12px; font-size: 12px; font-variant-numeric: tabular-nums; color: var(--text); }
progress { flex: 1; height: 6px; appearance: none; border: 0; border-radius: 999px; background: var(--border); overflow: hidden; }
progress::-webkit-progress-bar { background: var(--border); }
progress::-webkit-progress-value, progress::-moz-progress-bar { background: linear-gradient(90deg, #22d3ee, #2f5bff); border-radius: 999px; }
.warn progress::-webkit-progress-value, .warn progress::-moz-progress-bar { background: var(--warn); }
.full progress::-webkit-progress-value, .full progress::-moz-progress-bar { background: var(--err); }
#left { min-width: 120px; text-align: right; color: var(--muted); }
.warn #left { color: var(--text); font-weight: 600; } .full #left { color: var(--err); font-weight: 600; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
/* Tokens: ver pestaña HTML + CSS */
</style>
