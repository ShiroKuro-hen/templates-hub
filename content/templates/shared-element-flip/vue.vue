<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

type Estado = 'curso' | 'riesgo' | 'listo';
type Proyecto = {
  id: string; titulo: string; responsable: string; estado: Estado; avance: number;
  entrega: string; presupuesto: string; equipo: string; descripcion: string;
};

const ETIQUETA: Record<Estado, string> = { curso: 'En curso', riesgo: 'En riesgo', listo: 'Completado' };
const CLASE: Record<Estado, string> = { curso: '', riesgo: 'warn', listo: 'ok' };
const EASE = 'cubic-bezier(.2,.7,.2,1)';

const props = withDefaults(defineProps<{ proyectos?: Proyecto[] }>(), {
  proyectos: () => [
    { id: 'nube', titulo: 'Migración a la nube', responsable: 'Marta Ruiz', estado: 'curso', avance: 68, entrega: '30 abr 2026',
      presupuesto: 'S/ 84.000', equipo: '7 personas', descripcion: 'Traslado de servidores y bases de datos a la nube, por fases y sin cortes de servicio.' },
    { id: 'panel', titulo: 'Rediseño del panel de clientes', responsable: 'Luis Gómez', estado: 'riesgo', avance: 41, entrega: '18 may 2026',
      presupuesto: 'S/ 52.500', equipo: '4 personas', descripcion: 'Nueva vista de cuentas y actividad para el equipo comercial, con filtros por región.' },
    { id: 'audit', titulo: 'Auditoría de seguridad anual', responsable: 'Carlos Díaz', estado: 'listo', avance: 100, entrega: '28 feb 2026',
      presupuesto: 'S/ 31.200', equipo: '3 personas', descripcion: 'Revisión de accesos, dependencias y configuración, con informe final firmado.' },
  ],
});

const openId = ref<string | null>(null);
const list = ref<HTMLElement>();
const detail = ref<HTMLElement>();
let active: HTMLElement | null = null;
const current = computed(() => props.proyectos.find((p) => p.id === openId.value));

const mapTo = (src: DOMRect, dst: DOMRect) =>
  `translate(${dst.left - src.left}px, ${dst.top - src.top}px) scale(${dst.width / src.width}, ${dst.height / src.height})`;

function animate(keyframes: Keyframe[]) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  return detail.value!.animate(keyframes, { duration: reduced ? 0 : 320, easing: EASE });
}

async function open(p: Proyecto, e: MouseEvent) {
  const card = e.currentTarget as HTMLElement;
  detail.value?.getAnimations().forEach((a) => a.cancel());
  const first = card.getBoundingClientRect();
  openId.value = p.id;
  active = card;
  list.value!.toggleAttribute('inert', true);
  card.style.visibility = 'hidden';
  await nextTick();
  const el = detail.value!;
  const last = el.getBoundingClientRect();
  animate([{ transform: mapTo(last, first), opacity: 0.6 }, { transform: 'none', opacity: 1 }]);
  el.querySelector<HTMLElement>('button')?.focus();
}

function close() {
  const card = active;
  if (!card) return;
  active = null;
  const el = detail.value!;
  el.getAnimations().forEach((a) => a.cancel());
  const first = el.getBoundingClientRect();
  card.style.visibility = '';
  const last = card.getBoundingClientRect();
  animate([{ transform: 'none', opacity: 1 }, { transform: mapTo(first, last), opacity: 0 }]).onfinish = () => {
    list.value!.toggleAttribute('inert', false);
    card.focus();
    openId.value = null;
  };
}

function onLayerClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close();
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
}

onMounted(() => document.addEventListener('keydown', onKey));
onBeforeUnmount(() => document.removeEventListener('keydown', onKey));
</script>

<template>
  <ul ref="list" class="grid">
    <li v-for="p in proyectos" :key="p.id">
      <button type="button" class="card" aria-haspopup="dialog" @click="open(p, $event)">
        <span class="ttl">{{ p.titulo }}</span>
        <span class="own">Responsable: {{ p.responsable }}</span>
        <span class="badge" :class="CLASE[p.estado]">{{ ETIQUETA[p.estado] }}</span>
        <span class="bar"><i :style="{ '--p': p.avance }" />{{ p.avance }}% completado</span>
      </button>
    </li>
  </ul>

  <div class="layer" :hidden="openId === null" @click="onLayerClick">
    <section ref="detail" class="detail" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <template v-if="current">
        <div class="det-head">
          <div>
            <h2 id="detail-title">{{ current.titulo }}</h2>
            <span class="own">Responsable: {{ current.responsable }}</span>
          </div>
          <button type="button" class="close" aria-label="Cerrar" @click="close">×</button>
        </div>
        <p>{{ current.descripcion }}</p>
        <dl>
          <div><dt>Entrega</dt><dd>{{ current.entrega }}</dd></div>
          <div><dt>Presupuesto</dt><dd>{{ current.presupuesto }}</dd></div>
          <div><dt>Equipo</dt><dd>{{ current.equipo }}</dd></div>
        </dl>
      </template>
    </section>
  </div>
</template>

<style scoped>
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:12px; margin:0; padding:0; list-style:none; max-width:720px; color:var(--text); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
.card { display:grid; gap:10px; width:100%; padding:14px 16px; font:inherit; color:var(--text); text-align:left; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); cursor:pointer; transition:border-color .14s; }
.card:hover { border-color:var(--accent); }
.ttl { display:block; font-weight:600; line-height:1.35; }
.own { display:block; color:var(--muted); font-size:13px; }
.badge { justify-self:start; display:inline-flex; align-items:center; gap:6px; padding:0 10px; border-radius:999px; font-size:12px; font-weight:600; background:var(--info-soft); }
.badge::before { content:""; width:6px; height:6px; border-radius:50%; background:var(--info); }
.badge.warn { background:var(--warn-soft); }
.badge.warn::before { background:var(--warn); }
.badge.ok { background:var(--ok-soft); }
.badge.ok::before { background:var(--ok); }
.bar { display:flex; align-items:center; gap:10px; color:var(--muted); font-size:13px; font-variant-numeric:tabular-nums; }
.bar i { flex:1; height:6px; border-radius:999px; background:var(--accent-soft); overflow:hidden; }
.bar i::after { content:""; display:block; height:100%; width:calc(var(--p) * 1%); border-radius:999px; background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff)); }
.layer { position:fixed; inset:0; z-index:10; display:grid; place-items:center; padding:16px; background:rgba(0,0,0,.45); }
.layer[hidden] { display:none !important; }
.detail { width:min(520px,100%); max-height:100%; overflow:auto; padding:20px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); transform-origin:0 0; }
.det-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:14px; }
.det-head h2 { margin:0; font-size:18px; }
.close { flex:none; width:32px; height:32px; font:inherit; font-size:20px; line-height:1; color:var(--muted); background:none; border:0; border-radius:var(--radius); cursor:pointer; }
.close:hover { background:var(--bg); color:var(--text); }
.detail p { margin:0 0 14px; color:var(--muted); }
dl { display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:10px 16px; margin:0; }
dt { color:var(--muted); font-size:13px; }
dd { margin:0; font-weight:600; font-variant-numeric:tabular-nums; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
@media (prefers-reduced-motion:reduce) { .card { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
