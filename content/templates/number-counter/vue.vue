<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';

const metrics = [
  { label: 'Usuarios activos', to: 128450, dec: 0, unit: '', pct: 86, note: '86 % de la meta anual' },
  { label: 'Disponibilidad', to: 99.98, dec: 2, unit: '%', pct: 100, note: 'Objetivo de servicio cumplido' },
  { label: 'Latencia mediana', to: 182, dec: 0, unit: 'ms', pct: 64, note: '64 % del presupuesto de 285 ms' },
  { label: 'Pedidos procesados', to: 1284560, dec: 0, unit: '', pct: 72, note: '72 % de la capacidad contratada' },
];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const t = reactive<number[]>(metrics.map(() => (calm ? 1 : 0)));
const els = ref<HTMLElement[]>([]);
const raf: number[] = [];
let io: IntersectionObserver;

const fmt = (n: number, d: number) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });

function run(i: number) {
  cancelAnimationFrame(raf[i]);
  const t0 = performance.now();
  const f = (now: number) => {
    const p = Math.min((now - t0) / 1400, 1);
    t[i] = 1 - (1 - p) ** 3;
    if (p < 1) raf[i] = requestAnimationFrame(f);
  };
  raf[i] = requestAnimationFrame(f);
}
const repeat = () => metrics.forEach((_, i) => run(i));

onMounted(() => {
  if (calm) return;
  io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    run(els.value.indexOf(e.target as HTMLElement));
    io.unobserve(e.target);
  }), { threshold: 0.4 });
  els.value.forEach((el) => io.observe(el));
});
onBeforeUnmount(() => { io?.disconnect(); raf.forEach(cancelAnimationFrame); });
</script>

<template>
  <div class="head">
    <div><h1>Resumen del trimestre</h1><p>Las cifras cuentan hasta su valor al entrar en vista.</p></div>
    <button v-if="!calm" class="btn" type="button" @click="repeat">Repetir</button>
  </div>
  <dl class="grid">
    <div v-for="(m, i) in metrics" :key="m.label" ref="els" class="stat" :style="{ '--p': m.pct, '--t': t[i] }">
      <dt>{{ m.label }}</dt>
      <dd class="num"><span>{{ fmt(m.to * t[i], m.dec) }}</span><small v-if="m.unit">{{ m.unit }}</small></dd>
      <div class="meter" aria-hidden="true"><i /></div>
      <p class="cap">{{ m.note }}</p>
    </div>
  </dl>
</template>

<style scoped>
.head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:16px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.btn{padding:7px 14px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;font-weight:600;cursor:pointer;transition:border-color .14s,background .14s}
.btn:hover{border-color:var(--accent);background:var(--accent-soft)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin:0;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.stat{padding:18px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
dt{color:var(--muted)}
dd{margin:0}
.num{margin:6px 0 14px;font-size:30px;font-weight:700;line-height:1.1;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.num small{margin-left:4px;font-size:15px;font-weight:600;color:var(--muted)}
.meter{height:4px;border-radius:999px;background:var(--accent-soft);overflow:hidden}
.meter i{display:block;height:100%;width:calc(var(--p) * var(--t, 1) * 1%);border-radius:inherit;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.cap{margin:6px 0 0;color:var(--muted);font-size:13px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
