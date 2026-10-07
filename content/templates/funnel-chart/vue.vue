<script setup lang="ts">
import { ref } from 'vue';

const stages: [string, number][] = [
  ['Visitas al sitio', 24800], ['Registros', 14900], ['Cuentas activadas', 9800], ['Planes elegidos', 5400], ['Pagos completados', 3100],
];
const hl = ref(-1);
const top = stages[0][1], n = stages.length, h = 100 / n;
const step = stages.map((s, i) => (i ? s[1] / stages[i - 1][1] : 1));
const worst = step.indexOf(Math.min(...step.slice(1)));
const f = (v: number) => v.toLocaleString('es');
const pc = (v: number) => `${(v * 100).toLocaleString('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
const pts = (i: number) => {
  const w0 = (stages[i][1] / top) * 100, w1 = ((stages[i + 1] ? stages[i + 1][1] : stages[i][1] * 0.8) / top) * 100;
  const y0 = i * h + 0.8, y1 = (i + 1) * h - 0.8;
  return `${50 - w0 / 2},${y0} ${50 + w0 / 2},${y0} ${50 + w1 / 2},${y1} ${50 - w1 / 2},${y1}`;
};
</script>

<template>
  <figure class="card" @keydown.esc="hl = -1">
    <figcaption class="head">
      <div><h2>Embudo de conversión</h2><p>Visitantes del sitio que llegan a pagar, en septiembre.</p></div>
      <p class="sum"><b>{{ pc(stages[n - 1][1] / top) }}</b><span>de las visitas terminan en pago</span></p>
    </figcaption>
    <div class="wrap">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" :class="{ dim: hl >= 0 }" :style="{ height: n * 64 + 'px' }" @pointerleave="hl = -1">
        <defs><linearGradient id="fg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
        <polygon v-for="(s, i) in stages" :key="s[0]" :class="{ on: hl === i }" :points="pts(i)" @pointerover="hl = i" />
      </svg>
      <ol @pointerleave="hl = -1">
        <li v-for="(s, i) in stages" :key="s[0]" tabindex="0" :class="{ on: hl === i }" @pointerover="hl = i" @focus="hl = i" @blur="hl = -1"
            :aria-label="`${s[0]}: ${f(s[1])}, ${pc(s[1] / top)} del total${i ? `, ${pc(step[i])} de la etapa anterior` : ''}`">
          <span class="n">{{ s[0] }}</span>
          <span class="m">
            <b>{{ f(s[1]) }}</b>{{ pc(s[1] / top) }} del total
            <span v-if="i > 0" class="badge" :class="{ warn: i === worst }">{{ i === worst ? 'Mayor caída: ' : 'Paso ' }}{{ pc(step[i]) }}</span>
          </span>
        </li>
      </ol>
    </div>
  </figure>
</template>

<style scoped>
.card{margin:0;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:20px}
h2{margin:0;font-size:16px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.sum{text-align:right}
.sum b{display:block;font-size:24px;line-height:1.1;font-weight:600;font-variant-numeric:tabular-nums}
.sum span{color:var(--muted);font-size:13px}
.wrap{display:grid;grid-template-columns:minmax(90px,2fr) 3fr;gap:16px}
svg{display:block;width:100%}
polygon{fill:url(#fg);transition:opacity .14s}
svg.dim polygon:not(.on){opacity:.3}
ol{list-style:none;margin:0;padding:0;display:grid;grid-auto-rows:64px}
li{display:flex;flex-direction:column;justify-content:center;min-width:0;padding:0 10px;border-radius:var(--radius);transition:background .14s;cursor:default}
li:hover,li.on{background:var(--accent-soft)}
li:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.n{font-weight:600;overflow-wrap:anywhere}
.m{display:flex;flex-wrap:wrap;align-items:center;gap:0 8px;font-variant-numeric:tabular-nums;color:var(--muted);font-size:13px}
.m b{color:var(--text);font-size:14px}
.badge{padding:0 8px;border-radius:999px;background:var(--surface);border:1px solid var(--border);font-size:12px;color:var(--text)}
.badge.warn{background:var(--warn-soft);border-color:transparent}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
