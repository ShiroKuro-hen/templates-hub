<script setup lang="ts">
import { ref } from 'vue';

const trigger = ref<HTMLButtonElement>();
const dlg = ref<HTMLDialogElement>();
const email = ref('');
const sent = ref('');

function openDialog() {
  email.value = '';
  if (dlg.value) dlg.value.returnValue = '';
  dlg.value?.showModal();
}

function onClose() {
  trigger.value?.focus();
  if (dlg.value?.returnValue === 'send') sent.value = email.value.trim();
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
  <main class="page">
    <h1>Equipo</h1>
    <p class="lead">Invita a personas al proyecto «Web corporativa».</p>
    <button ref="trigger" type="button" class="btn primary" aria-haspopup="dialog" @click="openDialog">Invitar al equipo</button>
    <p class="status" role="status">{{ sent ? `Invitación enviada a ${sent}.` : '' }}</p>
  </main>

  <dialog ref="dlg" class="modal" aria-labelledby="dlg-title" aria-describedby="dlg-desc" @close="onClose" @click="onBackdropClick">
    <form method="dialog">
      <h2 id="dlg-title">Invitar a una persona</h2>
      <p id="dlg-desc">Le enviaremos un enlace para unirse al proyecto. Caduca en 7 días.</p>
      <label for="email">Correo electrónico</label>
      <input id="email" v-model="email" type="email" required autocomplete="email" placeholder="nombre@empresa.com" autofocus />
      <div class="actions">
        <button class="btn" type="submit" value="cancel" formnovalidate>Cancelar</button>
        <button class="btn primary" type="submit" value="send">Enviar invitación</button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.page { max-width:640px; margin:0 auto; padding:20px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
h1 { margin:0 0 4px; font-size:1.25rem; letter-spacing:-.01em; }
.lead { margin:0 0 16px; color:var(--muted); }
.status { min-height:1.5em; margin:12px 0 0; color:var(--ok); }
.btn { padding:8px 14px; font:inherit; font-weight:600; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; transition:background .14s, filter .14s; }
.btn:hover { background:var(--bg); }
.btn.primary { color:var(--accent-ink); background:var(--accent); border-color:var(--accent); }
.btn.primary:hover { background:var(--accent); filter:brightness(1.08); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.modal { --dur:240ms; --ease:cubic-bezier(.2,.7,.2,1); width:min(440px,calc(100% - 32px)); padding:24px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; opacity:0; transform:translateY(8px) scale(.98); transition-property:opacity, transform, display, overlay; transition-duration:var(--dur); transition-timing-function:var(--ease); transition-behavior:normal, normal, allow-discrete, allow-discrete; }
.modal[open] { opacity:1; transform:none; }
@starting-style { .modal[open] { opacity:0; transform:translateY(8px) scale(.98); } }
.modal::backdrop { background:rgba(0,0,0,0); transition-property:background, display, overlay; transition-duration:var(--dur); transition-timing-function:var(--ease); transition-behavior:normal, allow-discrete, allow-discrete; }
.modal[open]::backdrop { background:rgba(0,0,0,.5); }
@starting-style { .modal[open]::backdrop { background:rgba(0,0,0,0); } }
.modal h2 { margin:0 0 4px; font-size:18px; }
.modal p { margin:0 0 16px; color:var(--muted); }
.modal label { display:block; margin:0 0 6px; font-weight:500; }
.modal input { box-sizing:border-box; width:100%; padding:8px 10px; font:inherit; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); }
.actions { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px; margin-top:20px; }
@media (prefers-reduced-motion:reduce) { .modal, .modal::backdrop { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
