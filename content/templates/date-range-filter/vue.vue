<script setup lang="ts">
import { computed, ref } from 'vue';

type Preset = '7' | '30' | '90' | 'year' | 'all';

const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const today = new Date(new Date().setHours(0, 0, 0, 0));
const ago = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return iso(d); };
const items = ([['Suscripción Pro', 49, 1], ['Licencias adicionales', 180, 4], ['Soporte premium', 320, 9],
  ['Dominio renovado', 18, 17], ['Almacenamiento extra', 75, 26], ['Capacitación del equipo', 640, 62]] as const)
  .map(([n, m, o]) => ({ n, m, f: ago(o) }));
const presets: [Preset, string][] = [['7', 'Últimos 7 días'], ['30', 'Últimos 30 días'], ['90', 'Últimos 90 días'], ['year', 'Este año'], ['all', 'Todo']];
const range = (p: Preset): [string, string] =>
  p === 'all' ? ['', ''] : p === 'year' ? [`${today.getFullYear()}-01-01`, iso(today)] : [ago(+p), iso(today)];
const money = (v: number) => v.toLocaleString('es', { style: 'currency', currency: 'USD' });
const date = (d: string) => new Date(d + 'T00:00').toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });

const a = ref(range('30')[0]);
const b = ref(range('30')[1]);
const max = iso(today);
const bad = computed(() => !!a.value && !!b.value && a.value > b.value);
const hits = computed(() => (bad.value ? [] : items.filter((i) => (!a.value || i.f >= a.value) && (!b.value || i.f <= b.value))));
const total = computed(() => money(hits.value.reduce((s, i) => s + i.m, 0)));
const on = (p: Preset) => range(p).join() === [a.value, b.value].join();
const set = (p: Preset) => ([a.value, b.value] = range(p));
</script>

<template>
  <div class="dr">
    <form aria-label="Rango de fechas" @submit.prevent>
      <div class="pres" role="group" aria-label="Rangos rápidos">
        <button v-for="[p, t] in presets" :key="p" type="button" :aria-pressed="on(p)" @click="set(p)">{{ t }}</button>
      </div>
      <div class="dates">
        <label>Desde<input v-model="a" type="date" :max="max" /></label>
        <label>Hasta<input v-model="b" type="date" :max="max" /></label>
      </div>
      <p v-if="bad" class="err" role="alert">La fecha final es anterior a la inicial. Cambia «Hasta» o elige un rango rápido.</p>
    </form>
    <h2 aria-live="polite"><span>{{ hits.length }} movimientos</span><span>{{ total }}</span></h2>
    <ul>
      <li v-for="(i, k) in hits" :key="k">
        <span>{{ i.n }}<small><time :datetime="i.f">{{ date(i.f) }}</time></small></span><output>{{ money(i.m) }}</output>
      </li>
      <li v-if="!hits.length" class="empty">No hay movimientos en este rango. Amplía las fechas o elige «Todo».</li>
    </ul>
  </div>
</template>

<style scoped>
.dr{max-width:640px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
form{display:grid;gap:12px;padding:16px;border-bottom:1px solid var(--border)}
.pres{display:flex;flex-wrap:wrap;gap:8px}
button{display:inline-flex;align-items:center;gap:6px;font:inherit;padding:5px 12px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:999px;cursor:pointer;transition:border-color .14s,background .14s}
button:hover{border-color:var(--accent)}
button[aria-pressed=true]{background:var(--accent-soft);border-color:var(--accent);color:var(--accent);font-weight:600}
button[aria-pressed=true]::before{content:"";width:8px;height:8px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.dates{display:grid;grid-template-columns:1fr 1fr;gap:12px}
label{display:grid;gap:4px;font-weight:600}
input{font:inherit;font-weight:400;color:var(--text);color-scheme:light;min-width:0;padding:7px 10px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
:global(:root[data-theme=dark]) input{color-scheme:dark}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.err{margin:0;padding:8px 12px;color:var(--err);background:var(--err-soft);border-radius:var(--radius)}
h2{display:flex;justify-content:space-between;gap:12px;margin:0;padding:12px 16px;font-size:14px;font-variant-numeric:tabular-nums}
ul{list-style:none;margin:0;padding:0}
li{display:flex;justify-content:space-between;gap:12px;padding:10px 16px;border-top:1px solid var(--border)}
li small{display:block;color:var(--muted)}
li output{font-variant-numeric:tabular-nums}
li.empty{display:block;padding:24px 16px;text-align:center;color:var(--muted)}
@media (max-width:420px){.dates{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
