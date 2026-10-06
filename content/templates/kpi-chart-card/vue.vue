<script setup lang="ts">
type Kpi = {
  label: string; value: string; before: string; change: string; up: boolean;
  now: number[]; prev: number[]; // 0-100
};

withDefaults(defineProps<{ kpis?: Kpi[] }>(), {
  kpis: () => [
    { label: 'Ingresos', value: '48.920 €', before: '42.150 €', change: '+16,1 %', up: true,
      now: [40, 48, 45, 60, 58, 72, 80], prev: [38, 42, 40, 50, 48, 55, 58] },
    { label: 'Pedidos', value: '1.284', before: '1.339', change: '−4,1 %', up: false,
      now: [60, 55, 62, 50, 52, 45, 48], prev: [58, 60, 64, 58, 60, 58, 62] },
    { label: 'Visitantes', value: '31.240', before: '29.780', change: '+4,9 %', up: true,
      now: [50, 52, 49, 55, 57, 56, 63], prev: [50, 50, 51, 50, 52, 51, 52] },
  ],
});

const pts = (a: number[]) =>
  a.map((v, i) => `${(i * 120) / (a.length - 1)},${(38 - v * 0.36).toFixed(1)}`).join(' ');
</script>

<template>
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <linearGradient id="kg"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient>
    </defs>
  </svg>
  <section class="kc" aria-labelledby="kc-t">
    <h2 id="kc-t">Rendimiento de octubre</h2>
    <p class="sub">Últimos 30 días frente a los 30 anteriores.</p>
    <div class="cards">
      <article v-for="k in kpis" :key="k.label" class="card">
        <h3>{{ k.label }}</h3>
        <p class="v">{{ k.value }}</p>
        <p class="cmp"><span class="delta" :class="k.up ? 'up' : 'down'">{{ k.change }}</span> frente a {{ k.before }}</p>
        <svg class="spark" viewBox="0 0 120 40" preserveAspectRatio="none" role="img"
             :aria-label="`${k.label} ${k.up ? 'al alza' : 'a la baja'} respecto al periodo anterior`">
          <polyline class="prev" :points="pts(k.prev)" />
          <polyline class="cur" stroke="url(#kg)" :points="pts(k.now)" />
        </svg>
      </article>
    </div>
    <p class="key">Línea de color: este periodo. Línea discontinua: periodo anterior.</p>
  </section>
</template>

<style scoped>
.kc{color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:18px;font-weight:600}
.sub{margin:2px 0 0;color:var(--muted)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin:16px 0 12px}
.card{padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.card h3{margin:0;font-size:14px;font-weight:500;color:var(--muted)}
.v{margin:4px 0 0;font-size:28px;font-weight:600;line-height:1.2;font-variant-numeric:tabular-nums}
.cmp{margin:6px 0 12px;display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;color:var(--muted);font-variant-numeric:tabular-nums}
.delta{font-size:12px;font-weight:600;padding:1px 8px;border-radius:999px}
.up{color:var(--ok);background:var(--ok-soft)}
.down{color:var(--err);background:var(--err-soft)}
svg.spark{display:block;width:100%;height:48px;overflow:visible}
.cur,.prev{fill:none;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.cur{stroke-width:2}
.prev{stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3}
.key{margin:0;color:var(--muted);font-size:12px}
/* Tokens: ver pestaña HTML + CSS */
</style>
