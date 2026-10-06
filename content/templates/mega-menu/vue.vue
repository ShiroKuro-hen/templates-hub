<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

type Column = { title: string; links: { label: string; desc: string; href: string }[] };
defineProps<{ columns: Column[]; feature: { title: string; text: string; cta: string; href: string } }>();

const open = ref(false);
const nav = ref<HTMLElement>();
const btn = ref<HTMLButtonElement>();
const panel = ref<HTMLDivElement>();

async function enter() {
  open.value = true;
  await nextTick();
  panel.value?.querySelector('a')?.focus();
}
function close() {
  if (!open.value) return;
  open.value = false;
  btn.value?.focus();
}
function onFocusOut(e: FocusEvent) {
  const t = e.relatedTarget as Node | null;
  if (t && t !== btn.value && !panel.value?.contains(t)) open.value = false; // Tab fuera del panel
}
const onDoc = (e: MouseEvent) => { if (!nav.value?.contains(e.target as Node)) open.value = false; };
onMounted(() => document.addEventListener('click', onDoc));
onBeforeUnmount(() => document.removeEventListener('click', onDoc));
</script>

<template>
  <nav ref="nav" aria-label="Principal" @keydown.esc="close" @focusout="onFocusOut">
    <span class="brand">Ion Cloud</span>
    <ul>
      <li>
        <button ref="btn" type="button" class="top" :aria-expanded="open" aria-controls="panel"
                @click="open = !open" @keydown.down.prevent="enter">
          Productos
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 4.5l3 3 3-3" /></svg>
        </button>
        <div v-show="open" id="panel" ref="panel" class="panel">
          <div v-for="(c, i) in columns" :key="c.title">
            <h3 :id="`col-${i}`">{{ c.title }}</h3>
            <ul :aria-labelledby="`col-${i}`">
              <li v-for="l in c.links" :key="l.label"><a :href="l.href">{{ l.label }}<span>{{ l.desc }}</span></a></li>
            </ul>
          </div>
          <div class="feature">
            <div class="line" aria-hidden="true" />
            <strong>{{ feature.title }}</strong>
            <p>{{ feature.text }}</p>
            <a :href="feature.href">{{ feature.cta }}</a>
          </div>
        </div>
      </li>
      <li><a class="top" href="#">Precios</a></li>
      <li><a class="top" href="#">Documentación</a></li>
    </ul>
  </nav>
</template>

<style scoped>
nav{position:relative;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 12px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.brand{margin-right:12px;font-weight:700}
nav>ul{display:flex;flex-wrap:wrap;gap:4px;margin:0;padding:0;list-style:none}
.top{display:flex;align-items:center;gap:6px;padding:8px 12px;font:inherit;font-weight:500;color:var(--text);text-decoration:none;background:none;border:0;border-radius:6px;cursor:pointer;transition:background .14s}
.top:hover,.top[aria-expanded=true]{background:var(--accent-soft);color:var(--accent)}
.top svg{transition:transform .14s}
.top[aria-expanded=true] svg{transform:rotate(180deg)}
a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.panel{position:absolute;left:0;right:0;top:calc(100% + 8px);z-index:10;display:grid;grid-template-columns:repeat(3,1fr) 1.2fr;gap:24px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
h3{margin:0 0 8px;font-size:12px;font-weight:600;color:var(--muted)}
.panel ul{display:grid;gap:2px;margin:0;padding:0;list-style:none}
.panel a{display:block;padding:8px;margin:0 -8px;color:var(--text);text-decoration:none;border-radius:6px;transition:background .14s}
.panel a:hover{background:var(--accent-soft)}
.panel a span{display:block;color:var(--muted);font-size:13px}
.feature{padding:16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg)}
.feature .line{height:2px;width:40px;margin-bottom:12px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.feature p{margin:4px 0 12px;color:var(--muted)}
.feature a,.feature a:hover{display:inline-block;margin:0;padding:6px 12px;font-weight:600;color:var(--accent-ink);background:var(--accent)}
@media (max-width:760px){.panel{grid-template-columns:1fr 1fr}}
@media (max-width:480px){.panel{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
