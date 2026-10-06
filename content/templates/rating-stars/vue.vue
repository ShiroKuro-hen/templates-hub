<script setup lang="ts">
const WORDS = ['', 'muy malo', 'regular', 'bien', 'muy bien', 'excelente'];

withDefaults(defineProps<{ legend?: string; name?: string }>(), {
  legend: '¿Qué tal estuvo el servicio?',
  name: 'rate',
});
const model = defineModel<number>({ default: 0 });
</script>

<template>
  <fieldset>
    <legend>{{ legend }}</legend>
    <div class="rate">
      <template v-for="n in 5" :key="n">
        <input type="radio" :name="name" :id="`${name}-${n}`" :value="n" v-model="model" />
        <label :for="`${name}-${n}`">
          <svg class="star" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.8l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7l-5.9 3.1 1.2-6.5L2.5 9.7l6.6-.9z" />
          </svg>
          <span class="sr">{{ n }} {{ n === 1 ? 'estrella' : 'estrellas' }}</span>
        </label>
      </template>
    </div>
    <output aria-live="polite">
      {{ model ? `Tu valoración: ${model} de 5, ${WORDS[model]}` : 'Elige de 1 a 5 estrellas' }}
    </output>
  </fieldset>
</template>

<style scoped>
fieldset { margin: 0; padding: 0; border: 0; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
legend { padding: 0; margin-bottom: 8px; font-weight: 600; }
.rate { display: flex; gap: 2px; }
.rate input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.rate label { display: block; padding: 2px; border-radius: var(--radius); cursor: pointer; }
.star { display: block; width: 32px; height: 32px; fill: var(--surface); stroke: var(--warn); stroke-width: 1.5; stroke-linejoin: round; transition: transform 140ms, fill 140ms; }
.rate input:checked + label .star, .rate label:has(~ input:checked) .star { fill: var(--warn); }
.rate:has(label:hover) label .star { fill: var(--surface); }
.rate label:hover .star, .rate label:has(~ label:hover) .star { fill: var(--warn) !important; }
.rate label:hover .star { transform: scale(1.1); }
.rate input:focus-visible + label { outline: 2px solid var(--accent); outline-offset: 2px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
output { display: block; min-height: 1.5em; margin-top: 8px; color: var(--muted); }
@media (prefers-reduced-motion: reduce) { .star { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
