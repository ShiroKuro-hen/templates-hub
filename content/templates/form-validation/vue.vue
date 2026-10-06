<script setup lang="ts">
import { reactive, ref } from 'vue';

const MSG: Record<string, string> = {
  valueMissing: 'Completa este campo.',
  typeMismatch: 'Escribe un correo válido, por ejemplo ana@correo.com.',
  tooShort: 'Usa al menos 8 caracteres.',
  patternMismatch: 'Incluye al menos un número.',
};

const emit = defineEmits<{ submit: [data: FormData] }>();
const form = ref<HTMLFormElement>();
const errors = reactive<Record<string, string>>({});
const done = ref(false);

function validate(el: HTMLInputElement) {
  const pw = form.value!.elements.namedItem('pw') as HTMLInputElement;
  if (el.name === 'pw2') errors[el.name] = el.value !== pw.value ? 'Las contraseñas no coinciden. Escríbelas de nuevo.' : '';
  else {
    const key = Object.keys(MSG).find((k) => el.validity[k as keyof ValidityState]);
    errors[el.name] = el.validity.valid ? '' : key ? MSG[key] : el.validationMessage;
  }
}

function onSubmit() {
  form.value!.querySelectorAll('input').forEach(validate);
  const bad = form.value!.querySelector<HTMLInputElement>('[aria-invalid=true]');
  if (bad) return bad.focus();
  done.value = true;
  emit('submit', new FormData(form.value!));
}
</script>

<template>
  <form ref="form" novalidate @submit.prevent="onSubmit">
    <div class="field">
      <label for="email">Correo</label>
      <input id="email" name="email" type="email" required :aria-invalid="!!errors.email" aria-describedby="email-e" @blur="validate($event.target as HTMLInputElement)" />
      <p id="email-e" class="e">{{ errors.email }}</p>
    </div>
    <div class="field">
      <label for="pw">Contraseña</label>
      <input id="pw" name="pw" type="password" required minlength="8" pattern=".*\d.*" :aria-invalid="!!errors.pw" aria-describedby="pw-e" @blur="validate($event.target as HTMLInputElement)" />
      <p id="pw-e" class="e">{{ errors.pw }}</p>
    </div>
    <div class="field">
      <label for="pw2">Repite la contraseña</label>
      <input id="pw2" name="pw2" type="password" required :aria-invalid="!!errors.pw2" aria-describedby="pw2-e" @blur="validate($event.target as HTMLInputElement)" />
      <p id="pw2-e" class="e">{{ errors.pw2 }}</p>
    </div>
    <div class="full"><button type="submit">Crear cuenta</button></div>
    <p v-if="done" id="done" role="status">Cuenta creada. Revisa tu correo para confirmarla.</p>
  </form>
</template>

<style scoped>
form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px 16px; padding: 20px; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.field { display: flex; flex-direction: column; gap: 4px; }
label { font-weight: 600; font-size: 13px; }
input { width: 100%; height: 38px; padding: 0 12px; font: inherit; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); transition: border-color .14s; }
input:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
input[aria-invalid=true] { border-color: var(--err); }
.e { min-height: 18px; margin: 0; font-size: 12px; color: var(--err); }
.e:not(:empty)::before { content: "✕ "; font-weight: 700; }
.full { grid-column: 1 / -1; }
button { height: 38px; padding: 0 18px; font: 600 14px system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--accent-ink); background: var(--accent); border: 0; border-radius: var(--radius); cursor: pointer; transition: filter .14s; }
button:hover { filter: brightness(1.08); }
#done { grid-column: 1 / -1; margin: 0; padding: 10px 12px; font-weight: 600; color: var(--ok); background: var(--ok-soft); border: 1px solid var(--ok); border-radius: var(--radius); }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
