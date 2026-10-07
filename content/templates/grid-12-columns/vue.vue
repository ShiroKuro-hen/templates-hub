<script setup lang="ts">
import { ref } from 'vue';

type Col = [number, number?, number?]; // sm, md, lg
const fix = (...n: number[]): Col[] => n.map((v) => [v]);
const ejemplos: [string, string, Col[]][] = [
  ['Una columna', '12', fix(12)],
  ['Mitad y mitad', '6 + 6', fix(6, 6)],
  ['Tercios', '4 + 4 + 4', fix(4, 4, 4)],
  ['Contenido y lateral', '8 + 4', fix(8, 4)],
  ['Cuartos', '3 + 3 + 3 + 3', fix(3, 3, 3, 3)],
  ['Centrado', '2 + 8 + 2', fix(2, 8, 2)],
  ['Tarjetas adaptables', 'sm 12, md 6, lg 3', [[12, 6, 3], [12, 6, 3], [12, 6, 3], [12, 6, 3]]],
  ['Lateral adaptable', 'sm 12, md 4 y 8, lg 3 y 9', [[12, 4, 3], [12, 8, 9]]],
];
const breakpoints = [['sm', '0 a 639 px', '--sm'], ['md', '640 a 899 px', '--md'], ['lg', '900 px o más', '--lg']];
const guias = ref(true);
</script>

<template>
  <section class="card" :class="{ guias }" aria-labelledby="t">
    <div class="head">
      <div><h2 id="t">Sistema de 12 columnas</h2><p>Punto de quiebre actual:<span class="bp" /></p></div>
      <label class="sw"><input v-model="guias" type="checkbox" />Mostrar columnas</label>
    </div>
    <div v-for="[titulo, desc, cols] in ejemplos" :key="titulo" class="ex">
      <p class="lb"><b>{{ titulo }}</b><code>{{ desc }}</code></p>
      <div class="row">
        <div v-for="([sm, md, lg], i) in cols" :key="i" class="col" :style="{ '--sm': sm, '--md': md, '--lg': lg }">{{ md ? i + 1 : `col-${sm}` }}</div>
      </div>
    </div>
    <table aria-label="Puntos de quiebre">
      <thead><tr><th scope="col">Nombre</th><th scope="col">Ancho del contenedor</th><th scope="col">Regla</th></tr></thead>
      <tbody>
        <tr v-for="[n, ancho, v] in breakpoints" :key="n" :class="n"><th scope="row">{{ n }}</th><td>{{ ancho }}</td><td><code>{{ v }}</code></td></tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.card{container-type:inline-size;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px}
h2{margin:0;font-size:16px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.sw{display:flex;align-items:center;gap:8px;color:var(--muted);cursor:pointer}
.sw input{accent-color:var(--accent);margin:0}
.sw:has(:focus-visible){outline:2px solid var(--accent);outline-offset:4px;border-radius:4px}
.bp{margin-left:8px;padding:0 10px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff);color:#0a0f1c;font-weight:600}
.bp::after{content:"sm"}
.ex{margin-bottom:16px}
.lb{display:flex;flex-wrap:wrap;justify-content:space-between;gap:0 12px;margin:0 0 6px}
.lb b{font-weight:600}
code{font:12px ui-monospace,"Cascadia Code",Menlo,monospace;color:var(--muted)}
.row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px}
.guias .row{background:linear-gradient(90deg,var(--accent-soft) calc(100% - 12px),transparent 0) 0 0/calc((100% + 12px)/12) 100% repeat-x}
.col{grid-column:span var(--sm,12);display:grid;place-items:center;min-height:44px;padding:4px;border:1px solid var(--accent);border-radius:var(--radius);background:color-mix(in srgb,var(--surface) 75%,transparent);font-variant-numeric:tabular-nums;overflow:hidden}
table{width:100%;margin-top:8px;border-collapse:collapse;font-variant-numeric:tabular-nums}
th,td{padding:8px 12px;border-bottom:1px solid var(--border);text-align:left}
th{color:var(--muted);font-weight:500}
tr.sm{background:var(--accent-soft)}
@container (min-width:640px){.col{grid-column:span var(--md,var(--sm,12))}.bp::after{content:"md"}tr.sm{background:none}tr.md{background:var(--accent-soft)}}
@container (min-width:900px){.col{grid-column:span var(--lg,var(--md,var(--sm,12)))}.bp::after{content:"lg"}tr.md{background:none}tr.lg{background:var(--accent-soft)}}
/* Tokens: ver pestaña HTML + CSS */
</style>
