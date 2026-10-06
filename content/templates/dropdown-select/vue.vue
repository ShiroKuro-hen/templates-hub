<script setup lang="ts">
import { nextTick, ref, useId, watch } from 'vue';

const props = defineProps<{ label: string; options: string[]; hint?: string }>();
const model = defineModel<string>({ required: true });
const id = useId(); // Vue 3.5+
const open = ref(false);
const active = ref(Math.max(0, props.options.indexOf(model.value)));
const list = ref<HTMLUListElement>();

watch([open, active], async () => {
  await nextTick();
  if (open.value) list.value?.children[active.value]?.scrollIntoView({ block: 'nearest' });
});

const move = (i: number) => { active.value = Math.max(0, Math.min(props.options.length - 1, i)); };
function choose(i: number) { model.value = props.options[i]; active.value = i; open.value = false; }

function onKeyDown(e: KeyboardEvent) {
  const k = e.key, n = props.options.length;
  if (!open.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(k)) { e.preventDefault(); open.value = true; }
    return;
  }
  const moves: Record<string, number> = { ArrowDown: active.value + 1, ArrowUp: active.value - 1, Home: 0, End: n - 1 };
  if (k in moves) { e.preventDefault(); move(moves[k]); }
  else if (k === 'Enter' || k === ' ') { e.preventDefault(); choose(active.value); }
  else if (k === 'Escape') open.value = false;
  else if (k === 'Tab') choose(active.value);
  else if (k.length === 1) {
    for (let s = 1; s <= n; s++) {
      const j = (active.value + s) % n;
      if (props.options[j].toLowerCase().startsWith(k.toLowerCase())) { move(j); break; }
    }
  }
}
</script>

<template>
  <div class="field">
    <label :id="`${id}-l`">{{ label }}</label>
    <div class="select">
      <div class="combo" role="combobox" tabindex="0" :aria-labelledby="`${id}-l`" aria-haspopup="listbox"
           :aria-controls="`${id}-lb`" :aria-expanded="open" :aria-describedby="hint ? `${id}-h` : undefined"
           :aria-activedescendant="open ? `${id}-o${active}` : undefined"
           @keydown="onKeyDown" @click="open = !open" @blur="open = false">
        <span>{{ model }}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </div>
      <ul v-show="open" ref="list" class="list" :id="`${id}-lb`" role="listbox" :aria-labelledby="`${id}-l`" tabindex="-1" @mousedown.prevent>
        <li v-for="(o, i) in options" :key="o" :id="`${id}-o${i}`" role="option" :aria-selected="o === model"
            :class="{ active: i === active }" @click="choose(i)">{{ o }}</li>
      </ul>
    </div>
    <p v-if="hint" class="hint" :id="`${id}-h`">{{ hint }}</p>
  </div>
</template>

<style scoped>
.field{max-width:320px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
label{display:block;margin-bottom:6px;font-weight:600}
.select{position:relative}
.combo{display:flex;align-items:center;justify-content:space-between;gap:8px;height:38px;padding:0 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;user-select:none;transition:border-color .14s}
.combo:hover{border-color:var(--muted)}
.combo:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.combo[aria-expanded=true]{border-color:var(--accent)}
.combo svg{flex:none;color:var(--muted);transition:transform .14s}
.combo[aria-expanded=true] svg{transform:rotate(180deg)}
.list{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:10;margin:0;padding:4px;list-style:none;max-height:224px;overflow:auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
[role=option]{position:relative;display:flex;justify-content:space-between;gap:8px;padding:8px 10px 8px 12px;border-radius:6px;cursor:pointer}
[role=option]:hover,[role=option].active{background:var(--accent-soft)}
[role=option].active::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:2px;border-radius:2px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
[role=option][aria-selected=true]{font-weight:600}
[role=option][aria-selected=true]::after{content:"✓";color:var(--accent)}
.hint{margin:6px 0 0;color:var(--muted);font-size:13px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
