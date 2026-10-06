<script setup lang="ts">
import { computed, ref } from 'vue';

type Point = { x: string; y: number };

const props = withDefaults(defineProps<{ data?: Point[]; title?: string; unit?: string; step?: number }>(), {
  title: 'Pedidos mensuales, 2026', unit: 'pedidos', step: 100,
  data: () => [
    { x: 'Ene', y: 120 }, { x: 'Feb', y: 150 }, { x: 'Mar', y: 135 }, { x: 'Abr', y: 190 },
    { x: 'May', y: 220 }, { x: 'Jun', y: 205 }, { x: 'Jul', y: 260 }, { x: 'Ago', y: 310 },
    { x: 'Sep', y: 290 }, { x: 'Oct', y: 340 }, { x: 'Nov', y: 380 }, { x: 'Dic', y: 420 },
  ],
});
const W = 420, H = 220, L = 34, R = 14, T = 14, B = 26;
const cur = ref<number | null>(null);
const max = computed(() => Math.ceil(Math.max(...props.data.map((d) => d.y)) / props.step) * props.step);
const X = (i: number) => L + (i * (W - L - R)) / (props.data.length - 1);
const Y = (v: number) => T + (1 - v / max.value) * (H - T - B);
const pts = computed(() => props.data.map((d, i) => `${X(i)},${Y(d.y)}`));
const ticks = computed(() => Array.from({ length: max.value / props.step + 1 }, (_, k) => k * props.step));
const tip = computed(() => cur.value === null ? null : {
  left: `${Math.min(Math.max((X(cur.value) / W) * 100, 14), 86)}%`,
  top: `${(Y(props.data[cur.value].y) / H) * 100}%`,
  transform: 'translate(-50%, calc(-100% - 12px))',
});
function onMove(e: PointerEvent) {
  const r = (e.currentTarget as SVGElement).getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * W;
  cur.value = Math.min(props.data.length - 1, Math.max(0, Math.round((x - L) / ((W - L - R) / (props.data.length - 1)))));
}
</script>

<template>
  <section class="card" aria-labelledby="line-title">
    <header><h2 id="line-title">{{ title }}</h2></header>
    <div class="plot">
      <svg :viewBox="`0 0 ${W} ${H}`" role="group" :aria-label="`Gráfico de líneas: ${title}`" @pointermove="onMove" @pointerleave="cur = null">
        <g class="grid axis">
          <g v-for="v in ticks" :key="v"><line :x1="L" :x2="W - R" :y1="Y(v)" :y2="Y(v)" /><text :x="L - 6" :y="Y(v) + 3.5" text-anchor="end">{{ v }}</text></g>
        </g>
        <g class="axis"><text v-for="(d, i) in data" :key="d.x" :x="X(i)" :y="H - 8" text-anchor="middle">{{ d.x }}</text></g>
        <path class="area" :d="`M${X(0)},${Y(0)} L${pts.join(' L')} L${X(data.length - 1)},${Y(0)}Z`" />
        <path class="line" :d="`M${pts.join(' L')}`" pathLength="1" />
        <line v-if="cur !== null" class="guide" :x1="X(cur)" :x2="X(cur)" :y1="T" :y2="Y(0)" />
        <circle v-for="(d, i) in data" :key="d.x" class="pt" :class="{ on: cur === i }" :cx="X(i)" :cy="Y(d.y)" r="4" tabindex="0" role="img"
          :aria-label="`${d.x}: ${d.y} ${unit}`" @focus="cur = i" @blur="cur = null" />
      </svg>
      <div v-if="tip" class="tip" role="status" :style="tip">{{ data[cur!].x }}<b>{{ data[cur!].y }} {{ unit }}</b></div>
    </div>
  </section>
</template>

<style scoped>
.card{max-width:620px;margin:0 auto;padding:20px 20px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:var(--shadow)}
h2{margin:0 0 8px;font-size:16px;font-weight:600}
.plot{position:relative}
svg{display:block;width:100%;height:auto;touch-action:pan-y}
.grid line{stroke:var(--border)}
.axis text{fill:var(--muted);font:10px system-ui,-apple-system,"Segoe UI",sans-serif}
.area{fill:var(--accent);fill-opacity:.1}
.line{fill:none;stroke:var(--accent);stroke-width:2.5;stroke-linejoin:round;stroke-linecap:round}
.pt{fill:var(--surface);stroke:var(--accent);stroke-width:2;cursor:pointer;transition:r .12s}
.pt.on{fill:var(--accent);r:6}
.pt:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.guide{stroke:var(--muted);stroke-width:1;stroke-dasharray:4 3}
.tip{position:absolute;pointer-events:none;padding:6px 10px;border-radius:var(--radius);background:var(--text);color:var(--surface);font-size:12px;line-height:1.25;white-space:nowrap;box-shadow:var(--shadow)}
.tip b{display:block;font-size:14px;font-variant-numeric:tabular-nums}
@media(prefers-reduced-motion:reduce){.pt{transition:none}}
/* Tokens: ver pestaña HTML + CSS */
</style>
