<script setup lang="ts">
const WORDS = ['', 'Muy malo', 'Regular', 'Bien', 'Muy bien', 'Excelente'];

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
      {{ model ? `Tu valoración: ${model} de 5 · ${WORDS[model]}` : 'Elige de 1 a 5 estrellas' }}
    </output>
  </fieldset>
</template>

<style scoped>
fieldset { margin: 0; padding: 0; border: 0; font: 14px/1.4 system-ui, sans-serif; color: #17130f; }
legend { padding: 0; margin-bottom: 8px; font-weight: 700; letter-spacing: -.01em; }
.rate { display: flex; gap: 2px; }
.rate input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.rate label { display: block; padding: 2px; border-radius: 8px; cursor: pointer; }
.star { display: block; width: 34px; height: 34px; fill: #fffdf8; stroke: #17130f; stroke-width: 2; stroke-linejoin: round; transition: transform .12s; }
.rate input:checked + label .star, .rate label:has(~ input:checked) .star { fill: #ffd84d; }
.rate:has(label:hover) label .star { fill: #fffdf8; }
.rate label:hover .star, .rate label:has(~ label:hover) .star { fill: #ffd84d !important; }
.rate label:hover .star { transform: scale(1.12); }
.rate input:focus-visible + label { outline: 3px solid #ff5a36; outline-offset: 1px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
output { display: block; min-height: 1.4em; margin-top: 8px; color: #6b6258; font: 13px ui-monospace, monospace; }
@media (prefers-reduced-motion: reduce) { .star { transition: none; } }
</style>
