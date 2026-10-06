<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ filename: string; code: string }>();
const ok = ref(false);
let timer: ReturnType<typeof setTimeout>;

async function copy() {
  await navigator.clipboard.writeText(props.code);
  ok.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (ok.value = false), 1800);
}
</script>

<template>
  <figure class="code">
    <figcaption class="bar">
      <span>{{ filename }}</span>
      <button type="button" class="copy" :data-ok="ok || undefined" aria-live="polite" @click="copy">
        {{ ok ? 'Copiado' : 'Copiar' }}
      </button>
    </figcaption>
    <pre tabindex="0" :aria-label="`Código de ${filename}`"><code><span v-for="(line, i) in code.split('\n')" :key="i" class="l">{{ line || ' ' }}</span></code></pre>
  </figure>
</template>

<style scoped>
.code { position: relative; margin: 0; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); box-shadow: var(--shadow); overflow: hidden; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
.code::before { content: ""; position: absolute; inset: 0 0 auto; height: 2px; background: linear-gradient(135deg, #22d3ee, #2f5bff); }
.bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 10px 8px 16px; border-bottom: 1px solid var(--border); }
.bar span { font: 600 12px ui-monospace, "Cascadia Code", Menlo, monospace; color: var(--muted); }
.copy { padding: 4px 12px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); font: 600 12px system-ui, sans-serif; cursor: pointer; transition: background .14s, border-color .14s, color .14s; }
.copy:hover { background: var(--accent-soft); border-color: var(--accent); }
.copy[data-ok] { background: var(--ok-soft); border-color: var(--ok); color: var(--ok); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
pre { margin: 0; padding: 12px 0; overflow-x: auto; font: 13px/1.65 ui-monospace, "Cascadia Code", Menlo, monospace; color: var(--text); tab-size: 2; }
pre:focus-visible { outline-offset: -2px; }
code { display: block; counter-reset: line; min-width: max-content; }
.l { display: block; padding-right: 16px; white-space: pre; }
.l::before { counter-increment: line; content: counter(line); display: inline-block; width: 2.8em; margin-right: 1em; padding-right: .6em; text-align: right; color: var(--muted); border-right: 1px solid var(--border); font-variant-numeric: tabular-nums; user-select: none; }
@media (prefers-reduced-motion: reduce) { .copy { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
