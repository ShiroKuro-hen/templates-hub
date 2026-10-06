<script setup lang="ts">
import { ref } from 'vue';

type Item = { id: string; label: string; icon: string }; // icon = atributo "d" de un path 24x24
type Section = { title: string; items: Item[] };
withDefaults(defineProps<{ sections?: Section[]; brand?: string }>(), {
  brand: 'Tinta&Co',
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
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
.side { position:relative; width:224px; padding:8px; overflow:hidden; font:14px/1.5 system-ui, sans-serif; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; transition:width .2s; }
.side.collapsed { width:64px; }
.head { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:0 4px 8px; }
.brand { font-weight:800; font-size:1.1rem; letter-spacing:-.02em; white-space:nowrap; }
.toggle { flex:none; display:grid; place-items:center; width:34px; height:34px; color:inherit; background:#ffd84d; border:2px solid #17130f; border-radius:8px; cursor:pointer; }
.toggle svg { transition:transform .2s; }
.collapsed .toggle svg { transform:rotate(180deg); }
.collapsed .head { justify-content:center; padding-inline:0; }
.grp + .grp { margin-top:8px; padding-top:6px; border-top:2px solid #17130f1f; }
.sec { margin:4px 8px; font:600 11px ui-monospace, monospace; color:#6b6258; }
ul { display:grid; gap:2px; margin:0; padding:0; list-style:none; }
a { display:flex; align-items:center; gap:10px; height:32px; padding:0 10px; color:inherit; font-weight:600; white-space:nowrap; text-decoration:none; border-radius:8px; }
a:hover { background:#ffd84d; }
a[aria-current] { background:#17130f; color:#fffdf8; }
.ic { flex:none; width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.collapsed a { justify-content:center; padding:0; }
.collapsed .lbl, .collapsed .sec, .collapsed .brand { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
@media (prefers-reduced-motion:reduce) { .side, .toggle svg { transition:none; } }
</style>
