<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{ name: string; price: number; min?: number; max?: number }>(), { min: 1, max: 10 });
const qty = defineModel<number>({ default: 1 });
const draft = ref<string | number>(qty.value); // v-model en type=number devuelve número
const clamped = ref(false);
const input = ref<HTMLInputElement>();
const money = (n: number) => '$' + n.toFixed(2);

function commit(n: number, fromButton = false) {
  const v = Math.min(props.max, Math.max(props.min, Math.round(n) || props.min));
  clamped.value = n !== v;
  qty.value = v;
  draft.value = v;
  if (fromButton && (v === props.min || v === props.max)) input.value?.focus(); // el botón se desactiva: no perder el foco
}
</script>

<template>
  <article class="item">
    <div class="info">
      <h3 id="name">{{ name }}</h3>
      <p>{{ money(price) }} por unidad</p>
    </div>
    <div class="stepper" role="group" aria-labelledby="name">
      <button type="button" aria-label="Quitar una unidad" aria-controls="qty" :disabled="qty <= min" @click="commit(qty - 1, true)">−</button>
      <input id="qty" ref="input" v-model="draft" type="number" :min="min" :max="max" inputmode="numeric"
             aria-label="Cantidad" aria-describedby="note" @blur="commit(draft === '' ? NaN : +draft)" />
      <button type="button" aria-label="Añadir una unidad" aria-controls="qty" :disabled="qty >= max" @click="commit(qty + 1, true)">+</button>
    </div>
    <output class="total" for="qty" aria-live="polite">{{ money(qty * price) }}</output>
    <p id="note" :class="{ warn: clamped }">
      {{ clamped ? `Ajustamos la cantidad a ${qty}. Puedes pedir entre ${min} y ${max} unidades.` : `Máximo ${max} unidades por pedido.` }}
    </p>
  </article>
</template>

<style scoped>
.item{position:relative;max-width:480px;margin:0 auto;padding:16px 20px;display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.item::before{content:"";position:absolute;inset:0 0 auto;height:1px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.info{flex:1;min-width:160px}
.info h3{margin:0;font-size:15px}
.info p{margin:2px 0 0;color:var(--muted);font-variant-numeric:tabular-nums}
.stepper{display:inline-flex;border:1px solid var(--border);border-radius:var(--radius)}
.stepper button{width:36px;height:36px;font:500 18px/1 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text);background:none;border:0;cursor:pointer;transition:background .14s}
.stepper button:first-child{border-radius:var(--radius) 0 0 var(--radius)}
.stepper button:last-child{border-radius:0 var(--radius) var(--radius) 0}
.stepper button:hover:not(:disabled){background:var(--accent-soft);color:var(--accent)}
.stepper button:disabled{color:var(--border);cursor:not-allowed}
.stepper input{width:48px;padding:0;text-align:center;font:600 15px system-ui,-apple-system,"Segoe UI",sans-serif;font-variant-numeric:tabular-nums;color:var(--text);background:none;border:0;border-inline:1px solid var(--border);-moz-appearance:textfield;appearance:textfield}
.stepper input::-webkit-inner-spin-button,.stepper input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.stepper :focus-visible{outline:2px solid var(--accent);outline-offset:2px;position:relative}
.total{min-width:88px;text-align:right;font-weight:600;font-variant-numeric:tabular-nums}
#note{flex-basis:100%;margin:0;color:var(--muted);font-size:13px}
#note.warn{color:var(--warn)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
