<script setup lang="ts">
import { computed, ref } from 'vue';

const data: [string, string][] = [
  ['Balanceadores de carga', 'Red'], ['Bases de datos gestionadas', 'Datos'], ['Buckets de almacenamiento', 'Datos'],
  ['Claves de API', 'Seguridad'], ['Facturación mensual', 'Cuenta'], ['Funciones sin servidor', 'Cómputo'],
  ['Máquinas virtuales', 'Cómputo'], ['Registros de auditoría', 'Seguridad'], ['Usuarios y roles', 'Cuenta'],
];
const q = ref('');
const open = ref(false);
const active = ref(-1);
const recent = ref(['Máquinas virtuales', 'Claves de API']);
const status = ref('');

const t = computed(() => q.value.trim());
const opts = computed(() =>
  t.value
    ? data.filter(([n]) => n.toLowerCase().includes(t.value.toLowerCase()))
    : recent.value.map((n) => data.find((d) => d[0] === n)!),
);
function parts(s: string) {
  const i = t.value ? s.toLowerCase().indexOf(t.value.toLowerCase()) : -1;
  return i < 0 ? [s, '', ''] : [s.slice(0, i), s.slice(i, i + t.value.length), s.slice(i + t.value.length)];
}
function pick(i: number) {
  const n = opts.value[i][0];
  q.value = n; open.value = false; active.value = -1;
  recent.value = [n, ...recent.value.filter((x) => x !== n)].slice(0, 4);
  status.value = `Abriendo ${n}.`;
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!open.value) { open.value = true; return; }
    if (opts.value.length) active.value = (active.value + (e.key === 'ArrowDown' ? 1 : -1) + opts.value.length) % opts.value.length;
  } else if (e.key === 'Enter' && active.value > -1) { e.preventDefault(); pick(active.value); }
  else if (e.key === 'Escape') open.value = false;
}
</script>

<template>
  <div class="ss">
    <label for="q">Buscar en la consola</label>
    <div class="field">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="5"/><path d="m11 11 3.5 3.5"/></svg>
      <input id="q" v-model="q" type="text" role="combobox" :aria-expanded="open" aria-controls="lb" aria-autocomplete="list"
             :aria-activedescendant="open && active > -1 ? 'o' + active : undefined" autocomplete="off"
             placeholder="Servicios, facturas, usuarios"
             @input="active = -1; open = true" @focus="open = true" @blur="open = false" @keydown="onKey" />
    </div>
    <ul id="lb" role="listbox" aria-label="Sugerencias" :hidden="!open">
      <li v-if="!t" class="group" role="presentation">Búsquedas recientes</li>
      <li v-for="([n, c], i) in opts" :key="n" :id="'o' + i" role="option" :aria-selected="i === active"
          @mousedown.prevent="pick(i)">
        <span>{{ parts(n)[0] }}<mark v-if="parts(n)[1]">{{ parts(n)[1] }}</mark>{{ parts(n)[2] }}</span><small>{{ c }}</small>
      </li>
      <li v-if="!opts.length" class="none" role="presentation">Sin resultados para “{{ t }}”. Prueba con otro término.</li>
    </ul>
    <p class="status" aria-live="polite">{{ status }}</p>
  </div>
</template>

<style scoped>
.ss{position:relative;max-width:520px;min-height:300px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
label{display:block;font-weight:600;margin-bottom:6px}
.field{display:flex;align-items:center;gap:8px;padding:0 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);transition:border-color .14s}
.field:focus-within{border-color:var(--accent);outline:2px solid var(--accent);outline-offset:2px}
.field svg{flex:none;color:var(--muted)}
input{flex:1;min-width:0;padding:10px 0;border:0;background:none;color:inherit;font:inherit;outline:0}
[role=listbox]{position:absolute;left:0;right:0;margin:6px 0 0;padding:6px;list-style:none;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
[role=listbox][hidden]{display:none}
.group{padding:6px 10px 4px;font-size:12px;color:var(--muted)}
[role=option]{position:relative;display:flex;justify-content:space-between;gap:12px;padding:8px 10px;border-radius:6px;cursor:pointer}
[role=option] small{color:var(--muted)}
[role=option]:hover,[role=option][aria-selected=true]{background:var(--accent-soft)}
[role=option][aria-selected=true]::before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:3px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
mark{background:none;color:var(--accent);font-weight:600}
.none{padding:10px;color:var(--muted)}
.status{margin-top:10px;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
