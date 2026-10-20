<script setup lang="ts">
import { computed, ref } from 'vue';

type Nodo = { id: string; tipo: 'term' | 'proc' | 'dec'; cx: number; cy: number; w: number; h: number; lineas: string[] };
type Arista = {
  from: string;
  to: string;
  d: string;
  etiqueta?: { x: number; y: number; texto: string; anchor: 'start' | 'middle' };
};

const NODOS: Nodo[] = [
  { id: 'inicio', tipo: 'term', cx: 150, cy: 30, w: 220, h: 40, lineas: ['Inicio: pedido recibido'] },
  { id: 'validar', tipo: 'proc', cx: 150, cy: 110, w: 220, h: 44, lineas: ['Validar datos del pedido'] },
  { id: 'datos', tipo: 'dec', cx: 150, cy: 200, w: 200, h: 80, lineas: ['¿Datos completos?'] },
  { id: 'reenviar', tipo: 'proc', cx: 335, cy: 200, w: 110, h: 52, lineas: ['Pedir datos', 'al cliente'] },
  { id: 'importe', tipo: 'dec', cx: 150, cy: 310, w: 200, h: 80, lineas: ['¿Importe > 1.000 €?'] },
  { id: 'gerente', tipo: 'proc', cx: 150, cy: 410, w: 220, h: 44, lineas: ['Aprobación del gerente'] },
  { id: 'fin', tipo: 'term', cx: 150, cy: 500, w: 220, h: 40, lineas: ['Fin: pedido aprobado'] },
];

const ARISTAS: Arista[] = [
  { from: 'inicio', to: 'validar', d: 'M150 50V88' },
  { from: 'validar', to: 'datos', d: 'M150 132V160' },
  { from: 'datos', to: 'importe', d: 'M150 240V270', etiqueta: { x: 160, y: 255, texto: 'Sí', anchor: 'start' } },
  { from: 'datos', to: 'reenviar', d: 'M250 200H280', etiqueta: { x: 265, y: 188, texto: 'No', anchor: 'middle' } },
  { from: 'reenviar', to: 'validar', d: 'M335 174V110H260', etiqueta: { x: 297, y: 99, texto: 'Reenviar', anchor: 'middle' } },
  { from: 'importe', to: 'gerente', d: 'M150 350V388', etiqueta: { x: 160, y: 369, texto: 'Sí', anchor: 'start' } },
  { from: 'importe', to: 'fin', d: 'M250 310H320V500H260', etiqueta: { x: 285, y: 298, texto: 'No', anchor: 'middle' } },
  { from: 'gerente', to: 'fin', d: 'M150 432V480' },
];

const foco = ref<string | null>(null);
const enlazada = (a: Arista) => a.from === foco.value || a.to === foco.value;
const vecinos = computed(() => new Set(foco.value ? [foco.value, ...ARISTAS.filter(enlazada).flatMap((a) => [a.from, a.to])] : []));
const clases = (n: Nodo) => ['node', n.tipo, vecinos.value.has(n.id) ? 'hot' : ''].filter(Boolean);
const rombo = ({ cx, cy, w, h }: Nodo) => `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`;
const linea = (n: Nodo, i: number) => n.cy + (i - (n.lineas.length - 1) / 2) * 16;
</script>

<template>
  <figure class="card">
    <figcaption>
      <h1>Aprobación de pedidos</h1>
      <p>Pasa el ratón o el foco sobre un nodo para ver su camino.</p>
    </figcaption>
    <svg viewBox="0 0 400 540" role="img" aria-labelledby="flow-t flow-d" :class="foco ? 'flow active' : 'flow'" @pointerleave="foco = null">
      <title id="flow-t">Flujo de aprobación de pedidos</title>
      <desc id="flow-d">El pedido se valida. Si faltan datos, se piden al cliente y se vuelve a validar. Si el importe supera 1.000 euros, lo aprueba el gerente; en otro caso queda aprobado.</desc>
      <defs>
        <marker id="ah" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path class="arrow" d="M0 0L9 5L0 10z" /></marker>
        <marker id="ah-hot" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path class="arrow hot" d="M0 0L9 5L0 10z" /></marker>
      </defs>
      <path v-for="a in ARISTAS" :key="`${a.from}-${a.to}`" :class="enlazada(a) ? 'edge hot' : 'edge'" :d="a.d" />
      <template v-for="a in ARISTAS" :key="`t-${a.from}-${a.to}`">
        <text v-if="a.etiqueta" :class="enlazada(a) ? 'lbl hot' : 'lbl'" :x="a.etiqueta.x" :y="a.etiqueta.y" :text-anchor="a.etiqueta.anchor">{{ a.etiqueta.texto }}</text>
      </template>
      <g v-for="n in NODOS" :key="n.id" :class="clases(n)" tabindex="0" role="group" :aria-label="n.lineas.join(' ')"
         @pointerover="foco = n.id" @focus="foco = n.id" @blur="foco = null">
        <polygon v-if="n.tipo === 'dec'" :points="rombo(n)" />
        <rect v-else :x="n.cx - n.w / 2" :y="n.cy - n.h / 2" :width="n.w" :height="n.h" :rx="n.tipo === 'term' ? n.h / 2 : 6" />
        <text v-for="(t, i) in n.lineas" :key="t" :x="n.cx" :y="linea(n, i)">{{ t }}</text>
      </g>
    </svg>
  </figure>
</template>

<style scoped>
.card{max-width:440px;margin:0 auto;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:16px;font-weight:600}
p{margin:2px 0 12px;color:var(--muted);font-size:13px}
svg{display:block;width:100%;height:auto}
.edge{fill:none;stroke:var(--muted);stroke-width:1.5;marker-end:url(#ah);transition:stroke .14s,opacity .14s}
.edge.hot{stroke:var(--accent);stroke-width:2.5;marker-end:url(#ah-hot)}
.arrow{fill:var(--muted)}
.arrow.hot{fill:var(--accent)}
.lbl{font:12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;fill:var(--muted);dominant-baseline:middle;transition:opacity .14s}
.lbl.hot{fill:var(--accent);font-weight:600}
.node{outline:none;transition:opacity .14s}
.node text{font:13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;fill:var(--text);text-anchor:middle;dominant-baseline:middle}
.node rect,.node polygon{fill:var(--surface);stroke:var(--border);stroke-width:1.5;transition:stroke .14s}
.term rect{fill:var(--ok-soft);stroke:var(--ok)}
.dec polygon{fill:var(--warn-soft);stroke:var(--warn)}
.node.hot rect,.node.hot polygon{stroke:var(--accent);stroke-width:2.5}
.node:focus-visible rect,.node:focus-visible polygon{stroke:var(--accent);stroke-width:3}
.active .node:not(.hot),.active .edge:not(.hot),.active .lbl:not(.hot){opacity:.3}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
