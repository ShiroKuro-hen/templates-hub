<script setup lang="ts">
type Meter = { id: string; label: string; used: number; max: number; unit?: string; free: string };

withDefaults(defineProps<{ meters?: Meter[] }>(), {
  meters: () => [
    { id: 'storage', label: 'Almacenamiento', used: 42.6, max: 100, unit: ' GB', free: 'Quedan 57,4 GB.' },
    { id: 'users', label: 'Usuarios', used: 18, max: 25, free: 'Quedan 7 puestos.' },
    { id: 'api', label: 'Llamadas a la API', used: 91400, max: 100000, free: 'Quedan 8.600 llamadas este mes.' },
    { id: 'domains', label: 'Dominios personalizados', used: 5, max: 5, free: 'Elimina un dominio o mejora el plan para añadir otro.' },
  ],
});

const fmt = (n: number) => n.toLocaleString('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions);
const level = (m: Meter) => (m.used >= m.max ? 'err' : m.used / m.max >= 0.8 ? 'warn' : undefined);
</script>

<template>
  <section class="plan" aria-labelledby="um-t">
    <div class="head">
      <div><h2 id="um-t">Uso del plan</h2><p>Plan Business. Se renueva el 1 de noviembre.</p></div>
      <button type="button" class="btn">Mejorar plan</button>
    </div>
    <ul>
      <li v-for="m in meters" :key="m.id">
        <div class="top">
          <label :for="`um-${m.id}`">{{ m.label }}</label>
          <span class="val"><b>{{ fmt(m.used) }}</b> de {{ fmt(m.max) }}{{ m.unit }}</span>
        </div>
        <progress :id="`um-${m.id}`" :class="level(m)" :value="m.used" :max="m.max">{{ Math.round((m.used / m.max) * 100) }} %</progress>
        <p class="note">
          <span v-if="level(m)" class="badge" :class="`b-${level(m)}`">{{ level(m) === 'err' ? 'Límite alcanzado' : 'Cerca del límite' }}</span>
          {{ m.free }}
        </p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.plan{max-width:560px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
h2{margin:0;font-size:18px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.btn{padding:6px 14px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--accent-ink);font:inherit;font-weight:600;cursor:pointer;transition:filter .14s}
.btn:hover{filter:brightness(1.08)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
ul{margin:20px 0 0;padding:0;list-style:none;display:grid;gap:20px}
.top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:0 12px;margin-bottom:6px}
.top label{font-weight:600}
.val{color:var(--muted);font-variant-numeric:tabular-nums}
.val b{color:var(--text);font-weight:600}
progress{display:block;width:100%;height:8px;border:0;border-radius:999px;appearance:none;-webkit-appearance:none;background:var(--border);overflow:hidden}
progress::-webkit-progress-bar{background:var(--border);border-radius:999px}
progress::-webkit-progress-value{background:linear-gradient(90deg,#22d3ee,#2f5bff);border-radius:999px;transition:width .16s}
progress::-moz-progress-bar{background:var(--accent);border-radius:999px}
progress.warn::-webkit-progress-value{background:var(--warn)}
progress.warn::-moz-progress-bar{background:var(--warn)}
progress.err::-webkit-progress-value{background:var(--err)}
progress.err::-moz-progress-bar{background:var(--err)}
.note{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin:6px 0 0;color:var(--muted);font-variant-numeric:tabular-nums}
.badge{display:inline-flex;align-items:center;gap:6px;padding:0 8px;border-radius:999px;font-size:12px;font-weight:600;color:var(--text)}
.badge::before{content:"";width:8px;height:8px;border-radius:999px}
.b-warn{background:var(--warn-soft)} .b-warn::before{background:var(--warn)}
.b-err{background:var(--err-soft)} .b-err::before{background:var(--err)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
