<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type Panel = 'ws' | 'bell' | 'me';

const NOTES = [
  { id: 1, text: 'Ana comentó en Rediseño', when: 'Hace 5 min' },
  { id: 2, text: 'Se completó la tarea «Facturas»', when: 'Hace 1 h' },
  { id: 3, text: 'Invitación aceptada por Marcos', when: 'Ayer' },
];

const open = ref<Panel | null>(null);
const search = ref<HTMLInputElement | null>(null);
const wsBtn = ref<HTMLButtonElement | null>(null);
const bellBtn = ref<HTMLButtonElement | null>(null);
const meBtn = ref<HTMLButtonElement | null>(null);
const TRIGGERS = { ws: wsBtn, bell: bellBtn, me: meBtn };

const toggle = (panel: Panel) => {
  open.value = open.value === panel ? null : panel;
};

function closeWithEscape() {
  if (!open.value) return;
  TRIGGERS[open.value].value?.focus();
  open.value = null;
}

function onDocumentClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.wrap')) open.value = null;
}

function onDocumentKey(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    search.value?.focus();
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onDocumentKey);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onDocumentKey);
});
</script>

<template>
  <div class="page" @keydown.esc="closeWithEscape">
    <header class="bar">
      <a class="brand" href="#"><i aria-hidden="true">N</i><span>Nimbo</span></a>
      <div class="wrap">
        <button
          ref="wsBtn"
          class="ws"
          type="button"
          :aria-expanded="open === 'ws'"
          aria-controls="ws-pop"
          aria-label="Espacio de trabajo: Equipo Nimbo"
          @click="toggle('ws')"
        >
          <span class="ws-mark" aria-hidden="true">E</span>
          <span class="ws-name" aria-hidden="true">Equipo Nimbo</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div id="ws-pop" class="pop start" :hidden="open !== 'ws'">
          <p class="pop-title">Espacios de trabajo</p>
          <ul>
            <li><button type="button" aria-current="true">Equipo Nimbo <span>Activo</span></button></li>
            <li><button type="button">Marketing</button></li>
            <li><button type="button">Clientes beta</button></li>
          </ul>
        </div>
      </div>
      <label class="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
        <input id="q" ref="search" type="search" placeholder="Buscar proyectos" aria-label="Buscar proyectos" autocomplete="off" />
        <kbd>Ctrl K</kbd>
      </label>
      <div class="wrap">
        <button
          ref="bellBtn"
          class="icon-btn"
          type="button"
          :aria-expanded="open === 'bell'"
          aria-controls="bell-pop"
          :aria-label="`Notificaciones, ${NOTES.length} sin leer`"
          @click="toggle('bell')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
          <span class="count" aria-hidden="true">{{ NOTES.length }}</span>
        </button>
        <div id="bell-pop" class="pop end" :hidden="open !== 'bell'">
          <p class="pop-title">Notificaciones</p>
          <ul class="notes">
            <li v-for="n in NOTES" :key="n.id"><span class="dot" aria-hidden="true"></span><div><b>{{ n.text }}</b><span>{{ n.when }}</span></div></li>
          </ul>
        </div>
      </div>
      <div class="wrap">
        <button
          ref="meBtn"
          class="avatar-btn"
          type="button"
          :aria-expanded="open === 'me'"
          aria-controls="me-pop"
          aria-label="Cuenta de Lucía Ferrer"
          @click="toggle('me')"
        >
          <span class="avatar" aria-hidden="true">LF</span>
        </button>
        <div id="me-pop" class="pop end" :hidden="open !== 'me'">
          <div class="me"><span class="avatar lg" aria-hidden="true">LF</span><div><b>Lucía Ferrer</b><span>lucia@nimbo.app</span></div></div>
          <ul>
            <li><button type="button">Mi perfil</button></li>
            <li><button type="button">Preferencias</button></li>
            <li><button type="button" class="danger">Cerrar sesión</button></li>
          </ul>
        </div>
      </div>
    </header>
    <main class="content">
      <h1>Proyectos</h1>
      <p>Ocho proyectos activos esta semana. Pulsa Ctrl K para encontrar uno.</p>
    </main>
  </div>
</template>

