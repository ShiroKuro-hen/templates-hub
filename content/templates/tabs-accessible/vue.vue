<script setup lang="ts">
import { ref } from 'vue';

type Tab = { id: string; label: string; text: string };
withDefaults(defineProps<{ tabs?: Tab[]; label?: string }>(), {
  label: 'Detalle del proyecto',
  tabs: () => [
    { id: 'resumen', label: 'Resumen', text: 'Entrega prevista el 14 de noviembre. 18 de 24 tareas completadas.' },
    { id: 'actividad', label: 'Actividad', text: 'Marta subió 3 mockups y Luis cerró la tarea «Carrito».' },
    { id: 'ajustes', label: 'Ajustes', text: 'Nombre, miembros del equipo y notificaciones.' },
  ],
});

const active = ref(0);
const btns = ref<HTMLButtonElement[]>([]);

function go(i: number) {
  active.value = i;
  btns.value[i]?.focus();
}
function onKeyDown(e: KeyboardEvent, n: number) {
  const i = active.value;
  const next = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  go(next);
}
</script>

<template>
  <div class="tabs">
    <div role="tablist" :aria-label="label" @keydown="onKeyDown($event, tabs.length)">
      <button v-for="(t, i) in tabs" :key="t.id" :ref="(el) => (btns[i] = el as HTMLButtonElement)"
              role="tab" type="button" :id="`tab-${t.id}`" :aria-selected="i === active"
              :aria-controls="`panel-${t.id}`" :tabindex="i === active ? 0 : -1" @click="active = i">
        {{ t.label }}
      </button>
    </div>
    <section v-for="(t, i) in tabs" :key="t.id" v-show="i === active" role="tabpanel" tabindex="0"
             :id="`panel-${t.id}`" :aria-labelledby="`tab-${t.id}`">
      <p>{{ t.text }}</p>
    </section>
  </div>
</template>

<style scoped>
.tabs { font:14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color:var(--text); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
[role="tablist"] { display:flex; gap:4px; margin-bottom:12px; border-bottom:1px solid var(--border); overflow-x:auto; }
[role="tab"] { position:relative; padding:10px 14px; font:inherit; font-weight:500; color:var(--muted); background:none; border:0; border-radius:var(--radius) var(--radius) 0 0; white-space:nowrap; cursor:pointer; transition:color .14s, background .14s; }
[role="tab"]:hover { color:var(--text); background:var(--surface); }
[role="tab"][aria-selected="true"] { color:var(--accent); }
[role="tab"][aria-selected="true"]::after { content:""; position:absolute; left:8px; right:8px; bottom:-1px; height:2px; border-radius:2px; background:linear-gradient(135deg,#22d3ee,#2f5bff); }
[role="tab"]:focus-visible { outline-offset:-2px; }
[role="tabpanel"] { padding:16px 18px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
p { margin:0; max-width:52ch; }
@media (prefers-reduced-motion:reduce) { [role="tab"] { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
