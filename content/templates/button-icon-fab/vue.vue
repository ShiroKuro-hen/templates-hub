<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Action = { label: string; d: string };
const actions: Action[] = [
  { label: 'Nueva tarea', d: 'M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11' },
  { label: 'Subir archivo', d: 'M12 16V4M7 9l5-5 5 5M4 20h16' },
  { label: 'Invitar persona', d: 'M5 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6' },
];
const emit = defineEmits<{ action: [label: string] }>();
const open = ref(false);
const status = ref('');
const wrap = ref<HTMLDivElement>();
const fab = ref<HTMLButtonElement>();

watch(open, async (v) => {
  if (!v) return;
  await nextTick();
  wrap.value?.querySelector<HTMLButtonElement>('.actions button')?.focus();
});
function close() { open.value = false; fab.value?.focus(); }
function choose(label: string) { status.value = `Elegiste: ${label}.`; close(); emit('action', label); }
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open.value) close(); };
const onClick = (e: MouseEvent) => { if (!wrap.value?.contains(e.target as Node)) open.value = false; };
onMounted(() => { document.addEventListener('keydown', onKey); document.addEventListener('click', onClick); });
onBeforeUnmount(() => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); });
</script>

<template>
  <section class="stage" aria-labelledby="fab-title">
    <h2 id="fab-title">Proyecto Atlas</h2>
    <p>Usa el botón Crear para añadir contenido sin salir de la página.</p>
    <p class="status" role="status">{{ status }}</p>
    <div ref="wrap" class="fab-wrap">
      <button ref="fab" class="fab" type="button" aria-label="Crear" :aria-expanded="open"
              aria-controls="fab-actions" @click="open = !open">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <ul id="fab-actions" class="actions" :hidden="!open">
        <li v-for="a in actions" :key="a.label">
          <button type="button" @click="choose(a.label)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="a.d" /></svg>
            {{ a.label }}
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.stage{position:relative;min-height:320px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.stage h2{margin:0 0 4px;font-size:16px}
.stage p{margin:0;color:var(--muted)}
.stage .status{margin-top:12px;min-height:1.5em;color:var(--text)}
.fab-wrap{position:absolute;right:20px;bottom:20px;display:flex;flex-direction:column-reverse;align-items:flex-end;gap:12px}
.fab{display:grid;place-items:center;width:56px;height:56px;padding:0;border:1px solid transparent;border-radius:50%;cursor:pointer;color:var(--accent-ink);
     background:linear-gradient(var(--accent),var(--accent)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box;box-shadow:var(--shadow);transition:filter .14s}
.fab:hover{filter:brightness(1.08)}
.fab svg{transition:transform .16s}
.fab[aria-expanded=true] svg{transform:rotate(45deg)}
.actions{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.actions button{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;font:inherit;font-weight:500;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:999px;box-shadow:var(--shadow);cursor:pointer;transition:background .14s}
.actions button:hover{background:var(--accent-soft)}
.actions svg{color:var(--accent)}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
