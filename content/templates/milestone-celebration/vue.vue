<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{ cifra?: string; titulo?: string; shareText?: string }>(), {
  cifra: '1.000',
  titulo: 'Has llegado a 1.000 clientes',
  shareText: 'Hemos llegado a 1.000 clientes en Nimbus.',
});
const stats = [{ label: 'Este mes', value: '+86' }, { label: 'Ingresos', value: '48.920 €' }, { label: 'Retención', value: '94 %' }];
const colors = ['--accent', '--ok', '--warn', '--info', '--err'];
const pieces = Array.from({ length: 20 }, (_, i) => ({
  '--x': `${((i * 37 + 8) % 96) + 2}%`,
  '--d': `${(i % 7) * 0.1}s`,
  '--dx': `${(i % 2 ? 1 : -1) * (12 + (i % 5) * 10)}px`,
  '--c': `var(${colors[i % 5]})`,
}));
const run = ref(0); // cambiar la key reinicia las animaciones CSS
const status = ref('');

async function share() {
  try {
    await navigator.clipboard.writeText(props.shareText);
    status.value = 'Texto copiado. Pégalo donde quieras compartirlo.';
  } catch {
    status.value = 'No se pudo copiar. Selecciona el título y cópialo a mano.';
  }
}
</script>

<template>
  <section class="card" aria-labelledby="ttl">
    <div :key="`c${run}`" class="confetti" aria-hidden="true">
      <i v-for="(style, i) in pieces" :key="i" :style="style"></i>
    </div>
    <div class="ring">
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
        <circle class="track" cx="60" cy="60" r="52" />
        <circle :key="`a${run}`" class="arc" cx="60" cy="60" r="52" />
      </svg>
      <b>{{ cifra }}</b>
    </div>
    <h2 id="ttl">{{ titulo }}</h2>
    <p class="msg">Empezaste hace 14 meses. Este mes se sumaron 86 clientes nuevos.</p>
    <dl class="stats">
      <div v-for="s in stats" :key="s.label"><dt>{{ s.label }}</dt><dd>{{ s.value }}</dd></div>
    </dl>
    <div class="btns">
      <button type="button" class="btn main" @click="share">Compartir logro</button>
      <button type="button" class="btn again" @click="run++">Repetir celebración</button>
    </div>
    <p id="st" role="status">{{ status }}</p>
  </section>
</template>

<style scoped>
.card{position:relative;max-width:480px;margin:0 auto;padding:32px 20px 20px;overflow:hidden;text-align:center;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.ring{position:relative;width:120px;height:120px;margin:0 auto 16px}
.ring svg{display:block;transform:rotate(-90deg)}
.ring circle{fill:none;stroke-width:4}
.track{stroke:var(--border)}
.arc{stroke:url(#g);stroke-linecap:round;stroke-dasharray:327}
.ring b{position:absolute;inset:0;display:grid;place-items:center;font-size:26px;font-weight:600;font-variant-numeric:tabular-nums}
h2{margin:0;font-size:20px;font-weight:600}
.msg{margin:4px auto 0;max-width:340px;color:var(--muted)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);margin:24px 0 20px;padding-top:16px;border-top:1px solid var(--border)}
.stats div+div{border-left:1px solid var(--border)}
.stats dt{color:var(--muted);font-size:13px}
.stats dd{margin:0;font-size:17px;font-weight:600;font-variant-numeric:tabular-nums}
.btns{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.btn{height:36px;padding:0 16px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;font-weight:500;cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn.main{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
#st{min-height:21px;margin:12px 0 0;color:var(--muted)}
.confetti{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.confetti i{position:absolute;top:-14px;left:var(--x);width:8px;height:12px;border-radius:2px;background:var(--c);opacity:0}
@keyframes fall{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),360px) rotate(540deg)}}
@keyframes draw{from{stroke-dashoffset:327}}
@media (prefers-reduced-motion:no-preference){
  .confetti i{animation:fall 2.2s cubic-bezier(.2,.6,.4,1) var(--d) forwards}
  .arc{animation:draw .9s ease-out}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}.again{display:none}}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
/* Tokens: ver pestaña HTML + CSS */
</style>
