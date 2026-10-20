<script setup lang="ts">
import { nextTick, ref } from 'vue';

type Item = { id: string; name: string };

const ITEMS: Item[] = [
  { id: 'pagos', name: 'Incidencia en pagos' },
  { id: 'tls', name: 'Renovar certificado TLS' },
  { id: 'accesos', name: 'Revisar accesos de proveedores' },
  { id: 'bd', name: 'Migrar base de datos de clientes' },
  { id: 'informe', name: 'Preparar informe mensual' },
];

const items = ref<Item[]>([...ITEMS]);
const manual = ref<Item[] | null>(null);
const live = ref('');
const stage = ref<HTMLElement>();
const list = ref<HTMLOListElement>();
let tops = new Map<string, number>();

function rowsOf(): HTMLElement[] {
  return Array.from(list.value?.children ?? [], (el) => el as HTMLElement);
}

function remember() {
  tops = new Map(rowsOf().map((row) => [row.dataset.id ?? '', row.getBoundingClientRect().top]));
}

function play() {
  const el = stage.value;
  if (!el) return;
  const css = getComputedStyle(el);
  const duration = parseFloat(css.getPropertyValue('--dur')) * 1000;
  const easing = css.getPropertyValue('--ease');
  for (const row of rowsOf()) {
    const prev = tops.get(row.dataset.id ?? '');
    const dy = prev === undefined ? 0 : prev - row.getBoundingClientRect().top;
    if (dy) row.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration, easing });
  }
}

async function move(id: string, delta: number) {
  const from = items.value.findIndex((it) => it.id === id), to = from + delta;
  const name = items.value[from].name;
  if (to < 0 || to >= items.value.length) {
    live.value = `${name} ya está ${delta < 0 ? 'al principio' : 'al final'} de la lista.`;
    return;
  }
  const next = [...items.value];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  remember();
  items.value = next;
  live.value = `${name}: posición ${to + 1} de ${items.value.length}.`;
  await nextTick();
  play();
  list.value?.querySelector<HTMLButtonElement>(`[data-id="${id}"] [data-dir=${delta < 0 ? 'up' : 'down'}]`)?.focus();
}

async function toggleSort() {
  remember();
  if (manual.value) {
    items.value = manual.value;
    manual.value = null;
    live.value = 'Orden de prioridad restaurado.';
  } else {
    manual.value = items.value;
    items.value = [...items.value].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    live.value = 'Lista ordenada de la A a la Z.';
  }
  await nextTick();
  play();
}

function onKey(e: KeyboardEvent, id: string) {
  const delta = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
  if (!e.altKey || delta === 0) return;
  e.preventDefault();
  move(id, delta);
}
</script>

<template>
  <section ref="stage" class="stage" aria-labelledby="ttl">
    <div class="head">
      <div>
        <h1 id="ttl">Prioridades del sprint</h1>
        <p class="lead">Usa Subir y Bajar, o Alt + flechas sobre una fila.</p>
      </div>
      <button type="button" class="sort" :aria-pressed="manual !== null" @click="toggleSort">Ordenar A–Z</button>
    </div>
    <ol ref="list" class="list">
      <li v-for="(it, k) in items" :key="it.id" :data-id="it.id" class="row" tabindex="0" @keydown="onKey($event, it.id)">
        <span class="pos">{{ k + 1 }}</span>
        <span class="name">{{ it.name }}</span>
        <span class="acts">
          <button type="button" class="mv" data-dir="up" :aria-label="`Subir: ${it.name}`" @click="move(it.id, -1)">Subir</button>
          <button type="button" class="mv" data-dir="down" :aria-label="`Bajar: ${it.name}`" @click="move(it.id, 1)">Bajar</button>
        </span>
      </li>
    </ol>
    <p class="live" aria-live="polite">{{ live }}</p>
  </section>
</template>

<style scoped>
.stage { --dur:.26s; --ease:cubic-bezier(.2,.8,.2,1); max-width:560px; margin:0 auto; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
.head { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:12px; }
h1 { margin:0; font-size:1.25rem; letter-spacing:-.01em; }
.lead { margin:4px 0 0; color:var(--muted); }
.sort { font:600 14px system-ui,-apple-system,"Segoe UI",sans-serif; padding:8px 14px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); cursor:pointer; }
.sort:hover { border-color:var(--accent); }
.sort[aria-pressed=true] { background:var(--accent-soft); border-color:var(--accent); }
.list { display:grid; gap:8px; margin:0; padding:0; list-style:none; }
.row { display:flex; align-items:center; gap:12px; padding:10px 12px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
.pos { flex:none; width:24px; height:24px; display:grid; place-items:center; border-radius:50%; background:var(--accent-soft); font-size:12px; font-weight:600; font-variant-numeric:tabular-nums; }
.name { flex:1; min-width:0; font-weight:600; }
.acts { display:flex; flex:none; gap:6px; }
.mv { font:inherit; font-size:13px; padding:4px 10px; color:var(--text); background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; }
.mv:hover { border-color:var(--accent); }
.live { min-height:20px; margin:10px 0 0; color:var(--muted); font-size:13px; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
@media (prefers-reduced-motion:reduce) { .stage { --dur:0s; } }
</style>
