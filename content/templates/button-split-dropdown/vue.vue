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
  Object.assign(menu.value!.style, { left: `${r.left}px`, top: `${r.bottom + 8}px` });
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
.split { display: inline-flex; border-radius: var(--radius); box-shadow: var(--shadow); }
.split button { font: 500 14px system-ui, -apple-system, "Segoe UI", sans-serif; padding: 8px 16px; border: 0; background: var(--accent);
  color: var(--accent-ink); cursor: pointer; transition: filter .14s; }
.split button:hover { filter: brightness(1.1); }
.split button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
#main { border-radius: var(--radius) 0 0 var(--radius); }
#caret { border-radius: 0 var(--radius) var(--radius) 0; padding: 8px 10px; border-left: 1px solid color-mix(in srgb, var(--accent-ink) 35%, transparent); }
#menu { position: fixed; inset: auto; margin: 0; min-width: 230px; padding: 4px; border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--surface); color: var(--text); box-shadow: var(--shadow); }
#menu button { display: block; width: 100%; text-align: left; padding: 8px 10px; border: 0; border-radius: 6px;
  background: none; font: 500 14px system-ui, -apple-system, "Segoe UI", sans-serif; color: inherit; cursor: pointer; }
#menu button:hover, #menu button:focus-visible { background: var(--accent-soft); }
#menu button:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
#menu small { display: block; font-weight: 400; color: var(--muted); }
@media (prefers-reduced-motion: reduce) { .split button { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
