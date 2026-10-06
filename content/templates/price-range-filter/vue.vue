<script setup lang="ts">
import { computed, reactive } from 'vue';

const MAX = 300, STEP = 25, C = [4, 9, 18, 26, 31, 24, 19, 12, 8, 5, 3, 2], TOP = Math.max(...C);
const eur = (n: number) => `${n.toLocaleString('es-ES')} €`;
const num = (v: string, d: number) => (v === '' || isNaN(+v) ? d : Math.min(MAX, Math.max(0, +v)));

const s = reactive({ lo: 40, hi: 180, tlo: '40', thi: '180' });
const bad = computed(() => s.lo > s.hi);
const count = computed(() => (bad.value ? 0 : C.reduce((t, c, i) => t + (c * Math.max(0, Math.min(s.hi, (i + 1) * STEP) - Math.max(s.lo, i * STEP))) / STEP, 0)));
const vars = computed(() => ({ '--a': (Math.min(s.lo, s.hi) / MAX) * 100, '--b': (Math.max(s.lo, s.hi) / MAX) * 100 }));

function slideLo(e: Event) { s.lo = Math.min(+(e.target as HTMLInputElement).value, s.hi); s.tlo = String(s.lo); }
function slideHi(e: Event) { s.hi = Math.max(+(e.target as HTMLInputElement).value, s.lo); s.thi = String(s.hi); }
const typeLo = () => { s.lo = num(s.tlo, 0); };
const typeHi = () => { s.hi = num(s.thi, MAX); };
const sync = () => { s.tlo = String(s.lo); s.thi = String(s.hi); };
</script>

<template>
  <form novalidate @submit.prevent>
    <fieldset>
      <legend>Precio</legend>
      <div class="hist" aria-hidden="true">
        <i v-for="(c, i) in C" :key="i" :class="{ in: !bad && (i + 1) * STEP > s.lo && i * STEP < s.hi }" :style="{ '--h': (c / TOP) * 100 }" />
      </div>
      <div class="slider" :style="vars">
        <div class="rail" aria-hidden="true"><div class="fill" /></div>
        <input type="range" min="0" :max="MAX" step="5" :value="s.lo" aria-label="Precio mínimo" @input="slideLo">
        <input type="range" min="0" :max="MAX" step="5" :value="s.hi" aria-label="Precio máximo" @input="slideHi">
      </div>
      <div class="fields">
        <label>Mínimo
          <span class="field" :data-bad="bad || undefined">
            <input v-model="s.tlo" type="number" min="0" :max="MAX" step="5" inputmode="numeric" :aria-invalid="bad" aria-describedby="err" @input="typeLo" @blur="sync">
            <span aria-hidden="true">€</span>
          </span>
        </label>
        <label>Máximo
          <span class="field" :data-bad="bad || undefined">
            <input v-model="s.thi" type="number" min="0" :max="MAX" step="5" inputmode="numeric" :aria-invalid="bad" aria-describedby="err" @input="typeHi" @blur="sync">
            <span aria-hidden="true">€</span>
          </span>
        </label>
      </div>
      <p id="err" class="err" role="alert" :hidden="!bad">El mínimo ({{ eur(s.lo) }}) supera al máximo ({{ eur(s.hi) }}). Baja el mínimo o sube el máximo.</p>
      <button class="go" type="submit" :disabled="bad">{{ bad ? 'Corrige el rango' : `Ver ${Math.round(count)} artículos` }}</button>
    </fieldset>
  </form>
</template>

<style scoped>
fieldset{width:min(100%,360px);box-sizing:border-box;margin:0;padding:16px 20px 20px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
legend{padding:0 6px;font-size:16px;font-weight:600}
.hist{display:flex;align-items:flex-end;gap:3px;height:56px;margin:8px 9px 0}
.hist i{flex:1;height:calc(var(--h) * 1%);background:var(--border);border-radius:2px 2px 0 0;transition:background .14s}
.hist i.in{background:var(--accent-soft);box-shadow:inset 0 2px 0 var(--accent)}
.slider{position:relative;height:24px}
.rail{position:absolute;left:9px;right:9px;top:10px;height:4px;border-radius:999px;background:var(--accent-soft)}
.fill{position:absolute;top:0;bottom:0;left:calc(var(--a) * 1%);right:calc((100 - var(--b)) * 1%);border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.slider input{position:absolute;inset:0;width:100%;height:24px;margin:0;background:none;pointer-events:none;-webkit-appearance:none;appearance:none}
.slider input::-webkit-slider-runnable-track{height:24px;background:none}
.slider input::-moz-range-track{height:24px;background:none}
.slider input::-webkit-slider-thumb{-webkit-appearance:none;pointer-events:auto;width:18px;height:18px;margin-top:3px;border-radius:50%;background:var(--accent);border:1px solid var(--surface);box-shadow:var(--shadow);cursor:grab}
.slider input::-moz-range-thumb{pointer-events:auto;width:16px;height:16px;border-radius:50%;background:var(--accent);border:1px solid var(--surface);box-shadow:var(--shadow);cursor:grab}
.slider input:focus-visible{outline:none}
.slider input:focus-visible::-webkit-slider-thumb{outline:2px solid var(--accent);outline-offset:2px}
.slider input:focus-visible::-moz-range-thumb{outline:2px solid var(--accent);outline-offset:2px}
.fields{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
label{display:block;color:var(--muted);font-size:13px}
.field{display:flex;align-items:center;gap:6px;margin-top:2px;padding:0 10px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.field:focus-within{outline:2px solid var(--accent);outline-offset:2px}
.field input{width:100%;min-width:0;padding:7px 0;font:inherit;color:var(--text);font-variant-numeric:tabular-nums;background:none;border:0;outline:0}
.field[data-bad]{border-color:var(--err)}
.err{margin:8px 0 0;font-size:13px;color:var(--err)}
.err[hidden]{display:none}
.go{width:100%;margin-top:14px;padding:9px 14px;font:inherit;font-weight:600;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);cursor:pointer;transition:filter .14s}
.go:hover:not(:disabled){filter:brightness(1.08)}
.go:disabled{color:var(--muted);background:var(--accent-soft);border-color:var(--border);cursor:not-allowed}
.go:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
