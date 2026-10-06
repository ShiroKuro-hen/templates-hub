<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type Series = { key: string; label: string; color: string };
type Row = { mes: string; [serie: string]: number | string };

const props = withDefaults(defineProps<{ data?: Row[]; series?: Series[] }>(), {
  series: () => [
    { key: 'web', label: 'Web', color: 'var(--accent)' },
    { key: 'app', label: 'App móvil', color: 'var(--info)' },
    { key: 'tienda', label: 'Tienda física', color: 'var(--ok)' },
  ],
  data: () => [
    { mes: 'Ene', web: 42, app: 28, tienda: 12 }, { mes: 'Feb', web: 38, app: 31, tienda: 14 },
    { mes: 'Mar', web: 51, app: 35, tienda: 11 }, { mes: 'Abr', web: 47, app: 40, tienda: 15 },
    { mes: 'May', web: 56, app: 44, tienda: 13 }, { mes: 'Jun', web: 61, app: 49, tienda: 16 },
  ],
});
const BASE = 222, H = 196;
const val = (d: Row, k: string) => Number(d[k]);
const total = (d: Row) => props.series.reduce((sum, s) => sum + val(d, s.key), 0);
const max = computed(() => Math.ceil(Math.max(...props.data.map(total)) / 50) * 50);
const k = computed(() => H / max.value);
const ticks = computed(() => Array.from({ length: max.value / 50 }, (_, j) => (j + 1) * 50));
// Segmentos precalculados: posición en % (x, ancho) y px (y, alto).
const bars = computed(() => props.data.map((d, i) => {
  let y = BASE;
  const segs = props.series.map((s) => { const h = val(d, s.key) * k.value; y -= h; return { s, y, h }; });
  return { d, i, segs, top: y, x: `${((i + 0.25) / props.data.length) * 100}%`, w: `${(0.5 / props.data.length) * 100}%`, cx: `${((i + 0.5) / props.data.length) * 100}%` };
}));

const plot = ref<HTMLElement>();
const tip = ref<{ i: number; s: Series; left: number; top: number } | null>(null);
function show(e: Event, i: number, s: Series) {
  const r = (e.currentTarget as Element).getBoundingClientRect(), p = plot.value!.getBoundingClientRect();
  tip.value = { i, s, left: Math.min(Math.max(r.left - p.left + r.width / 2, 90), p.width - 90), top: r.top - p.top };
}
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') tip.value = null; };
onMounted(() => document.addEventListener('keydown', onKey));
onBeforeUnmount(() => document.removeEventListener('keydown', onKey));
</script>

<template>
  <figure>
    <figcaption><strong>Pedidos por canal</strong><span>Primer semestre de 2026, en miles de pedidos</span></figcaption>
    <ul class="legend"><li v-for="s in series" :key="s.key" :style="{ '--c': s.color }"><i />{{ s.label }}</li></ul>
    <div ref="plot" class="plot">
      <svg width="100%" height="250" role="group" aria-label="Pedidos por canal y mes. Recorre las barras con Tab.">
        <line v-for="v in ticks" :key="v" class="grid" x1="0" x2="100%" :y1="BASE - v * k" :y2="BASE - v * k" />
        <g v-for="b in bars" :key="b.d.mes">
          <rect v-for="g in b.segs" :key="g.s.key" class="seg" tabindex="0" role="img" :x="b.x" :y="g.y" :width="b.w" :height="g.h"
                :style="{ fill: g.s.color }" :aria-label="`${b.d.mes}, ${g.s.label}: ${val(b.d, g.s.key)} mil`"
                @pointerover="show($event, b.i, g.s)" @focus="show($event, b.i, g.s)" @pointerout="tip = null" @blur="tip = null" />
          <text class="total" :x="b.cx" :y="b.top - 6">{{ total(b.d) }}</text>
          <text class="tick" :x="b.cx" :y="BASE + 20">{{ b.d.mes }}</text>
        </g>
        <line class="axis" x1="0" x2="100%" :y1="BASE" :y2="BASE" />
      </svg>
      <div v-if="tip" class="tip" role="tooltip" :style="{ left: tip.left + 'px', top: tip.top + 'px' }">
        {{ tip.s.label }}: <b>{{ val(data[tip.i], tip.s.key) }} mil</b>
        <span>{{ data[tip.i].mes }}, total {{ total(data[tip.i]) }} mil</span>
      </div>
    </div>
  </figure>
</template>

<style scoped>
figure{margin:0;padding:16px 20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
figcaption strong{display:block;font-size:15px;font-weight:600}
figcaption span{color:var(--muted)}
.legend{display:flex;flex-wrap:wrap;gap:6px 20px;margin:12px 0 4px;padding:0;list-style:none;color:var(--muted);font-size:13px}
.legend li{display:flex;align-items:center;gap:8px}
.legend i{width:10px;height:10px;border-radius:3px;background:var(--c)}
.plot{position:relative}
svg{display:block;overflow:visible}
.grid{stroke:var(--border);stroke-dasharray:2 4}
.axis{stroke:var(--border)}
.seg{stroke:var(--surface);stroke-width:1;cursor:pointer;transition:opacity .14s}
.seg:hover{opacity:.85}
.seg:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.total{fill:var(--text);font-size:12px;font-weight:600;text-anchor:middle;font-variant-numeric:tabular-nums}
.tick{fill:var(--muted);font-size:12px;text-anchor:middle}
.tip{position:absolute;z-index:5;padding:8px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font-size:13px;white-space:nowrap;pointer-events:none;transform:translate(-50%,calc(-100% - 8px));overflow:hidden}
.tip::before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.tip b{font-variant-numeric:tabular-nums}
.tip span{display:block;color:var(--muted);font-size:12px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
