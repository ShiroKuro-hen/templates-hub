<script setup lang="ts">
import { onBeforeUnmount, ref, watchEffect } from 'vue';

const p = ref(0);
let timer: number | undefined;

watchEffect(() => {
  clearInterval(timer);
  if (p.value >= 100) return;
  timer = window.setInterval(() => (p.value = Math.min(100, Math.round(p.value + 4 + Math.random() * 10))), 300);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <section class="card" aria-labelledby="t">
    <h2 id="t">Estado de los procesos</h2>
    <div class="row">
      <div class="head"><span id="l1">Sincronizando contactos</span><span>En curso</span></div>
      <div class="track" role="progressbar" aria-labelledby="l1" aria-valuetext="Sincronizando"><span class="fill ind" /></div>
    </div>
    <div class="row" :class="{ ok: p >= 100 }">
      <div class="head"><span id="l2">Subiendo informe-q3.pdf</span><span>{{ p }} %</span></div>
      <div class="track" role="progressbar" aria-labelledby="l2" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="p">
        <span class="fill" :style="{ '--p': p + '%' }" />
      </div>
      <p class="note" aria-live="polite">{{ p >= 100 ? 'Archivo subido correctamente.' : 'Subiendo, quedan unos segundos.' }}</p>
    </div>
    <div class="row err">
      <div class="head"><span id="l3">Copia de seguridad</span><span>38 %</span></div>
      <div class="track" role="progressbar" aria-labelledby="l3" aria-valuemin="0" aria-valuemax="100" aria-valuenow="38">
        <span class="fill" style="--p: 38%" />
      </div>
      <p class="note">Se detuvo en 38 %. Revisa tu conexión y vuelve a iniciar la copia.</p>
    </div>
    <button class="btn" type="button" @click="p = 0">Reiniciar subida</button>
  </section>
</template>

<style scoped>
.card{max-width:560px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0 0 20px;font-size:16px}
.row{margin-bottom:20px}
.head{display:flex;justify-content:space-between;gap:12px;margin-bottom:8px;font-weight:600}
.head span:last-child{color:var(--muted);font-weight:400;font-variant-numeric:tabular-nums}
.track{position:relative;height:8px;overflow:hidden;border-radius:999px;background:var(--accent-soft)}
.fill{display:block;height:100%;width:var(--p,0%);border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .16s}
.ind{position:absolute;top:0;left:0;width:40%;animation:slide 1.4s ease-in-out infinite}
@keyframes slide{from{transform:translateX(-100%)}to{transform:translateX(250%)}}
.ok .track{background:var(--ok-soft)} .ok .fill{background:var(--ok)}
.err .track{background:var(--err-soft)} .err .fill{background:var(--err)}
.note{margin:8px 0 0;color:var(--muted);font-size:13px}
.err .note{color:var(--err)}
.btn{font:inherit;padding:8px 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}.ind{animation-duration:3.2s}}
/* Tokens: ver pestaña HTML + CSS */
</style>
