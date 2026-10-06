<script setup lang="ts">
import { computed } from 'vue';

type Item = { label: string; value: number };
const props = withDefaults(defineProps<{ data?: Item[]; title?: string; subtitle?: string }>(), {
  data: () => [
    { label: 'Plan Pro mensual', value: 980 },
    { label: 'Plan Pro anual', value: 1840 },
    { label: 'Soporte prioritario', value: 388 },
    { label: 'Plan Team', value: 1325 },
    { label: 'Almacenamiento extra', value: 612 },
  ],
  title: 'Productos más vendidos',
  subtitle: 'Unidades vendidas en septiembre de 2026',
});
const ROW = 46;
const fmt = new Intl.NumberFormat('es');
const rows = computed(() => [...props.data].sort((a, b) => b.value - a.value));
const max = computed(() => rows.value[0]?.value || 1);
const resumen = computed(() => rows.value.map((r, i) => `${i + 1}, ${r.label}, ${fmt.format(r.value)} unidades`).join('; '));
</script>

<template>
  <figure>
    <figcaption><strong>{{ title }}</strong><span>{{ subtitle }}</span></figcaption>
    <svg width="100%" :height="rows.length * ROW - 12" role="img" :aria-label="`Ranking de ventas: ${resumen}`">
      <defs>
        <linearGradient id="ion-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient>
      </defs>
      <g v-for="(r, i) in rows" :key="r.label">
        <text class="label" x="0" :y="i * ROW + 14"><tspan class="rank">{{ i + 1 }}&nbsp;&nbsp;</tspan>{{ r.label }}</text>
        <text class="val" x="100%" :y="i * ROW + 14">{{ fmt.format(r.value) }}</text>
        <rect class="track" x="0" :y="i * ROW + 22" width="100%" height="10" rx="5" />
        <rect class="bar" :class="{ top: i === 0 }" x="0" :y="i * ROW + 22" :width="`${(r.value / max) * 100}%`" height="10" rx="5" />
      </g>
    </svg>
  </figure>
</template>

<style scoped>
figure{margin:0;padding:16px 20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
figcaption{margin-bottom:12px}
figcaption strong{display:block;font-size:15px;font-weight:600}
figcaption span{color:var(--muted)}
svg{display:block;overflow:visible}
.label{fill:var(--text);font-size:13px}
.rank{fill:var(--muted);font-variant-numeric:tabular-nums}
.val{fill:var(--text);font-size:13px;font-weight:600;text-anchor:end;font-variant-numeric:tabular-nums}
.track{fill:var(--accent-soft)}
.bar{fill:var(--accent)}
.bar.top{fill:url(#ion-h)}
/* Tokens: ver pestaña HTML + CSS */
</style>
