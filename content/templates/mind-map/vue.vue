<script setup lang="ts">
import { computed, ref } from 'vue';

type Tone = 'accent' | 'ok' | 'warn' | 'info' | 'err';
type Branch = { id: string; name: string; tone: Tone; x: number; y: number; leaves: [string, number, number][] };
type Point = [number, number];

const branches: Branch[] = [
  { id: 'producto', name: 'Producto', tone: 'accent', x: 380, y: 110, leaves: [['Catálogo', 200, 50], ['Inventario', 560, 50]] },
  { id: 'clientes', name: 'Clientes', tone: 'ok', x: 640, y: 190, leaves: [['Cuentas', 640, 250], ['Soporte', 640, 300]] },
  { id: 'ventas', name: 'Ventas', tone: 'warn', x: 620, y: 410, leaves: [['Pedidos', 530, 500], ['Cobros', 690, 500]] },
  { id: 'operaciones', name: 'Operaciones', tone: 'info', x: 140, y: 410, leaves: [['Logística', 75, 500], ['Compras', 230, 500]] },
  { id: 'equipo', name: 'Equipo', tone: 'err', x: 120, y: 190, leaves: [['Roles', 80, 120], ['Formación', 80, 280]] },
];
const CENTER: Point = [380, 280];

const curve = ([x1, y1]: Point, [x2, y2]: Point) => {
  const k = 0.18, dx = x2 - x1, dy = y2 - y1;
  return `M${x1},${y1} Q${(x1 + x2) / 2 - dy * k},${(y1 + y2) / 2 + dx * k} ${x2},${y2}`;
};
const links = computed(() =>
  branches.flatMap((b) => [
    { key: b.id, id: b.id, tone: b.tone, d: curve(CENTER, [b.x, b.y]) },
    ...b.leaves.map(([, x, y]) => ({ key: `${b.id}-${x}-${y}`, id: b.id, tone: b.tone, d: curve([b.x, b.y], [x, y]) })),
  ]),
);

const hover = ref<string | null>(null);
const pinned = ref<string | null>(null);
const focus = computed(() => hover.value ?? pinned.value);
const toggle = (id: string) => { pinned.value = pinned.value === id ? null : id; };
</script>

<template>
  <figure class="card">
    <figcaption>
      <h2>Mapa mental de la tienda online</h2>
      <p>Cinco ramas principales con sus áreas. Pasa el cursor o enfoca una rama para destacarla; Enter la fija.</p>
    </figcaption>
    <div class="scroll" role="region" tabindex="0" aria-label="Diagrama desplazable horizontalmente">
    <svg :class="{ active: focus }" viewBox="0 0 760 560" role="img" aria-labelledby="map-t map-d">
      <title id="map-t">Mapa mental de la tienda online</title>
      <desc id="map-d">Tema central Tienda online con cinco ramas: Producto, Clientes, Ventas, Operaciones y Equipo, cada una con dos áreas.</desc>
      <path v-for="l in links" :key="l.key" class="link" :class="{ on: focus === l.id }" :style="{ stroke: `var(--${l.tone})` }" :d="l.d" />
      <g class="center">
        <rect class="shape" x="292" y="252" width="176" height="56" rx="28" />
        <text class="label" x="380" y="285" text-anchor="middle">Tienda online</text>
      </g>
      <g v-for="b in branches" :key="b.id">
        <g class="branch" :class="{ on: focus === b.id }" role="button" tabindex="0" :aria-pressed="pinned === b.id" :aria-label="`Rama ${b.name}`"
           @mouseenter="hover = b.id" @mouseleave="hover = null" @focus="hover = b.id" @blur="hover = null"
           @click="toggle(b.id)" @keydown.enter.prevent="toggle(b.id)" @keydown.space.prevent="toggle(b.id)">
          <rect class="shape" :x="b.x - 75" :y="b.y - 18" width="150" height="36" rx="18"
                :style="{ fill: `var(--${b.tone}-soft)`, stroke: `var(--${b.tone})` }" />
          <text class="label" :x="b.x" :y="b.y + 5" text-anchor="middle">{{ b.name }}</text>
        </g>
        <g v-for="([text, x, y]) in b.leaves" :key="text" class="leaf" :class="{ on: focus === b.id }">
          <rect class="shape" :x="x - 65" :y="y - 13" width="130" height="26" rx="13" />
          <text class="label" :x="x" :y="y + 4" text-anchor="middle">{{ text }}</text>
        </g>
      </g>
    </svg>
    </div>
  </figure>
</template>

<style scoped>
.card{max-width:760px;margin:0 auto;padding:20px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px;font-weight:600}
.card p{margin:2px 0 12px;color:var(--muted)}
svg{display:block;width:100%;height:auto}
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.scroll:focus-visible{outline:2px solid var(--accent)}
.scroll>svg{min-width:697px}
.link{fill:none;stroke-width:2;transition:opacity .2s}
.center .shape{fill:var(--accent)}
.center .label{fill:var(--accent-ink);font-size:15px;font-weight:600}
.branch{cursor:pointer;outline:none;transition:opacity .2s}
.branch .shape{stroke-width:1.5}
.branch .label{fill:var(--text);font-size:13px;font-weight:600}
.branch[aria-pressed="true"] .shape,.branch:focus-visible .shape{stroke-width:3}
.branch:focus-visible .shape{stroke:var(--accent)}
.leaf{transition:opacity .2s}
.leaf .shape{fill:var(--bg);stroke:var(--border);stroke-width:1}
.leaf .label{fill:var(--muted);font-size:12px}
svg.active .link:not(.on),svg.active .branch:not(.on),svg.active .leaf:not(.on){opacity:.3}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
