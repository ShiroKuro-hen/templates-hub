<script setup lang="ts">
import { computed } from 'vue';

type Kpi = { label: string; data: number[]; goodWhenUp?: boolean; bars?: boolean };

const props = defineProps<{ items: Kpi[] }>();
const W = 120, H = 36, P = 4;

const cards = computed(() =>
  props.items.map((k) => {
    const d = k.data, min = Math.min(...d), max = Math.max(...d), first = d[0], last = d[d.length - 1];
    const X = (i: number) => P + (i * (W - 2 * P)) / (d.length - 1);
    const Y = (v: number) => P + (1 - (v - min) / (max - min || 1)) * (H - 2 * P);
    const pct = Math.round(((last - first) / first) * 100);
    const pts = d.map((v, i) => `${X(i)},${Y(v)}`).join(' L');
    const bw = (W - 2 * P) / d.length;
    return {
      ...k, first, last, pct,
      good: pct >= 0 === (k.goodWhenUp ?? true),
      line: `M${pts}`, area: `M${X(0)},${H} L${pts} L${X(d.length - 1)},${H}Z`,
      endX: X(d.length - 1), endY: Y(last),
      rects: d.map((v, i) => { const y = P + (1 - v / max) * (H - 2 * P); return { x: P + i * bw + 1, y, w: bw - 2, h: H - P - y }; }),
    };
  }),
);
</script>

<template>
  <div class="kpis">
    <article v-for="c in cards" :key="c.label" class="kpi" :class="c.good ? 'good' : 'bad'">
      <small>{{ c.label }}</small>
      <strong>{{ c.last }}</strong>
      <span class="delta">{{ c.pct >= 0 ? '▲' : '▼' }} {{ Math.abs(c.pct) }}%</span>
      <svg class="spark" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`Tendencia de ${c.label}: de ${c.first} a ${c.last}`">
        <template v-if="c.bars">
          <rect v-for="(r, i) in c.rects" :key="i" class="bar" :x="r.x" :y="r.y" :width="r.w" :height="r.h" rx="1.5" />
        </template>
        <template v-else>
          <path class="area" :d="c.area" /><path class="line" :d="c.line" /><circle class="end" :cx="c.endX" :cy="c.endY" r="3.5" />
        </template>
      </svg>
    </article>
  </div>
</template>

<style scoped>
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(148px, 1fr)); gap: 14px; max-width: 760px; margin: 0 auto; font: 14px/1.4 system-ui, sans-serif; color: #17130f; }
.kpi { display: flex; flex-direction: column; gap: 2px; padding: 14px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; }
.kpi small { color: #6b6258; font-weight: 600; }
.kpi strong { font-size: 1.7rem; line-height: 1.15; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.delta { font: 700 .8rem ui-monospace, monospace; }
.good .delta { color: #1a7f47; } .bad .delta { color: #d6293e; }
.spark { display: block; width: 100%; height: auto; margin-top: 8px; overflow: visible; }
.line { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.area { opacity: .18; }
.end { stroke: #17130f; stroke-width: 2; fill: #fffdf8; }
.good .line { stroke: #1f9d55; } .good .area, .good .bar { fill: #1f9d55; }
.bad .line { stroke: #d6293e; } .bad .area, .bad .bar { fill: #d6293e; }
</style>
