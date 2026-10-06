<script setup lang="ts">
import { reactive, ref } from 'vue';

const MSG: Record<string, string> = {
  valueMissing: 'Este campo es obligatorio.',
  typeMismatch: 'Escribe un correo válido, p. ej. ana@correo.com.',
  tooShort: 'Usa al menos 8 caracteres.',
  patternMismatch: 'Incluye al menos un número.',
};

const emit = defineEmits<{ submit: [data: FormData] }>();
const form = ref<HTMLFormElement>();
const errors = reactive<Record<string, string>>({});
const done = ref(false);

function validate(el: HTMLInputElement) {
  const pw = form.value!.elements.namedItem('pw') as HTMLInputElement;
  if (el.name === 'pw2') errors[el.name] = el.value !== pw.value ? 'Las contraseñas no coinciden.' : '';
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
    <p v-if="done" id="done" role="status">¡Cuenta creada! Revisa tu correo para confirmarla.</p>
  </form>
</template>

<style scoped>
form { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px 12px; }
.field { display: flex; flex-direction: column; gap: 3px; }
label { font-weight: 700; font-size: 13px; }
input { width: 100%; height: 36px; padding: 0 10px; font: inherit; color: #17130f; background: #fffdf8; border: 2px solid #17130f; border-radius: 10px; }
input:focus-visible, button:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
input[aria-invalid=true] { border-color: #d6293e; background: #fff3f4; }
.e { min-height: 16px; margin: 0; font-size: 12px; color: #d6293e; }
.e:not(:empty)::before { content: "✕ "; font-weight: 800; }
.full { grid-column: 1 / -1; }
button { height: 40px; padding: 0 18px; font: 700 14px system-ui; color: #17130f; background: #ff5a36; border: 2px solid #17130f; border-radius: 10px; box-shadow: 4px 4px 0 #17130f; cursor: pointer; }
button:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
#done { grid-column: 1 / -1; margin: 0; padding: 8px 12px; font-weight: 700; background: #e3f5ea; border: 2px solid #1f9d55; border-radius: 10px; }
</style>
