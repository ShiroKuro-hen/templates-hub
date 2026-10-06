<script setup lang="ts">
import { ref } from 'vue';

const options = [
  { label: 'Publicar ahora', hint: 'Visible al instante' },
  { label: 'Programar', hint: 'Mañana a las 9:00' },
  { label: 'Guardar borrador', hint: 'Solo lo ves tú' },
];
const label = ref(options[0].label);
const open = ref(false);
const wrap = ref<HTMLElement>();
const menu = ref<HTMLElement>();
const items = () => [...(menu.value?.querySelectorAll('button') ?? [])];

function place() {
  const r = wrap.value!.getBoundingClientRect();
  Object.assign(menu.value!.style, { left: `${r.left}px`, top: `${r.bottom + 10}px` });
}
function onToggle(e: Event) {
  open.value = (e as ToggleEvent).newState === 'open';
  if (open.value) items()[0]?.focus();
}
function onKey(e: KeyboardEvent) {
  const list = items();
  const i = list.indexOf(document.activeElement as HTMLButtonElement);
  const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: list.length - 1 }[e.key];
  if (to === undefined) return;
  e.preventDefault();
  list[(to + list.length) % list.length].focus();
}
function pick(l: string) {
  label.value = l;
  menu.value?.hidePopover();
}
</script>

<template>
  <div ref="wrap" class="split">
    <button type="button" id="main">{{ label }}</button>
    <button type="button" id="caret" popovertarget="menu" aria-haspopup="menu" :aria-expanded="open"
            aria-label="Más opciones de publicación" @click="place">▾</button>
  </div>
  <div id="menu" ref="menu" popover role="menu" @toggle="onToggle" @keydown="onKey">
    <button v-for="o in options" :key="o.label" role="menuitem" @click="pick(o.label)">
      {{ o.label }}<small>{{ o.hint }}</small>
    </button>
  </div>
</template>

<style scoped>
.split { display: inline-flex; border-radius: 10px; box-shadow: 4px 4px 0 #17130f; }
.split:has(button:active) { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
.split button { font: 600 14px system-ui, sans-serif; padding: 9px 16px; border: 2px solid #17130f; background: #ff5a36; color: #17130f; cursor: pointer; }
.split button:hover { background: #ff7d5e; }
.split button:focus-visible { outline: 3px solid #ff5a36; outline-offset: 3px; }
#main { border-radius: 10px 0 0 10px; }
#caret { border-radius: 0 10px 10px 0; margin-left: -2px; padding: 9px 12px; }
#menu { position: fixed; inset: auto; margin: 0; min-width: 230px; padding: 6px; border: 2px solid #17130f; border-radius: 10px;
  background: #fffdf8; color: #17130f; box-shadow: 4px 4px 0 #17130f; }
#menu button { display: block; width: 100%; text-align: left; padding: 8px 10px; border: 0; border-radius: 6px;
  background: none; font: 600 14px system-ui, sans-serif; color: inherit; cursor: pointer; }
#menu button:hover, #menu button:focus-visible { background: #ffd84d; outline: 3px solid #ff5a36; outline-offset: -3px; }
#menu small { display: block; font-weight: 400; color: #6b6258; }
</style>
