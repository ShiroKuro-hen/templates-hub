<script setup lang="ts">
import { ref } from 'vue';

type Item = { id: string; label: string; aria?: string; d: string; icon: string; badge?: number };
const top: Item[] = [
  { id: 'inicio', label: 'Inicio', d: 'Resumen de actividad de tu equipo esta semana.', icon: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1z' },
  { id: 'proyectos', label: 'Proyectos', d: 'Tienes 8 proyectos activos y 2 por revisar.', icon: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'mensajes', label: 'Mensajes', aria: 'Mensajes, 3 sin leer', badge: 3, d: 'Tienes 3 mensajes sin leer.', icon: 'M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { id: 'analitica', label: 'Analítica', d: 'Las visitas subieron un 12 % frente a la semana pasada.', icon: 'M4 20V10M10 20V4M16 20v-7M21 20H3' },
  { id: 'equipo', label: 'Equipo', d: '12 personas en 3 equipos. Invita a alguien nuevo.', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8' },
];
const bottom: Item[] = [
  { id: 'ajustes', label: 'Ajustes', d: 'Gestiona tu cuenta, el plan y las integraciones.',
    icon: 'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M13 6a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0M15 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0' },
];
const cur = ref(top[0]);
const esc = ref(false);
</script>

<template>
  <div class="app">
    <nav class="rail" aria-label="Principal" :data-esc="esc ? '' : undefined"
         @keydown.esc="esc = true" @mouseover="esc = false" @focusin="esc = false">
      <span class="logo" aria-hidden="true" />
      <ul v-for="(items, k) in [top, bottom]" :key="k">
        <li v-for="it in items" :key="it.id">
          <a :href="`#${it.id}`" :data-tip="it.label" :aria-label="it.aria ?? it.label"
             :aria-current="cur.id === it.id ? 'page' : undefined" @click.prevent="cur = it">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="it.icon" /></svg>
            <span v-if="it.badge" class="n" aria-hidden="true">{{ it.badge }}</span>
          </a>
        </li>
      </ul>
    </nav>
    <main><h1>{{ cur.label }}</h1><p aria-live="polite">{{ cur.d }}</p></main>
  </div>
</template>

<style scoped>
.app{display:grid;grid-template-columns:56px 1fr;max-width:720px;min-height:340px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.rail{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 0;border-right:1px solid var(--border)}
.rail ul{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.rail ul:last-child{margin-top:auto}
.logo{width:28px;height:28px;margin-bottom:12px;border-radius:var(--radius);background:var(--accent)}
.rail a{position:relative;display:grid;place-items:center;width:40px;height:40px;border-radius:var(--radius);color:var(--muted);transition:background .14s,color .14s}
.rail a:hover{background:var(--accent-soft);color:var(--text)}
.rail a[aria-current=page]{background:var(--accent-soft);color:var(--text)}
.rail a[aria-current=page]::before{content:"";position:absolute;left:-8px;top:10px;bottom:10px;width:3px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.rail a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.rail svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.n{position:absolute;top:2px;right:2px;min-width:16px;padding:0 4px;border-radius:999px;background:var(--accent);color:var(--accent-ink);font-size:11px;font-weight:600;line-height:16px;text-align:center;font-variant-numeric:tabular-nums}
.rail a::after{content:attr(data-tip);position:absolute;left:calc(100% + 12px);top:50%;transform:translateY(-50%);padding:4px 10px;border-radius:6px;background:var(--text);color:var(--bg);font-size:12px;white-space:nowrap;box-shadow:var(--shadow);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .14s,visibility .14s}
.rail a:hover::after,.rail a:focus-visible::after{opacity:1;visibility:visible}
.rail[data-esc] a::after{display:none}
main{padding:20px 24px}
h1{margin:0 0 4px;font-size:18px}
main p{margin:0;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
