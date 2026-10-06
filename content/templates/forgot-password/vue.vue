<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps<{ onReset?: (password: string) => Promise<void> }>();
const TITLES = ['¿Olvidaste tu contraseña?', 'Revisa tu correo', 'Crea una contraseña nueva', 'Contraseña actualizada'];
const STEPS = ['pedir enlace', 'revisar correo', 'crear contraseña'];

const step = ref(0);
const email = ref('');
const p1 = ref('');
const p2 = ref('');
const show = ref(false);
const err = ref('');
const title = ref<HTMLElement | null>(null);
const cur = computed(() => Math.min(step.value, 2));
const bad = computed(() => !!err.value || undefined);
watch(step, async () => { await nextTick(); title.value?.focus(); });

function ask(e: Event) {
  if (!(e.target as HTMLFormElement).checkValidity()) { err.value = 'Escribe un correo válido, por ejemplo nombre@empresa.com.'; return; }
  err.value = ''; step.value = 1;
}
async function save() {
  err.value = p1.value.length < 12 ? `Usa al menos 12 caracteres. Ahora tienes ${p1.value.length}.`
    : p1.value !== p2.value ? 'Las contraseñas no coinciden. Vuelve a escribirlas.' : '';
  if (!err.value) { await props.onReset?.(p1.value); step.value = 3; }
}
</script>

<template>
  <main class="card">
    <ol class="steps" aria-label="Progreso de recuperación">
      <li v-for="(s, i) in STEPS" :key="s" :class="{ on: i <= cur }" :aria-current="i === cur ? 'step' : undefined">
        <span class="sr">Paso {{ i + 1 }} de 3: {{ s }}</span>
      </li>
    </ol>
    <h1 ref="title" tabindex="-1">{{ TITLES[step] }}</h1>
    <template v-if="step === 0">
      <p class="sub">Escribe el correo de tu cuenta y te enviamos un enlace para crear una nueva.</p>
      <form novalidate @submit.prevent="ask">
        <label for="email">Correo de la cuenta</label>
        <input id="email" v-model="email" class="field" type="email" autocomplete="email" placeholder="nombre@empresa.com"
               required :aria-invalid="bad" aria-describedby="m">
        <p id="m" class="msg" aria-live="polite">{{ err }}</p>
        <button class="btn primary" type="submit">Enviar enlace</button>
      </form>
      <p class="help"><a href="#">Volver a iniciar sesión</a></p>
    </template>
    <template v-else-if="step === 1">
      <p class="sub">Si hay una cuenta con <strong>{{ email }}</strong>, recibirás un enlace en unos minutos. Revisa también la carpeta de spam.</p>
      <button class="btn primary" type="button" @click="err = ''; step = 2">Abrir enlace de ejemplo</button>
      <p class="help">¿Correo equivocado? <button class="link" type="button" @click="step = 0">Usar otro correo</button></p>
    </template>
    <template v-else-if="step === 2">
      <p class="sub">Elige una que no uses en otros servicios.</p>
      <form novalidate @submit.prevent="save">
        <label for="p1">Contraseña nueva</label>
        <input id="p1" v-model="p1" class="field" :type="show ? 'text' : 'password'" autocomplete="new-password" required
               :aria-invalid="bad" aria-describedby="hint">
        <p id="hint" class="hint">Usa al menos 12 caracteres.</p>
        <label for="p2">Repite la contraseña</label>
        <input id="p2" v-model="p2" class="field" :type="show ? 'text' : 'password'" autocomplete="new-password" required
               :aria-invalid="bad" aria-describedby="m">
        <label class="chk"><input v-model="show" type="checkbox"> Mostrar contraseñas</label>
        <p id="m" class="msg" aria-live="polite">{{ err }}</p>
        <button class="btn primary" type="submit">Guardar contraseña</button>
      </form>
    </template>
    <template v-else>
      <p class="sub">Ya puedes iniciar sesión con tu contraseña nueva.</p>
      <button class="btn primary" type="button">Iniciar sesión</button>
    </template>
  </main>
</template>

<style scoped>
.card{max-width:420px;margin:0 auto;padding:28px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0 0 24px;padding:0;list-style:none}
.steps li{height:4px;border-radius:999px;background:var(--border);transition:background .14s}
.steps li.on{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
h1{margin:0 0 4px;font-size:20px;line-height:1.3}
h1:focus{outline:none}
.sub{margin:0 0 20px;color:var(--muted)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
label{display:block;font-weight:600;margin-bottom:6px}
.field{box-sizing:border-box;width:100%;height:40px;margin-bottom:12px;padding:0 12px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.field:focus-visible{border-color:var(--accent)}
.field[aria-invalid=true]{border-color:var(--err)}
.hint{margin:-6px 0 12px;font-size:13px;color:var(--muted)}
.chk{display:flex;align-items:center;gap:8px;margin:0 0 12px;font-weight:400}
.chk input{width:16px;height:16px;margin:0;accent-color:var(--accent)}
.msg{margin:-4px 0 12px;font-size:13px;color:var(--err)}
.msg:empty{display:none}
.btn{font:inherit;font-weight:600;display:block;width:100%;height:40px;padding:0 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s,border-color .14s}
.btn:hover{background:var(--accent-soft);border-color:var(--accent)}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn.primary:hover{background:var(--accent);filter:brightness(1.08)}
.link{all:unset;color:var(--accent);text-decoration:underline;cursor:pointer}
.link:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:2px}
a{color:var(--accent)}
.help{margin:16px 0 0;font-size:13px;color:var(--muted)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
