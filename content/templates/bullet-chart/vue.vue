<script setup lang="ts">
import { ref } from 'vue';

// r: límites bajo / medio / alto (el último es el máximo de la escala)
const kpis = [
  { n: 'Ingresos', u: 'miles USD', v: 270, t: 250, r: [150, 210, 300] },
  { n: 'Clientes nuevos', u: 'altas', v: 182, t: 220, r: [120, 180, 260] },
  { n: 'Satisfacción', u: 'NPS', v: 61, t: 55, r: [35, 50, 80] },
  { n: 'Retención', u: '%', v: 91, t: 94, r: [80, 90, 100] },
];
const rangos = ref(true);
const f = (n: number) => n.toLocaleString('es');
const p = (k: (typeof kpis)[number], x: number) => `${((x / k.r[2]) * 100).toFixed(2)}%`;
const pct = (k: (typeof kpis)[number]) => Math.round((k.v / k.t) * 100);
const estado = (k: (typeof kpis)[number]) =>
  k.v >= k.t ? { c: 'ok', t: 'Objetivo superado' } : k.v >= k.t * 0.9 ? { c: 'warn', t: 'Cerca del objetivo' } : { c: 'err', t: 'Por debajo' };
</script>

<template>
  <section class="card" aria-labelledby="t">
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
    </svg>
    <div class="head">
      <div><h2 id="t">Objetivos del trimestre</h2><p>Valor actual frente a la meta, con rangos de desempeño.</p></div>
      <label class="sw"><input v-model="rangos" type="checkbox" />Mostrar rangos</label>
    </div>
    <ul :class="{ off: !rangos }">
      <li v-for="k in kpis" :key="k.n">
        <div class="top">
          <span class="name">{{ k.n }}<small>{{ k.u }}</small></span>
          <span class="val"><b>{{ f(k.v) }}</b> de {{ f(k.t) }}<span class="badge" :class="estado(k).c">{{ estado(k).t }}, {{ pct(k) }} %</span></span>
        </div>
        <svg class="b" role="img" :aria-label="`${k.n}: ${f(k.v)} ${k.u}, objetivo ${f(k.t)}, ${pct(k)} % del objetivo. ${estado(k).t}.`">
          <rect class="r3" width="100%" height="28" />
          <rect class="r2" :width="p(k, k.r[1])" height="28" />
          <rect class="r1" :width="p(k, k.r[0])" height="28" />
          <rect class="bar" :class="{ met: k.v >= k.t }" y="10" :width="p(k, k.v)" height="8" rx="2" />
          <line class="tg" :x1="p(k, k.t)" :x2="p(k, k.t)" y1="4" y2="24" />
        </svg>
      </li>
    </ul>
    <p class="key" aria-hidden="true">
      <span><i style="background:var(--muted);opacity:.38" />Bajo</span>
      <span><i style="background:var(--muted);opacity:.22" />Medio</span>
      <span><i style="background:var(--muted);opacity:.1" />Alto</span>
      <span><i style="background:var(--accent)" />Valor</span>
      <span><i class="t" />Objetivo</span>
    </p>
  </section>
</template>

<style scoped>
.card{padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:20px}
h2{margin:0;font-size:16px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.sw{display:flex;align-items:center;gap:8px;color:var(--muted);cursor:pointer}
.sw input{accent-color:var(--accent);margin:0}
.sw:has(:focus-visible){outline:2px solid var(--accent);outline-offset:4px;border-radius:4px}
ul{list-style:none;margin:0;padding:0;display:grid;gap:20px}
.top{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 12px;margin-bottom:6px}
.name{font-weight:600}
.name small{margin-left:8px;color:var(--muted);font-weight:400}
.val{font-variant-numeric:tabular-nums;color:var(--muted)}
.val b{color:var(--text);font-size:16px}
.badge{display:inline-flex;align-items:center;gap:6px;margin-left:8px;padding:0 10px;border-radius:999px;font-size:12px;color:var(--text)}
.badge::before{content:"";width:6px;height:6px;border-radius:50%}
.badge.ok{background:var(--ok-soft)}.badge.ok::before{background:var(--ok)}
.badge.warn{background:var(--warn-soft)}.badge.warn::before{background:var(--warn)}
.badge.err{background:var(--err-soft)}.badge.err::before{background:var(--err)}
svg.b{display:block;width:100%;height:28px;border-radius:4px;overflow:hidden}
.r1{fill:var(--muted);fill-opacity:.38}.r2{fill:var(--muted);fill-opacity:.22}.r3{fill:var(--muted);fill-opacity:.1}
.off svg.b rect[class^=r]{fill-opacity:0}
.bar{fill:var(--accent)}.bar.met{fill:url(#g)}
.tg{stroke:var(--text);stroke-width:3}
.key{display:flex;flex-wrap:wrap;gap:8px 20px;margin:20px 0 0;padding:12px 0 0;border-top:1px solid var(--border);color:var(--muted);font-size:13px}
.key span{display:inline-flex;align-items:center;gap:8px}
.key i{display:inline-block;width:20px;height:10px;border-radius:2px}
.key i.t{width:3px;height:16px;background:var(--text);border-radius:0}
/* Tokens: ver pestaña HTML + CSS */
</style>
