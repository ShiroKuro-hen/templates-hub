<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

const TEAM = [['Ana Pérez', 'Diseño'], ['Bruno Salas', 'Ingeniería'], ['Carla Núñez', 'Producto'], ['Diego Herrera', 'Soporte'], ['Elena Vidal', 'Datos']];
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const el = ref<HTMLTextAreaElement>();
const text = ref('');
const query = ref<string | null>(null); // null = lista cerrada
const sel = ref(0);
let from = 0;

const items = computed(() => (query.value === null ? [] : TEAM.filter(([n]) => norm(n).includes(norm(query.value!)))));
const hit = computed(() => TEAM.filter(([n]) => text.value.includes('@' + n)));

function onInput() {
  const pos = el.value!.selectionStart, r = /(^|\s)@([^\s@]*)$/.exec(text.value.slice(0, pos));
  query.value = r ? r[2] : null; sel.value = 0;
  if (r) from = pos - r[2].length - 1;
}
async function pick(i: number) {
  const t = el.value!, name = items.value[i][0], pos = from + name.length + 2;
  text.value = text.value.slice(0, from) + '@' + name + ' ' + text.value.slice(t.selectionStart);
  query.value = null; await nextTick(); t.focus(); t.setSelectionRange(pos, pos);
}
function move(d: number) { if (items.value.length) sel.value = (sel.value + d + items.value.length) % items.value.length; }</script>

<template>
  <div class="mi">
    <label for="t">Comentario para el equipo</label>
    <textarea id="t" ref="el" v-model="text" rows="3" placeholder="Escribe @ para mencionar a alguien"
      role="combobox" :aria-expanded="query !== null" aria-controls="list" aria-autocomplete="list" aria-describedby="m"
      :aria-activedescendant="items.length && query !== null ? 'o' + sel : undefined"
      @input="onInput" @blur="query = null" @keydown.esc="query !== null && ($event.preventDefault(), (query = null))"
      @keydown.down="query !== null && ($event.preventDefault(), move(1))" @keydown.up="query !== null && ($event.preventDefault(), move(-1))"
      @keydown.tab="query !== null && items.length && ($event.preventDefault(), pick(sel))"
      @keydown.enter.exact="query !== null && ($event.preventDefault(), items.length && pick(sel))" />
    <ul id="list" class="list" role="listbox" aria-label="Personas del equipo" :hidden="query === null">
      <li v-for="([n, r], i) in items" :id="'o' + i" :key="n" role="option" :aria-selected="i === sel" @mousedown.prevent="pick(i)">
        <span class="av" aria-hidden="true">{{ n.split(' ').map((w) => w[0]).join('') }}</span>
        <span class="who"><b>{{ n }}</b><small>{{ r }}</small></span>
      </li>
      <li v-if="!items.length" class="none">Sin resultados para «{{ query }}». Prueba con otro nombre.</li>
    </ul>
    <p id="m" class="meta" aria-live="polite">
      <template v-if="hit.length">Se notificará a <span v-for="[n] in hit" :key="n" class="chip">{{ n }}</span></template>
      <template v-else>Usa las flechas para elegir y Enter para insertar.</template>
    </p>
  </div>
</template>

<style scoped>
.mi{position:relative;max-width:520px;margin:0 auto;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
label{display:block;margin-bottom:6px;font-weight:600}
textarea{display:block;width:100%;box-sizing:border-box;resize:vertical;font:inherit;color:inherit;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.list{position:absolute;z-index:2;left:16px;right:16px;margin:4px 0 0;padding:4px;list-style:none;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.list[hidden]{display:none}
.list li{display:flex;align-items:center;gap:10px;padding:6px 8px;border-radius:var(--radius);cursor:pointer;transition:background .12s}
.list li[aria-selected=true]{background:var(--accent-soft)}
.list .none{color:var(--muted);cursor:default}
.av{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:11px;font-weight:600}
[aria-selected=true] .av{background:linear-gradient(135deg,#22d3ee,#2f5bff);color:#fff}
.who{display:grid;line-height:1.3}
.who small{color:var(--muted)}
.meta{margin:10px 0 0;min-height:24px;font-size:12px;color:var(--muted)}
.chip{display:inline-block;margin:0 4px 0 0;padding:0 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
