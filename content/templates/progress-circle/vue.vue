<script setup lang="ts">
import { ref } from 'vue';

type Ring = { label: string; detail: string; value: number };
const migracion = ref(72);
const anillos = (): Ring[] => [
  { label: 'Migración de datos', detail: '18 de 25 tablas', value: migracion.value },
  { label: 'Tareas completadas', detail: '27 de 60 tareas', value: 45 },
  { label: 'Cuota de API', detail: 'Cerca del límite', value: 94 },
];
</script>

<template>
  <section class="card" aria-labelledby="pc-titulo">
    <svg width="0" height="0" aria-hidden="true" style="position:absolute">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
    </svg>
    <h2 id="pc-titulo">Estado del espacio de trabajo</h2>
    <div class="grid">
      <figure v-for="(r, i) in anillos()" :key="i" class="ring">
        <div class="dial" :class="{ crit: r.value > 90 }" :style="{ '--p': r.value }" role="progressbar"
             :aria-labelledby="`pc-l${i}`" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="r.value">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle class="track" cx="60" cy="60" r="52" />
            <circle class="fill" cx="60" cy="60" r="52" pathLength="100" />
          </svg>
          <span class="val" aria-hidden="true"><span>{{ r.value }}<small>%</small></span></span>
        </div>
        <figcaption :id="`pc-l${i}`">{{ r.label }}<small>{{ r.detail }}</small></figcaption>
      </figure>
    </div>
    <div class="ctl">
      <label for="pc-sim">Simular avance de la migración</label>
      <input id="pc-sim" v-model.number="migracion" type="range" min="0" max="100">
    </div>
  </section>
</template>

<style scoped>
.card{max-width:640px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;padding:16px 20px;border-bottom:1px solid var(--border);font-size:16px;font-weight:600}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:24px 16px;padding:24px 20px}
.ring{margin:0;text-align:center}
.dial{position:relative;width:112px;height:112px;margin:0 auto}
.dial svg{display:block;width:100%;height:100%;transform:rotate(-90deg)}
circle{fill:none;stroke-width:9}
.track{stroke:var(--border)}
.fill{stroke:url(#g);stroke-linecap:round;stroke-dasharray:var(--p) 100;transition:stroke-dasharray .6s cubic-bezier(.2,.8,.2,1);animation:fill .9s cubic-bezier(.2,.8,.2,1)}
.crit .fill{stroke:var(--err)}
@keyframes fill{from{stroke-dasharray:0 100}}
.val{position:absolute;inset:0;display:grid;place-content:center;font-size:26px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1}
.val small{margin-left:1px;color:var(--muted);font-size:13px;font-weight:400}
figcaption{margin-top:12px;font-weight:600}
figcaption small{display:block;color:var(--muted);font-weight:400;font-variant-numeric:tabular-nums}
.ctl{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;padding:14px 20px;border-top:1px solid var(--border)}
.ctl label{font-weight:600}
.ctl input{flex:1;min-width:140px;accent-color:var(--accent)}
.ctl input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.fill{animation:none;transition:none}}
/* Tokens: ver pestaña HTML + CSS */
</style>
