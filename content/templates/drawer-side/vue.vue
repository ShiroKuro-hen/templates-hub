<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ open: boolean; title: string }>();
const emit = defineEmits<{ close: []; apply: [data: FormData] }>();
const dlg = ref<HTMLDialogElement>();

watch(() => props.open, (o) => {
  if (o && !dlg.value?.open) dlg.value?.showModal();
  if (!o && dlg.value?.open) dlg.value.close();
});
const onBackdrop = (e: MouseEvent) => { if (e.target === dlg.value) dlg.value?.close(); };
const apply = (e: Event) => emit('apply', new FormData(e.currentTarget as HTMLFormElement));
</script>

<template>
  <dialog ref="dlg" aria-labelledby="drawer-title" @close="emit('close')" @click="onBackdrop">
    <header>
      <h2 id="drawer-title">{{ title }}</h2>
      <button type="button" class="x" aria-label="Cerrar filtros" @click="dlg?.close()">×</button>
    </header>
    <form method="dialog" style="display: contents" @submit="apply">
      <div class="body"><slot /></div>
      <footer>
        <button type="reset" class="btn">Limpiar</button>
        <button class="btn main">Aplicar</button>
      </footer>
    </form>
  </dialog>
</template>

<style scoped>
.btn { font:600 14px system-ui; padding:8px 14px; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; cursor:pointer; }
.btn:hover, .btn:active { transform:translate(2px,2px); box-shadow:2px 2px 0 #17130f; }
.btn.main { background:#ffd84d; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
dialog { margin:0 0 0 auto; width:min(300px, 100%); height:100%; max-height:100%; padding:0; font:14px/1.45 system-ui, sans-serif; color:#17130f; background:#fffdf8; border:0; border-left:2px solid #17130f; border-radius:0; }
dialog[open] { display:flex; flex-direction:column; animation:slide .22s ease-out; }
dialog::backdrop { background:rgba(23,19,15,.5); }
header, footer { display:flex; align-items:center; gap:10px; padding:10px 14px; }
header { justify-content:space-between; border-bottom:2px solid #17130f; }
footer { justify-content:flex-end; border-top:2px solid #17130f; }
h2 { margin:0; font-size:17px; letter-spacing:-.02em; }
.x { width:32px; height:32px; font-size:20px; line-height:1; color:#17130f; background:none; border:2px solid #17130f; border-radius:8px; cursor:pointer; }
.x:hover { background:#ffd84d; }
.body { flex:1; overflow:auto; padding:6px 14px 10px; }
@keyframes slide { from { transform:translateX(100%); } }
@media (prefers-reduced-motion:reduce) { dialog[open] { animation:none; } }
</style>
