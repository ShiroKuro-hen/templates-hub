<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const kpis = [['Ingresos', '$ 84.200', '+12,4 %', true], ['Pedidos', '1.284', '+4,1 %', true], ['Ticket promedio', '$ 65,6', '-2,3 %', false], ['Clientes nuevos', '312', '+8,7 %', true]] as const;
const actividad = [['--ok', 'Pedido #4821 pagado', 'Hace 2 min'], ['--warn', 'Reembolso pedido #4807', 'Hace 14 min'], ['--accent', 'Nueva cliente: Marta Quispe', 'Hace 31 min'], ['--err', 'Poco stock: monitor 27" 4K', 'Hace 1 h'], ['--info', 'Reporte semanal listo', 'Hace 3 h']];
const productos = [['Teclado mecánico K2', 412, 100], ['Monitor 27" 4K', 268, 65], ['Auriculares ANC', 231, 56], ['Base para laptop', 174, 42]] as const;
const vals = [2.1, 2.4, 2.2, 3.0, 3.4, 3.1, 2.8, 3.6, 4.0, 3.8, 4.4, 4.1, 4.9, 5.2]; // miles de USD por día
const H = 180, L = 28, T = 8, B = 24, MAX = 6;
const svg = ref<SVGSVGElement>();
const W = ref(300);
const areas = ref(false);
let ro: ResizeObserver;
onMounted(() => { ro = new ResizeObserver(([e]) => (W.value = e.contentRect.width || 300)); ro.observe(svg.value!); });
onUnmounted(() => ro.disconnect());
const x = (i: number) => L + (i * (W.value - L - 8)) / (vals.length - 1);
const y = (v: number) => T + (H - T - B) * (1 - v / MAX);
const pts = computed(() => vals.map((v, i) => `${x(i)},${y(v)}`).join(' '));
</script>

<template>
  <header class="top">
    <div><h1>Panel de ventas</h1><p>Septiembre de 2025</p></div>
    <label class="sw"><input id="ar" v-model="areas" type="checkbox" />Ver áreas del grid</label>
  </header>
  <main class="dash" :class="{ areas }">
    <article v-for="([l, v, d, up], i) in kpis" :key="l" class="c" :style="{ gridArea: `kpi${i + 1}` }" :data-a="`kpi${i + 1}`">
      <p class="lb">{{ l }}</p><p class="v">{{ v }}</p>
      <span class="d" :class="up ? 'up' : 'down'"><span class="sr">{{ up ? 'Subió ' : 'Bajó ' }}</span>{{ d }}</span>
    </article>
    <article class="c" style="grid-area:chart" data-a="chart">
      <h2>Ventas diarias</h2>
      <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Ventas diarias de septiembre: suben de 2,1 a 5,2 miles de dólares en 14 días.">
        <defs>
          <linearGradient id="lg"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient>
          <linearGradient id="af" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--accent);stop-opacity:.25" /><stop offset="1" style="stop-color:var(--accent);stop-opacity:0" /></linearGradient>
        </defs>
        <g v-for="t in [0, 2, 4, 6]" :key="t"><line class="gl" :x1="L" :x2="W - 8" :y1="y(t)" :y2="y(t)" /><text class="ax" :x="L - 6" :y="y(t) + 4" text-anchor="end">{{ t }}</text></g>
        <polygon fill="url(#af)" :points="`${x(0)},${y(0)} ${pts} ${x(vals.length - 1)},${y(0)}`" />
        <polyline fill="none" stroke="url(#lg)" stroke-width="2" stroke-linejoin="round" :points="pts" />
        <circle :cx="x(vals.length - 1)" :cy="y(vals[vals.length - 1])" r="4" stroke-width="2" style="fill:var(--accent);stroke:var(--surface)" />
        <text class="ax" :x="x(0)" :y="H - 6" text-anchor="start">1 sep</text><text class="ax" :x="x(6)" :y="H - 6" text-anchor="middle">7 sep</text><text class="ax" :x="x(13)" :y="H - 6" text-anchor="end">14 sep</text>
      </svg>
    </article>
    <article class="c act" style="grid-area:act" data-a="act">
      <h2>Actividad reciente</h2>
      <ul><li v-for="[c, t, h] in actividad" :key="t"><i :style="{ background: `var(${c})` }" /><span>{{ t }}</span><small>{{ h }}</small></li></ul>
    </article>
    <article class="c tabla" style="grid-area:tabla" data-a="tabla">
      <h2>Productos más vendidos</h2>
      <ul><li v-for="[n, u, p] in productos" :key="n"><span>{{ n }}</span><span>{{ u }} u.</span><div class="m" :style="{ '--p': p }"><i /></div></li></ul>
    </article>
    <article class="c meta" style="grid-area:meta" data-a="meta">
      <h2>Meta del mes</h2><p class="v">72 %</p>
      <progress value="72" max="100" aria-label="Avance de la meta mensual">72 %</progress>
      <p>Faltan $ 33.600 y quedan 9 días.</p>
    </article>
  </main>
