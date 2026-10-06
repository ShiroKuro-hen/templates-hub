<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{ name?: string; detail?: string; word?: string }>(), {
  name: 'Web corporativa',
  detail: 'Se borrarán 128 archivos y 3 integraciones. Esta acción no se puede deshacer.',
  word: 'ELIMINAR',
});
const emit = defineEmits<{ confirm: [] }>();
const dlg = ref<HTMLDialogElement>();
const typed = ref('');
const done = ref(false);

function open() {
  typed.value = '';
  if (dlg.value) dlg.value.returnValue = '';
  dlg.value?.showModal();
}
function onClose() {
  if (dlg.value?.returnValue !== 'confirm') return;
  done.value = true;
  emit('confirm');
}
</script>

<template>
  <section class="zone" aria-labelledby="zone-title">
    <div>
      <h2 id="zone-title">Eliminar proyecto</h2>
      <p>Borra «{{ props.name }}», sus archivos y su historial. No se puede deshacer.</p>
      <p class="status" role="status">{{ done ? `Eliminaste «${props.name}».` : '' }}</p>
    </div>
    <button class="btn danger" type="button" :disabled="done" @click="open">Eliminar proyecto</button>
  </section>

  <dialog ref="dlg" aria-labelledby="dlg-title" aria-describedby="dlg-desc" @close="onClose">
    <form method="dialog">
      <div class="icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" /></svg>
      </div>
      <h2 id="dlg-title">¿Eliminar «{{ props.name }}»?</h2>
      <p id="dlg-desc">{{ props.detail }}</p>
      <label for="confirm-in">Escribe <b>{{ props.word }}</b> para confirmar</label>
      <input id="confirm-in" v-model="typed" autocomplete="off" spellcheck="false" autocapitalize="characters" />
      <div class="actions">
        <button class="btn" type="button" @click="dlg?.close()">Cancelar</button>
        <button class="btn danger" value="confirm" :disabled="typed.trim() !== props.word">Eliminar proyecto</button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.zone{max-width:680px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 24px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px}
p{margin:4px 0 0;color:var(--muted)}
.status:empty{margin:0}
.status{color:var(--text)}
.btn{padding:8px 14px;font:inherit;font-weight:600;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s,opacity .14s}
.btn:hover{background:var(--bg)}
.btn.danger{color:var(--accent-ink);background:var(--err);border-color:var(--err)}
.btn.danger:hover{filter:brightness(.94)}
.btn:disabled{opacity:.45;cursor:not-allowed;filter:none}
.btn:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
dialog{width:min(440px,calc(100% - 32px));box-sizing:border-box;padding:24px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
dialog::before{content:"";position:absolute;top:0;left:8px;right:8px;height:1px;background:linear-gradient(90deg,#22d3ee,#2f5bff)}
dialog::backdrop{background:rgba(10,15,28,.5)}
dialog h2{font-size:18px}
.icon{display:grid;place-items:center;width:40px;height:40px;margin-bottom:12px;border-radius:50%;color:var(--err);background:var(--err-soft)}
dialog label{display:block;margin:16px 0 6px;font-weight:500}
dialog input{box-sizing:border-box;width:100%;padding:8px 10px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:20px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
