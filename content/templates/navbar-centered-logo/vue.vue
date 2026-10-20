<script setup lang="ts">
import { ref } from 'vue';

const LEFT = ['Inicio', 'Productos'];
const RIGHT = ['Precios', 'Contacto'];
const open = ref(false);
const current = ref('Inicio');
const burger = ref<HTMLButtonElement | null>(null);

function choose(label: string) {
  current.value = label;
  open.value = false;
}

function closeWithEscape() {
  if (!open.value) return;
  open.value = false;
  burger.value?.focus();
}
</script>

<template>
  <div class="page" @keydown.esc="closeWithEscape">
    <header class="bar">
      <a class="brand" href="#"><i aria-hidden="true"></i>Nexo</a>
      <button
        ref="burger"
        type="button"
        class="burger"
        :aria-expanded="open"
        aria-controls="menu"
        :aria-label="open ? 'Cerrar menú' : 'Abrir menú'"
        @click="open = !open"
      >
        <svg class="m" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        <svg class="x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <nav id="menu" :class="['menu', { open }]" aria-label="Principal">
        <ul class="l">
          <li v-for="label in LEFT" :key="label">
            <a href="#" :aria-current="label === current ? 'page' : undefined" @click.prevent="choose(label)">{{ label }}</a>
          </li>
        </ul>
        <ul class="r">
          <li v-for="label in RIGHT" :key="label">
            <a href="#" :aria-current="label === current ? 'page' : undefined" @click.prevent="choose(label)">{{ label }}</a>
          </li>
          <li><a class="btn" href="#">Crear cuenta</a></li>
        </ul>
      </nav>
    </header>
    <main class="content">
      <h1>{{ current }}</h1>
      <p>En pantallas estrechas, el botón abre el menú a ancho completo. Esc lo cierra y el foco vuelve al botón.</p>
    </main>
  </div>
</template>

<style scoped>
.page { overflow:hidden; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
.bar { position:relative; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:8px; height:64px; padding:0 12px; border-bottom:1px solid var(--border); }
.brand { grid-column:2; grid-row:1; display:flex; align-items:center; gap:8px; font-weight:700; color:var(--text); text-decoration:none; white-space:nowrap; }
.brand i { width:24px; height:24px; border-radius:min(var(--radius),6px); background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff)); }
.burger { grid-column:3; grid-row:1; justify-self:end; position:relative; display:grid; place-items:center; width:40px; height:40px; padding:0; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; }
.burger svg { width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; }
.burger .x { display:none; }
.burger[aria-expanded=true] .x { display:block; }
.burger[aria-expanded=true] .m { display:none; }
.menu { display:none; }
.menu.open { display:block; position:absolute; top:100%; left:0; right:0; z-index:2; padding:8px; background:var(--surface); border-bottom:1px solid var(--border); box-shadow:var(--shadow); }
.menu ul { display:flex; flex-direction:column; gap:2px; margin:0; padding:0; list-style:none; }
.menu a:not(.btn) { display:block; padding:8px 12px; border-radius:var(--radius); color:var(--muted); font-weight:500; text-decoration:none; transition:background .14s, color .14s; }
.menu a:not(.btn):hover { color:var(--text); background:var(--bg); }
.menu a[aria-current] { color:var(--accent); background:var(--accent-soft); font-weight:600; }
.btn { display:block; padding:8px 14px; border-radius:var(--radius); background:var(--accent); color:var(--accent-ink); font-weight:600; text-align:center; text-decoration:none; }
.btn:hover { filter:brightness(1.1); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.content { min-height:260px; padding:24px 20px; }
h1 { margin:0 0 4px; font-size:1.4rem; font-weight:600; letter-spacing:-.01em; }
.content p { margin:0; max-width:46ch; color:var(--muted); }
@media (min-width:640px) {
  .burger { display:none; }
  .menu, .menu.open { display:contents; }
  .menu ul { flex-direction:row; gap:4px; }
  .menu .l { grid-column:1; grid-row:1; justify-self:end; }
  .menu .r { grid-column:3; grid-row:1; justify-self:start; }
  .menu a:not(.btn) { padding:6px 12px; }
}
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
</style>
