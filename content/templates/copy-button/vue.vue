<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const props = defineProps<{ title: string; note?: string; command: string }>();
const copied = ref(false);
const error = ref('');
const code = ref<HTMLElement>();
let timer: number | undefined;

async function copy() {
  try {
    await navigator.clipboard.writeText(props.command);
    error.value = ''; copied.value = true;
    clearTimeout(timer);
    timer = window.setTimeout(() => { copied.value = false; }, 2000);
  } catch {
    if (code.value) getSelection()?.selectAllChildren(code.value);
    error.value = 'No se pudo copiar. El comando quedó seleccionado: pulsa Ctrl+C.';
  }
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <section class="card">
    <h2>{{ title }}</h2>
    <p v-if="note" class="note">{{ note }}</p>
    <div class="code">
      <pre><code ref="code">{{ command }}</code></pre>
      <button class="copy" :class="{ done: copied }" type="button" aria-label="Copiar comando" @click="copy">
        <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>
        <svg class="check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
        <span aria-hidden="true">{{ copied ? 'Copiado' : 'Copiar' }}</span>
      </button>
    </div>
    <p class="msg">{{ error }}</p>
    <span class="sr" role="status">{{ copied ? 'Comando copiado al portapapeles.' : '' }}</span>
  </section>
</template>

<style scoped>
.card{max-width:560px;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:15px;font-weight:600}
.note{margin:2px 0 12px;color:var(--muted)}
.code{display:flex;align-items:center;gap:8px;padding:6px 6px 6px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
.code::before{content:"$";font:600 13px/1.6 ui-monospace,"Cascadia Code",Menlo,monospace;background:linear-gradient(135deg,#22d3ee,#2f5bff);-webkit-background-clip:text;background-clip:text;color:transparent}
pre{flex:1;min-width:0;margin:0;overflow-x:auto;font:13px/1.6 ui-monospace,"Cascadia Code",Menlo,monospace}
.copy{flex:none;display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:6px;font:inherit;font-weight:500;cursor:pointer;transition:border-color .14s,color .14s}
.copy:hover{border-color:var(--muted)}
.copy:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.copy .check,.copy.done .icon{display:none}
.copy.done .check{display:block}
.copy.done{color:var(--ok);border-color:var(--ok)}
.msg{margin:8px 0 0;font-size:13px;color:var(--err)}
.msg:empty{display:none}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
