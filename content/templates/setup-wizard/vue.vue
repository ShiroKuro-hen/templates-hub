<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

type Field = { k: string; label: string; msg: string; ok: (v: string) => boolean; type?: string; suffix?: string; options?: string[]; check?: boolean };
const STEPS: { title: string; fields: Field[] }[] = [
  { title: 'Tus datos', fields: [
    { k: 'nom', label: 'Nombre completo', msg: 'Escribe tu nombre completo.', ok: (v) => v.trim().length > 1 },
    { k: 'mail', label: 'Correo de trabajo', type: 'email', msg: 'Escribe un correo válido, por ejemplo ana@empresa.es.', ok: (v) => /^\S+@\S+\.\S+$/.test(v) },
  ] },
  { title: 'Tu espacio', fields: [
    { k: 'esp', label: 'Nombre del espacio', msg: 'Usa al menos 3 caracteres para el nombre.', ok: (v) => v.trim().length >= 3 },
    { k: 'url', label: 'Dirección web', suffix: '.nimbus.app', msg: 'Usa 3 o más letras minúsculas o números, sin espacios.', ok: (v) => /^[a-z0-9]{3,}$/.test(v) },
  ] },
  { title: 'Tamaño del equipo', fields: [
    { k: 'eq', label: 'Equipo', options: ['1 a 10 personas', '11 a 50 personas', 'Más de 50 personas'], msg: 'Elige el tamaño de tu equipo para continuar.', ok: (v) => !!v },
  ] },
  { title: 'Revisa y confirma', fields: [
    { k: 'tos', label: 'Acepto los términos del servicio', check: true, msg: 'Acepta los términos para crear el espacio.', ok: (v) => v === 'si' },
  ] },
];
const names = ['Cuenta', 'Espacio', 'Equipo', 'Revisión'];
const summary = STEPS.slice(0, 3).flatMap((s) => s.fields);
const n = ref(0);
const done = ref(false);
const v = reactive<Record<string, string>>({});
const err = reactive<Record<string, string>>({});
const step = computed(() => STEPS[n.value]);
const last = computed(() => n.value === STEPS.length - 1);

function submit() {
  const bad = step.value.fields.filter((f) => !f.ok(v[f.k] ?? ''));
  step.value.fields.forEach((f) => (err[f.k] = bad.includes(f) ? f.msg : ''));
  if (bad.length) return document.getElementById(bad[0].k)?.focus();
  if (last.value) done.value = true; else n.value++;
}
</script>

<template>
  <section class="card" aria-labelledby="ttl">
    <div class="top">
      <h2 id="ttl">Configura tu espacio en Nimbus</h2>
      <ol class="steps" aria-label="Pasos de configuración">
        <li v-for="(name, j) in names" :key="name" :class="{ done: j < n }" :aria-current="j === n ? 'step' : undefined">
          <b>{{ j < n ? '✓' : j + 1 }}</b><span>{{ name }}</span>
        </li>
      </ol>
    </div>
    <div v-if="done" class="ok" tabindex="-1">
      <h3>Espacio creado</h3><p>Tu espacio {{ v.esp }} está listo en {{ v.url }}.nimbus.app.</p>
    </div>
    <form v-else novalidate @submit.prevent="submit">
      <fieldset class="pane">
        <legend>{{ step.title }}</legend>
        <dl v-if="last">
          <template v-for="f in summary" :key="f.k"><dt>{{ f.options ? 'Equipo' : f.label }}</dt><dd>{{ v[f.k] }}{{ f.suffix }}</dd></template>
        </dl>
        <div v-for="f in step.fields" :key="f.k" class="f">
          <template v-if="f.options">
            <label v-for="(o, j) in f.options" :key="o" class="opt">
              <input v-model="v[f.k]" type="radio" :name="f.k" :id="j === 0 ? f.k : undefined" :value="o" :aria-invalid="!!err[f.k]" @change="err[f.k] = ''" />{{ o }}
            </label>
          </template>
          <label v-else-if="f.check" class="check">
            <input :id="f.k" type="checkbox" :checked="v[f.k] === 'si'" :aria-invalid="!!err[f.k]" @change="v[f.k] = ($event.target as HTMLInputElement).checked ? 'si' : ''; err[f.k] = ''" />{{ f.label }}
          </label>
          <template v-else>
            <label :for="f.k">{{ f.label }}</label>
            <div class="suf">
              <input :id="f.k" v-model="v[f.k]" :type="f.type ?? 'text'" :aria-invalid="!!err[f.k]" @input="err[f.k] = ''" />
              <span v-if="f.suffix">{{ f.suffix }}</span>
            </div>
          </template>
          <small class="err" role="alert">{{ err[f.k] }}</small>
        </div>
      </fieldset>
      <div class="btns">
        <button v-if="n > 0" type="button" @click="n--">Atrás</button>
        <button type="submit">{{ last ? 'Crear espacio' : 'Continuar' }}</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.card{max-width:520px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.top{padding:20px 20px 16px;border-bottom:1px solid var(--border)}
h2{margin:0 0 16px;font-size:17px;font-weight:600}
.steps{display:flex;gap:8px;margin:0;padding:0;list-style:none}
.steps li{display:flex;flex:1;align-items:center;gap:8px;color:var(--muted);min-width:0}
.steps li::after{content:"";flex:1;height:1px;background:var(--border)}
.steps li:last-child::after{display:none}
.steps b{display:grid;place-items:center;flex:none;width:24px;height:24px;border:1px solid var(--border);border-radius:999px;font-size:12px;font-weight:600;font-variant-numeric:tabular-nums}
.steps li[aria-current=step]{color:var(--text);font-weight:500}
.steps li[aria-current=step] b{border-color:transparent;background:linear-gradient(135deg,#22d3ee,#2f5bff);color:#fff}
.steps li.done b{background:var(--ok-soft);border-color:var(--ok);color:var(--ok)}
@media (max-width:480px){.steps li:not([aria-current=step]) span{display:none}}
form{padding:20px}
.pane{margin:0;padding:0;border:0;min-width:0}
legend{padding:0;margin-bottom:12px;font-weight:600;font-size:15px}
.f{margin-bottom:14px}
label{display:block;margin-bottom:4px;font-weight:500}
input[type=text],input[type=email]{box-sizing:border-box;width:100%;height:36px;padding:0 12px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit}
input[aria-invalid=true]{border-color:var(--err)}
.suf{display:flex;align-items:center;gap:8px}.suf span{color:var(--muted);white-space:nowrap}
.err{display:block;margin-top:4px;color:var(--err)}
.opt{display:flex;gap:10px;align-items:center;margin:0 0 8px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius);font-weight:400;cursor:pointer}
.opt:has(:checked){border-color:var(--accent);background:var(--accent-soft)}
input[type=radio],input[type=checkbox]{accent-color:var(--accent);margin:0}
dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0 0 14px;padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
dt{color:var(--muted)}dd{margin:0;font-weight:500;overflow-wrap:anywhere}
.check{display:flex;gap:8px;align-items:center;font-weight:400}
.btns{display:flex;justify-content:space-between;margin-top:20px}
button{height:36px;padding:0 16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;font-weight:500;cursor:pointer}
button[type=submit]{margin-left:auto;background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.ok{margin:20px;padding:20px;background:var(--ok-soft);border-radius:var(--radius)}
.ok h3{margin:0 0 4px;font-size:15px}.ok p{margin:0}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
