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
          <path class="area" :d="c.area" /><path class="line" :d="c.line" /><circle class="end" :cx="c.endX" :cy="c.endY" r="3" />
        </template>
      </svg>
    </article>
  </div>
</template>

<style scoped>
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px; max-width: 900px; margin: 0 auto; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
.kpi { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.kpi small { color: var(--muted); font-size: .8125rem; }
.kpi strong { font-size: 1.6rem; font-weight: 600; line-height: 1.2; letter-spacing: -.01em; font-variant-numeric: tabular-nums; }
.good { --tone: var(--ok); --tone-soft: var(--ok-soft); } .bad { --tone: var(--err); --tone-soft: var(--err-soft); }
.delta { padding: 1px 8px; border-radius: 999px; font-size: .75rem; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--tone); background: var(--tone-soft); }
.spark { display: block; width: 100%; height: auto; margin-top: 10px; overflow: visible; color: var(--tone); }
.line { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.area { fill: currentColor; opacity: .12; }
.bar { fill: currentColor; opacity: .85; }
.end { fill: var(--surface); stroke: currentColor; stroke-width: 2; }
/* Tokens: ver pestaña HTML + CSS */
</style>
