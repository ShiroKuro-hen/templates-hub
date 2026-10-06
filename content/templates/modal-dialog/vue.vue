<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ open: boolean; title: string; confirmLabel?: string }>();
const emit = defineEmits<{ close: [returnValue: string] }>();
const dlg = ref<HTMLDialogElement>();

watch(() => props.open, (o) => {
  if (o && dlg.value && !dlg.value.open) { dlg.value.returnValue = ''; dlg.value.showModal(); }
  if (!o && dlg.value?.open) dlg.value.close();
});
const onBackdrop = (e: MouseEvent) => { if (e.target === dlg.value) dlg.value?.close('cancel'); };
</script>

<template>
  <dialog ref="dlg" aria-labelledby="m-title" aria-describedby="m-text"
          @close="emit('close', dlg!.returnValue)" @click="onBackdrop">
    <form method="dialog">
      <h2 id="m-title">{{ title }}</h2>
      <p id="m-text"><slot /></p>
      <div class="actions">
        <button class="btn" value="cancel" autofocus>Cancelar</button>
        <button class="btn danger" value="delete">{{ confirmLabel ?? 'Eliminar proyecto' }}</button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.btn { font:600 14px system-ui,-apple-system,"Segoe UI",sans-serif; padding:8px 14px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); cursor:pointer; transition:border-color .14s, filter .14s; }
.btn:hover { border-color:var(--accent); }
.btn.danger { color:var(--accent-ink); background:var(--err); border-color:var(--err); }
.btn.danger:hover { filter:brightness(1.08); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
dialog { position:fixed; width:min(400px, calc(100% - 24px)); padding:0; overflow:hidden; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
dialog::before { content:""; position:absolute; inset:0 0 auto; height:2px; background:linear-gradient(135deg,#22d3ee,#2f5bff); }
dialog[open] { animation:pop .16s ease-out; }
dialog::backdrop { background:rgba(10,15,28,.55); }
form { padding:22px 20px 20px; }
h2 { margin:0 0 6px; font-size:18px; font-weight:600; }
p { margin:0 0 20px; color:var(--muted); }
.actions { display:flex; justify-content:flex-end; gap:10px; }
@keyframes pop { from { opacity:0; transform:translateY(8px) scale(.98); } }
@media (prefers-reduced-motion:reduce) { dialog[open] { animation:none; } * { transition:none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