</template>

<style scoped>
.top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:20px;font-weight:600}
.top p{margin:0;color:var(--muted)}
.sw{display:flex;align-items:center;gap:8px;color:var(--muted);cursor:pointer}
.sw input{accent-color:var(--accent);margin:0}
.dash{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-areas:"kpi1 kpi2" "kpi3 kpi4" "chart chart" "meta meta" "tabla tabla" "act act";color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.c{position:relative;min-width:0;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.areas .c{outline:1px dashed var(--accent);outline-offset:-1px}
.areas .c::after{content:"grid-area: " attr(data-a);position:absolute;top:8px;right:8px;padding:0 8px;border-radius:999px;background:var(--accent);color:var(--accent-ink);font:11px/18px ui-monospace,"Cascadia Code",Menlo,monospace}
h2{margin:0 0 12px;font-size:14px;font-weight:600}
.lb{margin:0;color:var(--muted)}
.v{margin:0;font-size:24px;line-height:1.3;font-weight:600;font-variant-numeric:tabular-nums}
.d{display:inline-block;padding:0 8px;border-radius:999px;font-size:12px;font-variant-numeric:tabular-nums}
.d.up{background:var(--ok-soft)}.d.down{background:var(--err-soft)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
svg{display:block;width:100%;height:180px;overflow:visible}
.gl{stroke:var(--border);stroke-width:1}
.ax{fill:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
ul{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.act li{display:grid;grid-template-columns:auto 1fr;gap:2px 10px}
.act i{width:8px;height:8px;margin-top:7px;border-radius:50%}
.act small{grid-column:2;color:var(--muted)}
.tabla li{display:grid;grid-template-columns:1fr auto;gap:4px 12px;font-variant-numeric:tabular-nums}
.tabla span:last-of-type{color:var(--muted)}
.m{grid-column:1/-1;height:6px;border-radius:999px;background:var(--border);overflow:hidden}
.m i{display:block;height:100%;width:calc(var(--p) * 1%);border-radius:inherit;background:var(--accent)}
progress{width:100%;height:8px;border:0;border-radius:999px;background:var(--border);appearance:none;overflow:hidden}
progress::-webkit-progress-bar{background:var(--border)}
progress::-webkit-progress-value{border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
progress::-moz-progress-bar{border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.meta p:last-child{margin:8px 0 0;color:var(--muted)}
.meta .v{margin-bottom:8px}
@media (min-width:600px){.dash{grid-template-areas:"kpi1 kpi2" "kpi3 kpi4" "chart chart" "tabla meta" "act act"}}
@media (min-width:900px){.dash{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-areas:"kpi1 kpi2 kpi3 kpi4" "chart chart chart act" "tabla tabla meta act"}}
/* Tokens: ver pestaña HTML + CSS */
</style>
