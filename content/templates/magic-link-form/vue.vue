<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue';

const props = defineProps<{ onSend?: (email: string) => Promise<void> }>();
const N = 30, C = 2 * Math.PI * 24;
const email = ref('');
const sent = ref(false);
const err = ref('');
const left = ref(0);
const live = ref('');
const title = ref<HTMLElement | null>(null);
const field = ref<HTMLInputElement | null>(null);
let timer: ReturnType<typeof setInterval>;

function start() {
  left.value = N; clearInterval(timer);
  timer = setInterval(() => { left.value--; if (left.value <= 0) clearInterval(timer); }, 1000);
}
async function send(resend = false) {
  await props.onSend?.(email.value);
  start(); sent.value = true;
  live.value = resend ? `Enlace reenviado a ${email.value}.` : '';
  await nextTick(); title.value?.focus();
}
function submit(e: Event) {
  if (!(e.target as HTMLFormElement).checkValidity()) { err.value = 'Escribe un correo válido, por ejemplo nombre@empresa.com.'; return; }
  err.value = ''; send();
}
async function back() {
  clearInterval(timer); left.value = 0; live.value = ''; sent.value = false;
  await nextTick(); field.value?.focus();
}
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <main class="card">
    <section v-if="!sent" aria-labelledby="t1">
      <h1 id="t1">Accede sin contraseña</h1>
      <p class="sub">Escribe tu correo y te enviamos un enlace de un solo uso.</p>
      <form novalidate @submit.prevent="submit">
        <label for="email">Correo electrónico</label>
        <input id="email" ref="field" v-model="email" type="email" autocomplete="email" placeholder="nombre@empresa.com"
               required :aria-invalid="!!err || undefined" aria-describedby="msg">
        <p id="msg" class="msg" aria-live="polite">{{ err }}</p>
        <button class="btn primary" type="submit">Enviar enlace de acceso</button>
      </form>
    </section>
    <section v-else aria-labelledby="t2">
      <div class="ring">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke-width="3" stroke-linecap="round" aria-hidden="true">
          <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
          <circle class="track" cx="28" cy="28" r="24" />
          <circle class="bar" cx="28" cy="28" r="24" stroke="url(#g)" stroke-dasharray="150.8" :style="{ strokeDashoffset: C * (1 - left / N) }" />
        </svg>
        <b aria-hidden="true">{{ left }}</b>
      </div>
      <h1 id="t2" ref="title" tabindex="-1">Revisa tu correo</h1>
      <p class="sub">Enviamos un enlace a <strong>{{ email }}</strong>. Caduca en 10 minutos.</p>
      <button class="btn" type="button" :disabled="left > 0" @click="send(true)">
        {{ left > 0 ? `Reenviar en ${left} s` : 'Reenviar enlace' }}
      </button>
      <p class="help">¿Correo equivocado? <button class="link" type="button" @click="back">Usar otro correo</button></p>
    </section>
    <p class="sr" role="status" aria-live="polite">{{ live }}</p>
  </main>
</template>

<style scoped>
.card{max-width:420px;margin:0 auto;padding:28px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0 0 4px;font-size:20px;line-height:1.3}
h1:focus{outline:none}
.sub{margin:0 0 20px;color:var(--muted)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
label{display:block;font-weight:600;margin-bottom:6px}
input{box-sizing:border-box;width:100%;height:40px;margin-bottom:12px;padding:0 12px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
input:focus-visible{border-color:var(--accent)}
input[aria-invalid=true]{border-color:var(--err)}
.msg{margin:-4px 0 12px;font-size:13px;color:var(--err)}
.msg:empty{display:none}
.btn{font:inherit;font-weight:600;display:flex;align-items:center;justify-content:center;width:100%;height:40px;padding:0 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s,border-color .14s}
.btn:hover:not(:disabled){background:var(--accent-soft);border-color:var(--accent)}
.btn:disabled{color:var(--muted);cursor:not-allowed;font-variant-numeric:tabular-nums}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn.primary:hover{background:var(--accent);filter:brightness(1.08)}
.link{all:unset;color:var(--accent);text-decoration:underline;cursor:pointer}
.link:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:2px}
.ring{position:relative;width:56px;height:56px;margin-bottom:16px}
.ring svg{display:block;transform:rotate(-90deg)}
.ring .track{stroke:var(--border)}
.ring .bar{transition:stroke-dashoffset 1s linear}
.ring b{position:absolute;inset:0;display:grid;place-items:center;font-weight:600;font-variant-numeric:tabular-nums}
.help{margin:16px 0 0;font-size:13px;color:var(--muted)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
