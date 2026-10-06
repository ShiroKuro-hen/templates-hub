<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits<{ (e: 'try'): void }>();
const mejoras = ['Elige día y hora de envío.', 'Añade a quien quieras como destinatario.', 'Exporta en PDF o CSV.'];
const dlg = ref<HTMLDialogElement>();
const status = ref('');

onMounted(() => dlg.value?.showModal());
function onClose() {
  const probar = dlg.value?.returnValue === 'try';
  status.value = probar ? 'Abriendo informes programados.' : '';
  if (probar) emit('try');
  if (dlg.value) dlg.value.returnValue = '';
}
</script>

<template>
  <div class="root">
    <button type="button" class="btn" @click="dlg?.showModal()">Ver novedades <span class="pill">Nuevo</span></button>
    <p id="st" role="status">{{ status }}</p>
    <dialog ref="dlg" aria-labelledby="ttl" aria-describedby="desc" @click.self="dlg?.close()" @close="onClose">
      <figure>
        <svg viewBox="0 0 440 150" aria-hidden="true">
          <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
          <rect width="440" height="150" style="fill: var(--accent-soft)" />
          <g transform="translate(56 24)">
            <rect width="170" height="104" rx="8" style="fill: var(--surface); stroke: var(--border)" />
            <rect x="18" y="58" width="22" height="30" rx="3" style="fill: var(--accent-soft)" />
            <rect x="50" y="42" width="22" height="46" rx="3" style="fill: var(--accent-soft)" />
            <rect x="82" y="26" width="22" height="62" rx="3" fill="url(#g)" />
            <rect x="114" y="48" width="22" height="40" rx="3" style="fill: var(--accent-soft)" />
          </g>
          <path d="M226 76h24" fill="none" style="stroke: var(--accent); stroke-dasharray: 3 3" />
          <g transform="translate(250 44)">
            <rect width="134" height="64" rx="8" style="fill: var(--surface); stroke: var(--border)" />
            <circle cx="26" cy="32" r="12" fill="url(#g)" />
            <text x="46" y="48" font-size="11" style="fill: var(--muted)">Lunes, 08:00</text>
          </g>
        </svg>
      </figure>
      <button type="button" class="x" aria-label="Cerrar" @click="dlg?.close()">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 3l8 8M11 3l-8 8" /></svg>
      </button>
      <div class="body">
        <span class="pill">Novedad</span>
        <h2 id="ttl">Informes programados</h2>
        <p id="desc">Recibe tus paneles por correo sin abrir la aplicación.</p>
        <ul>
          <li v-for="m in mejoras" :key="m">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" /></svg>{{ m }}
          </li>
        </ul>
      </div>
      <form method="dialog">
        <button class="btn" value="later">Más tarde</button>
        <button class="btn main" value="try" autofocus>Probar ahora</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.root{color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.btn{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 16px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;font-weight:500;cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn.main{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.pill{padding:0 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600}
#st{margin:12px 0 0;color:var(--muted)}
dialog{width:min(440px,calc(100vw - 32px));padding:0;overflow:hidden;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
dialog[open]{animation:in .16s ease-out}
dialog::backdrop{background:color-mix(in srgb,var(--text) 45%,transparent)}
@keyframes in{from{opacity:0;transform:translateY(6px)}}
figure{margin:0;border-bottom:1px solid var(--border)}
figure svg{display:block;width:100%;height:auto}
.x{position:absolute;top:10px;right:10px;display:grid;place-items:center;width:32px;height:32px;padding:0;background:var(--surface);color:var(--muted);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer}
.body{padding:20px}
.body .pill{display:inline-block}
h2{margin:8px 0 4px;font-size:18px;font-weight:600}
.body p{margin:0;color:var(--muted)}
ul{margin:16px 0 0;padding:0;list-style:none;display:grid;gap:8px}
li{display:flex;gap:8px;align-items:flex-start}
li svg{flex:none;margin-top:3px;color:var(--ok)}
form{display:flex;justify-content:flex-end;gap:8px;padding:0 20px 20px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
