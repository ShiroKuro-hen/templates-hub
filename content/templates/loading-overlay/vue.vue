<script setup lang="ts">
import { ref } from 'vue';

const fmt = (n: number) =>
  'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const busy = ref(false);
const storage = ref(180);
const stamp = ref('09:00:00');
const live = ref('');

function refresh() {
  if (busy.value) return;
  busy.value = true;
  live.value = 'Actualizando datos…';
  setTimeout(() => {
    storage.value = Math.round(150 + Math.random() * 100);
    stamp.value = new Date().toLocaleTimeString('es-PE');
    busy.value = false;
    live.value = 'Datos actualizados.';
  }, 1800);
}
</script>

<template>
  <section class="panel" aria-labelledby="t" :aria-busy="busy">
    <header>
      <h2 id="t">Facturación de octubre</h2>
      <button class="btn" type="button" :aria-disabled="busy" @click="refresh">Actualizar datos</button>
    </header>
    <div :inert="busy">
      <dl>
        <div class="line"><dt>Plan Business<span>12 usuarios</span></dt><dd>{{ fmt(1440) }}</dd></div>
        <div class="line"><dt>Almacenamiento adicional<span>500 GB</span></dt><dd>{{ fmt(storage) }}</dd></div>
        <div class="line"><dt>Soporte prioritario</dt><dd>{{ fmt(320) }}</dd></div>
        <div class="line total"><dt>Total del mes</dt><dd>{{ fmt(1760 + storage) }}</dd></div>
      </dl>
      <p class="stamp">Actualizado hoy a las {{ stamp }}.</p>
    </div>
    <div class="overlay" aria-hidden="true"><span class="spin" /><span>Actualizando datos…</span></div>
    <p class="sr" role="status">{{ live }}</p>
  </section>
</template>

<style scoped>
.panel{position:relative;max-width:520px;margin:0 auto;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border)}
h2{margin:0;font-size:16px}
.btn{font:inherit;padding:8px 14px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--accent-ink);cursor:pointer;transition:filter .14s}
.btn:hover{filter:brightness(1.08)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn[aria-disabled=true]{cursor:progress;filter:none;opacity:.6}
dl{margin:0;padding:8px 20px}
.line{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
.line dd{margin:0;font-variant-numeric:tabular-nums}
.line dt span{display:block;color:var(--muted);font-size:13px}
.total{border-bottom:0;font-weight:600;font-size:16px}
.stamp{margin:0;padding:12px 20px;border-top:1px solid var(--border);color:var(--muted);font-size:13px}
.overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:color-mix(in srgb,var(--surface) 76%,transparent);opacity:0;visibility:hidden;transition:opacity .16s,visibility .16s}
.panel[aria-busy=true] .overlay{opacity:1;visibility:visible}
.spin{width:32px;height:32px;border-radius:50%;background:conic-gradient(from 0deg,transparent,#22d3ee,#2f5bff);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));animation:rot .9s linear infinite}
@keyframes rot{to{transform:rotate(360deg)}}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}.spin{animation-duration:3s}}
/* Tokens: ver pestaña HTML + CSS */
</style>
