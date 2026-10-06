<script setup lang="ts">
import { ref } from 'vue';

type Estado = 'idle' | 'loading' | 'done';
const label: Record<Estado, string> = { idle: 'Guardar cambios', loading: 'Guardando…', done: 'Guardado' };
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const estado = ref<Estado>('idle');
const aviso = ref('');

// Onda en el punto de la pulsación (centrada si se activa con teclado: detail === 0).
function ripple(e: MouseEvent) {
  if (calm) return;
  const b = e.currentTarget as HTMLElement, r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
  const x = e.detail ? e.clientX - r.left : r.width / 2, y = e.detail ? e.clientY - r.top : r.height / 2;
  const s = document.createElement('span');
  s.className = 'ripple';
  s.style.cssText = `width:${d}px;height:${d}px;left:${x - d / 2}px;top:${y - d / 2}px`;
  b.append(s);
  s.animate([{ transform: 'scale(0)', opacity: 0.3 }, { transform: 'scale(1)', opacity: 0 }], { duration: 600, easing: 'ease-out' })
    .finished.then(() => s.remove());
}
function guardar(e: MouseEvent) {
  ripple(e);
  if (estado.value !== 'idle') return;
  estado.value = 'loading';
  setTimeout(() => {
    estado.value = 'done';
    aviso.value = 'Cambios guardados.';
    setTimeout(() => { estado.value = 'idle'; aviso.value = ''; }, 1800);
  }, calm ? 300 : 900);
}
</script>

<template>
  <main class="card">
    <h1>Preferencias de notificación</h1>
    <p>Recibe un aviso por correo cuando termine de generarse un informe.</p>
    <div class="actions">
      <button class="btn primary" type="button" :data-state="estado" :aria-busy="estado === 'loading'" @click="guardar">
        <svg class="ico spin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" pathLength="1" /></svg>
        <svg class="ico check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" pathLength="1" /></svg>
        <span>{{ label[estado] }}</span>
      </button>
      <button class="btn" type="button" @click="ripple">Restablecer</button>
    </div>
    <p class="live" role="status">{{ aviso }}</p>
  </main>
</template>

<style scoped>
.card{max-width:440px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:16px;font-weight:600}
.card p{margin:4px 0 0;color:var(--muted)}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}
.btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-width:150px;padding:9px 18px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;font-weight:600;cursor:pointer;transition:background .14s,border-color .14s,color .14s}
.btn:hover{border-color:var(--accent)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.primary:hover{filter:brightness(1.08)}
.btn :deep(.ripple){position:absolute;border-radius:50%;background:currentColor;opacity:0;pointer-events:none}
.ico{display:none;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
[data-state=loading] .spin,[data-state=done] .check{display:block}
.spin circle{stroke-dasharray:.7 .3}
.check path{stroke-dasharray:1}
[data-state=done]{background:var(--ok-soft);border-color:var(--ok);color:var(--text)}
[data-state=done] .check{stroke:var(--ok)}
.card .live{min-height:21px;margin-top:12px;font-size:13px}
@media (prefers-reduced-motion:no-preference){
  .spin{animation:turn .8s linear infinite}
  [data-state=done] .check path{animation:draw .4s ease-out both}
  @keyframes turn{to{transform:rotate(360deg)}}
  @keyframes draw{from{stroke-dashoffset:1}}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
