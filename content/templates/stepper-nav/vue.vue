<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

type S = 'done' | 'current' | 'error' | 'todo';
const steps = [
  { name: 'Dominio', title: 'Conecta tu dominio', text: 'Apunta tu dominio al servidor con un registro CNAME.' },
  { name: 'Contenido', title: 'Revisa el contenido', text: 'Agrega la imagen de portada para poder continuar.' },
  { name: 'Pagos', title: 'Configura los pagos', text: 'Conecta una cuenta bancaria para cobrar a tus clientes.' },
  { name: 'Publicación', title: 'Publica tu sitio', text: 'Revisa el resumen y publica cuando estés listo.' },
];
const SUB: Record<S, string> = { done: 'Completo', error: 'Requiere atención', current: 'En curso', todo: 'Pendiente' };
const cur = ref(2);
const max = ref(2);
const errors = reactive<Record<number, string>>({ 1: 'Falta la imagen de portada' });

const state = (i: number): S => (i === cur.value ? 'current' : i > max.value ? 'todo' : errors[i] ? 'error' : 'done');
const info = computed(() => steps[cur.value] ?? { title: 'Sitio publicado', text: 'Tu sitio ya está disponible en tu dominio.' });
function next() {
  delete errors[cur.value];
  cur.value++;
  max.value = Math.max(max.value, cur.value);
}
</script>

<template>
  <section class="card" aria-label="Publicar un sitio">
    <nav aria-label="Pasos para publicar tu sitio">
      <ol>
        <li v-for="(st, i) in steps" :key="st.name" :data-s="state(i)">
          <component :is="state(i) === 'todo' ? 'span' : 'a'" class="step" :href="state(i) === 'todo' ? undefined : `#paso-${i + 1}`"
                     :aria-current="state(i) === 'current' ? 'step' : undefined" @click.prevent="state(i) !== 'todo' && (cur = i)">
            <span class="dot">
              <svg v-if="state(i) === 'done'" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
              <template v-else>{{ state(i) === 'error' ? '!' : i + 1 }}</template>
            </span>
            <span>
              <span class="lbl">{{ st.name }}</span>
              <span class="sub">{{ state(i) === 'error' ? errors[i] : SUB[state(i)] }}</span>
            </span>
          </component>
        </li>
      </ol>
    </nav>
    <div class="panel" aria-live="polite">
      <h2>{{ info.title }}</h2>
      <p>{{ info.text }}</p>
      <div class="row">
        <button class="btn" type="button" :disabled="cur === 0" @click="cur--">Atrás</button>
        <button class="btn p" type="button" :disabled="cur > 3" @click="next">{{ cur === 3 ? 'Publicar sitio' : 'Continuar' }}</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card{max-width:760px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
ol{list-style:none;margin:0 0 20px;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
li::before{content:"";display:block;height:4px;margin-bottom:10px;border-radius:999px;background:var(--border)}
li[data-s=done]::before{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
li[data-s=current]::before{background:var(--accent)}
li[data-s=error]::before{background:var(--err)}
.step{display:flex;gap:10px;align-items:flex-start;padding:6px;border-radius:var(--radius);color:var(--muted);text-decoration:none;transition:background .14s}
a.step{color:var(--text)}
a.step:hover{background:var(--accent-soft)}
a.step:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.dot{flex:none;display:grid;place-items:center;width:24px;height:24px;border:1px solid var(--border);border-radius:50%;font-size:12px;font-weight:600;font-variant-numeric:tabular-nums}
[data-s=done] .dot{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
[data-s=current] .dot{background:var(--accent-soft);border-color:var(--accent);color:var(--text)}
[data-s=error] .dot{background:var(--err-soft);border-color:var(--err);color:var(--text)}
.dot svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.lbl{display:block;font-weight:600}
.sub{display:block;color:var(--muted);font-size:13px}
[data-s=error] .sub{color:var(--err)}
.panel{padding:16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
h2{margin:0 0 4px;font-size:16px}
.panel p{margin:0 0 16px;color:var(--muted)}
.row{display:flex;gap:8px}
.btn{font:inherit;padding:8px 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s}
.btn:hover:not(:disabled){background:var(--accent-soft)}
.btn.p{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn.p:hover:not(:disabled){background:var(--accent);filter:brightness(1.08)}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (max-width:560px){ol{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
