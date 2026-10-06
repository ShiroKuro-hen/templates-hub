<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ create: [data: Record<string, string>] }>();
const steps = ['Tu cuenta', 'Tu equipo', 'Confirmar'];
const summary = [['Nombre', 'name'], ['Correo', 'email'], ['Empresa', 'company'], ['Equipo', 'size']] as const;
const step = ref(0);
const data = ref<Record<string, string>>({});
const done = ref(false);

function submit(e: Event) {
  const form = e.target as HTMLFormElement;
  const fields = [...form.querySelectorAll('fieldset')[step.value].querySelectorAll<HTMLInputElement>('input,select')];
  if (!fields.every((el) => el.reportValidity())) return; // valida solo el paso visible
  data.value = Object.fromEntries(new FormData(form)) as Record<string, string>;
  if (step.value < 2) step.value++;
  else { emit('create', data.value); done.value = true; }
}
</script>

<template>
  <main class="page">
    <section class="card" aria-labelledby="title">
      <div class="brand"><span class="logo" aria-hidden="true" />Nimbo</div>
      <h1 id="title">Crea tu cuenta</h1>
      <p class="sub">Prueba gratis durante 14 días. Sin tarjeta.</p>
      <ol class="steps" aria-label="Progreso del registro">
        <li v-for="(s, k) in steps" :key="s" :class="{ done: k < step }" :aria-current="k === step ? 'step' : undefined"><b>{{ k + 1 }}</b><span>{{ s }}</span></li>
      </ol>
      <div class="track" aria-hidden="true"><span :style="{ '--p': (step + 1) * 33.34 }" /></div>
      <form novalidate @submit.prevent="submit">
        <fieldset :hidden="step !== 0">
          <legend>Datos de acceso</legend>
          <label>Nombre completo <input name="name" autocomplete="name" required /></label>
          <label>Correo de trabajo <input type="email" name="email" autocomplete="email" required placeholder="nombre@empresa.com" /></label>
          <label>Contraseña <input type="password" name="password" autocomplete="new-password" required minlength="8" /><small>Mínimo 8 caracteres.</small></label>
        </fieldset>
        <fieldset :hidden="step !== 1">
          <legend>Sobre tu equipo</legend>
          <label>Nombre de la empresa <input name="company" autocomplete="organization" required /></label>
          <label>Tamaño del equipo
            <select name="size" required><option value="">Elige una opción</option><option>1–10</option><option>11–50</option><option>51–200</option><option>Más de 200</option></select>
          </label>
        </fieldset>
        <fieldset :hidden="step !== 2">
          <legend>Revisa y confirma</legend>
          <dl class="summary"><template v-for="[t, k] in summary" :key="k"><dt>{{ t }}</dt><dd>{{ data[k] }}</dd></template></dl>
          <label class="terms"><input type="checkbox" name="terms" required /><span>Acepto los <a href="#terminos">Términos del servicio</a> y la <a href="#privacidad">Política de privacidad</a>.</span></label>
        </fieldset>
        <div class="actions">
          <button v-if="step > 0" class="btn" type="button" @click="step--">Atrás</button>
          <button class="btn primary" type="submit">{{ step === 2 ? 'Crear cuenta' : 'Continuar' }}</button>
        </div>
        <p v-if="done" class="status" role="status">Cuenta creada. Te enviamos un correo para verificarla.</p>
      </form>
    </section>
    <p class="foot">¿Ya tienes cuenta? <a href="#login">Inicia sesión</a></p>
  </main>
</template>

<style scoped>
.page{min-height:100vh;display:grid;place-items:center;align-content:center;gap:20px;padding:20px;box-sizing:border-box;background:var(--bg);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card{width:100%;max-width:460px;box-sizing:border-box;padding:32px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:16px;margin-bottom:24px}
.logo{width:28px;height:28px;border-radius:7px;background:var(--accent)}
h1{font-size:22px;line-height:1.25;margin:0 0 4px}
.sub{margin:0 0 20px;color:var(--muted)}
.steps{list-style:none;margin:0 0 8px;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:13px;color:var(--muted)}
.steps li{display:flex;align-items:center;gap:8px}
.steps b{width:22px;height:22px;flex:none;border-radius:999px;border:1px solid var(--border);display:grid;place-items:center;font-weight:600;font-variant-numeric:tabular-nums}
.steps .done b,.steps [aria-current] b{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.steps [aria-current]{color:var(--text);font-weight:600}
.track{height:4px;border-radius:999px;background:var(--accent-soft);margin-bottom:24px;overflow:hidden}
.track span{display:block;height:100%;width:calc(var(--p) * 1%);background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .16s}
fieldset{border:0;margin:0;padding:0;display:grid;gap:16px}
fieldset[hidden]{display:none}
legend{font-weight:600;font-size:16px;margin-bottom:16px;padding:0}
label{display:grid;gap:6px;font-weight:600}
small{font-weight:400;color:var(--muted);font-size:13px}
input:not([type=checkbox]),select{font:inherit;color:inherit;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:9px 12px}
input:user-invalid,select:user-invalid{border-color:var(--err)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.terms{display:flex;gap:10px;align-items:flex-start;font-weight:400}
.terms input{accent-color:var(--accent);width:16px;height:16px;margin:2px 0 0;flex:none}
.summary{margin:0;padding:12px 16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);display:grid;grid-template-columns:auto 1fr;gap:4px 16px}
.summary dt{color:var(--muted)}
.summary dd{margin:0;overflow-wrap:anywhere}
a{color:var(--accent);font-weight:500}
.actions{display:flex;justify-content:space-between;gap:12px;margin-top:24px}
.btn{font:inherit;font-weight:600;border-radius:var(--radius);padding:10px 16px;cursor:pointer;transition:background .14s;border:1px solid var(--border);background:var(--surface);color:var(--text)}
.btn:hover{background:var(--accent-soft)}
.primary,.primary:hover{background:var(--accent);border-color:var(--accent);color:var(--accent-ink);margin-left:auto}
.status{margin:16px 0 0;padding:10px 12px;border-radius:var(--radius);background:var(--ok-soft);border:1px solid var(--ok)}
.foot{color:var(--muted);margin:0}
@media (max-width:440px){.card{padding:24px 20px}.steps li{flex-direction:column;gap:4px;text-align:center}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
