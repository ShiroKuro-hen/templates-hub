<script setup lang="ts">
import { nextTick, ref } from 'vue';

const props = defineProps<{ onVerify?: (code: string) => Promise<boolean> }>();
const KEY = 'JBSWY3DPEHPK3PXP';

function qr(n = 25) { // simulado: no es un QR real
  let s = 7, d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if ((x < 8 || x > n - 9) && (y < 8 || y > n - 9) && !(x > n - 9 && y > n - 9)) continue;
    s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff;
    if ((s >> 16) & 1) d += `M${x} ${y}h1v1h-1z`;
  }
  for (const [x, y] of [[0, 0], [n - 7, 0], [0, n - 7]]) d += `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}h5v5h-5zM${x + 2} ${y + 2}h3v3h-3z`;
  return d;
}
const path = qr();
const code = ref('');
const err = ref('');
const done = ref(false);
const copy = ref('Copiar');
const live = ref('');
const title = ref<HTMLElement | null>(null);

async function copyKey() {
  try { await navigator.clipboard.writeText(KEY); copy.value = 'Copiado'; live.value = 'Clave copiada.'; }
  catch { copy.value = 'Cópiala a mano'; }
  setTimeout(() => (copy.value = 'Copiar'), 1800);
}
async function submit() {
  const v = code.value.trim(), six = /^\d{6}$/.test(v);
  const ok = props.onVerify ? await props.onVerify(v) : v !== '000000';
  err.value = !six ? 'Escribe los 6 dígitos que muestra tu app, sin espacios.'
    : !ok ? 'El código no coincide o caducó. Espera al siguiente código en tu app e inténtalo de nuevo.' : '';
  if (six && ok) { done.value = true; await nextTick(); title.value?.focus(); }
}
</script>

<template>
  <main class="card">
    <div v-if="!done">
      <h1>Activa la verificación en dos pasos</h1>
      <p class="sub">Protege tu cuenta con un código temporal de tu app de autenticación.</p>
      <div class="grid">
        <div class="qr"><svg viewBox="0 0 25 25" shape-rendering="crispEdges" role="img" aria-label="Código QR para configurar la app de autenticación"><path :d="path" fill="currentColor" fill-rule="evenodd" /></svg></div>
        <ol class="steps">
          <li>Escanea el código con Google Authenticator, 1Password o Authy.</li>
          <li>¿No puedes escanear? Escribe esta clave en la app.
            <div class="key"><code>JBSW Y3DP EHPK 3PXP</code><button class="btn sm" type="button" @click="copyKey">{{ copy }}</button></div></li>
          <li>Escribe el código de 6 dígitos que muestra la app.</li>
        </ol>
      </div>
      <form novalidate @submit.prevent="submit">
        <label for="code">Código de verificación</label>
        <div class="row">
          <input id="code" v-model="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code"
                 placeholder="6 dígitos" :aria-invalid="!!err || undefined" aria-describedby="msg">
          <button class="btn primary" type="submit">Verificar y activar</button>
        </div>
        <p id="msg" class="msg" aria-live="polite">{{ err }}</p>
      </form>
    </div>
    <div v-else class="done">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12.5 3 3 5-6" /></svg>
      <div><h2 ref="title" tabindex="-1">Verificación en dos pasos activada</h2>
        <p>Desde ahora te pediremos un código al iniciar sesión. Guarda tus códigos de recuperación en un lugar seguro.</p></div>
    </div>
    <p class="sr" role="status" aria-live="polite">{{ live }}</p>
  </main>
</template>

<style scoped>
.card{max-width:560px;margin:0 auto;padding:28px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1,h2{margin:0 0 4px;font-size:20px;line-height:1.3}
h2{font-size:16px}
h2:focus{outline:none}
.sub{margin:0 0 20px;color:var(--muted)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.grid{display:flex;flex-wrap:wrap;gap:20px;margin-bottom:20px}
.qr{flex:none;padding:1px;border-radius:var(--radius);background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.qr svg{display:block;width:152px;height:152px;padding:12px;background:var(--surface);border-radius:7px;color:var(--text)}
.steps{flex:1 1 220px;margin:0;padding-left:20px;display:grid;gap:12px;align-content:start}
.steps li::marker{color:var(--muted);font-variant-numeric:tabular-nums}
.key{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px;padding:6px 6px 6px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
code{font:600 13px ui-monospace,"Cascadia Code",Menlo,monospace;overflow-wrap:anywhere}
label{display:block;font-weight:600;margin-bottom:6px}
.row{display:flex;flex-wrap:wrap;gap:8px}
input{box-sizing:border-box;flex:1 1 140px;height:40px;padding:0 12px;font:inherit;font-variant-numeric:tabular-nums;letter-spacing:.15em;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
input:focus-visible{border-color:var(--accent)}
input[aria-invalid=true]{border-color:var(--err)}
.msg{margin:8px 0 0;font-size:13px;color:var(--err)}
.msg:empty{display:none}
.btn{font:inherit;font-weight:600;height:40px;padding:0 16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s,border-color .14s}
.btn:hover{background:var(--accent-soft);border-color:var(--accent)}
.btn.sm{height:28px;padding:0 10px;font-size:13px}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn.primary:hover{background:var(--accent);filter:brightness(1.08)}
.done{display:flex;gap:12px;padding:16px;background:var(--ok-soft);border:1px solid var(--ok);border-radius:var(--radius)}
.done svg{flex:none;width:24px;height:24px;color:var(--ok)}
.done p{margin:0}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
