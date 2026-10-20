<script setup lang="ts">
import { computed, ref } from 'vue';

type Tarea = { id: string; nombre: string; inicio: number; dur: number; pct: number; fechas: string };
type Dep = { de: string; a: string; d: string };

const TAREAS: Tarea[] = [
  { id: 'req', nombre: 'Requisitos', inicio: 0, dur: 6, pct: 100, fechas: '14 sep – 19 sep' },
  { id: 'diseno', nombre: 'Diseño UX', inicio: 8, dur: 6, pct: 100, fechas: '22 sep – 27 sep' },
  { id: 'api', nombre: 'API del backend', inicio: 16, dur: 14, pct: 60, fechas: '30 sep – 13 oct' },
  { id: 'web', nombre: 'Interfaz web', inicio: 16, dur: 12, pct: 45, fechas: '30 sep – 11 oct' },
  { id: 'pruebas', nombre: 'Pruebas de QA', inicio: 32, dur: 6, pct: 20, fechas: '16 oct – 21 oct' },
  { id: 'lanza', nombre: 'Lanzamiento', inicio: 40, dur: 2, pct: 0, fechas: '24 oct – 25 oct' },
];
const DEPS: Dep[] = [
  { de: 'req', a: 'diseno', d: 'M302 64H314V104H326' },
  { de: 'diseno', a: 'api', d: 'M398 104H410V144H422' },
  { de: 'diseno', a: 'web', d: 'M398 104H410V184H422' },
  { de: 'api', a: 'pruebas', d: 'M590 144H602V224H614' },
  { de: 'web', a: 'pruebas', d: 'M566 184H578V224H614' },
  { de: 'pruebas', a: 'lanza', d: 'M686 224H698V264H710' },
];
const SEMANAS: [number, string][] = [[234, '14 sep'], [318, '21 sep'], [402, '28 sep'], [486, '5 oct'], [570, '12 oct'], [654, '19 oct']];

const X0 = 230, DIA = 12, FILA = 40, Y0 = 44, BARRA = 22, ANCHO = 760, TIP_W = 250, TIP_H = 44;
const barX = (t: Tarea) => X0 + t.inicio * DIA;
const barY = (i: number) => Y0 + i * FILA + 9;
const enlazados = (id: string) =>
  new Set([id, ...DEPS.filter((d) => d.de === id || d.a === id).flatMap((d) => [d.de, d.a])]);

const foco = ref<string | null>(null);
const tarea = computed(() => TAREAS.find((t) => t.id === foco.value));
const cercanos = computed(() => (foco.value ? enlazados(foco.value) : new Set<string>()));
const cls = (id: string, base: string) => (cercanos.value.has(id) ? `${base} on` : base);
const conecta = (dep: Dep) => dep.de === foco.value || dep.a === foco.value;

const tip = computed(() => {
  const t = tarea.value;
  const i = t ? TAREAS.indexOf(t) : 0;
  const arriba = barY(i) - TIP_H - 8;
  return {
    x: t ? Math.min(Math.max(barX(t), 8), ANCHO - 8 - TIP_W) : 0,
    y: arriba >= 30 ? arriba : barY(i) + BARRA + 8,
  };
});
</script>

