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
        <button class="btn danger" value="delete">{{ confirmLabel ?? 'Eliminar' }}</button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.btn { font:600 14px system-ui; padding:8px 14px; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; cursor:pointer; }
.btn:hover, .btn:active { transform:translate(2px,2px); box-shadow:2px 2px 0 #17130f; }
.btn.danger { background:#d6293e; color:#fff; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
dialog { width:min(380px, calc(100% - 24px)); padding:0; font:14px/1.45 system-ui, sans-serif; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; }
dialog[open] { animation:pop .18s ease-out; }
dialog::backdrop { background:rgba(23,19,15,.55); }
form { padding:18px; }
h2 { margin:0 0 6px; font-size:18px; letter-spacing:-.02em; }
p { margin:0 0 18px; color:#6b6258; }
.actions { display:flex; justify-content:flex-end; gap:10px; }
@keyframes pop { from { opacity:0; transform:translateY(8px) scale(.97); } }
@media (prefers-reduced-motion:reduce) { dialog[open] { animation:none; } }
</style>
