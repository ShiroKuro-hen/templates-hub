<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

const vistas = [
  { tab: 'Resumen', titulo: 'Resumen del equipo', texto: 'Actividad de las últimas 24 horas en todos tus proyectos.', filas: [['Despliegues', '18'], ['Incidencias abiertas', '2'], ['Cobertura de pruebas', '91 %']] },
  { tab: 'Proyectos', titulo: 'Proyectos activos', texto: 'Tres proyectos con entregas este mes.', filas: [['Portal de clientes', 'En curso'], ['App móvil', 'En revisión'], ['API pública', 'Estable']] },
  { tab: 'Ajustes', titulo: 'Ajustes del espacio', texto: 'Define quién puede ver y editar cada proyecto.', filas: [['Miembros', '12'], ['Roles personalizados', '3'], ['Verificación en dos pasos', 'Activa']] },
];
type VT = Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cur = ref(0);
const main = ref<HTMLElement>();
const v = computed(() => vistas[cur.value]);

async function go(k: number) {
  if (k === cur.value) return;
  const dir = k > cur.value ? 1 : -1, doc = document as VT;
  document.documentElement.style.setProperty('--d', String(dir));
  if (calm) cur.value = k;                                                   // alternativa estática
  else if (doc.startViewTransition) doc.startViewTransition(async () => { cur.value = k; await nextTick(); });
  else {                                                                     // alternativa: Web Animations
    cur.value = k;
    main.value?.animate([{ opacity: 0, transform: `translateX(${dir * 24}px)` }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'ease' });
  }
}
</script>

<template>
  <div class="app">
    <nav class="tabs" aria-label="Vistas">
      <button v-for="(x, k) in vistas" :key="x.tab" class="tab" type="button" :aria-current="k === cur ? 'page' : undefined" @click="go(k)">{{ x.tab }}</button>
    </nav>
    <main ref="main" class="view" aria-live="polite">
      <h2>{{ v.titulo }}</h2><p>{{ v.texto }}</p>
      <dl class="rows"><div v-for="[a, b] in v.filas" :key="a"><dt>{{ a }}</dt><dd>{{ b }}</dd></div></dl>
    </main>
  </div>
</template>

<style scoped>
.app{max-width:560px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.tabs{display:flex;gap:4px;margin-bottom:12px;border-bottom:1px solid var(--border)}
.tab{position:relative;padding:9px 14px;background:none;border:0;border-radius:var(--radius) var(--radius) 0 0;color:var(--muted);font:inherit;font-weight:600;cursor:pointer;transition:color .14s}
.tab:hover,.tab[aria-current]{color:var(--text)}
.tab:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.tab::after{content:"";position:absolute;left:10px;right:10px;bottom:-1px;height:2px;background:linear-gradient(135deg,#22d3ee,#2f5bff);opacity:0}
.tab[aria-current]::after{opacity:1}
.view{view-transition-name:view;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
h2{margin:0;font-size:16px;font-weight:600}
.view p{margin:4px 0 14px;color:var(--muted)}
.rows{margin:0}
.rows div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--border)}
dt{color:var(--muted)}
dd{margin:0;font-weight:600;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>

<style>
/* Global: los pseudo-elementos de View Transitions no admiten el atributo de scoped */
::view-transition-old(view){animation:vt-out .2s ease both}
::view-transition-new(view){animation:vt-in .24s ease both}
@keyframes vt-out{to{opacity:0;transform:translateX(calc(var(--d, 1) * -24px))}}
@keyframes vt-in{from{opacity:0;transform:translateX(calc(var(--d, 1) * 24px))}}
@media (prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
</style>
