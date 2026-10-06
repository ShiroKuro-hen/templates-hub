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
label { display: block; margin-bottom: 6px; font-weight: 700; letter-spacing: -.01em; }
textarea { display: block; width: 100%; height: 130px; padding: 10px 12px; resize: vertical; font: inherit; color: #17130f; background: #fffdf8; border: 2px solid #17130f; border-radius: 10px; box-shadow: 4px 4px 0 #17130f; box-sizing: border-box; }
textarea:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
.meta { display: flex; align-items: center; gap: 10px; margin-top: 14px; font: 12px ui-monospace, monospace; }
progress { flex: 1; height: 12px; appearance: none; border: 2px solid #17130f; border-radius: 6px; background: #fffdf8; overflow: hidden; }
progress::-webkit-progress-bar { background: #fffdf8; }
progress::-webkit-progress-value, progress::-moz-progress-bar { background: #1f9d55; }
.warn progress::-webkit-progress-value, .warn progress::-moz-progress-bar { background: #e0a800; }
.full progress::-webkit-progress-value, .full progress::-moz-progress-bar { background: #d6293e; }
#left { min-width: 130px; text-align: right; color: #6b6258; }
.warn #left { color: #17130f; font-weight: 700; } .full #left { color: #d6293e; font-weight: 700; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
</style>
