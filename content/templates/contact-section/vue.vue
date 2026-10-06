<script setup lang="ts">
import { reactive, ref } from 'vue';

type Field = 'name' | 'email' | 'topic' | 'message';
type FieldEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const MSG: Record<Field, string> = {
  name: 'Escribe tu nombre para saber a quién responder.',
  email: 'Escribe un correo válido, por ejemplo ana@empresa.com.',
  topic: 'Elige un tema para dirigir tu mensaje al equipo correcto.',
  message: 'Cuéntanos un poco más: el mensaje necesita al menos 20 caracteres.',
};
const emit = defineEmits<{ send: [data: Record<Field, string>] }>();
const errors = reactive<Partial<Record<Field, string>>>({});
const status = ref('');

function check(el: FieldEl) {
  const bad = !el.checkValidity();
  errors[el.name as Field] = bad ? MSG[el.name as Field] : '';
  return bad;
}
function onInput(e: Event) {
  const el = e.target as FieldEl;
  if (errors[el.name as Field]) check(el);
}
function submit(e: Event) {
  const form = e.currentTarget as HTMLFormElement;
  const bad = (Object.keys(MSG) as Field[]).map((f) => form.elements.namedItem(f) as FieldEl).filter(check);
  if (bad.length) { status.value = ''; return bad[0].focus(); }
  const data = Object.fromEntries(new FormData(form)) as Record<Field, string>;
  status.value = `Mensaje enviado. Te respondemos en un día hábil en ${data.email}.`;
  emit('send', data);
  form.reset();
}
</script>

<template>
  <section class="contact" aria-labelledby="ct-title">
    <div>
      <h2 id="ct-title">Hablemos de tu proyecto</h2>
      <p class="lead">Cuéntanos qué necesitas y te ponemos en contacto con la persona adecuada.</p>
      <dl class="info">
        <div><dt>Correo</dt><dd><a href="mailto:contacto@ejemplo.com">contacto@ejemplo.com</a></dd></div>
        <div><dt>Teléfono</dt><dd><a href="tel:+34910000000">+34 910 000 000</a></dd></div>
        <div><dt>Oficina</dt><dd>Calle de Alcalá 21, 28014 Madrid</dd></div>
        <div><dt>Horario</dt><dd>Lunes a viernes, de 9:00 a 18:00 (CET)</dd></div>
      </dl>
    </div>
    <form novalidate @submit.prevent="submit" @input="onInput">
      <div><label for="cf-name">Nombre</label>
        <input id="cf-name" name="name" autocomplete="name" required :aria-invalid="!!errors.name" aria-describedby="cf-name-err" />
        <p id="cf-name-err" class="err">{{ errors.name }}</p></div>
      <div><label for="cf-email">Correo</label>
        <input id="cf-email" name="email" type="email" autocomplete="email" required :aria-invalid="!!errors.email" aria-describedby="cf-email-err" />
        <p id="cf-email-err" class="err">{{ errors.email }}</p></div>
      <div><label for="cf-topic">Tema</label>
        <select id="cf-topic" name="topic" required :aria-invalid="!!errors.topic" aria-describedby="cf-topic-err">
          <option value="">Elige un tema</option><option>Ventas</option><option>Soporte técnico</option><option>Prensa</option><option>Otro</option>
        </select>
        <p id="cf-topic-err" class="err">{{ errors.topic }}</p></div>
      <div><label for="cf-message">Mensaje</label>
        <textarea id="cf-message" name="message" required minlength="20" :aria-invalid="!!errors.message" aria-describedby="cf-message-err" />
        <p id="cf-message-err" class="err">{{ errors.message }}</p></div>
      <button type="submit">Enviar mensaje</button>
      <p class="status" role="status">{{ status }}</p>
    </form>
  </section>
</template>

<style scoped>
.contact{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px 40px;max-width:1040px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.contact h2{margin:0;font-size:22px;line-height:1.25}
.lead{margin:4px 0 20px;color:var(--muted);max-width:48ch}
.info{display:grid;gap:14px;margin:0}
.info dt{color:var(--muted);font-size:13px}
.info dd{margin:0;font-weight:500}
.info a{color:var(--accent)}
form{position:relative;display:grid;gap:14px;padding:24px;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
form::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,#22d3ee,#2f5bff)}
label{display:block;margin-bottom:6px;font-weight:500}
input,select,textarea{box-sizing:border-box;width:100%;padding:9px 12px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
textarea{min-height:110px;resize:vertical}
[aria-invalid=true]{border-color:var(--err)}
.err{margin:6px 0 0;color:var(--err);font-size:13px}
.err:empty{display:none}
button{justify-self:start;padding:9px 16px;font:inherit;font-weight:600;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);cursor:pointer;transition:filter .14s}
button:hover{filter:brightness(1.08)}
:is(input,select,textarea,button,a):focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.status{margin:0}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
