<script setup lang="ts">
import { computed, ref } from 'vue';

type Vista = { n: string; q: string; s: string };
const D: [string, string, string, number][] = [
  ['Café Andino', 'Lima', 'Pagado', 1280], ['Textiles Sur', 'Arequipa', 'Pendiente', 640],
  ['Logística Norte', 'Lima', 'Pendiente', 2150], ['Panadería Sol', 'Cusco', 'Pagado', 310],
  ['Distribuidora Pacífico', 'Lima', 'Cancelado', 980], ['Hotel Valle', 'Cusco', 'Pendiente', 3890],
];
const money = (v: number) => v.toLocaleString('es', { style: 'currency', currency: 'USD' });

const q = ref('');
const s = ref('');
const views = ref<Vista[]>([{ n: 'Pendientes de pago', q: '', s: 'Pendiente' }, { n: 'Pedidos de Lima', q: 'Lima', s: '' }]);
const nombre = ref('');
const msg = ref({ t: '', bad: false });
const nm = ref<HTMLInputElement>();
const qq = computed(() => q.value.trim());
const hits = computed(() => D.filter(([n, c, e]) =>
  (!qq.value || (n + c).toLowerCase().includes(qq.value.toLowerCase())) && (!s.value || e === s.value)));

const say = (t: string, bad = false) => (msg.value = { t, bad });
function guardar() {
  const n = nombre.value.trim();
  if (!n) return say('Escribe un nombre para la vista.', true);
  if (!qq.value && !s.value) return say('Aplica al menos un filtro antes de guardar.', true);
  if (views.value.some((v) => v.n.toLowerCase() === n.toLowerCase())) return say('Ya existe una vista con ese nombre. Elige otro.', true);
  views.value.push({ n, q: qq.value, s: s.value }); nombre.value = ''; say(`Vista «${n}» guardada.`);
}
function aplicar(v: Vista) { q.value = v.q; s.value = v.s; say(`Vista «${v.n}» aplicada.`); }
function borrar(v: Vista) { views.value = views.value.filter((x) => x !== v); say(`Vista «${v.n}» eliminada.`); nm.value?.focus(); }
const resumen = (v: Vista) => [v.q && `“${v.q}”`, v.s].filter(Boolean).join(', ') || 'Sin filtros';
</script>

<template>
  <div class="sv">
    <aside aria-labelledby="vh">
      <h2 id="vh">Vistas guardadas</h2>
      <ul>
        <li v-for="v in views" :key="v.n" class="v">
          <button type="button" class="apply" :aria-pressed="v.q === qq && v.s === s" @click="aplicar(v)">
            {{ v.n }}<small>{{ resumen(v) }}</small>
          </button>
          <button type="button" class="del" :aria-label="`Eliminar vista ${v.n}`" @click="borrar(v)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m2 2 8 8M10 2l-8 8"/></svg>
          </button>
        </li>
        <li v-if="!views.length" class="none">Aún no hay vistas. Aplica filtros y guarda la primera.</li>
      </ul>
      <form @submit.prevent="guardar">
        <label for="nm">Guardar filtros como vista</label>
        <div class="row"><input id="nm" ref="nm" v-model="nombre" autocomplete="off" placeholder="Nombre de la vista" /><button class="go">Guardar</button></div>
        <p class="msg" :class="{ bad: msg.bad }" aria-live="polite">{{ msg.t }}</p>
      </form>
    </aside>
    <section aria-label="Pedidos">
      <div class="filters">
        <label>Buscar<input v-model="q" type="search" placeholder="Cliente o ciudad" /></label>
        <label>Estado
          <select v-model="s"><option value="">Todos</option><option>Pagado</option><option>Pendiente</option><option>Cancelado</option></select>
        </label>
      </div>
      <p class="head" aria-live="polite">{{ hits.length }} pedidos</p>
      <ul id="list">
        <li v-for="[n, c, e, t] in hits" :key="n"><span>{{ n }}<small>{{ c }}, {{ e }}</small></span><output>{{ money(t) }}</output></li>
        <li v-if="!hits.length" class="empty">Ningún pedido coincide. Cambia los filtros o aplica otra vista.</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.sv{display:grid;grid-template-columns:240px 1fr;align-items:start;gap:16px;max-width:900px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.sv>*{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;min-width:0}
@media (max-width:600px){.sv{grid-template-columns:1fr}}
h2{margin:0 0 8px;font-size:14px}
ul{list-style:none;margin:0;padding:0}
.v{position:relative;display:flex;align-items:center;gap:4px;border-radius:6px}
.apply{flex:1;min-width:0;text-align:left;padding:6px 8px;font:inherit;color:inherit;background:none;border:0;border-radius:6px;cursor:pointer;transition:background .14s}
.apply:hover,.apply[aria-pressed=true]{background:var(--accent-soft)}
.apply[aria-pressed=true]{font-weight:600}
.apply[aria-pressed=true]::before{content:"";position:absolute;left:-8px;top:6px;bottom:6px;width:3px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.apply small{display:block;font-weight:400;color:var(--muted)}
.del{display:grid;place-items:center;flex:none;width:28px;height:28px;padding:0;color:var(--muted);background:none;border:0;border-radius:6px;cursor:pointer}
.del:hover{color:var(--err);background:var(--err-soft)}
.none{color:var(--muted);padding:6px 8px}
form{margin-top:12px;padding-top:12px;border-top:1px solid var(--border)}
label{display:block;font-weight:600;margin-bottom:4px}
.row{display:flex;gap:8px}
input,select{font:inherit;color:var(--text);min-width:0;padding:6px 10px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
input{flex:1}
.go{font:inherit;padding:6px 12px;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);cursor:pointer}
.msg{min-height:21px;margin:6px 0 0;color:var(--muted)}
.msg.bad{color:var(--err)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.filters{display:grid;grid-template-columns:1fr 160px;gap:12px;margin-bottom:12px}
.filters label{margin:0}
.filters input,.filters select{display:block;width:100%;box-sizing:border-box;margin-top:4px;font-weight:400}
.head{margin:0 0 4px;font-weight:600;font-variant-numeric:tabular-nums}
#list li{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--border)}
#list small{display:block;color:var(--muted)}
#list output{font-variant-numeric:tabular-nums}
#list .empty{display:block;text-align:center;padding:24px 0;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
