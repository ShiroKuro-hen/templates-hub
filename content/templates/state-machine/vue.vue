<script setup lang="ts">
import { nextTick, ref } from 'vue';

type Estado = 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado' | 'reembolsado';
type Transicion = { id: string; de: Estado; a: Estado; texto: string; d: string; lx: number; ly: number; izq?: boolean };

const NOMBRES: Record<Estado, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
  reembolsado: 'Reembolsado',
};
const ESTADOS: { id: Estado; cx: number; cy: number }[] = [
  { id: 'pendiente', cx: 80, cy: 70 },
  { id: 'pagado', cx: 260, cy: 70 },
  { id: 'enviado', cx: 440, cy: 70 },
  { id: 'entregado', cx: 620, cy: 70 },
  { id: 'cancelado', cx: 80, cy: 210 },
  { id: 'reembolsado', cx: 440, cy: 210 },
];
const TRANSICIONES: Transicion[] = [
  { id: 'pagar', de: 'pendiente', a: 'pagado', texto: 'Pagar', d: 'M138 70H202', lx: 170, ly: 60 },
  { id: 'cancelar', de: 'pendiente', a: 'cancelado', texto: 'Cancelar', d: 'M80 92V188', lx: 92, ly: 144, izq: true },
  { id: 'enviar', de: 'pagado', a: 'enviado', texto: 'Enviar', d: 'M318 70H382', lx: 350, ly: 60 },
  { id: 'reembolsar', de: 'pagado', a: 'reembolsado', texto: 'Reembolsar', d: 'M260 92V210H382', lx: 321, ly: 200 },
  { id: 'entregar', de: 'enviado', a: 'entregado', texto: 'Entregar', d: 'M498 70H562', lx: 530, ly: 60 },
  { id: 'devolver', de: 'entregado', a: 'reembolsado', texto: 'Devolver', d: 'M620 92V210H498', lx: 559, ly: 200 },
];
const INICIAL: Estado = 'pendiente';

const actual = ref<Estado>(INICIAL);
const ultima = ref<string | null>(null);
const aviso = ref(`Pedido creado en estado ${NOMBRES[INICIAL]}.`);
const contenedor = ref<HTMLDivElement | null>(null);
const reiniciarBtn = ref<HTMLButtonElement | null>(null);

const permitidas = () => TRANSICIONES.filter((t) => t.de === actual.value);

async function mover(t: Transicion) {
  actual.value = t.a;
  ultima.value = t.id;
  const final = TRANSICIONES.every((x) => x.de !== t.a);
  aviso.value = `Pedido pasado de ${NOMBRES[t.de]} a ${NOMBRES[t.a]}.${final ? ' Es un estado final.' : ''}`;
  await nextTick();
  (contenedor.value?.querySelector('button') ?? reiniciarBtn.value)?.focus();
}

function reiniciar() {
  actual.value = INICIAL;
  ultima.value = null;
  aviso.value = `Pedido reiniciado en estado ${NOMBRES[INICIAL]}.`;
}
</script>

<template>
  <figure class="card">
    <figcaption>
      <h2>Estados de un pedido</h2>
      <p>Desde el estado actual solo se ofrecen los cambios permitidos.</p>
    </figcaption>
    <div class="scroll" role="region" tabindex="0" aria-label="Diagrama de estados desplazable horizontalmente">
      <svg viewBox="0 0 700 260" role="img" aria-labelledby="sm-t sm-d">
        <title id="sm-t">Estados de un pedido</title>
        <desc id="sm-d">Un pedido pasa de Pendiente a Pagado o a Cancelado. Pagado pasa a Enviado o a Reembolsado, Enviado pasa a Entregado y Entregado puede pasar a Reembolsado. Cancelado y Reembolsado son estados finales.</desc>
        <defs>
          <marker id="fl" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path class="head" d="M0 0L9 5L0 10z" /></marker>
          <marker id="fl-hot" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path class="head hot" d="M0 0L9 5L0 10z" /></marker>
        </defs>
        <path v-for="t in TRANSICIONES" :key="t.id" class="edge" :class="{ taken: t.id === ultima }" :d="t.d" />
        <text v-for="t in TRANSICIONES" :key="`etiqueta-${t.id}`" class="lbl" :class="{ left: t.izq }" :x="t.lx" :y="t.ly">{{ t.texto }}</text>
        <g v-for="e in ESTADOS" :key="e.id" class="state" :class="{ on: e.id === actual }">
          <rect class="box" :x="e.cx - 58" :y="e.cy - 22" :width="116" :height="44" :rx="6" />
          <text :x="e.cx" :y="e.cy">{{ NOMBRES[e.id] }}</text>
        </g>
      </svg>
    </div>
    <p class="estado">Estado actual: <strong>{{ NOMBRES[actual] }}</strong></p>
    <div class="acciones">
      <div ref="contenedor" class="transiciones" role="group" aria-label="Transiciones disponibles">
        <button v-for="t in permitidas()" :key="t.id" type="button" @click="mover(t)">{{ t.texto }}</button>
      </div>
      <button ref="reiniciarBtn" type="button" class="reiniciar" @click="reiniciar">Reiniciar</button>
    </div>
    <p class="live" aria-live="polite">{{ aviso }}</p>
  </figure>
</template>

<style scoped>
.card{max-width:740px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px;font-weight:600}
.card p{margin:2px 0 12px;color:var(--muted)}
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.scroll:focus-visible{outline:2px solid var(--accent)}
.scroll>svg{display:block;width:100%;height:auto;min-width:642px}
text{font:13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;fill:var(--text);text-anchor:middle;dominant-baseline:middle}
.lbl{font-size:12px;fill:var(--muted)}
.lbl.left{text-anchor:start}
.box{fill:var(--surface);stroke:var(--border);stroke-width:1.5}
.state.on .box{fill:var(--accent-soft);stroke:var(--accent);stroke-width:2.5}
.state.on text{fill:var(--accent);font-weight:600}
.edge{fill:none;stroke:var(--muted);stroke-width:1.5;marker-end:url(#fl);transition:stroke .15s}
.edge.taken{stroke:var(--accent);stroke-width:2.5;marker-end:url(#fl-hot)}
.head{fill:var(--muted)}
.head.hot{fill:var(--accent)}
.estado{margin:14px 0 0}
.estado strong{color:var(--accent)}
.acciones{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px}
.transiciones{display:flex;flex-wrap:wrap;flex:1;gap:8px}
button{font:600 14px system-ui,-apple-system,"Segoe UI",sans-serif;padding:8px 14px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);cursor:pointer;transition:border-color .14s}
button:hover{border-color:var(--accent)}
.reiniciar{color:var(--muted)}
.live{min-height:3em;margin:12px 0 0;padding-top:10px;border-top:1px solid var(--border);color:var(--muted);font-size:13px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
