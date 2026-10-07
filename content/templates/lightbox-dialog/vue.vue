<script setup lang="ts">
import { nextTick, ref } from 'vue';

const nodos = [
  { x: 10, y: 100, w: 80, t: 'Cliente', s: 'Web y móvil', g: false }, { x: 140, y: 100, w: 100, t: 'API Gateway', s: 'Autenticación', g: true },
  { x: 300, y: 20, w: 90, t: 'Usuarios', s: '12 ms', g: false }, { x: 300, y: 100, w: 90, t: 'Pagos', s: '48 ms', g: false }, { x: 300, y: 180, w: 90, t: 'Informes', s: '120 ms', g: false },
];
const lineas = ['M90 120H140', 'M240 120C270 120 270 40 300 40', 'M240 120H300', 'M240 120C270 120 270 200 300 200'];
const alt = 'Cliente, API Gateway y tres servicios: Usuarios, Pagos e Informes';

const dlg = ref<HTMLDialogElement | null>(null);
const view = ref<HTMLDivElement | null>(null);
const z = ref(100);
let drag: [number, number] | null = null;

async function zoom(v: number) {
  const el = view.value!;
  const rx = (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth, ry = (el.scrollTop + el.clientHeight / 2) / el.scrollHeight;
  z.value = Math.min(400, Math.max(100, v));
  await nextTick();
  el.scrollLeft = rx * el.scrollWidth - el.clientWidth / 2;
  el.scrollTop = ry * el.scrollHeight - el.clientHeight / 2;
}
function teclas(e: KeyboardEvent) {
  if (e.key === '+' || e.key === '=') zoom(z.value + 25);
  else if (e.key === '-') zoom(z.value - 25);
  else if (e.key === '0') zoom(100);
}
function abajo(e: PointerEvent) {
  const el = view.value!;
  if (e.pointerType !== 'mouse') return;
  drag = [e.clientX + el.scrollLeft, e.clientY + el.scrollTop];
  el.setPointerCapture(e.pointerId);
}
function mover(e: PointerEvent) {
  if (drag) { view.value!.scrollLeft = drag[0] - e.clientX; view.value!.scrollTop = drag[1] - e.clientY; }
}
</script>

<template>
  <svg width="0" height="0" aria-hidden="true" style="position:absolute">
    <defs>
      <linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient>
      <marker id="ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" style="fill:var(--muted)" /></marker>
      <symbol id="diag" viewBox="0 0 400 240">
        <g v-for="n in nodos" :key="n.t">
          <rect :class="n.g ? 'g' : 'n'" :x="n.x" :y="n.y" :width="n.w" height="40" rx="8" />
          <text class="t" :x="n.x + n.w / 2" :y="n.y + 18" text-anchor="middle">{{ n.t }}</text>
          <text class="s" :x="n.x + n.w / 2" :y="n.y + 31" text-anchor="middle">{{ n.s }}</text>
        </g>
        <path v-for="d in lineas" :key="d" class="l" :d="d" />
      </symbol>
    </defs>
  </svg>
  <div class="card">
    <h1>Arquitectura del servicio</h1>
    <p>Cómo viaja una solicitud desde el cliente hasta cada servicio.</p>
    <button class="thumb" type="button" aria-label="Ampliar diagrama de arquitectura" @click="dlg?.showModal(); zoom(100)">
      <svg viewBox="0 0 400 240" role="img" :aria-label="alt"><use href="#diag" width="400" height="240" /></svg><span>Ampliar</span>
    </button>
  </div>
  <dialog ref="dlg" aria-labelledby="lb-titulo" @keydown="teclas" @click="$event.target === dlg && dlg?.close()">
    <div class="hd"><h2 id="lb-titulo">Arquitectura del servicio</h2><button class="btn" type="button" aria-label="Cerrar" @click="dlg?.close()">×</button></div>
    <div ref="view" class="view" tabindex="0" role="region" aria-label="Diagrama ampliado. Usa las flechas para desplazarte."
         @pointerdown="abajo" @pointermove="mover" @pointerup="drag = null" @pointercancel="drag = null">
      <svg viewBox="0 0 400 240" role="img" :aria-label="alt" :style="{ width: z + '%' }"><use href="#diag" width="400" height="240" /></svg>
    </div>
    <div class="bar">
      <button class="btn" type="button" aria-label="Alejar" @click="zoom(z - 25)">−</button>
      <input type="range" min="100" max="400" step="25" :value="z" aria-label="Nivel de zoom" @input="zoom(+($event.target as HTMLInputElement).value)">
      <button class="btn" type="button" aria-label="Acercar" @click="zoom(z + 25)">+</button>
      <output aria-live="polite">{{ z }} %</output>
      <button class="btn" type="button" @click="zoom(100)">Restablecer</button>
    </div>
  </dialog>
</template>

<style scoped>
.card{max-width:420px;margin:0 auto;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card h1{margin:0 0 2px;font-size:16px;font-weight:600}
.card p{margin:0 0 12px;color:var(--muted)}
.thumb{position:relative;display:block;width:100%;padding:8px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);cursor:zoom-in;transition:border-color .14s}
.thumb:hover{border-color:var(--accent)}
.thumb svg{display:block;width:100%;height:auto}
.thumb span{position:absolute;right:8px;bottom:8px;padding:2px 10px;border:1px solid var(--border);border-radius:999px;background:var(--surface);color:var(--text);font-size:12px;font-weight:600}
.n{fill:var(--surface);stroke:var(--border)}
.g{fill:var(--accent-soft);stroke:url(#gr);stroke-width:1.5}
.t{fill:var(--text);font:600 11px system-ui,sans-serif}
.s{fill:var(--muted);font:10px system-ui,sans-serif}
.l{fill:none;stroke:var(--muted);stroke-width:1;marker-end:url(#ah)}
dialog{box-sizing:border-box;width:min(92vw,820px);padding:0;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;opacity:0;transform:scale(.98);transition:opacity .14s,transform .14s,overlay .14s allow-discrete,display .14s allow-discrete}
dialog[open]{opacity:1;transform:none}
@starting-style{dialog[open]{opacity:0;transform:scale(.98)}}
dialog::backdrop{background:rgba(14,23,38,.55)}
.hd{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border)}
.hd h2{margin:0;font-size:16px;font-weight:600}
.view{height:min(56vh,420px);overflow:auto;margin:16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg)}
.view svg{display:block;width:100%;height:auto}
.view:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:0 16px 16px}
.bar input{flex:1;min-width:120px;accent-color:var(--accent)}
.bar output{min-width:3.5em;text-align:right;font-weight:600;font-variant-numeric:tabular-nums}
.btn{min-width:36px;height:36px;padding:0 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;cursor:pointer;transition:border-color .14s}
.btn:hover{border-color:var(--accent)}
.btn:focus-visible,.bar input:focus-visible,.thumb:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
