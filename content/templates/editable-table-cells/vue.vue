<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

type Field = 'nombre' | 'email' | 'cantidad' | 'estado' | 'fecha';
type Row = Record<Field, string>;
type Col = {
  key: Field;
  label: string;
  type?: string;
  num?: boolean;
  options?: string[];
  check: (value: string) => string;
};
type Edit = { r: number; c: number; text: string; error: string };
type Change = { r: number; c: number; prev: string };

const COLS: Col[] = [
  { key: 'nombre', label: 'Nombre', type: 'text', check: (v) => (v.trim() ? '' : 'Escribe un nombre para la fila.') },
  { key: 'email', label: 'Correo', type: 'email', check: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Usa un formato como nombre@empresa.com.') },
  { key: 'cantidad', label: 'Cantidad', type: 'number', num: true, check: (v) => (v !== '' && Number(v) >= 0 ? '' : 'La cantidad debe ser un número igual o mayor que 0.') },
  { key: 'estado', label: 'Estado', options: ['Activo', 'Pendiente', 'Inactivo'], check: () => '' },
  { key: 'fecha', label: 'Fecha', type: 'date', check: (v) => (v ? '' : 'Elige una fecha.') },
];
const MOVES: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

const props = withDefaults(defineProps<{ initial?: Row[] }>(), {
  initial: () => [
    { nombre: 'Ana Pérez', email: 'ana.perez@meridian.pe', cantidad: '1240', estado: 'Activo', fecha: '2026-03-14' },
    { nombre: 'Luis Gómez', email: 'luis.gomez@meridian.pe', cantidad: '310', estado: 'Pendiente', fecha: '2026-04-02' },
    { nombre: 'Marta Ruiz', email: 'marta.ruiz@norte.cloud', cantidad: '2890', estado: 'Activo', fecha: '2026-02-21' },
    { nombre: 'Carlos Díaz', email: 'carlos.diaz@andes.pe', cantidad: '760', estado: 'Inactivo', fecha: '2025-11-30' },
    { nombre: 'Lucía Ferrer', email: 'lucia.ferrer@norte.cloud', cantidad: '415', estado: 'Activo', fecha: '2026-06-09' },
    { nombre: 'Jorge Salas', email: 'jorge.salas@andes.pe', cantidad: '0', estado: 'Pendiente', fecha: '2026-07-18' },
  ],
});

const copy = (list: Row[]) => list.map((row) => ({ ...row }));
const saved = copy(props.initial);
const rows = ref(copy(props.initial));
const history = ref<Change[]>([]);
const editing = ref<Edit | null>(null);
const active = ref({ r: 0, c: 0 });
const message = ref('Enter o doble clic para editar. Flechas para moverte.');
const root = ref<HTMLElement | null>(null);

const cellChanged = (r: number, c: number) => rows.value[r][COLS[c].key] !== saved[r][COLS[c].key];
const changes = computed(() => rows.value.flatMap((row, r) => COLS.filter((col) => row[col.key] !== saved[r][col.key])).length);
const isEditing = (r: number, c: number) => editing.value?.r === r && editing.value.c === c;
const clamp = (n: number, max: number) => Math.min(Math.max(n, 0), max - 1);

function focusAt(r: number, c: number) {
  root.value?.querySelector<HTMLElement>(`[data-r="${clamp(r, rows.value.length)}"][data-c="${clamp(c, COLS.length)}"]`)?.focus();
}

function activate(r: number, c: number) {
  active.value = { r, c };
  if (editing.value && !isEditing(r, c)) editing.value = null;
}

function startEdit(r: number, c: number) {
  if (editing.value) return;
  editing.value = { r, c, text: rows.value[r][COLS[c].key], error: '' };
  nextTick(() => root.value?.querySelector<HTMLElement>('[data-editing] input, [data-editing] select')?.focus());
}

function commit(ed: Edit): boolean {
  const col = COLS[ed.c];
  const label = col.label.toLowerCase();
  const error = col.check(ed.text);
  if (error) {
    editing.value = { ...ed, error };
    message.value = `Error en ${label}, fila ${ed.r + 1}: ${error}`;
    return false;
  }
  const prev = rows.value[ed.r][col.key];
  if (prev !== ed.text) {
    rows.value[ed.r][col.key] = ed.text;
    history.value.push({ r: ed.r, c: ed.c, prev });
    message.value = `Guardado: ${label} de la fila ${ed.r + 1}.`;
  } else {
    message.value = 'Sin cambios.';
  }
  editing.value = null;
  return true;
}

function onEditKey(e: KeyboardEvent, ed: Edit) {
  if (e.key === 'Escape') {
    e.preventDefault();
    editing.value = null;
    message.value = 'Edición cancelada.';
    focusAt(ed.r, ed.c);
  } else if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault();
    if (commit(ed)) focusAt(e.key === 'Enter' ? ed.r + 1 : ed.r, e.key === 'Tab' ? ed.c + (e.shiftKey ? -1 : 1) : ed.c);
  }
}

