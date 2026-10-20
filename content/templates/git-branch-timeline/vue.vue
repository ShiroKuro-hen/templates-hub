<script setup lang="ts">
import { computed, ref } from 'vue';

type Rama = 'main' | 'login' | 'pagos';
type Commit = { hash: string; mensaje: string; autor: string; fecha: string; rama: Rama; x: number; y: number };

const RAMAS: Record<Rama, { etiqueta: string; color: string }> = {
  main: { etiqueta: 'main', color: 'var(--accent)' },
  login: { etiqueta: 'feature/login', color: 'var(--ok)' },
  pagos: { etiqueta: 'feature/pagos', color: 'var(--warn)' },
};
const CARRILES: { rama: Rama; d: string }[] = [
  { rama: 'main', d: 'M40 50V442' },
  { rama: 'pagos', d: 'M40 50C40 78 140 78 140 106V162C140 190 40 190 40 218' },
  { rama: 'login', d: 'M40 386C40 358 90 358 90 330V274' },
];
const COMMITS: Commit[] = [
  { hash: 'e41d0a2', mensaje: 'Fusiona feature/pagos en main', autor: 'Lucía Ruiz', fecha: 'hace 1 día', rama: 'main', x: 40, y: 50 },
  { hash: '9c7f3b1', mensaje: 'Añade reintentos al cobro', autor: 'Mateo Ortiz', fecha: 'hace 2 días', rama: 'pagos', x: 140, y: 106 },
  { hash: '5b2e8d4', mensaje: 'Integra la pasarela de pago', autor: 'Mateo Ortiz', fecha: 'hace 3 días', rama: 'pagos', x: 140, y: 162 },
  { hash: '3f8a6c2', mensaje: 'Corrige el redondeo de totales', autor: 'Ana Gil', fecha: 'hace 4 días', rama: 'main', x: 40, y: 218 },
  { hash: 'd62b9e1', mensaje: 'Pantalla de inicio de sesión', autor: 'Ana Gil', fecha: 'hace 5 días', rama: 'login', x: 90, y: 274 },
  { hash: 'b1d4e77', mensaje: 'Valida el formato del correo', autor: 'Carlos Pérez', fecha: 'hace 6 días', rama: 'login', x: 90, y: 330 },
  { hash: '7c02a9e', mensaje: 'Añade CI con pruebas', autor: 'Lucía Ruiz', fecha: 'hace 1 semana', rama: 'main', x: 40, y: 386 },
  { hash: 'a0f13c5', mensaje: 'Versión 2.3.0', autor: 'Lucía Ruiz', fecha: 'hace 2 semanas', rama: 'main', x: 40, y: 442 },
];
const PISTA_TITULO = 'Ningún commit seleccionado';
const PISTA = 'Pasa el cursor o enfoca un commit para ver su detalle.';

const activo = ref<number | null>(null);
const commit = computed(() => (activo.value === null ? null : COMMITS[activo.value]));
const colorDe = (rama: Rama) => ({ '--c': RAMAS[rama].color });
const leyenda = Object.keys(RAMAS) as Rama[];
</script>

<template>
  <figure class="card">
    <figcaption>
      <h2>Ramas y fusiones</h2>
      <p>Cada línea es una rama. Pasa el cursor o enfoca un commit para ver su detalle y resaltar su rama.</p>
    </figcaption>
    <div class="scroll" role="region" tabindex="0" aria-label="Grafo de commits desplazable horizontalmente">
      <svg id="graph" :class="{ active: commit }" viewBox="0 0 560 480" role="img" aria-labelledby="g-t g-d" @pointerleave="activo = null">
        <title id="g-t">Grafo de commits con main y dos ramas</title>
        <desc id="g-d">La rama main recibe la fusión de feature/pagos. feature/login sale de main y aún no está fusionada. Cada commit muestra su hash, su mensaje, su autor y la fecha relativa.</desc>
        <path v-for="c in CARRILES" :key="c.rama" class="lane" :class="{ on: commit?.rama === c.rama }" :d="c.d" :style="colorDe(c.rama)" />
        <g v-for="(c, i) in COMMITS" :key="c.hash" class="commit" :class="{ on: activo === i }" tabindex="0" role="group"
           :aria-label="`${c.hash} ${c.mensaje}, ${c.autor}, ${c.fecha}`" :style="colorDe(c.rama)"
           @pointerover="activo = i" @focus="activo = i" @blur="activo = null">
          <rect class="row" :x="10" :y="c.y - 26" :width="540" :height="52" :rx="6" />
          <circle class="dot" :cx="c.x" :cy="c.y" :r="6" />
          <text :x="170" :y="c.y - 5"><tspan class="hash">{{ c.hash }}</tspan><tspan :dx="8">{{ c.mensaje }}</tspan></text>
          <text class="meta" :x="170" :y="c.y + 13">{{ `${c.autor} · ${c.fecha}` }}</text>
        </g>
      </svg>
    </div>
    <p class="panel" aria-live="polite">
      <strong>{{ commit ? commit.mensaje : PISTA_TITULO }}</strong>
      <span>{{ commit ? `${commit.hash} · ${commit.autor} · ${commit.fecha} · rama ${RAMAS[commit.rama].etiqueta}` : PISTA }}</span>
    </p>
    <ul class="legend" aria-label="Leyenda de ramas">
      <li v-for="r in leyenda" :key="r"><i :style="colorDe(r)" />{{ RAMAS[r].etiqueta }}</li>
    </ul>
  </figure>
</template>

<style scoped>
.card{max-width:620px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px;font-weight:600}
.card p{margin:2px 0 12px;color:var(--muted)}
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.scroll>svg{display:block;width:100%;height:auto;min-width:514px}
.scroll:focus-visible{outline:2px solid var(--accent)}
text{font-size:13px;line-height:1;fill:var(--text)}
.hash{font:600 12px ui-monospace,Consolas,monospace}
.meta{font-size:12px;fill:var(--muted)}
.lane{fill:none;stroke:var(--c);stroke-width:3;transition:opacity .15s,stroke-width .15s}
.dot{fill:var(--c);stroke:var(--surface);stroke-width:2}
.row{fill:transparent}
.commit{outline:none}
.commit:focus-visible{outline:none}
.commit.on .row{stroke:var(--accent);stroke-width:2}
svg.active .lane:not(.on){opacity:.3}
svg.active .lane.on{stroke-width:5}
.panel{min-height:3.2em;margin:12px 0 0;padding-top:10px;border-top:1px solid var(--border)}
.panel strong{display:block;font-weight:600}
.panel span{display:block;color:var(--muted);font-size:13px}
.legend{display:flex;flex-wrap:wrap;gap:6px 16px;margin:12px 0 0;padding:0;list-style:none;color:var(--muted);font-size:13px}
.legend li{display:flex;align-items:center;gap:6px}
.legend i{width:10px;height:10px;border-radius:3px;background:var(--c)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
