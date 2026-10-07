<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const links = ['Guías', 'Referencia API', 'Cambios', 'Estado'];
const open = ref(false);
const q = ref('');
const msg = ref('Pulsa / para buscar. Esc cierra el buscador.');
const input = ref<HTMLInputElement>();
const toggle = ref<HTMLButtonElement>();

async function set(v: boolean) {
  open.value = v;
  if (v) { await nextTick(); input.value?.focus(); } else q.value = '';
}
function onDoc(e: KeyboardEvent) {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName ?? '')) { e.preventDefault(); set(true); }
}
function onEsc() { set(false); toggle.value?.focus(); }
function submit() {
  const v = q.value.trim();
  msg.value = v ? `Mostrando resultados para «${v}».` : 'Escribe qué quieres buscar, por ejemplo «webhooks».';
}
onMounted(() => document.addEventListener('keydown', onDoc));
onBeforeUnmount(() => document.removeEventListener('keydown', onDoc));
</script>

<template>
  <nav class="nav" :class="{ searching: open }" aria-label="Principal">
    <a class="brand" href="#inicio"><i aria-hidden="true" /><span>Nimbo Docs</span></a>
    <ul class="links">
      <li v-for="(l, i) in links" :key="l"><a :href="`#${l.toLowerCase()}`" :aria-current="i === 0 ? 'page' : undefined">{{ l }}</a></li>
    </ul>
    <form class="s" :class="{ open }" role="search" @submit.prevent="submit">
      <button ref="toggle" type="button" aria-label="Buscar" :aria-expanded="open" aria-controls="q" aria-keyshortcuts="/" @click="set(!open)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
      </button>
      <input id="q" ref="input" v-model="q" type="search" name="q" placeholder="Buscar en la documentación"
             aria-label="Buscar en la documentación" autocomplete="off" @keydown.esc="onEsc">
    </form>
  </nav>
  <p class="res" role="status">{{ msg }}</p>
</template>

<style scoped>
.nav{display:flex;align-items:center;gap:16px;max-width:900px;margin:0 auto;padding:0 12px 0 16px;height:56px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.brand{display:flex;align-items:center;gap:8px;font-weight:700;color:var(--text);text-decoration:none;white-space:nowrap}
.brand i{width:22px;height:22px;border-radius:6px;background:var(--accent)}
.links{display:flex;gap:4px;margin:0;padding:0;list-style:none;min-width:0;overflow-x:auto}
.links a{display:block;padding:6px 12px;border-radius:var(--radius);color:var(--muted);text-decoration:none;white-space:nowrap;transition:background .14s,color .14s}
.links a:hover{background:var(--accent-soft);color:var(--text)}
.links a[aria-current=page]{background:var(--accent-soft);color:var(--text);font-weight:600}
a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.s{position:relative;display:flex;align-items:center;margin-left:auto;border:1px solid transparent;border-radius:var(--radius);transition:border-color .14s,background .14s}
.s.open{border-color:var(--border);background:var(--bg)}
.s::after{content:"";position:absolute;left:8px;right:8px;bottom:-1px;height:2px;border-radius:999px;background:linear-gradient(90deg,#22d3ee,#2f5bff);transform:scaleX(0);transition:transform .16s}
.s.open:focus-within::after{transform:scaleX(1)}
.s button{display:grid;place-items:center;width:34px;height:34px;padding:0;border:0;border-radius:var(--radius);background:none;color:var(--muted);cursor:pointer}
.s button:hover{color:var(--text)}
.s svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.s input{width:0;padding:0;border:0;background:none;color:var(--text);font:inherit;visibility:hidden;transition:width .16s,padding .16s,visibility .16s}
.s.open input{width:min(220px,calc(100vw - 190px));padding:0 8px 0 0;visibility:visible}
.s input:focus-visible{outline:0}
.s input::-webkit-search-cancel-button{display:none}
.res{max-width:900px;margin:16px auto 0;color:var(--muted);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
@media (max-width:560px){.searching .links,.searching .brand span{display:none}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
