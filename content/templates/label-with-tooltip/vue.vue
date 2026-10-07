<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

type Mode = 'closed' | 'hover' | 'pinned';
const fields = [
  { id: 'f1', label: 'Límite de gasto mensual', about: 'el límite de gasto', value: '1.500', placeholder: '', tip: 'Al llegar a este importe pausamos los envíos y te avisamos por correo. Puedes subirlo cuando quieras.' },
  { id: 'f2', label: 'Dominio personalizado', about: 'el dominio', value: '', placeholder: 'panel.miempresa.com', tip: 'Escribe solo el dominio, sin https://. Después añade un registro CNAME que apunte a clientes.ejemplo.com.' },
];
const mode = ref<Record<string, Mode>>({ f1: 'closed', f2: 'closed' });
const btns = ref<Record<string, HTMLButtonElement | null>>({});

const isOpen = (id: string) => mode.value[id] !== 'closed';
function closeAll(except?: string) {
  for (const id in mode.value) if (id !== except) mode.value[id] = 'closed';
}
function hover(id: string, on: boolean) {
  if (mode.value[id] === 'pinned') return;
  if (on) closeAll(id);
  mode.value[id] = on ? 'hover' : 'closed';
}
function pin(id: string) {
  const next = mode.value[id] === 'pinned' ? 'closed' : 'pinned';
  closeAll(id); mode.value[id] = next;
}
function onKey(e: KeyboardEvent) {
  if (e.key !== 'Escape') return;
  for (const id in mode.value) if (isOpen(id)) { mode.value[id] = 'closed'; btns.value[id]?.focus(); }
}
function onClickOutside(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.lab')) closeAll();
}
document.addEventListener('keydown', onKey);
document.addEventListener('click', onClickOutside);
onBeforeUnmount(() => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClickOutside); });
</script>

<template>
  <form aria-labelledby="t" @submit.prevent>
    <h2 id="t">Configurar facturación</h2>
    <div v-for="f in fields" :key="f.id" class="field">
      <div class="lab">
        <label :for="f.id">{{ f.label }}</label>
        <button :ref="(el) => (btns[f.id] = el as HTMLButtonElement)" type="button" class="help" :aria-label="`Más información sobre ${f.about}`"
          :aria-expanded="isOpen(f.id)" :aria-controls="`tip-${f.id}`"
          @click="pin(f.id)" @pointerenter="hover(f.id, true)" @pointerleave="hover(f.id, false)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8M12 17.5v.01" /></svg>
        </button>
        <div :id="`tip-${f.id}`" class="tip" :hidden="!isOpen(f.id)">{{ f.tip }}</div>
      </div>
      <input :id="f.id" :value="f.value" :placeholder="f.placeholder" :aria-describedby="`tip-${f.id}`">
    </div>
    <button class="btn" type="submit">Guardar cambios</button>
  </form>
</template>

<style scoped>
form{padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0 0 16px;font-size:18px}
.field{margin-bottom:16px}
.lab{position:relative;display:flex;align-items:center;gap:6px;margin-bottom:6px}
label{font-weight:600}
.help{all:unset;box-sizing:border-box;display:grid;place-items:center;width:20px;height:20px;border:1px solid var(--border);border-radius:50%;color:var(--muted);cursor:pointer;transition:background .14s,color .14s,border-color .14s}
.help:hover,.help[aria-expanded=true]{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}
.help:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.help svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.tip{position:absolute;z-index:1;top:calc(100% + 6px);left:0;width:min(300px,100%);box-sizing:border-box;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);box-shadow:var(--shadow);font-weight:400}
.tip::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:var(--radius) 0 0 var(--radius);background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.tip[hidden]{display:none}
input{box-sizing:border-box;width:100%;height:36px;padding:0 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;font-variant-numeric:tabular-nums}
input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn{height:36px;padding:0 16px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--accent-ink);font:inherit;font-weight:600;cursor:pointer}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
