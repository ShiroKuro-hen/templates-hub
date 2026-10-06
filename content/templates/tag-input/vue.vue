<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{ suggestions?: string[] }>(), {
  suggestions: () => ['frontend', 'backend', 'rendimiento', 'seguridad', 'documentación', 'diseño', 'accesibilidad'],
});
const tags = defineModel<string[]>({ default: () => ['diseño', 'accesibilidad'] });
const value = ref('');
const status = ref('');
const input = ref<HTMLInputElement>();

function add(raw: string[]) {
  for (const r of raw) {
    const t = r.trim().toLowerCase();
    if (!t) continue;
    if (tags.value.includes(t)) { status.value = `«${t}» ya está en la lista. Escribe otra etiqueta.`; continue; }
    tags.value = [...tags.value, t];
    status.value = `Añadiste «${t}».`;
  }
}
function remove(t: string) {
  tags.value = tags.value.filter((x) => x !== t);
  status.value = `Quitaste «${t}».`;
  input.value?.focus();
}
function onKeyDown(e: KeyboardEvent) {
  if (e.isComposing) return;
  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add([value.value]); value.value = ''; }
  else if (e.key === 'Backspace' && !value.value && tags.value.length) remove(tags.value[tags.value.length - 1]);
}
function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  const parts = el.value.split(',');
  el.value = value.value = parts.pop() ?? '';
  if (parts.length) add(parts);
}
</script>

<template>
  <div class="field">
    <label for="tag-in">Etiquetas del artículo</label>
    <div class="box" @click.self="input?.focus()">
      <ul class="tags" aria-label="Etiquetas añadidas">
        <li v-for="t in tags" :key="t" class="tag">
          {{ t }}
          <button type="button" :aria-label="`Quitar ${t}`" @click="remove(t)">×</button>
        </li>
      </ul>
      <input ref="input" id="tag-in" list="tag-sug" autocomplete="off" placeholder="Escribe y pulsa Enter"
             aria-describedby="tag-help" :value="value" @input="onInput" @keydown="onKeyDown" />
    </div>
    <datalist id="tag-sug"><option v-for="s in props.suggestions" :key="s" :value="s" /></datalist>
    <p id="tag-help" class="help">Pulsa Enter o coma para añadir. Retroceso con el campo vacío quita la última.</p>
    <p class="status" role="status">{{ status }}</p>
  </div>
</template>

<style scoped>
.field{max-width:520px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.field label{display:block;margin-bottom:6px;font-weight:600}
.box{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:6px;border:1px solid var(--border);border-radius:var(--radius);cursor:text;transition:border-color .14s}
.box:focus-within{border-color:var(--accent);outline:2px solid var(--accent);outline-offset:2px}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
.tag{display:inline-flex;align-items:center;gap:6px;padding:2px 4px 2px 10px;font-size:13px;background:var(--accent-soft);border:1px solid var(--border);border-radius:999px}
.tag::before{content:"";width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.tag button{display:grid;place-items:center;width:20px;height:20px;padding:0;border:0;border-radius:50%;background:none;color:var(--muted);font:inherit;font-size:16px;line-height:1;cursor:pointer;transition:background .14s,color .14s}
.tag button:hover{background:var(--surface);color:var(--text)}
.tag button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.box input{flex:1;min-width:140px;padding:4px 6px;border:0;background:none;color:var(--text);font:inherit;outline:none}
.help{margin:6px 0 0;color:var(--muted);font-size:13px}
.status{margin:4px 0 0;min-height:1.5em;font-size:13px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
