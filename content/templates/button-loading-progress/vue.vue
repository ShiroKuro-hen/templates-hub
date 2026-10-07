<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

type Estado = 'idle' | 'up' | 'done';
const SIZE = 4.2; // MB
const fmt = (n: number) => n.toFixed(1).replace('.', ',');

const state = ref<Estado>('idle');
const p = ref(0);
const msg = ref('');
const btn = ref<HTMLButtonElement | null>(null);
let timer = 0, quarter = 0;

const label = computed(() =>
  state.value === 'up' ? `Subiendo ${Math.round(p.value)} %` : state.value === 'done' ? 'Informe subido' : 'Subir informe');

function reset(text = '') {
  clearInterval(timer); quarter = 0; p.value = 0; state.value = 'idle'; msg.value = text;
}
function start() {
  if (state.value === 'up') return;
  reset(); state.value = 'up'; msg.value = 'Subiendo informe-q3.pdf.';
  timer = window.setInterval(() => {
    p.value = Math.min(100, p.value + 2 + Math.random() * 5);
    if (Math.floor(p.value / 25) > quarter) {
      quarter = Math.floor(p.value / 25);
      msg.value = `${fmt((SIZE * p.value) / 100)} MB de ${fmt(SIZE)} MB.`;
    }
    if (p.value < 100) return;
    clearInterval(timer); state.value = 'done'; msg.value = 'Listo. El equipo ya puede verlo.';
    setTimeout(() => reset(), 2500);
  }, 120);
}
function cancel() { reset('Subida cancelada. Vuelve a intentarlo cuando quieras.'); btn.value?.focus(); }
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <section class="card" aria-labelledby="t">
    <h2 id="t">Informe trimestral</h2>
    <p class="file">informe-q3.pdf, 4,2 MB</p>
    <div class="row">
      <button ref="btn" type="button" class="btn" :data-state="state" :aria-busy="state === 'up'" @click="start">
        <span>{{ label }}</span>
        <span class="fill" role="progressbar" aria-label="Progreso de subida" aria-valuemin="0" aria-valuemax="100"
          :aria-valuenow="Math.round(p)" :style="{ '--p': p }" />
      </button>
      <button type="button" class="link" :hidden="state !== 'up'" @click="cancel">Cancelar subida</button>
    </div>
    <p id="msg" role="status">{{ msg }}</p>
  </section>
</template>

<style scoped>
.card{max-width:420px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px}
.file{margin:2px 0 16px;color:var(--muted);font-variant-numeric:tabular-nums}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px}
.btn{position:relative;overflow:hidden;min-width:168px;padding:10px 18px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--accent-ink);font:inherit;font-weight:600;font-variant-numeric:tabular-nums;cursor:pointer;transition:background .14s,color .14s,border-color .14s}
.btn:hover{filter:brightness(1.06)}
.btn:focus-visible,.link:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.fill{position:absolute;left:0;bottom:0;height:3px;width:calc(var(--p,0) * 1%);background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .12s linear}
.btn[data-state=up]{background:var(--accent-soft);color:var(--text);border-color:var(--border);cursor:progress}
.btn[data-state=done]{background:var(--ok-soft);color:var(--ok);border-color:var(--ok)}
.btn[data-state=done] .fill{display:none}
.link{all:unset;color:var(--muted);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.link:hover{color:var(--text)}
.link[hidden]{display:none}
#msg{min-height:21px;margin:12px 0 0;color:var(--muted);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
