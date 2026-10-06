<script setup lang="ts">
import { computed, ref } from 'vue';

type Item = { nombre: string; fecha: string; mb: number };
type Orden = 'reciente' | 'antiguo' | 'az' | 'za' | 'tamano';

const items: Item[] = [
  { nombre: 'Portal de clientes', fecha: '2026-09-28', mb: 482 },
  { nombre: 'Migración a Postgres', fecha: '2026-08-14', mb: 1260 },
  { nombre: 'Rediseño de facturación', fecha: '2026-09-02', mb: 214 },
  { nombre: 'API de pagos', fecha: '2026-07-21', mb: 96 },
  { nombre: 'Panel de analítica', fecha: '2026-10-01', mb: 738 },
  { nombre: 'Auditoría de accesos', fecha: '2026-06-30', mb: 58 },
];
const opciones: [Orden, string][] = [
  ['reciente', 'Más recientes'], ['antiguo', 'Más antiguos'], ['az', 'Nombre (A a Z)'], ['za', 'Nombre (Z a A)'], ['tamano', 'Mayor tamaño'],
];
const sorters: Record<Orden, (a: Item, b: Item) => number> = {
  reciente: (a, b) => b.fecha.localeCompare(a.fecha),
  antiguo: (a, b) => a.fecha.localeCompare(b.fecha),
  az: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
  za: (a, b) => b.nombre.localeCompare(a.nombre, 'es'),
  tamano: (a, b) => b.mb - a.mb,
};
const orden = ref<Orden>('reciente');
const sorted = computed(() => [...items].sort(sorters[orden.value]));
const etiqueta = computed(() => opciones.find(([v]) => v === orden.value)![1]);
const fmt = (d: string) => new Date(d + 'T00:00').toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
</script>

<template>
  <div class="box">
    <div class="bar">
      <h2>{{ items.length }} proyectos</h2>
      <label for="s">Ordenar por
        <span class="sel">
          <select id="s" v-model="orden"><option v-for="[v, t] in opciones" :key="v" :value="v">{{ t }}</option></select>
        </span>
      </label>
    </div>
    <ol>
      <li v-for="i in sorted" :key="i.nombre">
        <span>{{ i.nombre }}<small>Actualizado el <time :datetime="i.fecha">{{ fmt(i.fecha) }}</time></small></span>
        <output>{{ i.mb }} MB</output>
      </li>
    </ol>
    <p class="sr" aria-live="polite">Lista ordenada: {{ etiqueta }}.</p>
  </div>
</template>

<style scoped>
.box{max-width:620px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border)}
.bar h2{margin:0;font-size:14px;font-weight:600;font-variant-numeric:tabular-nums}
.bar label{display:flex;align-items:center;gap:8px;color:var(--muted)}
.sel{position:relative}
.sel::after{content:"";position:absolute;right:12px;top:50%;width:6px;height:6px;border:solid var(--muted);border-width:0 1.5px 1.5px 0;transform:translateY(-70%) rotate(45deg);pointer-events:none}
select{appearance:none;font:inherit;color:var(--text);padding:6px 32px 6px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:border-color .14s}
select:hover{border-color:var(--accent)}
select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
ol{list-style:none;margin:0;padding:0}
li{position:relative;display:flex;justify-content:space-between;gap:12px;padding:12px 16px;border-top:1px solid var(--border)}
li:first-child{border-top:0}
li:first-child::before{content:"";position:absolute;left:0;top:10px;bottom:10px;width:3px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
li span{font-weight:600}
li small{display:block;color:var(--muted);font-weight:400}
li output{color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
