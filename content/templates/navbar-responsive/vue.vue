<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

type NavLink = { label: string; href: string };
withDefaults(defineProps<{ brand?: string; links?: NavLink[]; cta?: NavLink }>(), {
  brand: 'Nexo',
  links: () => [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Productos', href: '#productos' },
    { label: 'Precios', href: '#precios' },
    { label: 'Contacto', href: '#contacto' },
  ],
  cta: () => ({ label: 'Crear cuenta', href: '#registro' }),
});

const open = ref(false);
const current = ref('#inicio');
const burger = ref<HTMLButtonElement | null>(null);

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') { open.value = false; burger.value?.focus(); }
};
onMounted(() => addEventListener('keydown', onKey));
onUnmounted(() => removeEventListener('keydown', onKey));
</script>

<template>
  <header class="nav">
    <a class="brand" href="/">{{ brand }}</a>
    <button ref="burger" class="burger" type="button" :aria-expanded="open" aria-controls="menu"
            :aria-label="open ? 'Cerrar menú' : 'Abrir menú'" @click="open = !open">
      <span />
    </button>
    <nav id="menu" :class="['menu', { open }]" aria-label="Principal">
      <ul>
        <li v-for="l in links" :key="l.href">
          <a :href="l.href" :aria-current="l.href === current ? 'page' : undefined"
             @click="current = l.href; open = false">{{ l.label }}</a>
        </li>
      </ul>
      <a class="btn" :href="cta.href">{{ cta.label }}</a>
    </nav>
  </header>
</template>

<style scoped>
.nav { position:relative; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:8px 14px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); font:14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color:var(--text); }
a, button { font:inherit; color:inherit; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.brand { font-weight:700; font-size:1.1rem; letter-spacing:-.01em; text-decoration:none; }
.menu { display:flex; align-items:center; gap:14px; }
.menu ul { display:flex; gap:4px; margin:0; padding:0; list-style:none; }
.menu a:not(.btn) { position:relative; display:block; padding:6px 10px; border-radius:var(--radius); color:var(--muted); font-weight:500; text-decoration:none; transition:background .14s, color .14s; }
.menu a:not([aria-current]):not(.btn):hover { color:var(--text); background:var(--bg); }
.menu a[aria-current] { color:var(--accent); background:var(--accent-soft); }
.menu a[aria-current]::after { content:""; position:absolute; left:10px; right:10px; bottom:2px; height:2px; border-radius:2px; background:linear-gradient(135deg,#22d3ee,#2f5bff); }
.btn { padding:7px 14px; border-radius:var(--radius); background:var(--accent); color:var(--accent-ink); font-weight:600; text-decoration:none; transition:filter .14s; }
.btn:hover { filter:brightness(1.1); }
.burger { display:none; position:relative; width:40px; height:40px; border:1px solid var(--border); border-radius:var(--radius); background:var(--surface); cursor:pointer; }
.burger span, .burger span::before, .burger span::after { position:absolute; left:0; right:0; height:2px; border-radius:2px; background:var(--text); content:""; transition:transform .14s; }
.burger span { top:50%; left:11px; right:11px; margin-top:-1px; }
.burger span::before { transform:translateY(-6px); }
.burger span::after { transform:translateY(6px); }
.burger[aria-expanded="true"] span { background:transparent; }
.burger[aria-expanded="true"] span::before { transform:rotate(45deg); }
.burger[aria-expanded="true"] span::after { transform:rotate(-45deg); }
@media (max-width:560px) {
  .burger { display:block; }
  .menu { display:none; position:absolute; top:calc(100% + 8px); left:0; right:0; z-index:2; flex-direction:column; align-items:stretch; padding:10px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
  .menu.open { display:flex; }
  .menu ul { flex-direction:column; }
  .btn { text-align:center; }
}
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
