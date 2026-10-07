<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

type Campo = 'email' | 'ruc';

const nombres: Record<Campo, string> = { email: 'Correo de facturación', ruc: 'RUC' };
const reglas: Record<Campo, (v: string) => string> = {
  email: (v) => (!v ? 'Escribe un correo de facturación.' : /^[^@\s]+@[^@\s]+\.\w{2,}$/.test(v) ? '' : 'El formato no es válido. Usa nombre@empresa.com.'),
  ruc: (v) => (!v ? 'Escribe el RUC de 11 dígitos.' : /^\d{11}$/.test(v) ? '' : 'El RUC tiene 11 dígitos, sin espacios ni letras.'),
};
const valores = reactive<Record<Campo, string>>({ email: 'facturacion@empresa', ruc: '2051234' });
const guardado = ref(false);

const errores = computed(() =>
  (Object.keys(reglas) as Campo[]).map((k) => [k, reglas[k](valores[k].trim())] as const).filter(([, m]) => m),
);
const error = (k: Campo) => errores.value.find(([c]) => c === k)?.[1] ?? '';
const ir = (k: Campo) => document.getElementById(k)?.focus();
function enviar() {
  if (errores.value.length) ir(errores.value[0][0]);
  else guardado.value = true;
}
</script>

<template>
  <section class="card" aria-labelledby="ai-titulo">
    <h2 id="ai-titulo">Datos de facturación</h2>
    <form novalidate @submit.prevent="enviar" @input="guardado = false">
      <div aria-live="polite">
        <div v-if="errores.length" class="alert err">
          <span class="ic" aria-hidden="true">×</span>
          <div>
            <strong>Revisa {{ errores.length }} {{ errores.length > 1 ? 'campos' : 'campo' }} antes de guardar</strong>
            <ul>
              <li v-for="[k, m] in errores" :key="k"><a :href="`#${k}`" @click.prevent="ir(k)">{{ nombres[k] }}: {{ m }}</a></li>
            </ul>
          </div>
        </div>
        <div v-else-if="guardado" class="alert ok">
          <span class="ic" aria-hidden="true">✓</span>
          <div><strong>Datos guardados</strong><p>Enviaremos las facturas al correo indicado.</p></div>
        </div>
      </div>
      <div class="field">
        <label for="email">Correo de facturación</label>
        <input id="email" v-model="valores.email" type="email" :aria-invalid="!!error('email')" aria-describedby="email-e">
        <p id="email-e" class="msg">{{ error('email') }}</p>
      </div>
      <div class="field">
        <label for="ruc">RUC</label>
        <input id="ruc" v-model="valores.ruc" inputmode="numeric" :aria-invalid="!!error('ruc')" aria-describedby="ruc-e ruc-w">
        <p id="ruc-e" class="msg">{{ error('ruc') }}</p>
        <div id="ruc-w" class="alert warn"><span class="ic" aria-hidden="true">!</span><p>Si cambias el RUC, volveremos a verificar tu cuenta. Tarda hasta 24 horas.</p></div>
      </div>
      <div class="acts"><button class="btn main" type="submit">Guardar cambios</button></div>
    </form>
  </section>
</template>

<style scoped>
.card{max-width:520px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;padding:16px 20px;font-size:16px;font-weight:600;border-bottom:1px solid transparent;background:linear-gradient(90deg,#22d3ee,#2f5bff) bottom/100% 1px no-repeat}
form{display:grid;gap:16px;padding:20px}
.alert{--k:var(--info);--ks:var(--info-soft);display:flex;gap:10px;padding:12px 14px;border:1px solid var(--k);border-radius:var(--radius);background:var(--ks)}
.alert.err{--k:var(--err);--ks:var(--err-soft)}
.alert.warn{--k:var(--warn);--ks:var(--warn-soft)}
.alert.ok{--k:var(--ok);--ks:var(--ok-soft)}
.ic{display:grid;place-items:center;flex:none;width:20px;height:20px;border-radius:50%;background:var(--k);color:var(--surface);font-size:12px;font-weight:700}
.alert strong{display:block}
.alert p,.alert ul{margin:2px 0 0}
.alert ul{padding-left:18px}
.alert a{color:var(--text);font-weight:600;text-decoration-color:var(--k);text-underline-offset:2px}
.alert a:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:2px}
.field label{display:block;margin-bottom:4px;font-weight:600}
.field input{box-sizing:border-box;width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;transition:border-color .14s}
.field input:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-color:var(--accent)}
.field input[aria-invalid=true]{border-color:var(--err)}
.msg{margin:4px 0 0;color:var(--err);font-size:13px}
.msg:empty{display:none}
.field .alert{margin-top:8px}
.acts{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px}
.btn{padding:8px 16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;font-weight:600;cursor:pointer}
.btn.main{border-color:var(--accent);background:var(--accent);color:var(--accent-ink)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
