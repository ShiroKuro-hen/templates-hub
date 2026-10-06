<script setup lang="ts">
type Row = { region: string; valores: number[] };

withDefaults(defineProps<{ rows?: Row[]; cols?: string[] }>(), {
  cols: () => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
  rows: () => [
    { region: 'Norte', valores: [124, 131, 140, 138, 152, 160, 149, 171] },
    { region: 'Centro', valores: [210, 198, 225, 231, 240, 236, 219, 250] },
    { region: 'Sur', valores: [96, 104, 99, 112, 118, 125, 130, 121] },
    { region: 'Este', valores: [143, 150, 147, 155, 162, 158, 166, 174] },
  ],
});
const fmt = new Intl.NumberFormat('es-ES');
const total = (v: number[]) => fmt.format(v.reduce((a, b) => a + b, 0));
</script>

<template>
  <div class="wrap" tabindex="0" role="region" aria-labelledby="cap">
    <table>
      <caption id="cap" hidden>Ingresos mensuales por región en miles de euros</caption>
      <thead>
        <tr>
          <th scope="col" class="fix">Región</th>
          <th v-for="c in cols" :key="c" scope="col" class="num">{{ c }}</th>
          <th scope="col" class="num">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.region">
          <th scope="row" class="fix">{{ r.region }}</th>
          <td v-for="(v, i) in r.valores" :key="i" class="num">{{ fmt.format(v) }}</td>
          <td class="num">{{ total(r.valores) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="hint">Desplaza la tabla en horizontal; la región y la cabecera se quedan fijas.</p>
</template>

<style scoped>
.wrap{max-height:280px;overflow:auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
table{border-collapse:separate;border-spacing:0;min-width:100%}
th,td{padding:10px 16px;text-align:left;white-space:nowrap;border-bottom:1px solid var(--border);background:var(--surface)}
tbody tr:last-child>*{border-bottom:0}
thead th{position:sticky;top:0;z-index:1;font-weight:600;color:var(--muted)}
th[scope=row]{font-weight:600}
.fix{position:sticky;left:0;z-index:2}
thead .fix{z-index:3}
.fix::after{content:"";position:absolute;top:0;right:0;bottom:0;width:1px;background:linear-gradient(180deg,#22d3ee,#2f5bff)}
.num{text-align:right;font-variant-numeric:tabular-nums}
tbody tr:hover>*{background:var(--accent-soft)}
tbody tr>*{transition:background .14s}
.hint{margin:8px 0 0;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
