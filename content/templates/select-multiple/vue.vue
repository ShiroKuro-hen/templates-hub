<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

const props = withDefaults(defineProps<{ opciones?: string[] }>(), {
  opciones: () => ['Frontend', 'Backend', 'Diseño', 'Calidad (QA)', 'Infraestructura', 'Datos', 'Seguridad', 'Móvil', 'Producto'],
});
const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/g, '').toLowerCase();

const sel = ref<string[]>(['Frontend', 'Diseño']);
const q = ref('');
const abierta = ref(false);
const act = ref(0);
const input = ref<HTMLInputElement>();
const lista = ref<HTMLUListElement>();

const shown = computed(() => props.opciones.filter((o) => norm(o).includes(norm(q.value))));
const activa = computed(() => shown.value[Math.min(act.value, shown.value.length - 1)]);

const toggle = (o: string) => (sel.value = sel.value.includes(o) ? sel.value.filter((x) => x !== o) : [...sel.value, o]);
async function mover(d: number) {
  abierta.value = true;
  act.value = (act.value + d + shown.value.length) % (shown.value.length || 1);
  await nextTick();
  lista.value?.querySelector('.act')?.scrollIntoView({ block: 'nearest' });
}
function esc() { if (abierta.value) abierta.value = false; else q.value = ''; }
function atras() { if (!q.value && sel.value.length) sel.value = sel.value.slice(0, -1); }
function quitar(o: string) { sel.value = sel.value.filter((x) => x !== o); input.value?.focus(); }
</script>

<template>
  <main class="card">
    <h1>Áreas del proyecto</h1>
    <p class="sub">Elige las áreas que participan. Puedes escribir para buscar.</p>
    <label id="lbl" for="q">Áreas</label>
    <div class="box" @click="input?.focus()">
      <ul class="chips" aria-label="Áreas elegidas">
        <li v-for="o in sel" :key="o" class="chip">{{ o }}
          <button type="button" :aria-label="`Quitar ${o}`" @click.stop="quitar(o)">×</button></li>
      </ul>
      <input id="q" ref="input" v-model="q" role="combobox" :aria-expanded="abierta" aria-controls="list" aria-autocomplete="list"
        aria-haspopup="listbox" :aria-activedescendant="abierta && activa ? `o-${props.opciones.indexOf(activa)}` : undefined" autocomplete="off" placeholder="Buscar áreas"
        @input="act = 0; abierta = true" @focus="abierta = true" @blur="abierta = false"
        @keydown.down.prevent="mover(1)" @keydown.up.prevent="mover(-1)"
        @keydown.enter="abierta && activa && ($event.preventDefault(), toggle(activa))"
        @keydown.esc="($event.preventDefault(), esc())" @keydown.backspace="atras" />
    </div>
    <ul id="list" ref="lista" role="listbox" aria-labelledby="lbl" aria-multiselectable="true" :hidden="!abierta">
      <li v-for="o in shown" :id="`o-${props.opciones.indexOf(o)}`" :key="o" role="option" :aria-selected="sel.includes(o)" :class="{ act: o === activa }"
        @mousedown.prevent="toggle(o)">{{ o }}</li>
      <li v-if="!shown.length" class="empty">No hay áreas con ese nombre. Prueba otra palabra.</li>
    </ul>
    <p class="count" role="status">{{ sel.length ? `${sel.length} ${sel.length > 1 ? 'áreas elegidas' : 'área elegida'}.` : 'Aún no elegiste ninguna área. Abre la lista y marca una.' }}</p>
  </main>
</template>

<style scoped>
.card{max-width:460px;margin:0 auto;padding:24px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:18px;line-height:1.3}
.sub{margin:2px 0 16px;color:var(--muted)}
label{display:block;margin-bottom:6px;font-weight:600}
.box{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:6px 8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:text}
.box:focus-within{outline:2px solid var(--accent);outline-offset:2px}
.chips{display:contents;margin:0;padding:0;list-style:none}
.chip{display:inline-flex;align-items:center;gap:2px;padding:1px 2px 1px 10px;background:var(--accent-soft);border:1px solid var(--border);border-radius:999px}
.chip button{display:grid;place-items:center;width:20px;height:20px;padding:0;font:inherit;line-height:1;color:var(--muted);background:none;border:0;border-radius:999px;cursor:pointer}
.chip button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
#q{flex:1 1 120px;min-width:0;font:inherit;color:var(--text);background:transparent;border:0;padding:4px;outline:0}
#list{max-height:220px;margin:8px 0 0;padding:4px;overflow:auto;list-style:none;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
#list[hidden]{display:none}
[role=option]{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:6px;cursor:pointer}
[role=option].act{background:var(--accent-soft)}
[role=option]::before{content:"";flex:none;width:16px;height:16px;box-sizing:border-box;border:1px solid var(--border);border-radius:4px;background:var(--surface)}
[role=option][aria-selected=true]{font-weight:600}
[role=option][aria-selected=true]::before{content:"\2713";display:grid;place-items:center;font-size:11px;color:#fff;border-color:transparent;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.empty{padding:10px;color:var(--muted)}
.count{margin:8px 0 0;color:var(--muted);font-variant-numeric:tabular-nums}
/* Tokens: ver pestaña HTML + CSS */
</style>
