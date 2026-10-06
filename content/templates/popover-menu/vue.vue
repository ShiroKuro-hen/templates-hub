<script setup lang="ts">
import { ref } from 'vue';

type MenuAction = { label: string; danger?: boolean };
defineProps<{ label: string; actions: MenuAction[] }>();
const emit = defineEmits<{ select: [label: string] }>();

const btn = ref<HTMLButtonElement>();
const menu = ref<HTMLDivElement>();
const open = ref(false);
const items = () => [...(menu.value?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])];

function onToggle(e: Event) {
  open.value = (e as ToggleEvent).newState === 'open';
  if (!open.value || !btn.value || !menu.value) return;
  const r = btn.value.getBoundingClientRect();
  menu.value.style.top = `${r.bottom + 6}px`;
  menu.value.style.left = `${r.left}px`;
  items()[0]?.focus();
}
function onKeydown(e: KeyboardEvent) {
  const l = items(), i = l.indexOf(document.activeElement as HTMLElement);
  const next = { ArrowDown: l[(i + 1) % l.length], ArrowUp: l[(i - 1 + l.length) % l.length], Home: l[0], End: l[l.length - 1] }[e.key];
  if (next) { e.preventDefault(); next.focus(); }
}
</script>

<template>
  <button ref="btn" type="button" class="btn" popovertarget="pm" aria-haspopup="menu" :aria-expanded="open">{{ label }} ▾</button>
  <div ref="menu" id="pm" popover role="menu" :aria-label="label" @toggle="onToggle" @keydown="onKeydown">
    <button v-for="a in actions" :key="a.label" role="menuitem" :class="{ danger: a.danger }"
            popovertarget="pm" popovertargetaction="hide" @click="emit('select', a.label)">{{ a.label }}</button>
  </div>
</template>

<style scoped>
.btn { font: 600 14px system-ui, -apple-system, "Segoe UI", sans-serif; padding: 8px 14px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: 0 1px 2px rgba(14,23,38,.06); cursor: pointer; transition: border-color 140ms, background 140ms; }
.btn:hover { border-color: var(--accent); }
.btn[aria-expanded="true"] { color: var(--accent); background: var(--accent-soft); border-color: var(--accent); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
[popover] { position: fixed; inset: auto; margin: 0; min-width: 200px; padding: 4px; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
[popover]:popover-open { animation: in 140ms ease-out; }
[role="menuitem"] { display: block; width: 100%; padding: 7px 10px; font: inherit; text-align: left; color: var(--text); background: none; border: 0; border-radius: 6px; cursor: pointer; }
[role="menuitem"]:hover, [role="menuitem"]:focus-visible { background: var(--accent-soft); }
[role="menuitem"]:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
[role="menuitem"].danger { color: var(--err); }
[role="menuitem"].danger:hover, [role="menuitem"].danger:focus-visible { background: var(--err-soft); outline-color: var(--err); }
@keyframes in { from { opacity: 0; transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) { [popover]:popover-open { animation: none; } .btn { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
