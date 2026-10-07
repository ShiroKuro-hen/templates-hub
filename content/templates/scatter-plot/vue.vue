<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

type Punto = [string, number, number, number]; // nombre, gasto (miles USD), clientes nuevos, canal
const grupos = [{ n: 'Búsqueda', c: '--accent' }, { n: 'Redes sociales', c: '--info' }, { n: 'Correo', c: '--ok' }];
const puntos: Punto[] = ([
  ['Marca', 14, 52, 0], ['Competencia', 28, 88, 0], ['Genéricas', 45, 118, 0], ['Remarketing', 62, 170, 0], ['Shopping', 78, 196, 0],
  ['Reels', 10, 24, 1], ['Anuncios en feed', 26, 46, 1], ['Influencers', 44, 64, 1], ['Comunidad', 58, 92, 1], ['Video largo', 84, 104, 1],
  ['Bienvenida', 6, 48, 2], ['Carrito abandonado', 12, 92, 2], ['Boletín mensual', 20, 70, 2], ['Reactivación', 32, 110, 2],
] as Punto[]).sort((a, b) => a[1] - b[1]);
const H = 320, L = 48, R = 12, T = 12, B = 44;
const svg = ref<SVGSVGElement>();
const W = ref(560);
const on = ref([0, 1, 2]);
const cur = ref(0);
const tip = ref(-1);
let ro: ResizeObserver;
onMounted(() => { ro = new ResizeObserver(([e]) => (W.value = e.contentRect.width || 560)); ro.observe(svg.value!); });
onUnmounted(() => ro.disconnect());

const v = computed(() => puntos.filter((p) => on.value.includes(p[3])));
const x = (n: number) => L + ((W.value - L - R) * n) / 100;
const y = (n: number) => T + (H - T - B) * (1 - n / 200);
const sel = computed(() => (tip.value >= 0 ? v.value[tip.value] : null));
const tr = computed(() => {
  const d = v.value, n = d.length, sx = d.reduce((a, p) => a + p[1], 0), sy = d.reduce((a, p) => a + p[2], 0);
  const m = (n * d.reduce((a, p) => a + p[1] * p[2], 0) - sx * sy) / (n * d.reduce((a, p) => a + p[1] ** 2, 0) - sx ** 2), b = (sy - m * sx) / n;
  return { n, f: (px: number) => y(m * px + b) };
});
const toggle = (i: number) => {
  if (!on.value.includes(i)) on.value = [...on.value, i];
  else if (on.value.length > 1) on.value = on.value.filter((k) => k !== i);
};
const onKey = (e: KeyboardEvent, i: number) => {
  const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
  if (e.key === 'Escape') tip.value = -1;
  if (!d) return;
  e.preventDefault();
  (svg.value!.querySelector(`circle[data-i="${i + d}"]`) as SVGElement | null)?.focus();
};
</script>

