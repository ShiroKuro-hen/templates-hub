<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{ min?: number; max?: number; step?: number; gap?: number }>(),
  { min: 0, max: 1000, step: 10, gap: 50 });
const vol = ref(60);
const lo = ref(120);
const hi = ref(680);
const pct = (v: number) => ((v - props.min) / (props.max - props.min)) * 100;

function onLo(e: Event) {
  const v = +(e.target as HTMLInputElement).value;
  lo.value = Math.min(v, hi.value - props.gap);
  (e.target as HTMLInputElement).value = String(lo.value);
}
function onHi(e: Event) {
  const v = +(e.target as HTMLInputElement).value;
  hi.value = Math.max(v, lo.value + props.gap);
  (e.target as HTMLInputElement).value = String(hi.value);
}
</script>

<template>
  <form class="panel" aria-label="Filtros">
    <div>
      <div class="row"><label for="vol">Volumen</label><output for="vol">{{ vol }}%</output></div>
      <input id="vol" v-model.number="vol" type="range" class="single" min="0" max="100" :style="{ '--p': vol }" />
    </div>
    <div role="group" aria-labelledby="priceLbl">
      <div class="row">
        <span id="priceLbl" class="label">Precio</span>
        <output for="lo hi">${{ lo }} – ${{ hi }}</output>
      </div>
      <div class="dual" :style="{ '--a': pct(lo), '--b': pct(hi) }">
        <span class="fill" />
        <input id="lo" type="range" :min="min" :max="max" :step="step" :value="lo" aria-label="Precio mínimo" :aria-valuetext="`$${lo}`" @input="onLo" />
        <input id="hi" type="range" :min="min" :max="max" :step="step" :value="hi" aria-label="Precio máximo" :aria-valuetext="`$${hi}`" @input="onHi" />
      </div>
      <div class="scale" aria-hidden="true"><span>${{ min }}</span><span>${{ max }}</span></div>
    </div>
  </form>
</template>

<style scoped>
.panel{max-width:440px;margin:0 auto;padding:20px;display:grid;gap:24px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}
label,.label{font-weight:600}
output{color:var(--muted);font-variant-numeric:tabular-nums}
input[type=range]{-webkit-appearance:none;appearance:none;display:block;width:100%;height:20px;margin:0;background:transparent;cursor:pointer}
input[type=range]::-webkit-slider-runnable-track{height:4px;border-radius:999px;background:var(--track)}
input[type=range]::-moz-range-track{height:4px;border-radius:999px;background:var(--track)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;margin-top:-7px;border-radius:50%;background:var(--surface);border:1px solid var(--accent);box-shadow:var(--shadow);transition:transform .14s}
input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:var(--surface);border:1px solid var(--accent);box-shadow:var(--shadow)}
input[type=range]:active::-webkit-slider-thumb{transform:scale(1.15)}
input[type=range]:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}
.single{--track:linear-gradient(to right,var(--accent) calc(var(--p)*1%),var(--border) 0)}
.dual{position:relative;height:20px}
.dual::before,.fill{content:"";position:absolute;top:8px;height:4px;border-radius:999px}
.dual::before{left:0;right:0;background:var(--border)}
.fill{left:calc(var(--a)*1%);right:calc(100% - var(--b)*1%);background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.dual input{position:absolute;inset:0;pointer-events:none;--track:transparent}
.dual input::-webkit-slider-thumb{pointer-events:auto}
.dual input::-moz-range-thumb{pointer-events:auto}
.scale{display:flex;justify-content:space-between;margin-top:6px;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
