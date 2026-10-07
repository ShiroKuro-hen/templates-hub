<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';

const run = reactive({ ok: true, err: true });
const copied = ref(false);
const label = ref('Copiar enlace');

// Reinicia la animación: apaga "run", espera al DOM y lo vuelve a encender.
async function replay(k: 'ok' | 'err') {
  run[k] = false;
  await nextTick();
  requestAnimationFrame(() => (run[k] = true));
}
async function copy() {
  try { await navigator.clipboard.writeText('https://app.ejemplo.com/informes/q3'); label.value = 'Copiado'; copied.value = true; }
  catch { label.value = 'No se pudo copiar'; }
  setTimeout(() => { label.value = 'Copiar enlace'; copied.value = false; }, 1600);
}
</script>

<template>
  <div class="grid">
    <article>
      <div class="vis load"><svg role="img" aria-label="Cargando" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" opacity=".2" /><circle cx="12" cy="12" r="9" pathLength="1" stroke-dasharray=".28 .72" />
      </svg></div>
      <h3>Cargando</h3><p>Gira mientras la tarea sigue en curso.</p>
    </article>
    <article>
      <div class="vis ok" :class="{ run: run.ok }"><svg aria-hidden="true" viewBox="0 0 24 24">
        <circle class="d" pathLength="1" cx="12" cy="12" r="10" /><path class="d" pathLength="1" d="m7.5 12.5 3 3 6-6.5" style="--dl:.3s" />
      </svg></div>
      <h3>Éxito</h3><p>El trazo se dibuja al confirmar.</p>
      <button type="button" @click="replay('ok')">Repetir animación</button>
    </article>
    <article>
      <div class="vis err" :class="{ run: run.err }"><svg aria-hidden="true" viewBox="0 0 24 24">
        <circle class="d" pathLength="1" cx="12" cy="12" r="10" />
        <path class="d" pathLength="1" d="m9 9 6 6" style="--dl:.3s" /><path class="d" pathLength="1" d="m15 9-6 6" style="--dl:.4s" />
      </svg></div>
      <h3>Error</h3><p>Se dibuja y vibra una vez.</p>
      <button type="button" @click="replay('err')">Repetir animación</button>
    </article>
    <article>
      <div class="vis cp" :class="{ run: copied }"><svg aria-hidden="true" viewBox="0 0 24 24">
        <g class="a"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></g>
        <path class="b" d="m5 12.5 4.5 4.5L19 7.5" />
      </svg></div>
      <h3>Copiar</h3><p>Cambia a una marca al copiar.</p>
      <button type="button" aria-live="polite" @click="copy">{{ label }}</button>
    </article>
  </div>
</template>

<style scoped>
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
article{display:flex;flex-direction:column;align-items:flex-start;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.vis{display:grid;place-items:center;width:64px;height:64px;margin-bottom:12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg)}
svg{width:36px;height:36px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
h3{margin:0;font-size:15px}
p{margin:2px 0 12px;color:var(--muted)}
button{margin-top:auto;padding:6px 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;cursor:pointer;transition:background .14s,border-color .14s}
button:hover{background:var(--accent-soft);border-color:var(--accent)}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.load{color:var(--accent)}
.load svg{animation:spin .9s linear infinite}
.ok{color:var(--ok)}
.err{color:var(--err)}
.d{stroke-dasharray:1;stroke-dashoffset:0}
.run .d{animation:draw .4s ease-out both;animation-delay:var(--dl,0s)}
.err.run svg{animation:shake .4s .35s}
.cp svg{overflow:visible}
.cp .a,.cp .b{transition:opacity .14s,transform .14s;transform-origin:center}
.cp .b{opacity:0;transform:scale(.6);stroke:var(--ok)}
.cp.run .a{opacity:0;transform:scale(.6)}
.cp.run .b{opacity:1;transform:none}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes shake{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