<template>
  <figure class="card">
    <figcaption class="head">
      <div><h2>Gasto frente a clientes nuevos</h2><p>Cada punto es una campaña del primer semestre.</p></div>
      <div class="legend" role="group" aria-label="Canales visibles">
        <button v-for="(g, i) in grupos" :key="g.n" type="button" :aria-pressed="on.includes(i)" @click="toggle(i)">
          <i class="sw" :style="{ background: `var(${g.c})` }" />{{ g.n }}
        </button>
        <span class="tr"><i />Tendencia</span>
      </div>
    </figcaption>
    <div class="plot">
      <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" role="group" aria-label="Diagrama de dispersión de gasto y clientes nuevos" @pointerleave="tip = -1">
        <defs><linearGradient id="tg"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
        <g v-for="t in [0, 50, 100, 150, 200]" :key="'y' + t"><line class="gl" :x1="L" :x2="W - R" :y1="y(t)" :y2="y(t)" /><text class="ax" :x="L - 8" :y="y(t) + 4" text-anchor="end">{{ t }}</text></g>
        <g v-for="t in [0, 20, 40, 60, 80, 100]" :key="'x' + t"><line class="gl" :x1="x(t)" :x2="x(t)" :y1="T" :y2="H - B" /><text class="ax" :x="x(t)" :y="H - B + 18" text-anchor="middle">{{ t }}</text></g>
        <text class="at" :x="L + (W - L - R) / 2" :y="H - 6" text-anchor="middle">Gasto en marketing (miles de USD)</text>
        <text class="at" :transform="`translate(12 ${T + (H - T - B) / 2}) rotate(-90)`" text-anchor="middle">Clientes nuevos</text>
        <line v-if="tr.n > 2" :x1="x(v[0][1])" :y1="tr.f(v[0][1])" :x2="x(v[tr.n - 1][1])" :y2="tr.f(v[tr.n - 1][1])" stroke="url(#tg)" stroke-width="2" stroke-linecap="round" />
        <circle v-for="(p, i) in v" :key="p[0]" class="p" :data-i="i" :cx="x(p[1])" :cy="y(p[2])" r="6" :tabindex="i === Math.min(cur, tr.n - 1) ? 0 : -1" role="img"
                :aria-label="`${p[0]}, ${grupos[p[3]].n}: gasto ${p[1]} mil USD, ${p[2]} clientes nuevos`" :style="{ fill: `var(${grupos[p[3]].c})` }"
                @pointerover="tip = i" @focus="cur = i; tip = i" @blur="tip = -1" @keydown="onKey($event, i)" />
      </svg>
      <div v-if="sel" class="tip" :class="{ below: y(sel[2]) < 110 }" :style="{ left: Math.min(Math.max(x(sel[1]), 80), W - 80) + 'px', top: y(sel[2]) + 'px' }">
        <b>{{ sel[0] }}</b>
        <div><span>Canal</span><span>{{ grupos[sel[3]].n }}</span></div>
        <div><span>Gasto</span><span>{{ sel[1] }} mil USD</span></div>
        <div><span>Clientes nuevos</span><span>{{ sel[2] }}</span></div>
      </div>
    </div>
    <p class="hint">Usa Tab para entrar en el gráfico y las flechas para moverte entre campañas.</p>
  </figure>
</template>

<style scoped>
.card{margin:0;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-bottom:16px}
h2{margin:0;font-size:16px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.legend{display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px}
.legend button,.legend .tr{display:inline-flex;align-items:center;gap:8px;font:inherit;padding:4px 12px;border:1px solid var(--border);border-radius:999px;background:var(--surface);color:var(--text)}
.legend button{cursor:pointer;transition:background .14s,color .14s}
.legend button:hover{background:var(--accent-soft)}
.legend button[aria-pressed=false]{color:var(--muted);background:transparent}
.legend button[aria-pressed=false] .sw{opacity:.3}
.legend .tr{color:var(--muted);border-style:dashed}
.sw{display:inline-block;width:10px;height:10px;border-radius:50%}
.tr i{width:16px;height:3px;border-radius:2px;background:linear-gradient(90deg,#22d3ee,#2f5bff)}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.plot{position:relative}
svg{display:block;width:100%;height:320px;overflow:visible}
.gl{stroke:var(--border);stroke-width:1}
.ax{fill:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.at{fill:var(--text);font-size:12px;font-weight:600}
circle.p{stroke:var(--surface);stroke-width:1.5;fill-opacity:.85;cursor:pointer;outline:none;transition:r .12s}
circle.p:hover,circle.p:focus{r:8;stroke:var(--text);stroke-width:2}
.tip{position:absolute;min-width:150px;padding:8px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);pointer-events:none;font-size:13px;transform:translate(-50%,calc(-100% - 14px))}
.tip.below{transform:translate(-50%,14px)}
.tip>b{display:block}
.tip div{display:flex;justify-content:space-between;gap:16px;color:var(--muted);font-variant-numeric:tabular-nums}
.tip div span:last-child{color:var(--text)}
.hint{margin:12px 0 0;color:var(--muted);font-size:13px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
