<script setup lang="ts">
type Metric = { label: string; value: number }; // value: 0-100

const props = withDefaults(defineProps<{ data?: Metric[]; warn?: number; crit?: number }>(), {
  data: () => [
    { label: 'CPU', value: 64 },
    { label: 'Memoria', value: 78 },
    { label: 'Disco', value: 93 },
  ],
  warn: 70,
  crit: 90,
});

// 0 % = izquierda, 100 % = derecha, centro en (100,100)
const pt = (v: number, r: number) => {
  const a = Math.PI * (1 - v / 100);
  return [100 + r * Math.cos(a), 100 - r * Math.sin(a)].map((n) => n.toFixed(1));
};
const arc = (from: number, to: number, r: number) => {
  const [x1, y1] = pt(from, r), [x2, y2] = pt(to, r);
  return `M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`;
};
const state = (v: number) => (v >= props.crit ? ['err', 'Crítico'] : v >= props.warn ? ['warn', 'Atención'] : ['ok', 'Normal']);
</script>

<template>
  <figure>
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs><linearGradient id="ion" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
    </svg>
    <figcaption><strong>Uso de recursos</strong><span>Clúster de producción, últimos 5 minutos</span></figcaption>
    <div class="grid">
      <div v-for="d in data" :key="d.label" class="gauge">
        <svg viewBox="0 0 200 112" role="img" :aria-label="`${d.label}: ${d.value} %, estado ${state(d.value)[1].toLowerCase()}`">
          <path class="band ok" :d="arc(0, warn, 92)" />
          <path class="band warn" :d="arc(warn, crit, 92)" />
          <path class="band err" :d="arc(crit, 100, 92)" />
          <path class="track" :d="arc(0, 100, 76)" />
          <path class="value" :d="arc(0, d.value, 76)" />
          <text class="num" x="100" y="98">{{ d.value }}%</text>
        </svg>
        <p>{{ d.label }} <span class="chip" :class="state(d.value)[0]">{{ state(d.value)[1] }}</span></p>
      </div>
    </div>
    <ul class="legend">
      <li style="--c:var(--ok)"><i />Normal, menos de {{ warn }} %</li>
      <li style="--c:var(--warn)"><i />Atención, de {{ warn }} a {{ crit - 1 }} %</li>
      <li style="--c:var(--err)"><i />Crítico, {{ crit }} % o más</li>
    </ul>
  </figure>
</template>

<style scoped>
figure{margin:0;padding:16px 20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
figcaption strong{display:block;font-size:15px;font-weight:600}
figcaption span{color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin:16px 0}
.gauge svg{display:block;width:100%;max-width:240px;margin:0 auto}
.gauge p{display:flex;align-items:center;justify-content:center;gap:8px;margin:4px 0 0;font-weight:500}
.track,.value,.band{fill:none}
.track{stroke:var(--border);stroke-width:12;stroke-linecap:round}
.value{stroke:url(#ion);stroke-width:12;stroke-linecap:round}
.band{stroke-width:3}
.band.ok{stroke:var(--ok)} .band.warn{stroke:var(--warn)} .band.err{stroke:var(--err)}
.num{fill:var(--text);font-size:30px;font-weight:600;text-anchor:middle;font-variant-numeric:tabular-nums}
.chip{display:inline-flex;align-items:center;gap:6px;padding:1px 8px;border-radius:999px;font-size:12px;font-weight:600}
.chip::before{content:"";width:6px;height:6px;border-radius:999px;background:var(--c)}
.chip.ok{--c:var(--ok);background:var(--ok-soft)} .chip.warn{--c:var(--warn);background:var(--warn-soft)} .chip.err{--c:var(--err);background:var(--err-soft)}
.legend{display:flex;flex-wrap:wrap;gap:8px 20px;margin:0;padding:12px 0 0;border-top:1px solid var(--border);list-style:none;color:var(--muted);font-size:13px}
.legend li{display:flex;align-items:center;gap:8px}
.legend i{width:12px;height:3px;border-radius:2px;background:var(--c)}
/* Tokens: ver pestaña HTML + CSS */
</style>
