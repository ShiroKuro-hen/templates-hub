<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

const PANELS = [
  { tab: 'Resumen', titulo: 'Resumen del equipo', texto: 'Actividad de las últimas 24 horas en todos tus proyectos.', items: ['Despliegues: 18', 'Incidencias abiertas: 2', 'Cobertura de pruebas: 91 %'] },
  { tab: 'Equipo', titulo: 'Miembros del equipo', texto: 'Personas con acceso a este espacio de trabajo.', items: ['Ana Pérez · Administradora', 'Luis Gómez · Editor', 'Marta Ruiz · Lectora'] },
  { tab: 'Facturación', titulo: 'Facturación', texto: 'Plan y próximos cobros de tu organización.', items: ['Plan: Profesional (anual)', 'Próximo cobro: 5 de enero', 'Pago con tarjeta terminada en 4821'] },
];

type VT = Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const cur = ref(0);
const v = computed(() => PANELS[cur.value]);
const panel = ref<HTMLElement>();
const bar = ref<HTMLElement>();
const tabEls = () => Array.from(bar.value?.querySelectorAll<HTMLButtonElement>('[role=tab]') ?? []);

async function select(k: number) {
  if (k === cur.value) return;
  const dir = Math.sign(k - cur.value), doc = document as VT;
  document.documentElement.style.setProperty('--d', String(dir));
  if (calm) cur.value = k;
  else if (doc.startViewTransition) doc.startViewTransition(async () => {
    cur.value = k;
    await nextTick();
  });
  else {
    cur.value = k;
    panel.value?.animate([{ opacity: 0, transform: `translateX(${dir * 24}px)` }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'ease' });
  }
}

function targetIndex(key: string): number | undefined {
  const n = PANELS.length;
  switch (key) {
    case 'ArrowRight': return (cur.value + 1) % n;
    case 'ArrowLeft': return (cur.value + n - 1) % n;
    case 'Home': return 0;
    case 'End': return n - 1;
    default: return undefined;
  }
}

function onKey(e: KeyboardEvent) {
  const k = targetIndex(e.key);
  if (k === undefined) return;
  e.preventDefault();
  select(k);
  tabEls()[k]?.focus();
}
</script>

<template>
  <div class="app">
    <div ref="bar" class="tabs" role="tablist" aria-label="Secciones" @keydown="onKey">
      <button
        v-for="(p, k) in PANELS"
        :id="`t${k}`"
        :key="p.tab"
        class="tab"
        role="tab"
        type="button"
        aria-controls="panel"
        :aria-selected="k === cur"
        :tabindex="k === cur ? 0 : -1"
        @click="select(k)"
      >
        {{ p.tab }}
      </button>
    </div>
    <section ref="panel" id="panel" class="panel" role="tabpanel" :aria-labelledby="`t${cur}`" tabindex="0">
      <h2>{{ v.titulo }}</h2>
      <p>{{ v.texto }}</p>
      <ul>
        <li v-for="x in v.items" :key="x">{{ x }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.app { max-width:560px; margin:0 auto; color:var(--text); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
.tabs { display:flex; gap:4px; margin-bottom:12px; border-bottom:1px solid var(--border); }
.tab { position:relative; padding:9px 14px; background:none; border:0; border-radius:var(--radius) var(--radius) 0 0; color:var(--muted); font:inherit; font-weight:600; cursor:pointer; transition:color .14s; }
.tab:hover, .tab[aria-selected="true"] { color:var(--text); }
.tab:focus-visible { outline:2px solid var(--accent); outline-offset:-2px; }
.tab::after { content:""; position:absolute; left:10px; right:10px; bottom:-1px; height:2px; background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff)); opacity:0; }
.tab[aria-selected="true"]::after { opacity:1; }
.panel { view-transition-name:panel; padding:20px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
.panel:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
h2 { margin:0; font-size:16px; font-weight:600; }
.panel p { margin:4px 0 12px; color:var(--muted); }
.panel ul { margin:0; padding:0; list-style:none; }
.panel li { padding:10px 0; border-top:1px solid var(--border); }
@media (prefers-reduced-motion:reduce) { .tab { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>

<style>
html { --d:1; }
::view-transition-old(panel) { animation:vt-out .2s ease both; }
::view-transition-new(panel) { animation:vt-in .3s ease both; }
@keyframes vt-out { to { opacity:0; } }
@keyframes vt-in { from { opacity:0; transform:translateX(calc(var(--d) * 40px)); } }
@media (prefers-reduced-motion:reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation:none !important; } }
</style>
