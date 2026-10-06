<script setup lang="ts">
import { ref } from 'vue';

const MAX = 10 * 1024 * 1024;
const files = ref<File[]>([]);
const error = ref('');
const over = ref(false);
const input = ref<HTMLInputElement>();
const fmt = (b: number) => (b < 1048576 ? Math.ceil(b / 1024) + ' KB' : (b / 1048576).toFixed(1) + ' MB');

function add(list: FileList | null | undefined) {
  const all = [...(list ?? [])];
  const big = all.filter((f) => f.size > MAX);
  error.value = big.length ? `${big.map((f) => f.name).join(', ')} supera 10 MB. Comprime el archivo o elige otro.` : '';
  files.value = [...files.value, ...all.filter((f) => f.size <= MAX)];
}
function onPick(e: Event) {
  const el = e.target as HTMLInputElement;
  add(el.files);
  el.value = '';
}
function onDrop(e: DragEvent) {
  over.value = false;
  add(e.dataTransfer?.files);
}
function remove(i: number) {
  files.value.splice(i, 1);
  input.value?.focus();
}
</script>

<template>
  <section class="uploader" aria-labelledby="t">
    <h2 id="t">Adjunta tus facturas</h2>
    <label class="drop" :class="{ over }" @dragover.prevent="over = true" @dragleave="over = false" @drop.prevent="onDrop">
      <input ref="input" type="file" multiple accept=".pdf,.png,.jpg,.jpeg" aria-describedby="hint" @change="onPick" />
      <span class="ico" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M6 10l6-6 6 6M4 20h16" /></svg>
      </span>
      <span><strong>Arrastra archivos aquí</strong> o <span class="link">elígelos desde tu equipo</span></span>
      <small id="hint">PDF, PNG o JPG. Máximo 10 MB por archivo.</small>
    </label>
    <p class="msg" role="alert">{{ error }}</p>
    <ul aria-label="Archivos seleccionados" aria-live="polite">
      <li v-if="!files.length" class="empty">Aún no hay archivos. Añade el primero arriba.</li>
      <li v-for="(f, i) in files" :key="f.name + i">
        <span class="name">{{ f.name }}</span>
        <span class="size">{{ fmt(f.size) }}</span>
        <button type="button" :aria-label="`Quitar ${f.name}`" @click="remove(i)">Quitar</button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.uploader{max-width:560px;margin:0 auto;padding:20px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0 0 12px;font-size:16px}
.drop{position:relative;display:grid;justify-items:center;gap:6px;padding:28px 16px;text-align:center;border:1px dashed var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s,border-color .14s}
.drop:hover,.drop.over{background:var(--accent-soft);border-color:var(--accent)}
.drop:focus-within{outline:2px solid var(--accent);outline-offset:2px}
.drop input{position:absolute;width:1px;height:1px;opacity:0}
.ico{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;color:var(--accent-ink);background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.link{color:var(--accent);font-weight:600}
small{color:var(--muted)}
.msg{margin:12px 0 0;padding:8px 12px;border-radius:var(--radius);background:var(--err-soft);color:var(--err)}
.msg:empty{display:none}
ul{list-style:none;margin:12px 0 0;padding:0}
li{display:flex;align-items:center;gap:12px;padding:10px 0;border-top:1px solid var(--border)}
.name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.size{color:var(--muted);font-variant-numeric:tabular-nums}
li button{font:inherit;padding:4px 10px;color:var(--muted);background:none;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:color .14s,border-color .14s}
li button:hover{color:var(--err);border-color:var(--err)}
li button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.empty{color:var(--muted);justify-content:center}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
