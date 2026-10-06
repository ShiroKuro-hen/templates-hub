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
        {{ ok ? '¡Copiado!' : 'Copiar' }}
      </button>
    </figcaption>
    <pre tabindex="0" :aria-label="`Código de ${filename}`"><code><span v-for="(line, i) in code.split('\n')" :key="i" class="l">{{ line || ' ' }}</span></code></pre>
  </figure>
</template>

<style scoped>
.code { margin: 0; border: 2px solid #17130f; border-radius: 10px; background: #17130f; box-shadow: 4px 4px 0 #17130f; overflow: hidden; }
.bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px 6px 14px; background: #ffd84d; border-bottom: 2px solid #17130f; }
.bar span { font: 700 12px ui-monospace, monospace; color: #17130f; }
.copy { font: 700 12px system-ui; padding: 4px 10px; color: #17130f; background: #fffdf8; border: 2px solid #17130f; border-radius: 8px; box-shadow: 2px 2px 0 #17130f; cursor: pointer; }
.copy:hover { transform: translate(1px, 1px); box-shadow: 1px 1px 0 #17130f; }
.copy[data-ok] { background: #1f9d55; color: #fff; }
:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
pre { margin: 0; padding: 12px 0; overflow-x: auto; font: 13px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; color: #f6f1e7; }
pre:focus-visible { outline-offset: -3px; }
code { display: block; counter-reset: line; min-width: max-content; }
.l { display: block; padding-right: 14px; white-space: pre; }
.l::before { counter-increment: line; content: counter(line); display: inline-block; width: 2.8em; margin-right: 1em; padding-right: .6em; text-align: right; color: #a39a8d; border-right: 1px solid #4a423a; user-select: none; }
</style>
