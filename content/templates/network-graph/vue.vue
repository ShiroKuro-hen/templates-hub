<script setup lang="ts">
import { computed, ref } from 'vue';

type Tipo = 'servicio' | 'almacen' | 'cola';
type Nodo = { id: string; nombre: string; tipo: Tipo; cx: number; cy: number };
type Enlace = { de: string; a: string; d: string };

const TIPOS: Record<Tipo, string> = { servicio: 'Servicio', almacen: 'Almacén de datos', cola: 'Cola de mensajes' };
const nodos: Nodo[] = [
  { id: 'cdn', nombre: 'CDN', tipo: 'servicio', cx: 110, cy: 240 },
  { id: 'api', nombre: 'API', tipo: 'servicio', cx: 300, cy: 240 },
  { id: 'auth', nombre: 'Auth', tipo: 'servicio', cx: 300, cy: 100 },
  { id: 'cache', nombre: 'Caché', tipo: 'almacen', cx: 300, cy: 380 },
  { id: 'cola', nombre: 'Cola', tipo: 'cola', cx: 490, cy: 240 },
  { id: 'w1', nombre: 'Worker 1', tipo: 'servicio', cx: 680, cy: 100 },
  { id: 'w2', nombre: 'Worker 2', tipo: 'servicio', cx: 680, cy: 380 },
  { id: 'db', nombre: 'Base de datos', tipo: 'almacen', cx: 680, cy: 240 },
];
const enlaces: Enlace[] = [
  { de: 'cdn', a: 'api', d: 'M185 240H225' },
  { de: 'api', a: 'auth', d: 'M300 210V130' },
  { de: 'api', a: 'cache', d: 'M300 270V348' },
  { de: 'api', a: 'cola', d: 'M375 240H420' },
  { de: 'cola', a: 'w1', d: 'M490 214V100H605' },
  { de: 'cola', a: 'w2', d: 'M490 266V380H605' },
  { de: 'w1', a: 'db', d: 'M680 130V208' },
  { de: 'w2', a: 'db', d: 'M680 350V272' },
];

const cilindro = (x: number, y: number) =>
  `M${x} ${y + 8}A75 8 0 0 0 ${x + 150} ${y + 8}V${y + 56}A75 8 0 0 1 ${x} ${y + 56}Z`;
const tapa = (x: number, y: number) => `M${x} ${y + 8}A75 8 0 0 1 ${x + 150} ${y + 8}A75 8 0 0 1 ${x} ${y + 8}Z`;

const foco = ref<string | null>(null);
const vecinos = computed(() => {
  const f = foco.value;
  if (!f) return new Set<string>();
  return new Set([f, ...enlaces.filter((l) => l.de === f || l.a === f).flatMap((l) => [l.de, l.a])]);
});
const conecta = (l: Enlace) => l.de === foco.value || l.a === foco.value;
</script>

<template>
  <figure class="card">
    <figcaption>
      <h2>Topología de servicios</h2>
      <p>Pasa el ratón o enfoca un nodo para ver con qué se conecta; el resto se atenúa.</p>
    </figcaption>
    <div class="scroll" role="region" tabindex="0" aria-label="Diagrama desplazable horizontalmente">
    <svg id="red" :class="{ active: foco }" viewBox="0 0 800 480" role="img" aria-labelledby="red-t red-d" @pointerleave="foco = null">
      <title id="red-t">Topología de servicios</title>
      <desc id="red-d">El CDN envía las peticiones a la API, que consulta Auth y Caché y encola trabajos en la Cola. Dos workers consumen la cola y escriben en la base de datos.</desc>
      <defs>
        <marker id="ah" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path class="arrow" d="M0 0L9 5L0 10z" /></marker>
        <marker id="ah-hot" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path class="arrow hot" d="M0 0L9 5L0 10z" /></marker>
      </defs>
      <path v-for="l in enlaces" :key="`${l.de}-${l.a}`" :class="conecta(l) ? 'link hot' : 'link'" :data-de="l.de" :data-a="l.a" :d="l.d" />
      <g v-for="n in nodos" :key="n.id" :class="['node', n.tipo, { on: vecinos.has(n.id) }]" :data-node="n.id"
         tabindex="0" role="group" :aria-label="`${n.nombre}, ${TIPOS[n.tipo].toLowerCase()}`"
         @pointerover="foco = n.id" @focus="foco = n.id" @blur="foco = null">
        <rect v-if="n.tipo === 'cola'" class="forma" :x="n.cx - 70" :y="n.cy - 26" width="140" height="52" rx="26" />
        <template v-else-if="n.tipo === 'almacen'">
          <path class="forma" :d="cilindro(n.cx - 75, n.cy - 32)" />
          <path class="forma" :d="tapa(n.cx - 75, n.cy - 32)" />
        </template>
        <rect v-else class="forma" :x="n.cx - 75" :y="n.cy - 30" width="150" height="60" rx="6" />
        <text class="nombre" :x="n.cx" :y="n.cy - 3">{{ n.nombre }}</text>
        <text class="tipo" :x="n.cx" :y="n.cy + 15">{{ TIPOS[n.tipo] }}</text>
      </g>
      <g class="servicio">
        <rect class="forma" x="35" y="446" width="24" height="14" rx="3" />
        <text class="leyenda" x="68" y="457">Servicio</text>
      </g>
      <g class="almacen">
        <path class="forma" d="M150 449A12 3 0 0 0 174 449V457A12 3 0 0 1 150 457Z" />
        <path class="forma" d="M150 449A12 3 0 0 1 174 449A12 3 0 0 1 150 449Z" />
        <text class="leyenda" x="182" y="457">Almacén de datos</text>
      </g>
      <g class="cola">
        <rect class="forma" x="300" y="446" width="24" height="14" rx="7" />
        <text class="leyenda" x="332" y="457">Cola de mensajes</text>
      </g>
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
.scroll>svg{min-width:734px}
.link{fill:none;stroke:var(--muted);stroke-width:1.5;marker-end:url(#ah);transition:opacity .14s,stroke .14s}
.link.hot{stroke:var(--accent);stroke-width:2.5;marker-end:url(#ah-hot)}
.arrow{fill:var(--muted)}
.arrow.hot{fill:var(--accent)}
.node{cursor:pointer;outline:none;transition:opacity .14s}
.forma{stroke-width:1.5}
.servicio .forma{fill:var(--accent-soft);stroke:var(--accent)}
.almacen .forma{fill:var(--ok-soft);stroke:var(--ok)}
.cola .forma{fill:var(--warn-soft);stroke:var(--warn)}
.node.on .forma{stroke-width:2.5}
.node:focus-visible .forma{stroke-width:3}
.nombre{fill:var(--text);font-size:13px;font-weight:600;text-anchor:middle}
.tipo,.leyenda{fill:var(--muted);font-size:12px}
.tipo{text-anchor:middle}
svg.active .node:not(.on),svg.active .link:not(.hot){opacity:.25}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
