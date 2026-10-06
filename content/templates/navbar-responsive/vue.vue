<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

type NavLink = { label: string; href: string };
withDefaults(defineProps<{ brand?: string; links?: NavLink[]; cta?: NavLink }>(), {
  brand: 'Tinta&Co',
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
.nav { position:relative; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 14px; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; font:14px/1.5 system-ui, sans-serif; color:#17130f; }
a, button { font:inherit; color:inherit; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
.brand { font-weight:800; font-size:1.15rem; letter-spacing:-.02em; text-decoration:none; }
.menu { display:flex; align-items:center; gap:14px; }
.menu ul { display:flex; gap:4px; margin:0; padding:0; list-style:none; }
.menu a:not(.btn) { display:block; padding:6px 10px; border-radius:8px; font-weight:600; text-decoration:none; }
.menu a:not([aria-current]):not(.btn):hover { background:#ffd84d; }
.menu a[aria-current] { background:#17130f; color:#fffdf8; }
.btn { padding:8px 14px; border:2px solid #17130f; border-radius:10px; background:#ff5a36; font-weight:700; text-decoration:none; box-shadow:2px 2px 0 #17130f; }
.burger { display:none; position:relative; width:44px; height:44px; border:2px solid #17130f; border-radius:10px; background:#ffd84d; cursor:pointer; }
.burger span, .burger span::before, .burger span::after { position:absolute; left:0; right:0; height:2px; background:#17130f; content:""; transition:transform .2s; }
.burger span { top:50%; left:9px; right:9px; margin-top:-1px; }
.burger span::before { transform:translateY(-7px); }
.burger span::after { transform:translateY(7px); }
.burger[aria-expanded="true"] span { background:transparent; }
.burger[aria-expanded="true"] span::before { transform:rotate(45deg); }
.burger[aria-expanded="true"] span::after { transform:rotate(-45deg); }
@media (max-width:560px) {
  .burger { display:block; }
  .menu { display:none; position:absolute; top:calc(100% + 8px); left:0; right:0; z-index:2; flex-direction:column; align-items:stretch; padding:10px; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; }
  .menu.open { display:flex; }
  .menu ul { flex-direction:column; }
  .btn { text-align:center; }
}
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
</style>
