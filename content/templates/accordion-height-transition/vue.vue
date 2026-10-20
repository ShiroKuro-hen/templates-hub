<script setup lang="ts">
import { ref } from 'vue';

type Item = { id: string; pregunta: string; respuesta: string };

const props = withDefaults(defineProps<{ items?: Item[] }>(), {
  items: () => [
    { id: 'migracion', pregunta: '¿Cuánto tarda la migración?', respuesta: 'Entre 2 y 5 días hábiles según el volumen de datos. Te avisamos antes de cada corte.' },
    { id: 'datos', pregunta: '¿Mis datos se conservan?', respuesta: 'Sí. Hacemos una copia completa antes de empezar y puedes restaurarla durante 30 días.' },
    { id: 'equipo', pregunta: '¿Necesito detener mi equipo?', respuesta: 'No. Trabajamos en horario de bajo tráfico y el servicio se mantiene disponible.' },
  ],
});

const openIds = ref<string[]>(props.items.slice(0, 1).map((it) => it.id));
const single = ref(true);

const isOpen = (id: string) => openIds.value.includes(id);

function toggle(id: string) {
  if (isOpen(id)) openIds.value = openIds.value.filter((x) => x !== id);
  else openIds.value = single.value ? [id] : [...openIds.value, id];
}
</script>

<template>
  <main class="wrap">
    <div class="head">
      <h1>Preguntas frecuentes</h1>
      <label class="toggle"><input v-model="single" type="checkbox" /> Abrir uno a la vez</label>
    </div>
    <div class="acc">
      <section v-for="it in items" :key="it.id" class="item">
        <h2>
          <button type="button" class="trigger" :aria-expanded="String(isOpen(it.id))" :aria-controls="'panel-' + it.id" @click="toggle(it.id)">
            {{ it.pregunta }}
            <svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6" /></svg>
          </button>
        </h2>
        <div :id="'panel-' + it.id" class="panel" :class="{ open: isOpen(it.id) }">
          <div><p>{{ it.respuesta }}</p></div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.wrap { max-width:640px; margin:0 auto; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
.head { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px; }
h1 { margin:0; font-size:1.25rem; letter-spacing:-.01em; }
.toggle { display:inline-flex; align-items:center; gap:8px; color:var(--muted); cursor:pointer; }
.acc { --dur:260ms; --ease:cubic-bezier(.2,.7,.2,1); display:grid; gap:8px; }
.item { margin:0; overflow:hidden; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
.item h2 { margin:0; font-size:inherit; }
.trigger { display:flex; width:100%; align-items:center; justify-content:space-between; gap:12px; padding:12px 16px; font:inherit; font-weight:600; color:var(--text); background:none; border:0; text-align:left; cursor:pointer; }
.trigger:focus-visible { outline-offset:-2px; }
.chev { flex:none; width:18px; height:18px; color:var(--muted); transition:transform var(--dur) var(--ease), color var(--dur) var(--ease); }
.trigger[aria-expanded=true] .chev { transform:rotate(180deg); color:var(--accent); }
.panel { display:grid; grid-template-rows:0fr; transition:grid-template-rows var(--dur) var(--ease); }
.panel.open { grid-template-rows:1fr; }
.panel > div { min-height:0; overflow:hidden; visibility:hidden; transition:visibility var(--dur); }
.panel.open > div { visibility:visible; }
.panel p { margin:0; padding:0 16px 14px; color:var(--muted); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
@media (prefers-reduced-motion:reduce) { .panel, .panel > div, .chev { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
