<script setup lang="ts">
import { ref } from 'vue';

withDefaults(defineProps<{ producto?: string }>(), { producto: 'Nimbo' });
const emit = defineEmits<{ login: [data: { email: string; password: string; remember: boolean }] }>();
const show = ref(false);
const done = ref(false);

function submit(e: Event) {
  const f = new FormData(e.target as HTMLFormElement); // el navegador ya validó los campos
  emit('login', { email: String(f.get('email')), password: String(f.get('password')), remember: f.has('remember') });
  done.value = true;
}
</script>

<template>
  <main class="page">
    <section class="card" aria-labelledby="title">
      <div class="brand">
        <span class="logo" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13V3l10 10V3" /></svg>
        </span>
        {{ producto }}
      </div>
      <h1 id="title">Inicia sesión</h1>
      <p class="sub">Accede a tu espacio de trabajo.</p>
      <button class="btn ghost" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
        Continuar con SSO de tu empresa
      </button>
      <div class="or" role="separator">o con tu correo</div>
      <form @submit.prevent="submit">
        <label>Correo electrónico
          <input type="email" name="email" autocomplete="email" required placeholder="nombre@empresa.com" />
          <span class="hint">Escribe un correo válido, por ejemplo nombre@empresa.com.</span>
        </label>
        <label>
          <span class="row">Contraseña <a href="#recuperar">Olvidé mi contraseña</a></span>
          <span class="pw">
            <input id="pw" :type="show ? 'text' : 'password'" name="password" autocomplete="current-password" required minlength="8" />
            <button type="button" aria-controls="pw" :aria-pressed="show" @click="show = !show">{{ show ? 'Ocultar' : 'Mostrar' }}</button>
          </span>
          <span class="hint">La contraseña tiene al menos 8 caracteres.</span>
        </label>
        <label class="check"><input type="checkbox" name="remember" /> Mantener la sesión iniciada</label>
        <button class="btn primary" type="submit">Iniciar sesión</button>
        <p class="status" role="status" :hidden="!done">Sesión iniciada. Abriendo tu espacio de trabajo.</p>
      </form>
    </section>
    <p class="foot">¿No tienes cuenta? <a href="#registro">Crea una gratis</a></p>
  </main>
</template>

<style scoped>
.page{min-height:100vh;display:grid;place-items:center;align-content:center;gap:20px;padding:20px;box-sizing:border-box;background:var(--bg);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card{width:100%;max-width:400px;box-sizing:border-box;padding:32px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:16px;margin-bottom:24px}
.logo{width:28px;height:28px;border-radius:7px;background:linear-gradient(135deg,#22d3ee,#2f5bff);display:grid;place-items:center}
h1{font-size:22px;line-height:1.25;margin:0 0 4px}
.sub{margin:0 0 24px;color:var(--muted)}
form{display:grid;gap:16px}
label{display:grid;gap:6px;font-weight:600}
.row{display:flex;justify-content:space-between;align-items:baseline}
input[type=email],input[type=password],input[type=text]{font:inherit;color:inherit;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:9px 12px;transition:border-color .14s}
input:focus-visible,button:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
input:user-invalid{border-color:var(--err)}
.hint{display:none;font-weight:400;font-size:13px;color:var(--err)}
label:has(:user-invalid) .hint{display:block}
.pw{position:relative;display:grid}
.pw input{padding-right:72px}
.pw button{position:absolute;right:6px;top:50%;transform:translateY(-50%);font:inherit;font-size:13px;background:none;border:0;color:var(--accent);padding:4px 8px;border-radius:6px;cursor:pointer}
a{color:var(--accent);text-decoration:none;font-weight:500}
a:hover{text-decoration:underline}
.check{display:flex;align-items:center;gap:8px;font-weight:400}
.check input{accent-color:var(--accent);width:16px;height:16px;margin:0}
.btn{font:inherit;font-weight:600;border-radius:var(--radius);padding:10px 16px;cursor:pointer;transition:background .14s;display:flex;justify-content:center;align-items:center;gap:10px}
.primary{background:var(--accent);color:var(--accent-ink);border:1px solid var(--accent)}
.ghost{background:var(--surface);color:var(--text);border:1px solid var(--border);width:100%}
.ghost:hover{background:var(--accent-soft)}
.or{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:13px;margin:20px 0}
.or::before,.or::after{content:"";flex:1;border-top:1px solid var(--border)}
.status{margin:0;padding:10px 12px;border-radius:var(--radius);background:var(--ok-soft);border:1px solid var(--ok)}
.status[hidden]{display:none}
.foot{color:var(--muted);margin:0;text-align:center}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
