<script setup lang="ts">
import { ref } from 'vue';

type Side = 'left' | 'right' | 'bottom';
const SIDES: [Side, string][] = [['left', 'Izquierda'], ['right', 'Derecha'], ['bottom', 'Abajo']];

const side = ref<Side>('right');
const msg = ref('');
const page = ref<HTMLElement>();
const dlg = ref<HTMLDialogElement>();
const trigger = ref<HTMLButtonElement>();
const form = ref<HTMLFormElement>();
const nameInput = ref<HTMLInputElement>();

function openDrawer() {
  form.value?.reset();
  if (page.value) page.value.inert = true;
  dlg.value?.showModal();
}

function onClose() {
  if (page.value) page.value.inert = false;
  trigger.value?.focus();
  if (dlg.value?.returnValue === 'save') msg.value = `Ajustes guardados para ${nameInput.value?.value.trim() ?? ''}.`;
}

function onBackdropClick(e: MouseEvent) {
  const el = dlg.value;
  if (!el || e.target !== el) return;
  const r = el.getBoundingClientRect();
  const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  if (outside) el.close('cancel');
}
</script>

<template>
  <main ref="page" class="page">
    <h1>Preferencias</h1>
    <p class="lead">Elige desde qué borde aparece el panel y ábrelo para editar tus ajustes.</p>
    <fieldset>
      <legend>Posición del panel</legend>
      <div class="segmented">
        <label v-for="[value, label] in SIDES" :key="value">
          <input v-model="side" type="radio" name="side" :value="value" />
          <span>{{ label }}</span>
        </label>
      </div>
    </fieldset>
    <button ref="trigger" type="button" class="btn primary" aria-haspopup="dialog" @click="openDrawer">Abrir ajustes</button>
    <p class="status" role="status">{{ msg }}</p>
  </main>

  <dialog ref="dlg" class="drawer" :data-side="side" aria-labelledby="dr-title" @close="onClose" @click="onBackdropClick">
    <form ref="form" method="dialog">
      <header class="head">
        <div>
          <h2 id="dr-title">Ajustes de cuenta</h2>
          <p>Los cambios se aplican a tu perfil.</p>
        </div>
        <button type="submit" value="cancel" class="x" aria-label="Cerrar ajustes" formnovalidate>×</button>
      </header>
      <div class="body">
        <label for="name">Nombre para mostrar</label>
        <input ref="nameInput" id="name" name="name" required autocomplete="name" value="Lucía Torres" autofocus />
        <label for="mail">Correo electrónico</label>
        <input id="mail" name="mail" type="email" required autocomplete="email" value="lucia@empresa.com" />
        <label class="check"><input type="checkbox" name="digest" checked /> Recibir un resumen semanal</label>
      </div>
      <footer class="foot">
        <button type="submit" value="cancel" class="btn" formnovalidate>Cancelar</button>
        <button type="submit" value="save" class="btn primary">Guardar</button>
      </footer>
    </form>
  </dialog>
</template>

<style scoped>
.page { max-width:640px; margin:0 auto; padding:20px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
h1 { margin:0 0 4px; font-size:1.25rem; letter-spacing:-.01em; }
.lead { margin:0 0 16px; color:var(--muted); }
fieldset { min-width:0; margin:0 0 16px; padding:0; border:0; }
legend { margin:0 0 6px; padding:0; color:var(--muted); font-weight:500; }
.segmented { display:flex; gap:4px; padding:4px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); }
.segmented label { position:relative; flex:1; padding:6px 10px; text-align:center; border-radius:min(var(--radius), 6px); cursor:pointer; }
.segmented input { position:absolute; inset:0; margin:0; opacity:0; cursor:pointer; }
.segmented label:has(:checked) { background:var(--accent); color:var(--accent-ink); font-weight:600; }
.segmented label:has(:focus-visible) { outline:2px solid var(--accent); outline-offset:2px; }
.status { min-height:1.5em; margin:12px 0 0; color:var(--ok); }
.btn { padding:8px 14px; font:inherit; font-weight:600; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; }
.btn:hover { background:var(--bg); }
.btn.primary { color:var(--accent-ink); background:var(--accent); border-color:var(--accent); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.drawer { --dur:.3s; --ease:cubic-bezier(.2,.8,.2,1); margin:0; padding:0; border:0; max-width:100%; max-height:100%; color:var(--text); background:var(--surface); box-shadow:var(--shadow); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; transform:translate(var(--tx), var(--ty)); transition-property:transform, display, overlay; transition-duration:var(--dur); transition-timing-function:var(--ease); transition-behavior:normal, allow-discrete, allow-discrete; }
.drawer[data-side=right] { inset:0 0 0 auto; width:min(360px, 100%); height:100%; --tx:100%; --ty:0; }
.drawer[data-side=left] { inset:0 auto 0 0; width:min(360px, 100%); height:100%; --tx:-100%; --ty:0; }
.drawer[data-side=bottom] { inset:auto 0 0 0; width:100%; max-height:80%; --tx:0; --ty:100%; }
.drawer[open] { transform:none; }
@starting-style { .drawer[open] { transform:translate(var(--tx), var(--ty)); } }
.drawer::backdrop { background:rgba(0,0,0,0); transition-property:background, display, overlay; transition-duration:var(--dur); transition-timing-function:var(--ease); transition-behavior:normal, allow-discrete, allow-discrete; }
.drawer[open]::backdrop { background:rgba(0,0,0,.5); }
@starting-style { .drawer[open]::backdrop { background:rgba(0,0,0,0); } }
.drawer form { display:flex; flex-direction:column; height:100%; }
.head { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; padding:20px 20px 12px; }
.head h2 { margin:0; font-size:18px; }
.head p { margin:2px 0 0; color:var(--muted); }
.x { flex:none; width:28px; height:28px; font:inherit; font-size:18px; line-height:1; color:var(--muted); background:none; border:0; border-radius:var(--radius); cursor:pointer; }
.x:hover { background:var(--bg); color:var(--text); }
.body { display:grid; align-content:start; gap:8px; flex:1; padding:8px 20px 20px; }
.body label { font-weight:500; }
.body input:not([type=checkbox]) { box-sizing:border-box; width:100%; padding:8px 10px; font:inherit; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); }
.check { display:flex; align-items:center; gap:8px; }
.foot { display:flex; justify-content:flex-end; gap:8px; padding:12px 20px; border-top:1px solid var(--border); }
@media (prefers-reduced-motion:reduce) { .drawer, .drawer::backdrop { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
