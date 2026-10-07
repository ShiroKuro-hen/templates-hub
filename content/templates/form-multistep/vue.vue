<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

type Field = { id: string; label: string; type?: string; min?: number; options?: string[] };
const steps: { title: string; fields: Field[] }[] = [
  { title: 'Tus datos', fields: [
    { id: 'nombre', label: 'Nombre completo', min: 2 },
    { id: 'correo', label: 'Correo de trabajo', type: 'email' },
  ] },
  { title: 'Tu empresa', fields: [
    { id: 'empresa', label: 'Nombre de la empresa', min: 2 },
    { id: 'equipo', label: 'Tamaño del equipo', options: ['1 a 10 personas', '11 a 50 personas', 'Más de 50 personas'] },
  ] },
  { title: 'Revisa y confirma', fields: [{ id: 'terminos', label: 'Acepto los términos del servicio', type: 'checkbox' }] },
];
const resumen = steps.flatMap((s) => s.fields).filter((f) => f.type !== 'checkbox');
const n = ref(0);
const done = ref(false);
const v = reactive<Record<string, string | boolean>>({});
const errs = reactive<Record<string, string>>({});
const step = computed(() => steps[n.value]);
const last = computed(() => n.value === steps.length - 1);
const pct = computed(() => Math.round(((n.value + 1) / steps.length) * 100));

function check(f: Field): string {
  const val = v[f.id];
  if (f.type === 'checkbox') return val ? '' : 'Acepta los términos para crear el espacio.';
  const s = String(val ?? '').trim();
  if (!s) return 'Completa este campo.';
  if (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(s)) return 'Escribe un correo válido, como ana@empresa.com.';
  if (f.min && s.length < f.min) return `Usa al menos ${f.min} caracteres.`;
  return '';
}
function submit() {
  step.value.fields.forEach((f) => (errs[f.id] = check(f)));
  if (step.value.fields.some((f) => errs[f.id])) return;
  if (last.value) done.value = true; else n.value++;
}
</script>

<template>
  <main class="card">
    <template v-if="done"><h1>Espacio creado</h1><p class="sub">Revisa tu correo para activar la cuenta.</p></template>
    <form v-else novalidate @submit.prevent="submit">
      <h1>Crear espacio de trabajo</h1>
      <p class="sub" aria-live="polite">Paso {{ n + 1 }} de {{ steps.length }}</p>
      <div class="bar" role="progressbar" aria-label="Progreso del formulario" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="pct">
        <i :style="{ width: pct + '%' }" />
      </div>
      <fieldset :key="n">
        <legend>{{ step.title }}</legend>
        <dl v-if="last"><template v-for="f in resumen" :key="f.id"><dt>{{ f.label }}</dt><dd>{{ v[f.id] }}</dd></template></dl>
        <div v-for="(f, i) in step.fields" :key="f.id" class="f" :class="{ chk: f.type === 'checkbox' }">
          <div v-if="f.type === 'checkbox'">
            <input :id="f.id" v-model="v[f.id]" type="checkbox" :aria-invalid="!!errs[f.id]" :aria-describedby="f.id + '-e'" />
            <label :for="f.id">{{ f.label }}</label>
          </div>
          <template v-else>
            <label :for="f.id">{{ f.label }}</label>
            <select v-if="f.options" :id="f.id" v-model="v[f.id]" :aria-invalid="!!errs[f.id]" :aria-describedby="f.id + '-e'">
              <option value="">Selecciona una opción</option><option v-for="o in f.options" :key="o">{{ o }}</option>
            </select>
            <input v-else :id="f.id" v-model="v[f.id]" :type="f.type ?? 'text'" :aria-invalid="!!errs[f.id]" :aria-describedby="f.id + '-e'" />
          </template>
          <p :id="f.id + '-e'" class="err">{{ errs[f.id] }}</p>
        </div>
      </fieldset>
      <div class="row">
        <button v-if="n > 0" type="button" class="btn" @click="n--">Atrás</button>
        <button class="btn pri">{{ last ? 'Crear espacio' : 'Continuar' }}</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.card{max-width:460px;margin:0 auto;padding:24px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:18px;line-height:1.3}
.sub{margin:2px 0 14px;color:var(--muted);font-variant-numeric:tabular-nums}
.bar{height:6px;margin-bottom:22px;border-radius:999px;background:var(--accent-soft);overflow:hidden}
.bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .16s}
fieldset{border:0;margin:0;padding:0;min-width:0}
legend{padding:0;margin-bottom:12px;font-size:16px;font-weight:600}
.f{display:grid;gap:6px;margin-bottom:14px}
label{font-weight:600}
input,select{font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px;transition:border-color .14s}
input:focus-visible,select:focus-visible,.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
input[aria-invalid=true],select[aria-invalid=true]{border-color:var(--err)}
input[type=checkbox]{width:16px;height:16px;padding:0;accent-color:var(--accent)}
.chk div{display:flex;gap:8px;align-items:center}
.chk label{font-weight:400}
.err{margin:0;color:var(--err);font-size:13px}
.err:empty{display:none}
dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0 0 16px;padding:12px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
dt{color:var(--muted)} dd{margin:0;font-weight:600;overflow-wrap:anywhere}
.row{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}
.btn{font:inherit;font-weight:600;padding:8px 16px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer}
.btn.pri{color:var(--accent-ink);background:var(--accent);border-color:var(--accent)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