<style scoped>
.page{overflow:hidden;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.bar{position:relative;display:flex;align-items:center;gap:8px;height:56px;padding:0 12px;background:var(--surface);border-bottom:1px solid var(--border)}
.brand{display:flex;align-items:center;gap:8px;flex:none;font-weight:700;color:var(--text);text-decoration:none}
.brand i,.avatar{display:grid;place-items:center;color:var(--accent-ink);background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff))}
.brand i{width:26px;height:26px;border-radius:min(var(--radius),6px);font:700 13px/1 system-ui,sans-serif;font-style:normal}
.wrap{display:flex}
.ws{display:flex;align-items:center;gap:6px;flex:none;height:34px;margin-left:4px;padding:0 8px 0 4px;font:inherit;font-weight:600;color:var(--text);background:none;border:1px solid transparent;border-radius:var(--radius);cursor:pointer}
.ws:hover,.ws[aria-expanded=true]{background:var(--accent-soft)}
.ws-mark{display:grid;place-items:center;width:22px;height:22px;border-radius:min(var(--radius),6px);background:var(--accent);color:var(--accent-ink);font-size:12px;font-weight:700}
.ws svg,.search svg,.icon-btn svg{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.ws svg{width:14px;height:14px;color:var(--muted)}
.search{display:flex;align-items:center;gap:8px;flex:0 1 240px;height:36px;margin-left:auto;padding:0 8px;color:var(--muted);background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);cursor:text}
.search:focus-within{outline:2px solid var(--accent);outline-offset:2px}
.search svg{flex:none;width:16px;height:16px}
.search input{flex:1;min-width:0;padding:0;font:inherit;color:var(--text);border:0;background:none;outline:0}
.search input::placeholder{color:var(--muted)}
kbd{flex:none;padding:0 6px;font:12px/18px ui-monospace,"Cascadia Code",Menlo,monospace;color:var(--muted);border:1px solid var(--border);border-radius:min(var(--radius),4px)}
.icon-btn{position:relative;display:grid;place-items:center;flex:none;width:36px;height:36px;padding:0;color:var(--muted);background:none;border:0;border-radius:var(--radius);cursor:pointer}
.icon-btn:hover,.icon-btn[aria-expanded=true]{color:var(--text);background:var(--accent-soft)}
.icon-btn svg{width:18px;height:18px;stroke-linejoin:round}
.count{position:absolute;top:2px;right:2px;min-width:16px;height:16px;padding:0 4px;display:grid;place-items:center;font-size:11px;font-weight:700;line-height:1;color:var(--accent-ink);background:var(--err);border-radius:999px;box-shadow:0 0 0 2px var(--surface)}
.avatar-btn{flex:none;padding:0;background:none;border:0;border-radius:999px;cursor:pointer}
.avatar{width:32px;height:32px;border-radius:999px;font-size:12px;font-weight:700}
.avatar.lg{width:40px;height:40px;font-size:14px}
.avatar-btn[aria-expanded=true] .avatar{box-shadow:0 0 0 2px var(--surface),0 0 0 4px var(--accent)}
.pop{position:absolute;top:calc(100% + 6px);z-index:3;width:min(280px,calc(100% - 24px));padding:6px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.pop.start{left:12px}
.pop.end{right:12px}
.pop-title{margin:4px 8px 6px;font-size:12px;font-weight:600;color:var(--muted)}
.pop ul{display:grid;gap:2px;margin:0;padding:0;list-style:none}
.pop button{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:8px;font:inherit;text-align:left;color:var(--text);background:none;border:0;border-radius:min(var(--radius),6px);cursor:pointer}
.pop button:hover{background:var(--accent-soft)}
.pop [aria-current=true]{color:var(--accent);font-weight:600}
.pop [aria-current=true] span{font-size:12px;font-weight:500}
.notes li{display:flex;gap:10px;padding:8px;border-radius:min(var(--radius),6px)}
.notes li:hover{background:var(--bg)}
.notes b,.me b{display:block}
.notes b{font-weight:600}
.notes span,.me span{font-size:12px;color:var(--muted)}
.dot{flex:none;width:8px;height:8px;margin-top:6px;border-radius:50%;background:var(--accent)}
.me{display:flex;align-items:center;gap:10px;padding:8px}
.pop .danger{color:var(--err)}
.content{padding:16px 12px;background:var(--surface)}
h1{margin:0 0 4px;font-size:1.15rem;font-weight:600;letter-spacing:-.01em}
.content p{margin:0;color:var(--muted)}
@media (max-width:479px){
  .brand span,.ws-name,kbd{display:none}
  .search{flex:none;width:36px;margin-left:auto;padding:0;justify-content:center;background:none;border-color:transparent;cursor:pointer}
  .search input{width:0;flex:none}
  .search:focus-within{position:absolute;top:10px;left:12px;right:12px;z-index:2;width:auto;padding:0 8px;background:var(--bg);border-color:var(--border)}
  .search:focus-within input{width:auto;flex:1}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
