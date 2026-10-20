<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const PROFILES = [
  { id: 'marta', ini: 'MR', name: 'Marta Ruiz', role: 'Diseñadora de producto', bio: 'Lidera el sistema de diseño y la documentación de componentes.', status: 'Disponible', tone: 'ok' },
  { id: 'luis', ini: 'LG', name: 'Luis Gómez', role: 'Ingeniero de datos', bio: 'Construye los pipelines de métricas y los paneles de seguimiento.', status: 'En reunión', tone: 'warn' },
  { id: 'carlos', ini: 'CD', name: 'Carlos Díaz', role: 'Responsable de seguridad', bio: 'Coordina auditorías de accesos y la respuesta a incidentes.', status: 'Fuera hoy', tone: 'idle' },
];

const loading = ref(true);
let timer = 0;

function load() {
  clearTimeout(timer);
  loading.value = true;
  timer = window.setTimeout(() => (loading.value = false), 1200);
}

load();
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <section class="stage" :data-state="loading ? 'loading' : 'ready'">
    <header class="head">
      <h1>Equipo</h1>
      <button type="button" class="reload" @click="load">Recargar</button>
    </header>
    <p class="status" aria-live="polite">{{ loading ? 'Cargando perfiles…' : 'Perfiles cargados.' }}</p>
    <ul class="grid" :aria-busy="loading">
      <li v-for="p in PROFILES" :key="p.id" class="card">
        <div class="layer sk" aria-hidden="true">
          <div class="who"><i class="bone circ" /><div class="bones"><i class="bone w1" /><i class="bone w2" /></div></div>
          <i class="bone" />
          <i class="bone w3" />
          <i class="bone tag" />
        </div>
        <div class="layer real" :inert="loading">
          <div class="who"><span class="av" aria-hidden="true">{{ p.ini }}</span><div><b>{{ p.name }}</b><small>{{ p.role }}</small></div></div>
          <p>{{ p.bio }}</p>
          <span :class="['pill', p.tone]">{{ p.status }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.stage { --dur:.4s; --ease:cubic-bezier(.2,.8,.2,1); max-width:560px; margin:0 auto; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
.head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:6px; }
h1 { margin:0; font-size:1.25rem; letter-spacing:-.01em; }
.status { min-height:20px; margin:0 0 12px; color:var(--muted); font-size:13px; }
.reload { font:600 14px system-ui,-apple-system,"Segoe UI",sans-serif; padding:8px 14px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); cursor:pointer; }
.reload:hover { border-color:var(--accent); }
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; margin:0; padding:0; list-style:none; }
.card { display:grid; padding:16px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
.layer { grid-area:1/1; display:grid; align-content:start; gap:10px; transition:opacity var(--dur) var(--ease); }
.real { opacity:0; }
.stage[data-state=ready] .real { opacity:1; }
.stage[data-state=ready] .sk { opacity:0; }
.who { display:flex; align-items:center; gap:10px; }
.who b { display:block; font-weight:600; }
.who small { display:block; color:var(--muted); font-size:13px; }
.av { flex:none; width:40px; height:40px; display:grid; place-items:center; border-radius:50%; background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff)); color:var(--accent-ink); font-weight:600; font-size:13px; }
.real p { margin:0; color:var(--muted); }
.pill { justify-self:start; padding:0 10px; border-radius:999px; font-size:12px; font-weight:600; line-height:22px; background:var(--accent-soft); }
.pill.ok { background:var(--ok-soft); }
.pill.warn { background:var(--warn-soft); }
.bone { display:block; height:12px; border-radius:6px; background:var(--accent-soft); }
.bones { display:grid; gap:8px; flex:1; }
.circ { flex:none; width:40px; height:40px; border-radius:50%; }
.w1 { width:60%; }
.w2 { width:40%; }
.w3 { width:75%; }
.tag { width:84px; height:22px; border-radius:999px; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
@media (prefers-reduced-motion:reduce) { .stage { --dur:0s; } }
</style>
