<script setup lang="ts">
import { nextTick, ref } from 'vue';

const emit = defineEmits<{ subscribe: [email: string] }>();
const email = ref('');
const error = ref('');
const done = ref('');
const input = ref<HTMLInputElement>();
const ok = ref<HTMLParagraphElement>();

async function submit() {
  const v = input.value!.validity;
  error.value = v.valueMissing ? 'Escribe tu correo para suscribirte.'
    : v.typeMismatch || v.patternMismatch ? 'Revisa el correo: necesita @ y un dominio, por ejemplo ana@empresa.com.' : '';
  if (error.value) return input.value!.focus();
  done.value = `Listo. Te enviamos un enlace a ${email.value} para confirmar la suscripción.`;
  emit('subscribe', email.value);
  await nextTick();
  ok.value?.focus();
}
function onInput() {
  if (error.value && input.value!.checkValidity()) error.value = '';
}
</script>

<template>
  <section class="news" aria-labelledby="nl-title">
    <div>
      <h2 id="nl-title">Recibe las novedades del producto</h2>
      <p class="lead">Un correo al mes con lanzamientos, guías y cambios importantes. Te das de baja con un clic.</p>
    </div>
    <div>
      <form novalidate :hidden="!!done" @submit.prevent="submit">
        <label for="nl-email">Correo de trabajo</label>
        <div class="row">
          <input ref="input" id="nl-email" v-model="email" type="email" name="email" autocomplete="email" placeholder="nombre@empresa.com"
                 required pattern=".+@.+\..+" :aria-invalid="!!error" aria-describedby="nl-err nl-note" @input="onInput" />
          <button type="submit">Suscribirme</button>
        </div>
        <p id="nl-err" class="err" :hidden="!error">{{ error }}</p>
        <p id="nl-note" class="note">Usamos tu correo solo para este boletín.</p>
      </form>
      <p ref="ok" class="ok" role="status" tabindex="-1">{{ done }}</p>
    </div>
  </section>
</template>

<style scoped>
.news{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));align-items:center;gap:20px 32px;max-width:960px;padding:28px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.news h2{margin:0;font-size:22px;line-height:1.25}
.lead{margin:6px 0 0;color:var(--muted);max-width:52ch}
.news label{display:block;margin-bottom:6px;font-weight:500}
.row{display:flex;flex-wrap:wrap;gap:8px}
.row input{flex:1 1 200px;min-width:0;padding:9px 12px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.row input[aria-invalid=true]{border-color:var(--err)}
.row button{padding:9px 16px;font:inherit;font-weight:600;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);cursor:pointer;transition:filter .14s}
.row button:hover{filter:brightness(1.08)}
input:focus-visible,button:focus-visible,.ok:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.err{margin:6px 0 0;color:var(--err);font-size:13px}
.note{margin:8px 0 0;color:var(--muted);font-size:13px}
.ok{display:flex;align-items:flex-start;gap:12px;margin:0;border-radius:var(--radius)}
.ok:not(:empty)::before{content:"✓";flex:none;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;font-weight:700;color:var(--surface);background:linear-gradient(135deg,#22d3ee,#2f5bff)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
