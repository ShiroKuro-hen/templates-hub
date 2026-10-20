<script setup lang="ts">
import { computed, ref } from 'vue';

type PlanFila = { id: string; nombre: string; descripcion: string; precio: string; periodo: string; incluye: string[]; rec?: boolean };

const planes: PlanFila[] = [
  { id: 'inicial', nombre: 'Inicial', descripcion: 'Para probar con tu equipo sin pagar nada.', precio: '0 €', periodo: 'gratis', incluye: ['Hasta 3 personas', '5 proyectos activos', 'Historial de 30 días', 'Soporte de la comunidad'] },
  { id: 'profesional', nombre: 'Profesional', descripcion: 'Para equipos que trabajan a diario en Nimbo.', precio: '8 €', periodo: 'por persona al mes', rec: true, incluye: ['Personas ilimitadas', 'Proyectos ilimitados', 'Informes y automatizaciones', 'Soporte por chat en 4 horas'] },
  { id: 'negocio', nombre: 'Negocio', descripcion: 'Para organizaciones con requisitos de seguridad.', precio: '18 €', periodo: 'por persona al mes', incluye: ['Todo lo del plan Profesional', 'SSO y registro de auditoría', 'Disponibilidad del 99,9 %', 'Gerente de cuenta'] },
];

const abiertos = ref<string[]>([]);
const elegido = ref<string | null>(null);
const nombreElegido = computed(() => planes.find((p) => p.id === elegido.value)?.nombre);

function alternar(id: string) {
  abiertos.value = abiertos.value.includes(id) ? abiertos.value.filter((x) => x !== id) : [...abiertos.value, id];
}
</script>

<template>
  <section class="plans" aria-labelledby="pt">
    <h2 id="pt">Elige tu plan</h2>
    <p class="intro">Cambia de plan cuando quieras. Sin permanencia.</p>
    <article v-for="p in planes" :key="p.id" :class="['row', { rec: p.rec }]">
      <div class="info">
        <h3 class="name">
          {{ p.nombre }}
          <span v-if="p.rec" class="tag">Recomendado</span>
        </h3>
        <p>{{ p.descripcion }}</p>
        <button
          type="button"
          class="toggle"
          :aria-expanded="String(abiertos.includes(p.id))"
          :aria-controls="`f-${p.id}`"
          @click="alternar(p.id)"
        >
          Qué incluye <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
        </button>
      </div>
      <p class="price"><strong>{{ p.precio }}</strong><span>{{ p.periodo }}</span></p>
      <button
        type="button"
        class="pick"
        :aria-pressed="String(elegido === p.id)"
        @click="elegido = p.id"
      >
        {{ elegido === p.id ? 'Elegido' : 'Elegir' }}
      </button>
      <ul :id="`f-${p.id}`" class="feat" :hidden="!abiertos.includes(p.id)">
        <li v-for="texto in p.incluye" :key="texto">{{ texto }}</li>
      </ul>
    </article>
    <p class="picked" role="status">{{ nombreElegido ? `Plan elegido: ${nombreElegido}.` : '' }}</p>
  </section>
</template>

<style scoped>
.plans { max-width: 760px; margin: 0 auto; display: grid; gap: 10px; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
h2 { margin: 0; font-size: 20px; letter-spacing: -.01em; }
.intro { margin: 2px 0 8px; color: var(--muted); }
.row { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 12px 20px; padding: 16px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.row.rec { border-color: var(--accent); background: var(--accent-soft); }
.row.rec::before { content: ""; position: absolute; left: -1px; top: -1px; bottom: -1px; width: 4px; border-radius: var(--radius) 0 0 var(--radius); background: linear-gradient(135deg, var(--accent-2,#22d3ee), var(--accent,#2f5bff)); }
.info { min-width: 0; display: grid; gap: 2px; justify-items: start; }
.name { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 0; font-size: 17px; font-weight: 700; }
.tag { padding: 1px 8px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-size: 11px; font-weight: 600; }
.info p { margin: 0; color: var(--muted); font-size: 13px; }
.toggle { display: inline-flex; align-items: center; gap: 6px; margin-top: 4px; padding: 2px 0; font: 600 13px system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--accent); background: none; border: 0; cursor: pointer; }
.toggle svg { transition: transform .2s; }
.toggle[aria-expanded="true"] svg { transform: rotate(180deg); }
.price { margin: 0; text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
.price strong { display: block; font-size: 22px; line-height: 1.1; }
.price span { font-size: 12px; color: var(--muted); }
.pick { padding: 8px 14px; font: 600 14px system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; white-space: nowrap; }
.pick:hover { border-color: var(--accent); }
.rec .pick { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
.pick[aria-pressed="true"] { background: var(--ok-soft); border-color: var(--ok); color: var(--ok); }
.feat { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px 20px; margin: 0; padding: 12px 0 0; list-style: none; border-top: 1px dashed var(--border); font-size: 13px; }
.feat[hidden] { display: none; }
.feat li::before { content: "✓"; margin-right: 8px; font-weight: 700; color: var(--ok); }
.picked { min-height: 1.5em; margin: 4px 0 0; color: var(--muted); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (max-width: 559px) { .row { grid-template-columns: minmax(0, 1fr) auto; } .pick { grid-column: 1 / -1; } }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
