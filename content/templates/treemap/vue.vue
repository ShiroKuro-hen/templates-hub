<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

type Item = [string, number, string]; // nombre, valor (M USD), categoría
type Tile = { d: Item; x: number; y: number; w: number; h: number };
const cats: Record<string, [string, string]> = {
  Software: ['--accent-soft', '--accent'], Infraestructura: ['--info-soft', '--info'], Servicios: ['--ok-soft', '--ok'], Hardware: ['--warn-soft', '--warn'],
};
const items: Item[] = [
  ['Plataforma en la nube', 420, 'Infraestructura'], ['Ciberseguridad', 260, 'Software'], ['Analítica de datos', 210, 'Software'],
  ['IA aplicada', 180, 'Software'], ['Consultoría', 150, 'Servicios'], ['Redes', 120, 'Infraestructura'],
  ['Soporte gestionado', 90, 'Servicios'], ['Dispositivos', 70, 'Hardware'], ['Capacitación', 40, 'Servicios'],
];
const H = 340, total = items.reduce((a, i) => a + i[1], 0);
const svg = ref<SVGSVGElement>();
const W = ref(560);
const sel = ref(0);
let ro: ResizeObserver;
onMounted(() => { ro = new ResizeObserver(([e]) => (W.value = e.contentRect.width || 560)); ro.observe(svg.value!); });
onUnmounted(() => ro.disconnect());

const f = (n: number) => n.toLocaleString('es');
const pc = (n: number) => `${((n / total) * 100).toLocaleString('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
// Partición binaria: dos mitades de peso similar, corte por el lado más largo.
function lay(a: Item[], x: number, y: number, w: number, h: number, out: Tile[]) {
  if (a.length === 1) { out.push({ d: a[0], x, y, w, h }); return; }
  const tot = a.reduce((s, i) => s + i[1], 0);
  let k = 1, acc = a[0][1];
  while (k < a.length - 1 && acc < tot / 2) acc += a[k++][1];
  const r = acc / tot;
  if (w >= h) { lay(a.slice(0, k), x, y, w * r, h, out); lay(a.slice(k), x + w * r, y, w * (1 - r), h, out); }
  else { lay(a.slice(0, k), x, y, w, h * r, out); lay(a.slice(k), x, y + h * r, w, h * (1 - r), out); }
}
const tiles = computed(() => { const o: Tile[] = []; lay(items, 0, 0, W.value, H, o); return o; });
</script>

<template>
  <figure class="card">
    <figcaption class="head">
      <div><h2>Ingresos por línea de negocio</h2><p>El área de cada bloque es proporcional a su aporte. Selecciona uno para ver el detalle.</p></div>
      <div class="key" aria-hidden="true"><span v-for="(c, n) in cats" :key="n"><i :style="{ background: `var(${c[1]})` }" />{{ n }}</span></div>
    </figcaption>
    <svg ref="svg" class="map" :viewBox="`0 0 ${W} ${H}`" role="group" aria-label="Mapa de árbol de ingresos por línea de negocio">
      <svg v-for="({ d, x, y, w, h }, i) in tiles" :key="d[0]" class="t" :class="{ sel: i === sel }" :x="x" :y="y" :width="w" :height="h" tabindex="0" role="button" :aria-pressed="i === sel"
           :aria-label="`${d[0]}, ${d[2]}: ${f(d[1])} millones de USD, ${pc(d[1])} del total`" @click="sel = i" @keydown.enter.prevent="sel = i" @keydown.space.prevent="sel = i">
        <title>{{ d[0] }}: {{ f(d[1]) }} M USD</title>
        <rect class="bg" x="1" y="1" :width="w - 2" :height="h - 2" rx="4" :style="{ fill: `var(${cats[d[2]][0]})` }" />
        <rect x="1" y="1" :width="w - 2" height="3" rx="1.5" :style="{ fill: `var(${cats[d[2]][1]})` }" />
        <template v-if="w > 80 && h > 44"><text class="nm" x="10" y="26">{{ d[0] }}</text><text class="vl" x="10" y="44">{{ f(d[1]) }} M USD, {{ pc(d[1]) }}</text></template>
      </svg>
    </svg>
    <div class="detail" aria-live="polite">
      <div class="row"><span><b>{{ items[sel][0] }}</b><span class="cat">{{ items[sel][2] }}</span></span><span class="num">{{ f(items[sel][1]) }} M USD</span></div>
      <div class="bar"><i :style="{ width: (items[sel][1] / total) * 100 + '%' }" /></div>
      <small>{{ pc(items[sel][1]) }} de los {{ f(total) }} M USD facturados</small>
    </div>
  </figure>
</template>

<style scoped>
.card{margin:0;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-bottom:16px}
h2{margin:0;font-size:16px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.key{display:flex;flex-wrap:wrap;gap:4px 16px;color:var(--muted)}
.key span{display:inline-flex;align-items:center;gap:8px}
.key i{width:10px;height:10px;border-radius:3px}
svg.map{display:block;width:100%;height:340px}
.t{cursor:pointer;outline:none}
.bg{stroke:var(--border);stroke-width:1;transition:filter .14s}
.t:hover .bg{filter:brightness(.96)}
.t.sel .bg{stroke:var(--accent)}
.t:focus .bg{stroke:var(--accent);stroke-width:2}
.nm{fill:var(--text);font-size:13px;font-weight:600}
.vl{fill:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.detail{margin-top:16px;padding:12px 16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg)}
.row{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 16px}
.detail b{font-size:15px}
.cat{margin-left:8px;color:var(--muted)}
.num{font-size:20px;font-weight:600;font-variant-numeric:tabular-nums}
.bar{height:8px;margin:8px 0 4px;border-radius:999px;background:var(--border);overflow:hidden}
.bar i{display:block;height:100%;border-radius:inherit;background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .16s}
.detail small{color:var(--muted);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
