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
.tabs { font:14px/1.5 system-ui, sans-serif; color:#17130f; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
[role="tablist"] { position:relative; z-index:1; display:flex; gap:6px; margin-bottom:-2px; }
[role="tab"] { padding:10px 16px; font:inherit; font-weight:600; color:#6b6258; background:#f6f1e7; border:2px solid #17130f; border-bottom:0; border-radius:10px 10px 0 0; cursor:pointer; }
[role="tab"]:hover { background:#ffd84d; color:#17130f; }
[role="tab"][aria-selected="true"] { background:#fffdf8; color:#17130f; box-shadow:inset 0 4px 0 #ff5a36; }
[role="tab"][aria-selected="true"]:focus-visible { outline-offset:-5px; }
[role="tabpanel"] { padding:16px 18px; background:#fffdf8; border:2px solid #17130f; border-radius:0 10px 10px 10px; box-shadow:4px 4px 0 #17130f; }
p { margin:0; max-width:52ch; }
</style>
