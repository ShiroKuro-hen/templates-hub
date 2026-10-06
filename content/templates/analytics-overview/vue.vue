<script setup lang="ts">
import { computed, ref } from 'vue';

type Kpi = { label: string; value: string; change: string; up: boolean };
type Range = { points: number[]; ticks: string[]; kpis: Kpi[] }; // points: 0-100

const k = (label: string, value: string, change: string, up = true): Kpi => ({ label, value, change, up });
const data: Record<string, Range> = {
  '7': { points: [42, 55, 48, 63, 71, 58, 80], ticks: ['30 sep', '3 oct', '6 oct'],
    kpis: [k('Visitantes', '18.420', '+8,2 %'), k('Sesiones', '26.910', '+5,1 %'), k('Conversión', '3,4 %', '−0,3 pp', false), k('Ingresos', '12.480 €', '+11,6 %')] },
  '30': { points: [35, 41, 38, 52, 47, 60, 55, 49, 66, 72, 64, 78], ticks: ['7 sep', '21 sep', '6 oct'],
    kpis: [k('Visitantes', '74.305', '+14,0 %'), k('Sesiones', '108.240', '+9,8 %'), k('Conversión', '3,6 %', '+0,2 pp'), k('Ingresos', '51.920 €', '+17,3 %')] },
  '90': { points: [62, 58, 50, 44, 47, 40, 52, 57, 61, 59, 70, 76], ticks: ['8 jul', '22 ago', '6 oct'],
    kpis: [k('Visitantes', '201.780', '−2,4 %', false), k('Sesiones', '296.400', '+1,2 %'), k('Conversión', '3,5 %', '+0,1 pp'), k('Ingresos', '139.610 €', '+4,7 %')] },
};

const range = ref('7');
const d = computed(() => data[range.value]);
const pts = computed(() => {
  const n = d.value.points.length - 1;
  return d.value.points.map((v, i) => `${(i * 600) / n},${200 - v * 2}`).join(' ');
});
const label = computed(() => {
  const p = d.value.points;
  return `Visitantes en ${range.value} días, de ${d.value.ticks[0]} a ${d.value.ticks[2]}. Tendencia ${p[p.length - 1] > p[0] ? 'al alza' : 'a la baja'}.`;
});
</script>

<template>
  <section class="panel" aria-labelledby="ao-t">
    <div class="head">
      <div><h2 id="ao-t">Resumen de analítica</h2><p>Tienda online de Norte Digital</p></div>
      <fieldset class="range">
        <legend class="sr">Rango de fechas</legend>
        <label v-for="r in Object.keys(data)" :key="r">
          <input v-model="range" type="radio" name="ao-r" :value="r" /><span>{{ r }} días</span>
        </label>
      </fieldset>
    </div>
    <dl class="kpis" aria-live="polite">
      <div v-for="x in d.kpis" :key="x.label">
        <dt>{{ x.label }}</dt>
        <dd><b>{{ x.value }}</b><span class="delta" :class="x.up ? 'up' : 'down'">{{ x.change }}</span></dd>
      </div>
    </dl>
    <figure>
      <figcaption>Visitantes únicos por día</figcaption>
      <svg viewBox="0 0 600 200" preserveAspectRatio="none" role="img" :aria-label="label">
        <defs>
          <linearGradient id="ao-g" gradientUnits="userSpaceOnUse" x1="0" x2="600">
            <stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" />
          </linearGradient>
        </defs>
        <g class="grid"><line v-for="y in [50, 100, 150, 200]" :key="y" x1="0" x2="600" :y1="y" :y2="y" /></g>
        <polygon class="area" :points="`${pts} 600,200 0,200`" />
        <polyline class="line" :points="pts" stroke="url(#ao-g)" vector-effect="non-scaling-stroke" />
      </svg>
      <div class="x" aria-hidden="true"><span v-for="t in d.ticks" :key="t">{{ t }}</span></div>
    </figure>
  </section>
</template>

<style scoped>
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
h2{margin:0;font-size:18px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.range{display:inline-flex;margin:0;padding:3px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg)}
.range label{position:relative}
.range input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.range span{display:block;padding:5px 12px;border-radius:6px;color:var(--muted);transition:background .14s,color .14s}
.range input:checked+span{background:var(--surface);color:var(--text);font-weight:600;box-shadow:var(--shadow)}
.range input:focus-visible+span{outline:2px solid var(--accent);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1px;margin:20px 0;background:var(--border);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.kpis div{background:var(--surface);padding:12px 16px}
dt{color:var(--muted)}
dd{margin:4px 0 0;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
dd b{font-size:22px;font-weight:600;font-variant-numeric:tabular-nums}
.delta{font-size:12px;font-weight:600;padding:1px 8px;border-radius:999px;font-variant-numeric:tabular-nums}
.up{color:var(--ok);background:var(--ok-soft)}
.down{color:var(--err);background:var(--err-soft)}
figure{margin:0}
figcaption{color:var(--muted);margin-bottom:8px}
svg{display:block;width:100%;height:200px;overflow:visible}
.grid line{stroke:var(--border)}
.area{fill:var(--accent-soft);opacity:.7}
.line{fill:none;stroke-width:2;stroke-linejoin:round}
.x{display:flex;justify-content:space-between;color:var(--muted);font-size:12px;margin-top:6px;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
