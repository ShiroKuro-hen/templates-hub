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
        <button class="btn main">Aplicar filtros</button>
      </footer>
    </form>
  </dialog>
</template>

<style scoped>
.btn { font:600 14px system-ui,-apple-system,"Segoe UI",sans-serif; padding:8px 14px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); cursor:pointer; transition:border-color .14s, filter .14s; }
.btn:hover { border-color:var(--accent); }
.btn.main { color:var(--accent-ink); background:var(--accent); border-color:var(--accent); }
.btn.main:hover { filter:brightness(1.08); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
dialog { margin:0 0 0 auto; width:min(320px, 100%); height:100%; max-height:100%; padding:0; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); background:var(--surface); border:0; border-left:1px solid var(--border); border-radius:0; box-shadow:var(--shadow); }
dialog[open] { display:flex; flex-direction:column; animation:slide .16s ease-out; }
dialog::backdrop { background:rgba(10,15,28,.5); }
header, footer { display:flex; align-items:center; gap:10px; padding:12px 16px; }
header { position:relative; justify-content:space-between; border-bottom:1px solid var(--border); }
header::after { content:""; position:absolute; left:0; right:0; bottom:-1px; height:2px; background:linear-gradient(135deg,#22d3ee,#2f5bff); }
footer { justify-content:flex-end; border-top:1px solid var(--border); }
h2 { margin:0; font-size:16px; font-weight:600; }
.x { width:32px; height:32px; font-size:20px; line-height:1; color:var(--muted); background:none; border:0; border-radius:var(--radius); cursor:pointer; transition:background .14s, color .14s; }
.x:hover { color:var(--text); background:var(--bg); }
.body { flex:1; overflow:auto; padding:8px 16px 12px; }
@keyframes slide { from { transform:translateX(100%); } }
@media (prefers-reduced-motion:reduce) { dialog[open] { animation:none; } * { transition:none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
