<script setup lang="ts">
import { computed, reactive } from 'vue';

type Estado = 'Activo' | 'Prueba' | 'Suspendido';
const rows: { nombre: string; plan: string; estado: Estado; mrr: number }[] = [
  { nombre: 'Textiles Andina', plan: 'Team', estado: 'Activo', mrr: 1240 },
  { nombre: 'Café del Valle', plan: 'Pro', estado: 'Prueba', mrr: 0 },
  { nombre: 'Logística Pacífico', plan: 'Enterprise', estado: 'Activo', mrr: 8900 },
  { nombre: 'Estudio Mirador', plan: 'Pro', estado: 'Activo', mrr: 390 },
  { nombre: 'Agro Sierra', plan: 'Team', estado: 'Suspendido', mrr: 1240 },
  { nombre: 'Clínica San Isidro', plan: 'Enterprise', estado: 'Activo', mrr: 6450 },
  { nombre: 'Bodega Los Olivos', plan: 'Free', estado: 'Prueba', mrr: 0 },
  { nombre: 'Nova Telecom', plan: 'Pro', estado: 'Suspendido', mrr: 390 },
];
const tono = { Activo: 'ok', Prueba: 'warn', Suspendido: 'err' };
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim();
const money = (n: number) => `S/ ${n.toLocaleString('es-PE')}`;
const f = reactive({ q: '', nombre: '', plan: '', estado: '' });

const shown = computed(() =>
  rows.filter((r) =>
    norm(`${r.nombre} ${r.plan} ${r.estado} ${money(r.mrr)}`).includes(norm(f.q)) &&
    norm(r.nombre).includes(norm(f.nombre)) && (!f.plan || r.plan === f.plan) && (!f.estado || r.estado === f.estado)));
const filtered = computed(() => !!(f.nombre || f.plan || f.estado));
const clear = () => Object.assign(f, { q: '', nombre: '', plan: '', estado: '' });
</script>

<template>
  <section class="card" aria-labelledby="t">
    <header>
      <h2 id="t">Clientes</h2>
      <div class="search">
        <label class="sr" for="q">Buscar en toda la tabla</label>
        <input id="q" v-model="f.q" type="search" placeholder="Buscar cliente, plan o estado" autocomplete="off">
      </div>
    </header>
    <div class="scroll">
      <table :class="{ on: filtered }">
        <caption class="sr">Clientes. Los filtros bajo cada encabezado reducen las filas al instante.</caption>
        <thead>
          <tr><th scope="col">Cliente</th><th scope="col">Plan</th><th scope="col">Estado</th><th scope="col" class="num">MRR</th></tr>
          <tr class="f">
            <td><input v-model="f.nombre" type="text" aria-label="Filtrar por cliente" placeholder="Filtrar"></td>
            <td>
              <select v-model="f.plan" aria-label="Filtrar por plan">
                <option value="">Todos</option><option v-for="p in ['Free', 'Pro', 'Team', 'Enterprise']" :key="p">{{ p }}</option>
              </select>
            </td>
            <td>
              <select v-model="f.estado" aria-label="Filtrar por estado">
                <option value="">Todos</option><option v-for="s in Object.keys(tono)" :key="s">{{ s }}</option>
              </select>
            </td>
            <td />
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in shown" :key="r.nombre">
            <th scope="row">{{ r.nombre }}</th><td>{{ r.plan }}</td>
            <td><span class="b" :class="tono[r.estado]">{{ r.estado }}</span></td><td class="num">{{ money(r.mrr) }}</td>
          </tr>
          <tr v-if="!shown.length" id="none"><td colspan="4">Ningún cliente coincide. Cambia los filtros o limpia la búsqueda.</td></tr>
        </tbody>
      </table>
    </div>
    <footer>
      <span role="status">{{ shown.length }} de {{ rows.length }} clientes</span>
      <button v-if="f.q || filtered" class="btn" type="button" @click="clear">Limpiar filtros</button>
    </footer>
  </section>
</template>

<style scoped>
.card{max-width:820px;margin:0 auto;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border)}
h2{margin:0;font-size:16px}
input,select,.btn{font:inherit;color:var(--text)}
input,select{box-sizing:border-box;width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface)}
input:focus-visible,select:focus-visible,.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.search{flex:1 1 220px;max-width:320px}
.scroll{overflow-x:auto}
table{width:100%;min-width:560px;border-collapse:collapse}
th,td{padding:10px 16px;text-align:left;border-bottom:1px solid var(--border)}
thead th{color:var(--muted);font-weight:600;border-bottom:0;padding-bottom:6px}
.f td{padding-top:0;padding-bottom:10px;background-repeat:no-repeat;background-size:100% 1px;background-position:bottom}
table.on .f td{background-image:linear-gradient(90deg,#22d3ee,#2f5bff);border-bottom-color:transparent}
tbody th{font-weight:600}
tbody tr:hover{background:var(--accent-soft)}
.num{text-align:right;font-variant-numeric:tabular-nums}
.b{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;color:var(--text)}
.b::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.b.ok{background:var(--ok-soft)} .b.ok::before{color:var(--ok)}
.b.warn{background:var(--warn-soft)} .b.warn::before{color:var(--warn)}
.b.err{background:var(--err-soft)} .b.err::before{color:var(--err)}
#none td{padding:32px 16px;text-align:center;color:var(--muted)}
footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 20px;color:var(--muted);font-size:13px;min-height:28px}
.btn{padding:4px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
