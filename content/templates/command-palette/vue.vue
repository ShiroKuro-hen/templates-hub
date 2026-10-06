<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Command = { id: string; label: string; group: string; shortcut?: string; run: () => void };
const props = defineProps<{ commands: Command[] }>();
const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

const dlg = ref<HTMLDialogElement>();
const query = ref('');
const active = ref(0);
const matches = computed(() => props.commands.filter((c) => norm(c.label).includes(norm(query.value.trim()))));
const groups = computed(() => [...new Set(matches.value.map((c) => c.group))]);
const results = computed(() => groups.value.flatMap((g) => matches.value.filter((c) => c.group === g)));
const current = computed(() => results.value[active.value]);

function open() { query.value = ''; active.value = 0; dlg.value?.showModal(); }
function run(c: Command) { dlg.value?.close(); c.run(); }
function move(step: number) {
  const n = results.value.length;
  if (n) active.value = (active.value + step + n) % n;
}
function onGlobal(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.value?.open ? dlg.value.close() : open(); }
}
watch(query, () => (active.value = 0));
watch(current, (c) => c && nextTick(() => document.getElementById(c.id)?.scrollIntoView({ block: 'nearest' })));
onMounted(() => document.addEventListener('keydown', onGlobal));
onBeforeUnmount(() => document.removeEventListener('keydown', onGlobal));
</script>

<template>
  <button type="button" class="trigger" aria-haspopup="dialog" @click="open"><span>Buscar comandos</span><kbd>Ctrl K</kbd></button>
  <dialog ref="dlg" aria-label="Paleta de comandos" @click.self="dlg?.close()">
    <div class="search">
      <input v-model="query" role="combobox" aria-expanded="true" aria-controls="list" aria-autocomplete="list" autocomplete="off"
             :aria-activedescendant="current?.id" placeholder="Escribe un comando o busca"
             @keydown.down.prevent="move(1)" @keydown.up.prevent="move(-1)" @keydown.enter.prevent="current && run(current)" />
    </div>
    <ul id="list" class="list" role="listbox" aria-label="Comandos">
      <li v-for="(g, i) in groups" :key="g" role="presentation">
        <div :id="`g-${i}`" class="group-label">{{ g }}</div>
        <ul role="group" :aria-labelledby="`g-${i}`">
          <li v-for="c in results.filter((r) => r.group === g)" :id="c.id" :key="c.id" role="option" :aria-selected="c === current"
              @click="run(c)" @mousemove="active = results.indexOf(c)">
            {{ c.label }} <kbd v-if="c.shortcut">{{ c.shortcut }}</kbd>
          </li>
        </ul>
      </li>
    </ul>
    <p v-if="!results.length" class="empty">Sin resultados para «<b>{{ query }}</b>». Prueba con otra palabra.</p>
    <div class="foot" aria-hidden="true"><span><kbd>↑</kbd> <kbd>↓</kbd> moverse</span><span><kbd>Enter</kbd> ejecutar</span><span><kbd>Esc</kbd> cerrar</span></div>
  </dialog>
</template>

<style scoped>
kbd{font:12px ui-monospace,"Cascadia Code",Menlo,monospace;padding:1px 6px;color:var(--muted);border:1px solid var(--border);border-radius:4px;background:var(--bg)}
.trigger{display:flex;align-items:center;gap:10px;width:100%;max-width:360px;padding:8px 12px;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);cursor:pointer}
.trigger span{flex:1;text-align:left}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
dialog{width:min(560px,calc(100vw - 32px));margin:12vh auto auto;padding:0;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
dialog::backdrop{background:color-mix(in srgb,var(--bg) 70%,transparent);backdrop-filter:blur(2px)}
.search{display:flex;align-items:center;gap:10px;padding:0 14px;border-bottom:1px solid var(--border)}
.search input{flex:1;min-width:0;padding:14px 0;font:inherit;font-size:15px;color:var(--text);background:none;border:0;outline:0}
.list{max-height:320px;overflow:auto;margin:0;padding:6px;list-style:none}
.list ul{margin:0;padding:0;list-style:none}
.list:empty{display:none}
.group-label{padding:8px 10px 4px;font-size:12px;font-weight:600;color:var(--muted)}
[role=option]{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 10px;border-radius:6px;cursor:pointer}
[role=option][aria-selected=true]{background:var(--accent-soft)}
[role=option][aria-selected=true]::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:2px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.empty{padding:24px 16px;text-align:center;color:var(--muted)}
.foot{display:flex;gap:14px;padding:8px 14px;border-top:1px solid var(--border);color:var(--muted);font-size:12px}
/* Tokens: ver pestaña HTML + CSS */
</style>
