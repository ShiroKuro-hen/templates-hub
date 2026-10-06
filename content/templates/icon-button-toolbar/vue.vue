<script setup lang="ts">
import { ref } from 'vue';

type Tool = { id: string; label: string; d: string };

const props = withDefaults(defineProps<{ tools?: Tool[] }>(), {
  tools: () => [
    { id: 'b', label: 'Negrita', d: 'M7 4h6a4 4 0 0 1 0 8H7zM7 12h7a4 4 0 0 1 0 8H7z' },
    { id: 'i', label: 'Cursiva', d: 'M10 4h8M6 20h8M15 4l-6 16' },
    { id: 'u', label: 'Subrayado', d: 'M7 4v7a5 5 0 0 0 10 0V4M5 21h14' },
    { id: 'c', label: 'Código', d: 'M8 7l-5 5 5 5M16 7l5 5-5 5' },
    { id: 'l', label: 'Enlace', d: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1' },
  ],
});
const emit = defineEmits<{ change: [active: string[]] }>();

const active = ref<string[]>([]);
const focus = ref(0); // tabindex itinerante
const btns = ref<HTMLButtonElement[]>([]);

function toggle(i: number) {
  focus.value = i;
  const id = props.tools[i].id;
  active.value = active.value.includes(id) ? active.value.filter((a) => a !== id) : [...active.value, id];
  emit('change', active.value);
}

function onKeydown(e: KeyboardEvent) {
  const n = props.tools.length;
  const to = ({ ArrowRight: focus.value + 1, ArrowLeft: focus.value - 1, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
  if (to === undefined) return;
  e.preventDefault();
  focus.value = (to + n) % n;
  btns.value[focus.value]?.focus();
}
</script>

<template>
  <div role="toolbar" aria-label="Formato de texto" @keydown="onKeydown">
    <button
      v-for="(t, i) in props.tools"
      :key="t.id"
      :ref="(el) => { if (el) btns[i] = el as HTMLButtonElement }"
      type="button"
      :aria-label="t.label"
      :data-tip="t.label"
      :aria-pressed="active.includes(t.id)"
      :tabindex="i === focus ? 0 : -1"
      @click="toggle(i)"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="t.d" /></svg>
    </button>
  </div>
</template>

<style scoped>
[role=toolbar] { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 8px; width: fit-content; max-width: 100%; background: #fffdf8; border: 2px solid #17130f; border-radius: 10px; box-shadow: 4px 4px 0 #17130f; }
button { position: relative; display: grid; place-items: center; width: 36px; height: 36px; padding: 0; color: #17130f; background: #fffdf8; border: 2px solid transparent; border-radius: 8px; cursor: pointer; }
button:hover { border-color: #17130f; }
button[aria-pressed=true] { background: #ffd84d; border-color: #17130f; }
button:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
button::after { content: attr(data-tip); position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); z-index: 2; padding: 3px 7px; font: 11px ui-monospace, monospace; white-space: nowrap; color: #f6f1e7; background: #17130f; border-radius: 6px; opacity: 0; pointer-events: none; }
button:hover::after, button:focus-visible::after { opacity: 1; }
@media (prefers-reduced-motion: no-preference) { button::after { transition: opacity .12s; } }
</style>