<template>
  <figure class="card">
    <figcaption>
      <h2>Cronograma del proyecto</h2>
      <p>Seis semanas de trabajo. Pasa el ratón o enfoca una tarea para ver sus fechas y su avance.</p>
    </figcaption>
    <div class="scroll" role="region" tabindex="0" aria-label="Cronograma desplazable horizontalmente">
    <svg id="gantt" :class="{ active: foco }" viewBox="0 0 760 350" role="img" aria-labelledby="gantt-t gantt-d" @pointerleave="foco = null">
      <title id="gantt-t">Cronograma del proyecto de seis semanas</title>
      <desc id="gantt-d">Seis tareas del 14 de septiembre al 25 de octubre: requisitos, diseño UX, API del backend, interfaz web, pruebas de QA y lanzamiento. Las flechas indican dependencias y la línea discontinua marca hoy, 20 de octubre.</desc>
      <defs>
        <marker id="ah" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path class="arrow" d="M0 0L9 5L0 10z" /></marker>
        <marker id="ah-hot" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path class="arrow hot" d="M0 0L9 5L0 10z" /></marker>
      </defs>
      <text class="head" x="12" y="24">Tarea</text>
      <text v-for="[x, texto] in SEMANAS" :key="texto" class="head" :x="x" y="24">{{ texto }}</text>
      <path class="grid" d="M230 32V284M314 32V284M398 32V284M482 32V284M566 32V284M650 32V284M734 32V284" />
      <path v-for="dep in DEPS" :key="`${dep.de}-${dep.a}`" :class="conecta(dep) ? 'dep hot' : 'dep'" :data-de="dep.de" :data-a="dep.a" :d="dep.d" />
      <g v-for="(t, fila) in TAREAS" :key="t.id">
        <text :class="cls(t.id, 'task')" :data-id="t.id" x="12" :y="barY(fila) + 15">{{ t.nombre }}</text>
        <g :class="cls(t.id, 'bar')" :data-id="t.id" tabindex="0" role="group"
           :aria-label="`${t.nombre}, del ${t.fechas}, ${t.pct} % completado`"
           @pointerover="foco = t.id" @focus="foco = t.id" @blur="foco = null">
          <rect class="base" :x="barX(t)" :y="barY(fila)" :width="t.dur * DIA" :height="BARRA" rx="6" />
          <rect class="done" :x="barX(t)" :y="barY(fila)" :width="(t.dur * DIA * t.pct) / 100" :height="BARRA" rx="6" />
        </g>
      </g>
      <line class="hoy" x1="668" x2="668" y1="32" y2="284" />
      <text class="hoy-txt" x="668" y="300" text-anchor="middle">Hoy · 20 oct</text>
      <g :class="foco ? 'tip show' : 'tip'" :transform="`translate(${tip.x} ${tip.y})`" aria-hidden="true">
        <rect :width="TIP_W" :height="TIP_H" rx="6" />
        <text class="tip-name" x="12" y="18">{{ tarea?.nombre }}</text>
        <text class="tip-info" x="12" y="36">{{ tarea ? `${tarea.fechas} · ${tarea.pct} % completado` : '' }}</text>
      </g>
      <rect class="done" x="12" y="320" width="14" height="10" rx="3" />
      <text class="leyenda" x="32" y="329">Progreso</text>
      <rect class="base" x="120" y="320" width="14" height="10" rx="3" />
      <text class="leyenda" x="140" y="329">Pendiente</text>
      <path class="dep" d="M216 325H236" />
      <text class="leyenda" x="244" y="329">Dependencia</text>
      <line class="hoy" x1="340" x2="340" y1="318" y2="332" />
      <text class="leyenda" x="348" y="329">Hoy</text>
    </svg>
    </div>
  </figure>
</template>

<style scoped>
.card{max-width:760px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px;font-weight:600}
.card p{margin:2px 0 12px;color:var(--muted)}
svg{display:block;width:100%;height:auto}
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.scroll:focus-visible{outline:2px solid var(--accent)}
.scroll>svg{min-width:697px}
.grid{fill:none;stroke:var(--border);stroke-width:1}
.head,.leyenda{fill:var(--muted);font-size:12px}
.task{fill:var(--text);font-size:13px;font-weight:600;transition:opacity .14s}
.bar{cursor:pointer;outline:none;transition:opacity .14s}
.base{fill:var(--accent-soft);stroke:var(--accent);stroke-width:1.5}
.done{fill:var(--accent)}
.bar.on .base{stroke-width:2.5}
.bar:focus-visible .base{stroke-width:3}
.dep{fill:none;stroke:var(--muted);stroke-width:1.5;marker-end:url(#ah);transition:opacity .14s,stroke .14s}
.dep.hot{stroke:var(--accent);stroke-width:2.5;marker-end:url(#ah-hot)}
.arrow{fill:var(--muted)}
.arrow.hot{fill:var(--accent)}
.hoy{stroke:var(--err);stroke-width:1.5;stroke-dasharray:4 3;pointer-events:none}
.hoy-txt{fill:var(--err);font-size:12px;font-weight:600}
.tip{display:none;pointer-events:none}
.tip.show{display:inline}
.tip rect{fill:var(--surface);stroke:var(--border)}
.tip-name{fill:var(--text);font-size:13px;font-weight:600}
.tip-info{fill:var(--muted);font-size:12px}
svg.active [data-id]:not(.on){opacity:.35}
svg.active .dep[data-de]:not(.hot){opacity:.35}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