function onKey(e: KeyboardEvent, r: number, c: number) {
  if (isEditing(r, c) && editing.value) return onEditKey(e, editing.value);
  const step = MOVES[e.key];
  if (step) {
    e.preventDefault();
    focusAt(r + step[0], c + step[1]);
  } else if (e.key === 'Enter' || e.key === 'F2') {
    e.preventDefault();
    startEdit(r, c);
  }
}

function undo() {
  const last = history.value.pop();
  if (!last) return;
  rows.value[last.r][COLS[last.c].key] = last.prev;
  message.value = 'Deshecho el último cambio.';
  focusAt(last.r, last.c);
}

function discard() {
  rows.value = copy(saved);
  history.value = [];
  message.value = 'Se descartaron todos los cambios.';
  focusAt(0, 0);
}
</script>

<template>
  <main ref="root" class="sheet">
    <div class="bar">
      <p class="count">{{ changes }} {{ changes === 1 ? 'cambio' : 'cambios' }}</p>
      <div class="actions">
        <button type="button" class="btn" :disabled="!history.length" @click="undo">Deshacer último</button>
        <button type="button" class="btn" :disabled="!changes" @click="discard">Descartar todo</button>
      </div>
    </div>
    <div class="scroll" role="region" tabindex="0" aria-label="Datos del personal, desplazable horizontalmente">
      <div role="grid" aria-label="Personal del equipo">
        <div role="row">
          <div v-for="col in COLS" :key="col.key" role="columnheader" :class="{ num: col.num }">{{ col.label }}</div>
        </div>
        <div v-for="(row, r) in rows" :key="r" role="row">
          <div
            v-for="(col, c) in COLS"
            :key="col.key"
            role="gridcell"
            :class="{ num: col.num }"
            :tabindex="active.r === r && active.c === c ? 0 : -1"
            :data-r="r"
            :data-c="c"
            :data-changed="cellChanged(r, c) || undefined"
            :data-editing="isEditing(r, c) || undefined"
            @focus="activate(r, c)"
            @dblclick="!isEditing(r, c) && startEdit(r, c)"
            @keydown="onKey($event, r, c)"
          >
            <template v-if="isEditing(r, c)">
              <select
                v-if="col.options"
                v-model="editing!.text"
                :aria-label="`${col.label}, fila ${r + 1}`"
                :aria-describedby="`m-${r}-${c}`"
                :aria-invalid="editing?.error ? 'true' : undefined"
                @change="editing!.error = ''"
              >
                <option v-for="option in col.options" :key="option">{{ option }}</option>
              </select>
              <input
                v-else
                v-model="editing!.text"
                :type="col.type"
                :aria-label="`${col.label}, fila ${r + 1}`"
                :aria-describedby="`m-${r}-${c}`"
                :aria-invalid="editing?.error ? 'true' : undefined"
                @input="editing!.error = ''"
              />
            </template>
            <span v-else class="v">{{ row[col.key] }}</span>
            <small v-if="isEditing(r, c) && editing?.error" :id="`m-${r}-${c}`" class="msg">{{ editing.error }}</small>
          </div>
        </div>
      </div>
    </div>
    <p class="status" aria-live="polite">{{ message }}</p>
  </main>
</template>

<style scoped>
.sheet { max-width:760px; margin:0 auto; overflow:hidden; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
.bar { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px 12px; padding:10px 12px; border-bottom:1px solid var(--border); }
.count { margin:0; font-weight:600; font-variant-numeric:tabular-nums; }
.actions { display:flex; gap:8px; }
.btn { font:inherit; font-weight:600; padding:6px 12px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; transition:border-color .14s; }
.btn:hover:not(:disabled) { border-color:var(--accent); }
.btn:disabled { opacity:.45; cursor:not-allowed; }
.scroll { overflow-x:auto; }
.scroll:focus-visible { outline-offset:-2px; }
[role=grid] { min-width:640px; }
[role=row] { display:grid; grid-template-columns:1.3fr 1.7fr .8fr 1fr 1fr; border-bottom:1px solid var(--border); }
[role=row]:last-child { border-bottom:0; }
[role=columnheader] { padding:8px 12px; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; color:var(--muted); background:var(--bg); border-right:1px solid var(--border); }
[role=gridcell] { position:relative; min-width:0; padding:10px 12px; border-right:1px solid var(--border); cursor:cell; transition:background .14s; }
[role=columnheader]:last-child, [role=gridcell]:last-child { border-right:0; }
[role=gridcell]:focus-visible { outline:2px solid var(--accent); outline-offset:-2px; }
[role=gridcell][data-changed] { background:var(--accent-soft); box-shadow:inset 3px 0 0 var(--accent); }
.num { text-align:right; font-variant-numeric:tabular-nums; }
.v { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
[role=gridcell] input, [role=gridcell] select { width:100%; height:32px; padding:0 8px; font:inherit; color:var(--text); background:var(--surface); border:1px solid var(--accent); border-radius:min(var(--radius),6px); }
[role=gridcell] input[aria-invalid=true] { border-color:var(--err); box-shadow:0 0 0 2px var(--err-soft); }
.msg { display:block; margin-top:4px; font-size:12px; color:var(--err); }
.status { margin:0; padding:8px 12px; font-size:13px; color:var(--muted); border-top:1px solid var(--border); }
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
</style>
