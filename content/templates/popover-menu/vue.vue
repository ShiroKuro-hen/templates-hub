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
.btn { font:600 14px system-ui, sans-serif; padding:8px 14px; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; cursor:pointer; }
.btn:hover, .btn:active, .btn[aria-expanded="true"] { transform:translate(2px,2px); box-shadow:2px 2px 0 #17130f; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
[popover] { position:fixed; inset:auto; margin:0; min-width:190px; padding:6px; font:14px/1.45 system-ui, sans-serif; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; }
[popover]:popover-open { animation:in .12s ease-out; }
[role="menuitem"] { display:block; width:100%; padding:7px 10px; font:inherit; text-align:left; color:#17130f; background:none; border:0; border-radius:6px; cursor:pointer; }
[role="menuitem"]:hover, [role="menuitem"]:focus-visible { background:#ffd84d; outline:none; }
[role="menuitem"]:focus-visible { box-shadow:inset 0 0 0 3px #ff5a36; }
[role="menuitem"].danger { color:#d6293e; font-weight:600; }
[role="menuitem"].danger:hover, [role="menuitem"].danger:focus-visible { color:#17130f; }
@keyframes in { from { opacity:0; transform:translateY(-4px); } }
@media (prefers-reduced-motion:reduce) { [popover]:popover-open { animation:none; } }
</style>
