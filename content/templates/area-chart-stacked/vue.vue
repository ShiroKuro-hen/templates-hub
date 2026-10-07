<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const series = [
  { n: 'Escritorio', c: '--accent', d: [42, 45, 48, 46, 52, 55, 58, 61] },
  { n: 'Móvil', c: '--info', d: [30, 34, 39, 44, 48, 53, 57, 64] },
  { n: 'Tablet', c: '--ok', d: [8, 9, 9, 10, 11, 11, 12, 13] },
];
const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];
const H = 280, L = 40, R = 12, T = 12, B = 28, N = months.length - 1;
const svg = ref<SVGSVGElement>();
const W = ref(560);
const on = ref([0, 1, 2]);
const idx = ref(-1);
let ro: ResizeObserver;
onMounted(() => { ro = new ResizeObserver(([e]) => (W.value = e.contentRect.width || 560)); ro.observe(svg.value!); });
onUnmounted(() => ro.disconnect());

const x = (i: number) => L + (i * (W.value - L - R)) / N;
const total = (i: number) => on.value.reduce((a, s) => a + series[s].d[i], 0);
const max = computed(() => Math.ceil(Math.max(...months.map((_, i) => total(i))) / 40) * 40);
const y = (n: number) => T + (H - T - B) * (1 - n / max.value);
const ticks = computed(() => Array.from({ length: max.value / 40 + 1 }, (_, k) => k * 40));
const areas = computed(() => {
  let base = months.map(() => 0);
  return on.value.map((s) => {
    const top = base.map((b, i) => b + series[s].d[i]);
    const up = top.map((n, i) => `${x(i)},${y(n)}`), dn = base.map((n, i) => `${x(i)},${y(n)}`).reverse();
    base = top;
    return { s, up: up.join(' '), all: [...up, ...dn].join(' ') };
  });
});
const toggle = (i: number) => {
  if (!on.value.includes(i)) on.value = [...on.value, i].sort();
  else if (on.value.length > 1) on.value = on.value.filter((v) => v !== i);
};
const onKey = (e: KeyboardEvent) => {
  const k: Record<string, number> = { ArrowRight: Math.min(N, idx.value + 1), ArrowLeft: Math.max(0, idx.value < 0 ? 0 : idx.value - 1), Home: 0, End: N, Escape: -1 };
  if (e.key in k) { e.preventDefault(); idx.value = k[e.key]; }
};
const onMove = (e: PointerEvent) => {
  const r = svg.value!.getBoundingClientRect();
  idx.value = Math.max(0, Math.min(N, Math.round((e.clientX - r.left - L) / ((W.value - L - R) / N))));
};
const live = computed(() => idx.value < 0 ? '' : `${months[idx.value]}: ${on.value.map((s) => `${series[s].n} ${series[s].d[idx.value]}`).join(', ')}. Total ${total(idx.value)}.`);
</script>

<template>
  <figure class="card">
    <figcaption class="head">
      <div><h2>Sesiones por dispositivo</h2><p>Miles de sesiones al mes, de enero a agosto</p></div>
      <div class="legend" role="group" aria-label="Series visibles">
        <button v-for="(s, i) in series" :key="s.n" type="button" :aria-pressed="on.includes(i)" @click="toggle(i)">
          <i class="sw" :style="{ background: `var(${s.c})` }" />{{ s.n }}
        </button>
      </div>
    </figcaption>
    <div class="plot">
      <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" tabindex="0" role="img" aria-label="Áreas apiladas de sesiones por dispositivo. Usa las flechas izquierda y derecha para explorar los meses."
           @keydown="onKey" @pointermove="onMove" @pointerleave="idx = -1" @blur="idx = -1">
        <defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
        <g v-for="t in ticks" :key="t"><line class="gl" :x1="L" :x2="W - R" :y1="y(t)" :y2="y(t)" /><text class="ax" :x="L - 6" :y="y(t) + 4" text-anchor="end">{{ t }}</text></g>
        <g v-for="a in areas" :key="a.s">
          <polygon :points="a.all" :style="{ fill: `var(${series[a.s].c})`, fillOpacity: 0.35 }" />
          <polyline :points="a.up" fill="none" stroke-width="2" :style="{ stroke: `var(${series[a.s].c})` }" />
        </g>
        <text v-for="(m, i) in months" :key="m" class="ax" :x="x(i)" :y="H - 8" text-anchor="middle">{{ m }}</text>
        <rect v-if="idx >= 0" :x="x(idx) - 0.75" :y="T" width="1.5" :height="H - T - B" fill="url(#cg)" />
      </svg>
      <div v-if="idx >= 0" class="tip" :style="{ left: Math.min(Math.max(x(idx), 90), W - 90) + 'px' }">
        <b>{{ months[idx] }}</b>
        <div v-for="s in [...on].reverse()" :key="s"><span><i class="sw" :style="{ background: `var(${series[s].c})` }" />{{ series[s].n }}</span><span>{{ series[s].d[idx] }}</span></div>
        <div class="tot"><span>Total</span><span>{{ total(idx) }}</span></div>
      </div>
    </div>
    <p class="sr" aria-live="polite">{{ live }}</p>
  </figure>
</template>

<style scoped>
.card{margin:0;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-bottom:16px}
h2{margin:0;font-size:16px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.legend{display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px}
.legend button{display:inline-flex;align-items:center;gap:8px;font:inherit;padding:4px 12px;border:1px solid var(--border);border-radius:999px;background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s,color .14s}
.legend button:hover{background:var(--accent-soft)}
.legend button[aria-pressed=false]{color:var(--muted);background:transparent}
.legend button[aria-pressed=false] .sw{opacity:.3}
.sw{display:inline-block;width:10px;height:10px;border-radius:3px}
button:focus-visible,svg:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.plot{position:relative}
svg{display:block;width:100%;height:280px;overflow:visible;border-radius:4px}
.gl{stroke:var(--border);stroke-width:1}
.ax{fill:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.tip{position:absolute;top:0;transform:translateX(-50%);min-width:160px;padding:8px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);pointer-events:none;font-size:13px}
.tip>b{display:block;margin-bottom:4px}
.tip div{display:flex;justify-content:space-between;gap:16px;font-variant-numeric:tabular-nums}
.tip .sw{margin-right:6px}
.tip .tot{margin-top:4px;padding-top:4px;border-top:1px solid var(--border);font-weight:600}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
