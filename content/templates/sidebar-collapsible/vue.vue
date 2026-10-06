<script setup lang="ts">
import { ref } from 'vue';

type Item = { id: string; label: string; icon: string }; // icon = atributo "d" de un path 24x24
type Section = { title: string; items: Item[] };
withDefaults(defineProps<{ sections?: Section[]; brand?: string }>(), {
  brand: 'Nexo',
  sections: () => [
    { title: 'Trabajo', items: [
      { id: 'panel', label: 'Panel', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
      { id: 'proyectos', label: 'Proyectos', icon: 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
      { id: 'tareas', label: 'Tareas', icon: 'M4 4h16v16H4zM8 12l3 3 5-6' },
    ] },
    { title: 'Equipo', items: [
      { id: 'miembros', label: 'Miembros', icon: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7' },
      { id: 'ajustes', label: 'Ajustes', icon: 'M4 7h9M17 7h3M4 17h3M11 17h9M13 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0' },
    ] },
  ],
});
const collapsed = ref(false);
const current = ref('panel');
</script>

<template>
  <aside :class="['side', { collapsed }]">
    <div class="head">
      <span class="brand">{{ brand }}</span>
      <button class="toggle" type="button" :aria-expanded="!collapsed" aria-controls="menu"
              :aria-label="collapsed ? 'Expandir menú' : 'Contraer menú'" @click="collapsed = !collapsed">
        <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
      </button>
    </div>
    <nav id="menu" aria-label="Lateral">
      <div v-for="s in sections" :key="s.title" class="grp">
        <h2 class="sec">{{ s.title }}</h2>
        <ul>
          <li v-for="it in s.items" :key="it.id">
            <a :href="`#${it.id}`" :title="collapsed ? it.label : undefined"
               :aria-current="it.id === current ? 'page' : undefined" @click="current = it.id">
              <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path :d="it.icon" /></svg>
              <span class="lbl">{{ it.label }}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.side { position:relative; width:224px; padding:8px; overflow:hidden; font:14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); transition:width .16s; }
.side.collapsed { width:64px; }
.head { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:0 4px 8px; }
.brand { font-weight:700; font-size:1.1rem; letter-spacing:-.01em; white-space:nowrap; }
.toggle { flex:none; display:grid; place-items:center; width:32px; height:32px; color:var(--muted); background:transparent; border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; transition:color .14s, border-color .14s; }
.toggle:hover { color:var(--accent); border-color:var(--accent); }
.toggle svg { transition:transform .16s; }
.collapsed .toggle svg { transform:rotate(180deg); }
.collapsed .head { justify-content:center; padding-inline:0; }
.grp + .grp { margin-top:8px; padding-top:6px; border-top:1px solid var(--border); }
.sec { margin:4px 10px; font-size:12px; font-weight:600; color:var(--muted); }
ul { display:grid; gap:2px; margin:0; padding:0; list-style:none; }
a { position:relative; display:flex; align-items:center; gap:10px; height:34px; padding:0 10px; color:var(--muted); font-weight:500; white-space:nowrap; text-decoration:none; border-radius:var(--radius); transition:background .14s, color .14s; }
a:hover { color:var(--text); background:var(--bg); }
a[aria-current] { color:var(--accent); background:var(--accent-soft); }
a[aria-current]::before { content:""; position:absolute; left:0; top:8px; bottom:8px; width:2px; border-radius:2px; background:linear-gradient(135deg,#22d3ee,#2f5bff); }
.ic { flex:none; width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.collapsed a { justify-content:center; padding:0; }
.collapsed .lbl, .collapsed .sec, .collapsed .brand { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
@media (prefers-reduced-motion:reduce) { .side, .toggle svg, a, .toggle { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
