<script setup lang="ts">
import { ref } from 'vue';

type Layer = { id: string; name: string; detail: string; tone: 'info' | 'accent' | 'ok'; via?: string };

const layers: Layer[] = [
  { id: 'cliente', name: 'Cliente', detail: 'Web SPA · App móvil', tone: 'info', via: 'HTTPS' },
  { id: 'edge', name: 'Edge / CDN', detail: 'CDN · WAF · Balanceador', tone: 'info', via: 'HTTPS · JSON' },
  { id: 'api', name: 'API', detail: 'Gateway · Autenticación · REST', tone: 'accent', via: 'gRPC' },
  { id: 'servicios', name: 'Servicios', detail: 'Pedidos · Catálogo · Pagos', tone: 'accent', via: 'SQL · caché' },
  { id: 'datos', name: 'Datos', detail: 'PostgreSQL · Redis · S3', tone: 'ok' },
];
const legend: [Layer['tone'], string][] = [['info', 'Entrada'], ['accent', 'Lógica de negocio'], ['ok', 'Persistencia']];
const Y = (i: number) => 20 + i * 100;
const active = ref<number | null>(null);
const nodeOn = (i: number) => active.value !== null && Math.abs(i - active.value) <= 1;
const edgeOn = (i: number) => active.value === i || active.value === i + 1;
</script>

<template>
  <figure class="card">
    <figcaption>
      <h2>Arquitectura por capas</h2>
      <p>Cada capa solo llama a la inmediatamente inferior. Pasa el cursor o enfoca una capa para ver sus dependencias.</p>
    </figcaption>
    <div class="scroll" role="region" tabindex="0" aria-label="Diagrama desplazable horizontalmente">
    <svg :class="{ active: active !== null }" viewBox="0 0 560 500" role="img" aria-labelledby="arch-t arch-d">
      <title id="arch-t">Arquitectura en cinco capas</title>
      <desc id="arch-d">Cliente, Edge y CDN, API, Servicios y Datos, unidas de arriba abajo por flechas que indican la dependencia.</desc>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M0,0 L10,5 L0,10Z" style="fill: var(--muted)" />
        </marker>
        <marker id="arr-hl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M0,0 L10,5 L0,10Z" style="fill: var(--accent)" />
        </marker>
      </defs>
      <g v-for="(l, i) in layers.slice(0, -1)" :key="`edge-${l.id}`">
        <path class="edge" :class="{ hl: edgeOn(i) }" :d="`M280,${Y(i) + 56} V${Y(i + 1)}`" />
        <text class="lb" :class="{ hl: edgeOn(i) }" x="292" :y="Y(i) + 82">{{ l.via }}</text>
      </g>
      <g v-for="(l, i) in layers" :key="l.id" class="node" :class="{ hl: nodeOn(i) }" tabindex="0" role="group"
         :aria-label="`${l.name}: ${l.detail}`" @mouseenter="active = i" @mouseleave="active = null" @focus="active = i" @blur="active = null">
        <rect class="box" x="40" :y="Y(i)" width="480" height="56" rx="6" />
        <rect x="40" :y="Y(i)" width="4" height="56" :style="{ fill: `var(--${l.tone})` }" />
        <text class="name" x="60" :y="Y(i) + 24">{{ l.name }}</text>
        <text class="detail" x="60" :y="Y(i) + 44">{{ l.detail }}</text>
      </g>
    </svg>
    </div>
    <ul class="legend" aria-label="Leyenda">
      <li v-for="[tone, label] in legend" :key="tone"><i :style="{ '--c': `var(--${tone})` }" />{{ label }}</li>
    </ul>
  </figure>
</template>

<style scoped>
.card{max-width:620px;margin:0 auto;padding:20px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px;font-weight:600}
.card p{margin:2px 0 12px;color:var(--muted)}
svg{display:block;width:100%;height:auto}
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.scroll:focus-visible{outline:2px solid var(--accent)}
.scroll>svg{min-width:514px}
.edge{fill:none;stroke:var(--muted);stroke-width:1.5;marker-end:url(#arr);transition:stroke .15s,opacity .15s}
.edge.hl{stroke:var(--accent);stroke-width:2.5;marker-end:url(#arr-hl)}
.lb{fill:var(--muted);font-size:12px;transition:opacity .15s}
.lb.hl{fill:var(--accent);font-weight:600}
.node{cursor:pointer;transition:opacity .15s}
.box{fill:var(--bg);stroke:var(--border);stroke-width:1}
.node.hl .box{stroke:var(--accent)}
.node:focus-visible .box{stroke:var(--accent);stroke-width:2}
.name{fill:var(--text);font-size:14px;font-weight:600}
.detail{fill:var(--muted);font-size:13px}
svg.active .node:not(.hl),svg.active .edge:not(.hl),svg.active .lb:not(.hl){opacity:.35}
.legend{display:flex;flex-wrap:wrap;gap:6px 16px;margin:12px 0 0;padding:0;list-style:none;color:var(--muted);font-size:13px}
.legend li{display:flex;align-items:center;gap:6px}
.legend i{width:10px;height:10px;border-radius:3px;background:var(--c)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
