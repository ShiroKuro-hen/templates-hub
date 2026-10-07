<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const series = [{ n: 'Ingresos', c: '--accent' }, { n: 'Costos', c: '--info' }, { n: 'Margen', c: '--ok' }];
const data: [string, number[]][] = [['T1', [120, 78, 42]], ['T2', [138, 84, 54]], ['T3', [126, 90, 36]], ['T4', [152, 96, 56]]];
const H = 260, L = 36, R = 8, T = 12, B = 28, MAX = 160;
const svg = ref<SVGSVGElement>();
const W = ref(480);
const on = ref([0, 1, 2]);
const g = ref<number | null>(null);
let ro: ResizeObserver;
onMounted(() => { ro = new ResizeObserver(([e]) => (W.value = e.contentRect.width || 480)); ro.observe(svg.value!); });
onUnmounted(() => ro.disconnect());

const gw = computed(() => (W.value - L - R) / data.length);
const bw = computed(() => Math.min(28, (gw.value * 0.72 - 4 * (on.value.length - 1)) / on.value.length));
const y = (v: number) => T + (H - T - B) * (1 - v / MAX);
const off = computed(() => (gw.value - bw.value * on.value.length - 4 * (on.value.length - 1)) / 2);
const toggle = (i: number) => {
  if (!on.value.includes(i)) on.value = [...on.value, i].sort();
  else if (on.value.length > 1) on.value = on.value.filter((x) => x !== i);
};
const label = (l: string, v: number[]) => `${l}: ${on.value.map((i) => `${series[i].n} ${v[i]}`).join(', ')}`;
const tipX = computed(() => Math.min(Math.max(L + ((g.value ?? 0) + 0.5) * gw.value, 80), W.value - 80));
</script>

<template>
  <figure class="card" @keydown.esc="g = null">
    <figcaption class="head">
      <div><h2>Ingresos, costos y margen por trimestre</h2><p>Miles de USD, año fiscal 2025</p></div>
      <div class="legend" role="group" aria-label="Series visibles">
        <button v-for="(s, i) in series" :key="s.n" type="button" :aria-pressed="on.includes(i)" @click="toggle(i)">
          <i class="sw" :style="{ background: `var(${s.c})` }" />{{ s.n }}
        </button>
      </div>
    </figcaption>
    <div class="plot">
      <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" role="group" aria-label="Barras agrupadas por trimestre" @pointerleave="g = null">
        <g v-for="t in [0, 40, 80, 120, 160]" :key="t">
          <line class="gl" :x1="L" :x2="W - R" :y1="y(t)" :y2="y(t)" />
          <text class="ax" :x="L - 6" :y="y(t) + 4" text-anchor="end">{{ t }}</text>
        </g>
        <g v-for="([l, v], k) in data" :key="l">
          <g class="grp" tabindex="0" role="img" :aria-label="label(l, v)" @pointerover="g = k" @focus="g = k" @blur="g = null">
            <rect class="hit" :x="L + k * gw" :y="T" :width="gw" :height="H - T - B" rx="4" />
            <rect v-for="(i, j) in on" :key="i" :x="L + k * gw + off + j * (bw + 4)" :y="y(v[i])" :width="bw" :height="y(0) - y(v[i])" rx="2" :style="{ fill: `var(${series[i].c})` }" />
          </g>
          <text class="ax" :x="L + k * gw + gw / 2" :y="H - 8" text-anchor="middle">{{ l }}</text>
        </g>
      </svg>
      <div v-if="g !== null" class="tip" :style="{ left: tipX + 'px' }">
        <b>{{ data[g][0] }}</b>
        <div v-for="i in on" :key="i"><span><i class="sw" :style="{ background: `var(${series[i].c})` }" />{{ series[i].n }}</span><b>{{ data[g][1][i] }}</b></div>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.card{margin:0;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-bottom:16px}
h2{margin:0;font-size:16px;font-weight:600}
h2::before{content:"";display:inline-block;width:8px;height:8px;margin-right:8px;border-radius:2px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.head p{margin:2px 0 0;color:var(--muted)}
.legend{display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px}
.legend button{display:inline-flex;align-items:center;gap:8px;font:inherit;padding:4px 12px;border:1px solid var(--border);border-radius:999px;background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s,color .14s}
.legend button:hover{background:var(--accent-soft)}
.legend button[aria-pressed=false]{color:var(--muted);background:transparent}
.legend button[aria-pressed=false] .sw{opacity:.3}
.sw{display:inline-block;width:10px;height:10px;border-radius:3px}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.plot{position:relative}
svg{display:block;width:100%;height:260px;overflow:visible}
.gl{stroke:var(--border);stroke-width:1}
.ax{fill:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.hit{fill:transparent;transition:fill .14s}
.grp{outline:none}
.grp:hover .hit{fill:var(--accent-soft)}
.grp:focus .hit{fill:var(--accent-soft);stroke:var(--accent);stroke-width:1}
.tip{position:absolute;top:0;transform:translateX(-50%);min-width:150px;padding:8px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);pointer-events:none;font-size:13px}
.tip>b{display:block;margin-bottom:4px}
.tip div{display:flex;justify-content:space-between;gap:16px;font-variant-numeric:tabular-nums}
.tip .sw{margin-right:6px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
