<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';

type Field = { id: string; label: string; value: string; type?: string; min?: number };
const fields = reactive<Field[]>([
  { id: 'nombre', label: 'Nombre', value: 'Ana Pérez', min: 2 },
  { id: 'correo', label: 'Correo', value: 'ana.perez@meridian.pe', type: 'email' },
  { id: 'cargo', label: 'Cargo', value: 'Responsable de Producto' },
  { id: 'empresa', label: 'Empresa', value: 'Meridian Logística', min: 2 },
]);
const editing = ref<string | null>(null);
const draft = ref('');
const err = ref('');
const live = ref('');

function check(f: Field, v: string): string {
  if (!v) return 'Este campo no puede quedar vacío. Escribe un valor.';
  if (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) return 'Escribe un correo válido, como ana@empresa.com.';
  if (f.min && v.length < f.min) return `Usa al menos ${f.min} caracteres.`;
  return '';
}
async function open(f: Field) {
  editing.value = f.id; draft.value = f.value; err.value = '';
  await nextTick();
  const i = document.getElementById(`i-${f.id}`) as HTMLInputElement | null;
  i?.focus(); i?.select();
}
async function close(f: Field) {
  editing.value = null;
  await nextTick();
  document.getElementById(`b-${f.id}`)?.focus();
}
function save(f: Field) {
  const v = draft.value.trim();
  err.value = check(f, v);
  if (err.value) return;
  f.value = v; live.value = `Cambios guardados: ${f.label.toLowerCase()} actualizado.`;
  close(f);
}
</script>

<template>
  <section class="card" aria-labelledby="t">
    <header><h1 id="t">Perfil de la cuenta</h1><p class="sub">Selecciona Editar para cambiar un dato. Enter guarda y Esc cancela.</p></header>
    <dl>
      <div v-for="f in fields" :key="f.id" class="row" :class="{ on: editing === f.id }">
        <dt :id="`l-${f.id}`">{{ f.label }}</dt>
        <dd>
          <form v-if="editing === f.id" class="edit" novalidate @submit.prevent="save(f)" @keydown.esc="close(f)">
            <input :id="`i-${f.id}`" v-model="draft" :type="f.type ?? 'text'" :aria-labelledby="`l-${f.id}`" :aria-invalid="!!err" />
            <button class="btn pri">Guardar</button>
            <button type="button" class="btn" @click="close(f)">Cancelar</button>
            <p class="err">{{ err }}</p>
          </form>
          <div v-else class="view">
            <span class="val">{{ f.value }}</span>
            <button :id="`b-${f.id}`" type="button" class="btn" :aria-label="`Editar ${f.label.toLowerCase()}`" @click="open(f)">Editar</button>
          </div>
        </dd>
      </div>
    </dl>
    <p id="live" role="status">{{ live }}</p>
  </section>
</template>

<style scoped>
.card{max-width:540px;margin:0 auto;overflow:hidden;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{padding:20px 24px 14px}
h1{margin:0;font-size:18px;line-height:1.3}
.sub{margin:2px 0 0;color:var(--muted)}
dl{margin:0}
.row{position:relative;display:grid;grid-template-columns:minmax(90px,140px) 1fr;gap:4px 16px;align-items:center;min-height:36px;padding:12px 24px;border-top:1px solid var(--border);transition:background .14s}
.row.on{background:var(--accent-soft)}
.row.on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
dt{color:var(--muted)}
dd{margin:0;min-width:0}
.view{display:flex;align-items:center;justify-content:space-between;gap:12px}
.val{font-weight:600;overflow-wrap:anywhere}
.edit{display:flex;flex-wrap:wrap;gap:8px}
input{flex:1 1 160px;min-width:0;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:6px 12px}
input[aria-invalid=true]{border-color:var(--err)}
input:focus-visible,.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn{font:inherit;font-weight:600;padding:6px 12px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn.pri{color:var(--accent-ink);background:var(--accent);border-color:var(--accent)}
.err{flex-basis:100%;margin:0;color:var(--err);font-size:13px}
.err:empty{display:none}
#live{margin:0;padding:10px 24px;color:var(--ok);background:var(--ok-soft);border-top:1px solid var(--border)}
#live:empty{display:none}
@media (max-width:480px){.row{grid-template-columns:1fr;padding:12px 16px}header{padding:16px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
