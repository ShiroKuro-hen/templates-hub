<script setup lang="ts">
import { computed, ref } from 'vue';

type Entity = { id: string; name: string; x: number; y: number; attrs: [string, string][] };
type Rel = { a: string; b: string; d: string; labels: [number, number, string, 'start' | 'end'][] };

const entities: Entity[] = [
  { id: 'cliente', name: 'Cliente', x: 20, y: 20, attrs: [['PK', 'id_cliente'], ['', 'nombre'], ['', 'correo']] },
  { id: 'pedido', name: 'Pedido', x: 255, y: 20, attrs: [['PK', 'id_pedido'], ['FK', 'id_cliente'], ['', 'fecha'], ['', 'estado']] },
  { id: 'pago', name: 'Pago', x: 490, y: 20, attrs: [['PK', 'id_pago'], ['FK', 'id_pedido'], ['', 'importe'], ['', 'método']] },
  { id: 'linea', name: 'Línea', x: 255, y: 230, attrs: [['PK', 'id_linea'], ['FK', 'id_pedido'], ['FK', 'id_producto'], ['', 'cantidad']] },
  { id: 'producto', name: 'Producto', x: 490, y: 230, attrs: [['PK', 'id_producto'], ['', 'nombre'], ['', 'precio']] },
];
const rels: Rel[] = [
  { a: 'cliente', b: 'pedido', d: 'M190,68 H255', labels: [[196, 60, '1', 'start'], [249, 60, 'N', 'end']] },
  { a: 'pedido', b: 'pago', d: 'M425,68 H490', labels: [[431, 60, '1', 'start'], [484, 60, '0..N', 'end']] },
  { a: 'pedido', b: 'linea', d: 'M340,136 V230', labels: [[346, 160, '1', 'start'], [346, 220, 'N', 'start']] },
  { a: 'linea', b: 'producto', d: 'M425,290 H490', labels: [[431, 284, 'N', 'start'], [484, 284, '1', 'end']] },
];
const HEAD = 28, ROW = 20, W = 170;
const active = ref<string | null>(null);
const linked = (r: Rel) => active.value !== null && (r.a === active.value || r.b === active.value);
const ends = computed(() => (active.value === null ? null : new Set([active.value, ...rels.filter(linked).flatMap((r) => [r.a, r.b])])));
const boxH = (e: Entity) => HEAD + e.attrs.length * ROW + 8;
const rowY = (e: Entity, i: number) => e.y + HEAD + i * ROW + 15;
</script>

<template>
  <figure class="card">
    <figcaption>
      <h2>Modelo de datos de la tienda</h2>
      <p>Un cliente tiene muchos pedidos, y cada pedido tiene varias líneas. Pasa el cursor o enfoca una entidad para ver sus relaciones.</p>
    </figcaption>
    <div class="scroll" role="region" tabindex="0" aria-label="Diagrama desplazable horizontalmente">
    <svg :class="{ active: active !== null }" viewBox="0 0 680 370" role="img" aria-labelledby="erd-t erd-d">
      <title id="erd-t">Entidad-relación de la tienda</title>
      <desc id="erd-d">Cliente 1 a N Pedido; Pedido 1 a 0..N Pago; Pedido 1 a N Línea; Producto 1 a N Línea.</desc>
      <g v-for="r in rels" :key="`${r.a}-${r.b}`">
        <path class="rel" :class="{ hl: linked(r) }" :d="r.d" />
        <text v-for="([x, y, text, anchor]) in r.labels" :key="`${x}-${y}`" class="card-lbl" :class="{ hl: linked(r) }"
              :x="x" :y="y" :text-anchor="anchor">{{ text }}</text>
      </g>
      <g v-for="e in entities" :key="e.id" class="ent" :class="{ hl: ends?.has(e.id) }" tabindex="0" role="group" :aria-label="e.name"
         @mouseenter="active = e.id" @mouseleave="active = null" @focus="active = e.id" @blur="active = null">
        <rect class="box" :x="e.x" :y="e.y" :width="W" :height="boxH(e)" rx="6" />
        <rect class="head" :x="e.x" :y="e.y" :width="W" :height="HEAD" rx="6" />
        <text class="head-t" :x="e.x + 12" :y="e.y + 19">{{ e.name }}</text>
        <g v-for="([key, name], i) in e.attrs" :key="name">
          <text v-if="key" :class="`k-${key.toLowerCase()}`" :x="e.x + 12" :y="rowY(e, i)">{{ key }}</text>
          <text class="attr" :x="e.x + 44" :y="rowY(e, i)">{{ name }}</text>
        </g>
      </g>
    </svg>
    </div>
    <ul class="legend" aria-label="Leyenda">
      <li><b>PK</b> clave primaria</li>
      <li><b>FK</b> clave externa</li>
      <li><b>1</b> y <b>N</b> cardinalidad</li>
    </ul>
  </figure>
</template>

<style scoped>
.card{max-width:680px;margin:0 auto;padding:20px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px;font-weight:600}
.card p{margin:2px 0 12px;color:var(--muted)}
svg{display:block;width:100%;height:auto}
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.scroll:focus-visible{outline:2px solid var(--accent)}
.scroll>svg{min-width:680px}
.rel{fill:none;stroke:var(--muted);stroke-width:1.5;transition:stroke .15s,opacity .15s}
.rel.hl{stroke:var(--accent);stroke-width:2.5}
.card-lbl{fill:var(--muted);font-size:12px;font-weight:600;transition:opacity .15s}
.card-lbl.hl{fill:var(--accent)}
.ent{cursor:pointer;transition:opacity .15s}
.box{fill:var(--bg);stroke:var(--border);stroke-width:1}
.ent.hl .box{stroke:var(--accent)}
.ent:focus-visible .box{stroke:var(--accent);stroke-width:2}
.head{fill:var(--accent)}
.head-t{fill:var(--accent-ink);font-size:13px;font-weight:600}
.k-pk{fill:var(--accent);font-size:11px;font-weight:700}
.k-fk{fill:var(--muted);font-size:11px;font-weight:700}
.attr{fill:var(--text);font-size:12px}
svg.active .ent:not(.hl),svg.active .rel:not(.hl),svg.active .card-lbl:not(.hl){opacity:.35}
.legend{display:flex;flex-wrap:wrap;gap:6px 16px;margin:12px 0 0;padding:0;list-style:none;color:var(--muted);font-size:13px}
.legend b{color:var(--text);font-weight:600}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
