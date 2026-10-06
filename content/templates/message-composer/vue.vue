<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

const MAX = 5 * 1024 * 1024;
const TOOLS = [['b', 'Negrita', 'B'], ['i', 'Cursiva', 'I'], ['c', 'Código', '</>'], ['l', 'Lista', '•']];
const mb = (n: number) => (n / 1048576).toFixed(1).replace('.', ',') + ' MB';
const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
const md = (s: string) =>
  esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/_([^_]+)_/g, '<i>$1</i>')
    .split('\n').map((l) => (l.startsWith('- ') ? `<li>${l.slice(2)}</li>` : `<p>${l}</p>`)).join('')
    .replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

const t = ref<HTMLTextAreaElement>();
const tabs = ref<HTMLButtonElement[]>([]);
const text = ref('');
const files = ref<File[]>([]);
const error = ref('');
const sent = ref<{ html: string; meta: string }[]>([]);
const cur = ref(0);
const disabled = computed(() => !text.value.trim() && !files.value.length);

async function edit(v: string, from: number, to: number) {
  text.value = v; await nextTick(); t.value!.focus(); t.value!.setSelectionRange(from, to);
}
function wrap(l: string, r = l) {
  const el = t.value!, s = el.selectionStart, e = el.selectionEnd, v = text.value.slice(s, e) || 'texto';
  edit(text.value.slice(0, s) + l + v + r + text.value.slice(e), s + l.length, s + l.length + v.length);
}
function bullets() {
  const el = t.value!, s = text.value.lastIndexOf('\n', el.selectionStart - 1) + 1, e = el.selectionEnd;
  const b = text.value.slice(s, e).split('\n').map((x) => '- ' + x).join('\n');
  edit(text.value.slice(0, s) + b + text.value.slice(e), s + b.length, s + b.length);
}
const FMT: Record<string, () => void> = { b: () => wrap('**'), i: () => wrap('_'), c: () => wrap('`'), l: bullets };

function onFiles(e: Event) {
  const input = e.target as HTMLInputElement, all = [...(input.files ?? [])], big = all.filter((x) => x.size > MAX);
  files.value.push(...all.filter((x) => x.size <= MAX)); input.value = '';
  error.value = big.length ? `${big[0].name} supera los 5 MB. Comprime el archivo o elige uno más pequeño.` : '';
}
function shortcut(e: KeyboardEvent) {
  const k = e.key.toLowerCase();
  if (!(e.ctrlKey || e.metaKey)) return;
  if (k === 'enter') { e.preventDefault(); submit(); } else if (k === 'b' || k === 'i') { e.preventDefault(); FMT[k](); }
}
function move(e: KeyboardEvent, i: number) {
  const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + TOOLS.length) % TOOLS.length;
  cur.value = n; tabs.value[n].focus();
}
function submit() {
  if (disabled.value) return;
  const hora = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  const n = files.value.length, adj = n ? `${n} ${n === 1 ? 'adjunto' : 'adjuntos'}: ${files.value.map((x) => x.name).join(', ')}. ` : '';
  sent.value.unshift({ html: md(text.value), meta: `${adj}Enviado ${hora}` });
  text.value = ''; files.value = []; error.value = '';
}
</script>

<template>
  <form class="comp" @submit.prevent="submit">
    <div role="toolbar" aria-label="Formato del texto">
      <button v-for="([k, label, icon], i) in TOOLS" :key="k" :ref="(el) => (tabs[i] = el as HTMLButtonElement)" type="button"
        :tabindex="cur === i ? 0 : -1" :aria-label="label" :title="label" @focus="cur = i"
        @keydown.right.prevent="move($event, i)" @keydown.left.prevent="move($event, i)" @click="FMT[k]()">{{ icon }}</button>
    </div>
    <label class="sr" for="t">Mensaje</label>
    <textarea id="t" ref="t" v-model="text" placeholder="Escribe tu mensaje" @keydown="shortcut" />
    <ul class="files" aria-label="Archivos adjuntos">
      <li v-for="(x, i) in files" :key="x.name + i">{{ x.name }} ({{ mb(x.size) }})
        <button type="button" :aria-label="`Quitar ${x.name}`" @click="files.splice(i, 1)">×</button></li>
    </ul>
    <p v-if="error" class="err" role="alert">{{ error }}</p>
    <div class="foot">
      <label class="attach"><input type="file" class="sr" multiple @change="onFiles">Adjuntar</label>
      <small>Hasta 5 MB por archivo. Ctrl + Enter envía.</small>
      <button type="submit" class="send" :disabled="disabled">Enviar</button>
    </div>
  </form>
  <ol class="sent" aria-label="Mensajes enviados">
    <li v-for="(m, i) in sent" :key="i"><div v-html="m.html" /><small>{{ m.meta }}</small></li>
  </ol>
</template>

<style scoped>
.comp{max-width:600px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.comp::before{content:"";display:block;height:1px;background:linear-gradient(90deg,#22d3ee,#2f5bff)}
[role=toolbar]{display:flex;gap:2px;padding:6px 8px;border-bottom:1px solid var(--border)}
button,.attach{display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:32px;box-sizing:border-box;padding:0 10px;font:inherit;color:var(--muted);background:none;border:1px solid transparent;border-radius:var(--radius);cursor:pointer;transition:background .14s,color .14s}
button:hover,.attach:hover{background:var(--accent-soft);color:var(--accent)}
button.send{margin-left:auto;font-weight:600;background:var(--accent);color:var(--accent-ink)}
button.send:hover:not(:disabled){filter:brightness(1.08);background:var(--accent);color:var(--accent-ink)}
button.send:disabled{background:none;border-color:var(--border);color:var(--muted);cursor:not-allowed}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.attach:has(:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
textarea{display:block;width:100%;box-sizing:border-box;min-height:96px;resize:vertical;padding:12px;font:inherit;color:inherit;background:var(--surface);border:0}
textarea:focus-visible{outline-offset:-2px}
.files{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0 12px;list-style:none}
.files li{display:flex;align-items:center;gap:4px;padding:2px 4px 2px 10px;border:1px solid var(--border);border-radius:999px;background:var(--accent-soft);font-size:13px}
.files button{min-width:24px;height:24px;padding:0;border-radius:999px}
.err{margin:6px 12px 0;color:var(--err)}
.foot{display:flex;align-items:center;gap:6px;padding:8px}
.foot small{color:var(--muted)}
.sent{max-width:600px;margin:16px auto 0;padding:0;list-style:none}
.sent li{margin-bottom:8px;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.sent :deep(p),.sent :deep(ul){margin:0}
.sent :deep(code){padding:0 4px;border-radius:4px;background:var(--accent-soft);font:13px ui-monospace,"Cascadia Code",Menlo,monospace}
.sent small{display:block;margin-top:4px;color:var(--muted)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
