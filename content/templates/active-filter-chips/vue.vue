<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue';

type Key = 'estado' | 'prioridad' | 'equipo';
type Ticket = Record<Key, string> & { t: string };

const items: Ticket[] = [
  { t: 'No carga el panel de facturas', estado: 'Abierto', prioridad: 'Alta', equipo: 'Soporte' },
  { t: 'Error 502 al exportar informes', estado: 'Abierto', prioridad: 'Alta', equipo: 'Ingeniería' },
  { t: 'Solicitud de cotización anual', estado: 'En curso', prioridad: 'Media', equipo: 'Ventas' },
  { t: 'Cambiar correo de facturación', estado: 'Cerrado', prioridad: 'Baja', equipo: 'Soporte' },
  { t: 'Lentitud en la API de pagos', estado: 'En curso', prioridad: 'Alta', equipo: 'Ingeniería' },
  { t: 'No llegan los correos de aviso', estado: 'Abierto', prioridad: 'Alta', equipo: 'Soporte' },
];
const F: Record<Key, [string, string[]]> = {
  estado: ['Estado', ['Abierto', 'En curso', 'Cerrado']],
  prioridad: ['Prioridad', ['Alta', 'Media', 'Baja']],
  equipo: ['Equipo', ['Soporte', 'Ventas', 'Ingeniería']],
};
const keys = Object.keys(F) as Key[];
const act = reactive<Partial<Record<Key, string>>>({ estado: 'Abierto', prioridad: 'Alta' });
const bar = ref<HTMLElement>();
const on = computed(() => Object.entries(act) as [Key, string][]);
const hits = computed(() => items.filter((x) => on.value.every(([k, v]) => x[k] === v)));

async function quitar(k: Key, i: number) {
  delete act[k];
  await nextTick(); // devuelve el foco al chip vecino (o al selector)
  const b = bar.value!.querySelectorAll<HTMLElement>('.chip button');
  (b[i] ?? b[i - 1] ?? bar.value!.querySelector('select'))?.focus();
}
function anadir(e: Event) {
  const el = e.target as HTMLSelectElement;
  const [k, v] = el.value.split(':');
  if (k) act[k as Key] = v;
  el.value = '';
}
const limpiar = () => keys.forEach((k) => delete act[k]);
</script>

<template>
  <div class="ac">
    <div ref="bar" class="bar">
      <ul class="chips" aria-label="Filtros activos">
        <li v-for="([k, v], i) in on" :key="k" class="chip">
          <span>{{ F[k][0] }}: <b>{{ v }}</b></span>
          <button type="button" :aria-label="`Quitar filtro ${F[k][0]}: ${v}`" @click="quitar(k, i)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m2 2 8 8M10 2l-8 8"/></svg>
          </button>
        </li>
        <li v-if="!on.length" class="hint">Sin filtros activos.</li>
      </ul>
      <select aria-label="Añadir filtro" @change="anadir">
        <option value="">Añadir filtro</option>
        <optgroup v-for="k in keys" :key="k" :label="F[k][0]">
          <option v-for="v in F[k][1].filter((x) => act[k] !== x)" :key="v" :value="`${k}:${v}`">{{ v }}</option>
        </optgroup>
      </select>
      <button v-if="on.length" type="button" class="clr" @click="limpiar">Limpiar todo</button>
    </div>
    <p class="head" aria-live="polite">{{ hits.length }} tickets</p>
    <ul id="list">
      <li v-for="x in hits" :key="x.t"><span>{{ x.t }}</span><small>{{ x.estado }}, {{ x.prioridad }}, {{ x.equipo }}</small></li>
      <li v-if="!hits.length" class="empty">Ningún ticket coincide. Quita un filtro o pulsa «Limpiar todo».</li>
    </ul>
  </div>
</template>

<style scoped>
.ac{max-width:680px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--border)}
ul{list-style:none;margin:0;padding:0}
.chips{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.chip{display:inline-flex;align-items:center;gap:2px;padding:2px 2px 2px 12px;background:var(--accent-soft);border:1px solid var(--accent);border-radius:999px}
.chip b{font-weight:600}
.chip button{display:grid;place-items:center;width:24px;height:24px;padding:0;color:var(--accent);background:none;border:0;border-radius:999px;cursor:pointer;transition:background .14s}
.chip button:hover{background:var(--surface)}
select,.clr{font:inherit;padding:5px 12px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:border-color .14s}
select:hover,.clr:hover{border-color:var(--accent)}
.clr{margin-left:auto;color:var(--accent);border-color:transparent;background:none}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.hint{margin:0;color:var(--muted)}
.head{display:flex;align-items:center;gap:8px;margin:0;padding:12px 16px;font-weight:600;font-variant-numeric:tabular-nums}
.head::before{content:"";width:8px;height:8px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
#list li{display:flex;justify-content:space-between;gap:12px;padding:10px 16px;border-top:1px solid var(--border)}
#list small{color:var(--muted);white-space:nowrap}
#list .empty{display:block;padding:24px 16px;text-align:center;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
