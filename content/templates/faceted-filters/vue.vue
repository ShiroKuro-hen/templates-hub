<script setup lang="ts">
import { computed, reactive } from 'vue';

type Item = { nombre: string; region: string; tipo: string; estado: string };
type Key = Exclude<keyof Item, 'nombre'>;

const items: Item[] = [
  { nombre: 'api-lima-01', region: 'Lima', tipo: 'Cómputo', estado: 'Activo' },
  { nombre: 'db-lima-02', region: 'Lima', tipo: 'Base de datos', estado: 'Activo' },
  { nombre: 'cache-scl-01', region: 'Santiago', tipo: 'Caché', estado: 'Detenido' },
  { nombre: 'api-scl-03', region: 'Santiago', tipo: 'Cómputo', estado: 'Activo' },
  { nombre: 'db-bog-01', region: 'Bogotá', tipo: 'Base de datos', estado: 'Mantenimiento' },
];
const facets: [Key, string][] = [['region', 'Región'], ['tipo', 'Tipo'], ['estado', 'Estado']];
const sel = reactive<Record<Key, string[]>>({ region: [], tipo: [], estado: [] });

const match = (i: Item, skip?: Key) => facets.every(([k]) => k === skip || !sel[k].length || sel[k].includes(i[k]));
const hits = computed(() => items.filter((i) => match(i)));
const values = (k: Key) => [...new Set(items.map((i) => i[k]))];
const count = (k: Key, v: string) => items.filter((i) => match(i, k) && i[k] === v).length;
const clear = () => facets.forEach(([k]) => (sel[k] = []));
</script>

<template>
  <div class="ff">
    <aside aria-label="Filtros">
      <fieldset v-for="[k, title] in facets" :key="k">
        <legend>{{ title }}</legend>
        <label v-for="v in values(k)" :key="v">
          <input v-model="sel[k]" type="checkbox" :value="v" :disabled="!count(k, v) && !sel[k].includes(v)" /> {{ v }}
          <small>{{ count(k, v) }}</small>
        </label>
      </fieldset>
    </aside>
    <section aria-labelledby="h">
      <p id="h" class="head" aria-live="polite"><span>{{ hits.length }}</span> servidores</p>
      <ul>
        <li v-for="i in hits" :key="i.nombre"><span>{{ i.nombre }}</span><small>{{ i.region }}, {{ i.tipo }}, {{ i.estado }}</small></li>
        <li v-if="!hits.length" class="empty">
          Ningún servidor cumple estos filtros. <button type="button" @click="clear">Quitar filtros</button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.ff{display:grid;grid-template-columns:220px 1fr;align-items:start;gap:16px;max-width:900px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.ff>*{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;min-width:0}
@media (max-width:560px){.ff{grid-template-columns:1fr}}
fieldset{border:0;margin:0 0 14px;padding:0}
legend{font-weight:600;margin-bottom:6px}
label{display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:6px;cursor:pointer;transition:background .14s}
label:hover{background:var(--accent-soft)}
label:has(:disabled){color:var(--muted);cursor:default}
input{accent-color:var(--accent);margin:0}
label small{margin-left:auto;color:var(--muted);font-variant-numeric:tabular-nums}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.head{display:flex;align-items:center;gap:8px;margin:0 0 10px;font-weight:600}
.head::before{content:"";width:8px;height:8px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.head span{font-variant-numeric:tabular-nums}
ul{list-style:none;margin:0;padding:0}
li{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--border)}
li small{color:var(--muted)}
li.empty{display:block;padding:24px 0;text-align:center;color:var(--muted)}
button{font:inherit;padding:6px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer}
button:hover{border-color:var(--accent);color:var(--accent)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
