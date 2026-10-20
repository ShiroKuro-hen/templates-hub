<script setup lang="ts">
import { ref } from 'vue';

const PENDIENTES = [
  { title: 'Revisar el presupuesto', detail: 'Vence hoy a las 18:00' },
  { title: 'Responder a Ana Pérez', detail: 'Pidió confirmar la reunión' },
  { title: 'Subir el informe mensual', detail: 'Pendiente de aprobación' },
  { title: 'Actualizar la política de accesos', detail: 'Asignada por Luis Gómez' },
];
const NUEVAS = [
  { title: 'Llamar al proveedor', detail: 'Confirmar la entrega del lunes' },
  { title: 'Firmar el contrato', detail: 'Enviado por Marta Ruiz' },
  { title: 'Revisar comentarios', detail: '3 nuevos en el documento' },
  { title: 'Preparar la demo', detail: 'Jueves a las 10:00' },
];

type Task = { id: number; title: string; detail: string; leaving: boolean };

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const tasks = ref<Task[]>(PENDIENTES.map((t, id) => ({ ...t, id, leaving: false })));
const addBtn = ref<HTMLButtonElement>();
let seq = PENDIENTES.length;

function add() {
  const id = seq++;
  tasks.value.unshift({ ...NUEVAS[id % NUEVAS.length], id, leaving: false });
}

function drop(task: Task) {
  tasks.value = tasks.value.filter((t) => t !== task);
}

function remove(task: Task) {
  addBtn.value?.focus();
  if (calm) return drop(task);
  task.leaving = true;
}

function onEnd(task: Task) {
  if (task.leaving) drop(task);
}
</script>

<template>
  <div class="app">
    <div class="toolbar">
      <h2>Tareas pendientes</h2>
      <button ref="addBtn" class="btn" type="button" @click="add">Agregar</button>
    </div>
    <ul class="list">
      <li
        v-for="(t, i) in tasks"
        :key="t.id"
        class="item"
        :class="{ leaving: t.leaving }"
        :style="{ '--i': i }"
      >
        <div class="wrap" @transitionend="onEnd(t)">
          <div class="inner">
            <div class="row">
              <span class="dot" aria-hidden="true" />
              <div class="txt"><b>{{ t.title }}</b><span>{{ t.detail }}</span></div>
              <button class="rm" type="button" :aria-label="`Quitar: ${t.title}`" @click="remove(t)">×</button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.app { max-width:560px; margin:0 auto; color:var(--text); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
.toolbar { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; }
h2 { margin:0; font-size:16px; font-weight:600; }
.btn { padding:7px 14px; font:inherit; font-weight:600; color:var(--accent-ink); background:var(--accent); border:1px solid var(--accent); border-radius:var(--radius); cursor:pointer; }
.btn:hover { filter:brightness(1.08); }
.btn:focus-visible, .rm:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.list { margin:0; padding:0; list-style:none; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); overflow:hidden; }
.item { animation:enter .45s cubic-bezier(.2,.7,.2,1) both; animation-delay:calc(var(--i) * 80ms); }
.item:not(:first-child) .row { border-top:1px solid var(--border); }
.wrap { display:grid; grid-template-rows:1fr; transition:grid-template-rows .3s ease; }
.leaving .wrap { grid-template-rows:0fr; }
.inner { min-height:0; overflow:hidden; }
.row { display:flex; align-items:center; gap:12px; padding:12px 14px; }
.dot { flex:none; width:10px; height:10px; border-radius:50%; background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff)); }
.txt { flex:1; min-width:0; }
.txt b { display:block; font-weight:600; }
.txt span { color:var(--muted); font-size:13px; }
.rm { flex:none; width:28px; height:28px; font:inherit; font-size:18px; line-height:1; color:var(--muted); background:none; border:0; border-radius:var(--radius); cursor:pointer; }
.rm:hover { background:var(--bg); color:var(--text); }
@keyframes enter { from { opacity:0; transform:translateY(-8px); } }
@media (prefers-reduced-motion:reduce) { .item { animation:none; } .wrap { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
