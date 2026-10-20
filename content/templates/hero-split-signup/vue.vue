<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';

type Field = 'name' | 'email' | 'password';
type Values = Record<Field, string>;

const FREE = /@(gmail|hotmail|outlook|yahoo)\./i;
const RULES: Record<Field, [(v: string) => boolean, string][]> = {
  name: [[(v) => v.trim().length >= 2, 'Escribe tu nombre completo.']],
  email: [
    [(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), 'Revisa el formato, por ejemplo nombre@empresa.com.'],
    [(v) => !FREE.test(v), 'Usa tu correo de trabajo, no uno personal.'],
  ],
  password: [[(v) => v.length >= 8, 'La contraseña necesita al menos 8 caracteres.']],
};
const FIELDS: Field[] = ['name', 'email', 'password'];

const values = reactive<Values>({ name: '', email: '', password: '' });
const errors = reactive<Values>({ name: '', email: '', password: '' });
const showPass = ref(false);
const done = ref<{ name: string; email: string } | null>(null);
const doneEl = ref<HTMLElement | null>(null);

const validate = (field: Field) => RULES[field].find(([ok]) => !ok(values[field]))?.[1] ?? '';
const blur = (field: Field) => { errors[field] = validate(field); };
const revalidate = (field: Field) => { if (errors[field]) errors[field] = validate(field); };

function submit() {
  for (const f of FIELDS) errors[f] = validate(f);
  const firstBad = FIELDS.find((f) => errors[f]);
  if (firstBad) {
    document.getElementById(firstBad)?.focus();
    return;
  }
  done.value = { name: values.name.trim(), email: values.email.trim() };
}

const firstName = computed(() => done.value?.name.split(' ')[0] ?? '');

watch(done, async (d) => {
  if (!d) return;
  await nextTick();
  doneEl.value?.focus();
});
</script>

<template>
  <section class="split" aria-labelledby="h">
    <div>
      <h1 id="h">Lanza tu equipo en minutos, no en semanas.</h1>
      <p class="lead">Lumen reúne tus proyectos, tus plazos y a tu equipo en un solo lugar, con migración guiada desde la herramienta que ya usas.</p>
      <ul class="perks">
        <li><span class="tick" aria-hidden="true">✓</span>Importa tus proyectos desde Trello, Asana o una hoja de cálculo.</li>
        <li><span class="tick" aria-hidden="true">✓</span>Permisos por equipo: cada persona ve solo lo que necesita.</li>
        <li><span class="tick" aria-hidden="true">✓</span>Soporte en español y migración guiada sin coste.</li>
      </ul>
    </div>
    <div class="card">
      <h2>Crea tu cuenta gratis</h2>
      <div v-if="done" ref="doneEl" class="done" role="status" tabindex="-1">
        <span class="tick" aria-hidden="true">✓</span>
        <h3>¡Listo, {{ firstName }}!</h3>
        <p>Enviamos un enlace de activación a {{ done.email }}.</p>
      </div>
      <template v-else>
        <p class="intro">14 días de prueba. Sin tarjeta de crédito.</p>
        <form id="signup" novalidate @submit.prevent="submit">
          <div class="field">
            <label for="name">Nombre completo</label>
            <input id="name" v-model="values.name" name="name" type="text" autocomplete="name" :aria-invalid="Boolean(errors.name)" aria-describedby="name-err" @input="revalidate('name')" @blur="blur('name')" />
            <p class="err" id="name-err">{{ errors.name }}</p>
          </div>
          <div class="field">
            <label for="email">Correo de trabajo</label>
            <input id="email" v-model="values.email" name="email" type="email" autocomplete="email" :aria-invalid="Boolean(errors.email)" aria-describedby="email-err" @input="revalidate('email')" @blur="blur('email')" />
            <p class="err" id="email-err">{{ errors.email }}</p>
          </div>
          <div class="field">
            <label for="password">Contraseña</label>
            <div class="pass">
              <input id="password" v-model="values.password" name="password" :type="showPass ? 'text' : 'password'" autocomplete="new-password" :aria-invalid="Boolean(errors.password)" aria-describedby="password-hint password-err" @input="revalidate('password')" @blur="blur('password')" />
              <button type="button" class="toggle" aria-controls="password" @click="showPass = !showPass">{{ showPass ? 'Ocultar' : 'Mostrar' }}</button>
            </div>
            <p class="hint" id="password-hint">Mínimo 8 caracteres.</p>
            <p class="err" id="password-err">{{ errors.password }}</p>
          </div>
          <button class="submit" type="submit">Crear cuenta</button>
        </form>
      </template>
    </div>
  </section>
</template>

<style scoped>
.split { display:grid; gap:32px; align-items:center; max-width:1040px; margin:0 auto; padding:clamp(16px,4vw,48px) 0; }
@media (min-width:860px) { .split { grid-template-columns:1.1fr 1fr; gap:24px; } }
h1 { margin:0 0 14px; font-size:clamp(2rem,5.5vw,3.2rem); font-weight:700; line-height:1.08; letter-spacing:-.03em; text-wrap:balance; }
.lead { margin:0 0 24px; max-width:44ch; color:var(--muted); font-size:1.05rem; }
.perks { display:grid; gap:14px; margin:0; padding:0; list-style:none; }
.perks li { display:flex; gap:12px; align-items:flex-start; }
.tick { flex:none; display:grid; place-items:center; width:24px; height:24px; border-radius:50%; background:var(--ok-soft); color:var(--ok); font-size:13px; font-weight:700; font-style:normal; }
.card { padding:clamp(20px,4vw,28px); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
.card h2 { margin:0; font-size:1.25rem; font-weight:700; }
.intro { margin:4px 0 20px; color:var(--muted); font-size:13px; }
form { display:grid; gap:16px; }
.field { display:grid; gap:6px; }
label { font-size:13px; font-weight:600; }
input { width:100%; padding:10px 12px; font:15px system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); }
input[aria-invalid="true"] { border-color:var(--err); }
.hint, .err { margin:0; font-size:12.5px; }
.hint { color:var(--muted); }
.err { color:var(--err); font-weight:500; }
.err:empty { display:none; }
.pass { position:relative; }
.pass input { padding-right:76px; }
.toggle { position:absolute; right:6px; top:50%; transform:translateY(-50%); padding:4px 8px; border:0; border-radius:6px; background:none; color:var(--muted); font:600 12px system-ui,sans-serif; cursor:pointer; }
.toggle:hover { color:var(--text); }
.submit { padding:11px 20px; border:1px solid var(--accent); border-radius:var(--radius); background:var(--accent); color:var(--accent-ink); font:600 1rem system-ui,sans-serif; box-shadow:var(--shadow); cursor:pointer; }
.submit:hover { filter:brightness(1.08); }
.done { display:grid; justify-items:start; gap:8px; padding:8px 0; }
.done .tick { width:36px; height:36px; font-size:18px; }
.done h3 { margin:4px 0 0; font-size:1.2rem; }
.done p { margin:0; color:var(--muted); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
</style>
