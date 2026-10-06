<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const frases = ['tus informes semanales', 'la conciliación de pagos', 'las alertas de inventario', 'la bienvenida a clientes'];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const text = ref(calm ? frases[0] : '');
const paused = ref(false);
let i = 0, n = 0, del = false, timer: ReturnType<typeof setTimeout>;

function tick() {
  const p = frases[i];
  n += del ? -1 : 1;
  text.value = p.slice(0, n);
  let ms = del ? 28 : 55;
  if (!del && n === p.length) { del = true; ms = 1500; }
  else if (del && n === 0) { del = false; i = (i + 1) % frases.length; ms = 350; }
  timer = setTimeout(tick, ms);
}
function toggle() { paused.value = !paused.value; clearTimeout(timer); if (!paused.value) tick(); }
function repeat() { clearTimeout(timer); i = n = 0; del = false; text.value = ''; paused.value = false; tick(); }

onMounted(() => { if (!calm) tick(); });
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <section class="hero">
    <h1>
      Automatiza <span class="typed" aria-hidden="true">{{ text }}</span>
      <span class="sr">tus informes, pagos, inventario y bienvenidas</span>
    </h1>
    <p class="lead">Aurora conecta tus herramientas y repite por ti las tareas que se llevan horas cada semana.</p>
    <div v-if="!calm" class="actions">
      <button class="btn" type="button" @click="toggle">{{ paused ? 'Reanudar' : 'Pausar' }}</button>
      <button class="btn" type="button" @click="repeat">Repetir</button>
    </div>
  </section>
</template>

<style scoped>
.hero{max-width:640px;margin:0 auto;padding:28px 24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;min-height:2.5em;font-size:clamp(22px,5.5vw,34px);font-weight:700;line-height:1.25;letter-spacing:-.015em}
.typed{color:var(--accent)}
.typed::after{content:"";display:inline-block;width:2px;height:.95em;margin-left:3px;vertical-align:-.1em;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.lead{max-width:52ch;margin:12px 0 20px;color:var(--muted)}
.actions{display:flex;flex-wrap:wrap;gap:12px}
.btn{padding:7px 14px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;font-weight:600;cursor:pointer;transition:border-color .14s,background .14s}
.btn:hover{border-color:var(--accent);background:var(--accent-soft)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:no-preference){.typed::after{animation:blink 1.06s steps(1) infinite}}
@keyframes blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}.typed::after{display:none}}
/* Tokens: ver pestaña HTML + CSS */
</style>
