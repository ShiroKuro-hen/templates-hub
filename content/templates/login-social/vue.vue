<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ onProvider?: (id: string) => Promise<void> }>();
const providers = [
  { id: 'Google', label: 'Google', paths: ['M20 12a8 8 0 1 1-2.4-5.7M20 12h-8'] },
  { id: 'GitHub', label: 'GitHub', paths: ['M6 8.5v7M18 10.5c0 4-6 3-11 6', 'M3.5 6a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0M3.5 18a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0M15.5 8a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0'] },
  { id: 'Microsoft', label: 'Microsoft', paths: ['M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z'] },
  { id: 'tu proveedor SSO', label: 'SSO empresarial', paths: ['M4 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0M12 12h9M18 12v3M21 12v2'] },
];
const busy = ref<string | null>(null);
const email = ref('');
const msg = ref<{ text: string; err: boolean } | null>(null);

async function pick(id: string) {
  busy.value = id;
  await (props.onProvider?.(id) ?? new Promise((r) => setTimeout(r, 1600)));
  busy.value = null;
}
function submit(e: Event) {
  const ok = ((e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement).checkValidity();
  msg.value = ok ? { text: `Te enviamos un código a ${email.value}.`, err: false }
                 : { text: 'Escribe un correo válido, por ejemplo nombre@empresa.com.', err: true };
}
</script>

<template>
  <main class="card" aria-labelledby="t">
    <div class="logo" aria-hidden="true" />
    <h1 id="t">Accede a Norte Cloud</h1>
    <p class="sub">Usa la cuenta de tu empresa. No publicamos nada en tu nombre.</p>
    <div class="providers" role="group" aria-label="Acceder con un proveedor">
      <button v-for="p in providers" :key="p.id" class="btn" type="button" :disabled="!!busy"
              :aria-busy="busy === p.id || undefined" @click="pick(p.id)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path v-for="d in p.paths" :key="d" :d="d" /></svg>
        {{ p.label }}
      </button>
    </div>
    <p class="sep">o con tu correo</p>
    <form novalidate @submit.prevent="submit">
      <label for="email">Correo de trabajo</label>
      <input id="email" v-model="email" name="email" type="email" autocomplete="email" placeholder="nombre@empresa.com"
             required :aria-invalid="msg?.err || undefined" aria-describedby="msg">
      <p id="msg" class="msg" :class="{ err: msg?.err }" aria-live="polite">{{ msg?.text }}</p>
      <button class="btn primary" type="submit">Continuar con correo</button>
    </form>
    <p class="legal">Al continuar aceptas los <a href="#">Términos del servicio</a> y la <a href="#">Política de privacidad</a>.</p>
    <p class="sr" role="status" aria-live="polite">{{ busy ? `Redirigiendo a ${busy}…` : '' }}</p>
  </main>
</template>

<style scoped>
.card{max-width:440px;margin:0 auto;padding:28px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.logo{width:32px;height:32px;border-radius:var(--radius);background:linear-gradient(135deg,#22d3ee,#2f5bff)}
h1{margin:16px 0 4px;font-size:20px;line-height:1.3}
.sub{margin:0 0 20px;color:var(--muted)}
.providers{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px}
.btn{font:inherit;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s,border-color .14s}
.btn:hover{background:var(--accent-soft);border-color:var(--accent)}
.btn:disabled{cursor:progress;opacity:.6}
.btn[aria-busy=true]{opacity:1;border-color:var(--accent)}
.btn svg{width:18px;height:18px;flex:none}
.btn.primary{width:100%;background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn.primary:hover{filter:brightness(1.08)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.sep{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--muted)}
.sep::before,.sep::after{content:"";flex:1;border-top:1px solid var(--border)}
label{display:block;font-weight:600;margin-bottom:6px}
input{box-sizing:border-box;width:100%;height:40px;margin-bottom:12px;padding:0 12px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
input[aria-invalid=true]{border-color:var(--err)}
.msg{margin:-4px 0 12px;font-size:13px;color:var(--muted)}
.msg:empty{display:none}
.msg.err{color:var(--err)}
.legal{margin:16px 0 0;font-size:12px;color:var(--muted)}
a{color:var(--accent)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
