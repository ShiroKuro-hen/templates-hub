<script setup lang="ts">
import { ref } from 'vue';

const SECTIONS = [
  { title: 'Producto', links: ['Plataforma', 'Automatizaciones', 'Integraciones', 'Precios'] },
  { title: 'Soluciones', links: ['Equipos de marketing', 'Operaciones', 'Ingeniería', 'Ventas'] },
  { title: 'Recursos', links: ['Blog', 'Guías', 'Plantillas', 'Comunidad'] },
  { title: 'Empresa', links: ['Nosotros', 'Clientes', 'Empleo', 'Prensa'] },
  { title: 'Ayuda', links: ['Centro de ayuda', 'Estado del servicio', 'Contacto', 'API'] },
];

const open = ref<string[]>([]);

function toggle(title: string) {
  open.value = open.value.includes(title) ? open.value.filter((t) => t !== title) : [...open.value, title];
}
</script>

<template>
  <footer>
    <div class="head">
      <a class="brand" href="#inicio" aria-label="Nimbo, inicio"><span aria-hidden="true">N</span>Nimbo</a>
      <a class="status" href="#estado"><span class="dot" aria-hidden="true" />Todos los sistemas operativos</a>
    </div>
    <nav class="map" aria-label="Mapa del sitio">
      <div v-for="section in SECTIONS" :key="section.title" class="col">
        <h3 class="col-title">{{ section.title }}</h3>
        <h2 class="col-head">
          <button
            type="button"
            class="toggle"
            :aria-expanded="open.includes(section.title)"
            :aria-controls="`map-${section.title}`"
            @click="toggle(section.title)"
          >
            {{ section.title }}
          </button>
        </h2>
        <ul class="panel" :id="`map-${section.title}`" :hidden="!open.includes(section.title)">
          <li v-for="link in section.links" :key="link"><a href="#">{{ link }}</a></li>
        </ul>
      </div>
    </nav>
    <div class="base">
      <p>© 2026 Nimbo Software, S.L. Todos los derechos reservados.</p>
      <ul>
        <li><a href="#">Privacidad</a></li>
        <li><a href="#">Términos</a></li>
        <li><a href="#">Cookies</a></li>
        <li><a href="#">Accesibilidad</a></li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
footer { max-width:1100px; margin:0 auto; overflow:hidden; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
a { color:var(--muted); text-decoration:none; }
a:hover { color:var(--text); text-decoration:underline; text-underline-offset:3px; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.head { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:14px 20px; padding:24px 16px 20px; }
.brand { display:inline-flex; align-items:center; gap:8px; color:var(--text); font-size:1.1rem; font-weight:700; letter-spacing:-.02em; }
.brand:hover { text-decoration:none; }
.brand span { display:grid; place-items:center; width:26px; height:26px; border-radius:min(var(--radius),6px); background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff)); color:var(--accent-ink); font-size:.85rem; font-weight:700; }
.status { display:inline-flex; align-items:center; gap:8px; padding:4px 12px; color:var(--text); font-size:12px; background:var(--bg); border:1px solid var(--border); border-radius:999px; }
.status:hover { text-decoration:none; border-color:var(--ok); }
.dot { width:8px; height:8px; border-radius:50%; background:var(--ok); box-shadow:0 0 0 3px var(--ok-soft); }
.map { display:grid; margin:0; padding:0 16px; }
.col { border-bottom:1px solid var(--border); }
h2, h3 { margin:0; }
.col-title { display:none; margin:0 0 12px; font-size:12px; font-weight:600; line-height:1.5; letter-spacing:.08em; text-transform:uppercase; color:var(--text); }
.col-head { font-weight:600; }
.toggle { display:flex; justify-content:space-between; align-items:center; width:100%; padding:14px 0; font:inherit; font-size:14px; font-weight:600; color:var(--text); text-align:left; background:none; border:0; cursor:pointer; }
.toggle::after { content:""; width:8px; height:8px; margin-top:-4px; border-right:2px solid var(--muted); border-bottom:2px solid var(--muted); transform:rotate(45deg); transition:transform .16s; }
.toggle[aria-expanded=true]::after { margin-top:4px; transform:rotate(-135deg); }
.panel { display:grid; gap:10px; margin:0; padding:0 0 14px; list-style:none; }
.panel[hidden] { display:none; }
.base { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px 20px; padding:18px 16px; border-top:1px solid var(--border); color:var(--muted); font-size:13px; }
.base p { margin:0; }
.base ul { display:flex; flex-wrap:wrap; gap:6px 16px; margin:0; padding:0; list-style:none; }
@media (min-width:900px) {
  .head { padding:28px 32px 24px; }
  .map { grid-template-columns:repeat(5,1fr); gap:24px; padding:0 32px 28px; }
  .col { border:0; }
  .col-title { display:block; }
  .col-head { display:none; }
  .panel { padding:0; }
  .panel[hidden] { display:grid; }
  .base { padding:18px 32px; }
}
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
