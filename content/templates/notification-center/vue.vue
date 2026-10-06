<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type Note = { id: number; title: string; time: string; read: boolean };
const items = ref<Note[]>([
  { id: 1, title: 'Despliegue completado en producción', time: 'Hace 5 min', read: false },
  { id: 2, title: 'Marta Ruiz te asignó la incidencia #482', time: 'Hace 32 min', read: false },
  { id: 3, title: 'Tu factura de septiembre está disponible', time: 'Hace 2 h', read: false },
  { id: 4, title: 'Se renovó el certificado SSL de api.ion.dev', time: 'Ayer', read: true },
]);
const open = ref(false);
const root = ref<HTMLElement>();
const bell = ref<HTMLButtonElement>();
const unread = computed(() => items.value.filter((n) => !n.read).length);

function markRead(id?: number) {
  items.value.forEach((n) => { if (id === undefined || n.id === id) n.read = true; });
}
function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && open.value) { open.value = false; bell.value?.focus(); } }
function onClick(e: MouseEvent) { if (!root.value?.contains(e.target as Node)) open.value = false; }
onMounted(() => { document.addEventListener('keydown', onKey); document.addEventListener('click', onClick); });
onBeforeUnmount(() => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); });
</script>

<template>
  <div ref="root" class="nc">
    <button ref="bell" class="bell" type="button" :aria-expanded="open" aria-controls="nc-panel"
            :aria-label="unread ? `Notificaciones, ${unread} sin leer` : 'Notificaciones, todo leído'" @click="open = !open">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      <span v-if="unread" class="count" aria-hidden="true">{{ unread }}</span>
    </button>
    <section v-show="open" id="nc-panel" class="panel" aria-labelledby="nc-title">
      <header>
        <h2 id="nc-title">Notificaciones</h2>
        <button class="link" type="button" :disabled="!unread" @click="markRead()">Marcar todo como leído</button>
      </header>
      <ul>
        <li v-for="n in items" :key="n.id">
          <button class="item" :class="{ unread: !n.read }" type="button" @click="markRead(n.id)">
            <span class="dot"><span v-if="!n.read" class="sr">Sin leer.</span></span>
            <strong>{{ n.title }}</strong><small>{{ n.time }}</small>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.nc{position:relative;display:inline-block;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.bell{position:relative;display:grid;place-items:center;width:36px;height:36px;border-radius:var(--radius);color:var(--muted);transition:background .14s,color .14s}
.bell:hover,.bell[aria-expanded=true]{background:var(--accent-soft);color:var(--text)}
.count{position:absolute;top:2px;right:0;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:999px;background:var(--accent);color:var(--accent-ink);font-size:10px;font-weight:600;line-height:16px;text-align:center;font-variant-numeric:tabular-nums}
.panel{position:absolute;right:0;top:calc(100% + 8px);z-index:10;width:min(360px,calc(100vw - 40px));background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.panel header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border)}
h2{margin:0;font-size:15px;font-weight:600}
.link{padding:2px 4px;border-radius:4px;color:var(--accent);font-weight:500}
.link:disabled{color:var(--muted);cursor:default}
ul{list-style:none;margin:0;padding:4px 0;max-height:300px;overflow:auto}
.item{display:grid;grid-template-columns:8px 1fr;gap:2px 12px;width:100%;padding:10px 16px;text-align:left;transition:background .14s}
.item:hover{background:var(--accent-soft)}
.item:focus-visible{outline-offset:-2px}
.dot{grid-row:span 2;width:8px;height:8px;margin-top:7px;border-radius:999px}
.unread .dot{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.item strong{font-weight:400}
.unread strong{font-weight:600}
.item small{color:var(--muted);font-size:12px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
