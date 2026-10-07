<script setup lang="ts">
import { computed, ref } from 'vue';

const names = ['Compilación', 'Pruebas', 'Revisión', 'Staging', 'Producción'];
const init = [100, 100, 60, 0, 0]; // % por etapa
const p = ref([...init]);
const cur = computed(() => p.value.findIndex((v) => v < 100));
const state = (i: number) => (p.value[i] >= 100 ? 'done' : i === cur.value ? 'active' : 'todo');
const texto = (i: number) => ({ done: 'Completada', todo: 'Pendiente', active: `En curso, ${p.value[i]}%` })[state(i)];
const avanzar = () => { if (cur.value >= 0) p.value[cur.value] = Math.min(100, p.value[cur.value] + 20); };
</script>

<template>
  <section class="card" aria-labelledby="t">
    <header>
      <div>
        <h2 id="t">Despliegue de la versión 4.2</h2>
        <p aria-live="polite">
          {{ cur < 0 ? 'Despliegue completo: las 5 etapas terminaron.' : `${cur} de 5 etapas completadas. En curso: ${names[cur]}.` }}
        </p>
      </div>
      <div class="actions">
        <button type="button" @click="p = [...init]">Reiniciar</button>
        <button type="button" class="primary" :disabled="cur < 0" @click="avanzar">Avanzar etapa</button>
      </div>
    </header>
    <ol>
      <li v-for="(n, i) in names" :key="n" :data-s="state(i)">
        <div class="track" role="progressbar" :aria-label="n" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="p[i]">
          <i :style="{ '--p': p[i] }" />
        </div>
        <strong>{{ n }}</strong>
        <small>{{ texto(i) }}</small>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.card{padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px}
h2{margin:0;font-size:16px;font-weight:600}
header p{margin:2px 0 0;color:var(--muted)}
.actions{display:flex;gap:8px}
button{font:inherit;padding:7px 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s,opacity .14s}
button:hover:not(:disabled){background:var(--accent-soft)}
button.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink);font-weight:600}
button.primary:hover:not(:disabled){background:var(--accent);opacity:.9}
button:disabled{opacity:.5;cursor:default}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
li{min-width:0}
.track{height:8px;border-radius:999px;background:var(--border);overflow:hidden}
.track i{display:block;height:100%;width:calc(var(--p) * 1%);border-radius:inherit;background:var(--ok);transition:width .16s}
li[data-s=active] .track i{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
strong{display:block;margin-top:10px;font-weight:600;overflow-wrap:anywhere}
small{color:var(--muted);font-size:13px;font-variant-numeric:tabular-nums}
li[data-s=done] small{color:var(--ok)}
@media (max-width:640px){ol{grid-template-columns:1fr;gap:16px}li{display:grid;grid-template-columns:1fr auto;align-items:baseline;column-gap:12px}.track{grid-column:1/-1}strong{margin-top:6px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
