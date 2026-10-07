<script setup lang="ts">
import { ref } from 'vue';

const avisos = ref(3);
const items = ref(0);
const msg = ref('Prueba el aviso y el carrito: los contadores se actualizan.');

function leer() { avisos.value = 0; msg.value = 'Avisos marcados como leídos.'; }
function anadir() { items.value++; msg.value = `Producto añadido. Tienes ${items.value} en el carrito.`; }
</script>

<template>
  <section class="card" aria-labelledby="t">
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <symbol id="i-download" viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></symbol>
      <symbol id="i-next" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" /></symbol>
      <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></symbol>
      <symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /></symbol>
      <symbol id="i-cart" viewBox="0 0 24 24"><path d="M3 4h2l2.4 11h10.2L20 8H6.2" /><circle cx="9" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></symbol>
    </svg>
    <h2 id="t">Botones con icono</h2>
    <h3>Icono a la izquierda</h3>
    <div class="row">
      <button class="btn primary" type="button"><svg aria-hidden="true"><use href="#i-download" /></svg>Descargar informe</button>
      <button class="btn" type="button"><svg aria-hidden="true"><use href="#i-plus" /></svg>Nuevo proyecto</button>
    </div>
    <h3>Icono a la derecha</h3>
    <div class="row">
      <button class="btn primary next" type="button">Continuar<svg aria-hidden="true"><use href="#i-next" /></svg></button>
      <button class="btn ghost next" type="button">Ver detalles<svg aria-hidden="true"><use href="#i-next" /></svg></button>
    </div>
    <h3>Solo icono, con etiqueta accesible</h3>
    <div class="row">
      <button class="btn icon primary" type="button" aria-label="Crear proyecto" title="Crear proyecto"><svg aria-hidden="true"><use href="#i-plus" /></svg></button>
      <button class="btn icon" type="button" aria-label="Descargar" title="Descargar"><svg aria-hidden="true"><use href="#i-download" /></svg></button>
      <button class="btn icon ghost" type="button" aria-label="Siguiente" title="Siguiente"><svg aria-hidden="true"><use href="#i-next" /></svg></button>
    </div>
    <h3>Con badge</h3>
    <div class="row">
      <button class="btn icon" type="button" :aria-label="avisos ? `Avisos, ${avisos} sin leer` : 'Avisos, sin pendientes'" @click="leer">
        <svg aria-hidden="true"><use href="#i-bell" /></svg><span v-if="avisos" class="badge" aria-hidden="true">{{ avisos }}</span>
      </button>
      <button class="btn icon" type="button" :aria-label="`Carrito, ${items} ${items === 1 ? 'producto' : 'productos'}`">
        <svg aria-hidden="true"><use href="#i-cart" /></svg><span v-if="items" class="badge" aria-hidden="true">{{ items }}</span>
      </button>
      <button class="btn" type="button" @click="anadir"><svg aria-hidden="true"><use href="#i-plus" /></svg>Añadir al carrito</button>
    </div>
    <p id="msg" role="status">{{ msg }}</p>
  </section>
</template>

<style scoped>
.card{padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0 0 4px;font-size:18px}
h3{margin:20px 0 8px;font-size:14px;color:var(--muted);font-weight:600}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:12px}
.btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:36px;padding:0 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;font-weight:600;cursor:pointer;transition:background .14s,border-color .14s,filter .14s}
.btn:hover{background:var(--accent-soft);border-color:var(--accent)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn.primary:hover{background:var(--accent);filter:brightness(1.08)}
.btn.ghost{border-color:transparent;background:transparent}
.btn.ghost:hover{border-color:transparent}
.btn.icon{width:36px;padding:0}
.btn svg{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .14s}
.btn.next:hover svg{transform:translateX(2px)}
.badge{position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;padding:0 5px;box-sizing:border-box;border-radius:999px;background:var(--err);color:var(--accent-ink);font-size:11px;font-weight:700;line-height:18px;text-align:center;font-variant-numeric:tabular-nums;box-shadow:0 0 0 2px var(--surface)}
#msg{min-height:21px;margin:16px 0 0;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
