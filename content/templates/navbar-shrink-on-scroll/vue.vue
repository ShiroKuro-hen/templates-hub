<script setup lang="ts">
import { ref } from 'vue';

const LINKS = ['Producto', 'Precios', 'Documentación', 'Equipo'];
const CARDS = [
  ['Proyectos activos', '12 en curso y 3 pendientes de revisión.'],
  ['Equipo', '8 personas y 2 invitaciones enviadas esta semana.'],
  ['Facturación', 'El plan Pro se renueva el 5 de noviembre.'],
  ['Incidencias', 'Ninguna abierta. El último cierre fue hace cuatro días.'],
];

const scrolled = ref(false);
function onScroll(e: Event) {
  scrolled.value = (e.currentTarget as HTMLElement).scrollTop > 8;
}
</script>

<template>
  <div class="frame" @scroll.passive="onScroll">
    <header id="arriba" class="nav" :data-scrolled="scrolled ? '' : undefined">
      <a class="brand" href="#arriba"><i aria-hidden="true"></i>Atlas</a>
      <nav class="links" aria-label="Principal">
        <ul>
          <li v-for="(label, i) in LINKS" :key="label">
            <a href="#arriba" :aria-current="i === 0 ? 'page' : undefined">{{ label }}</a>
          </li>
        </ul>
      </nav>
      <a class="btn" href="#arriba">Empezar</a>
    </header>
    <main class="content">
      <h1>Resumen de octubre</h1>
      <p>Desplázate por el contenido: al bajar, la barra se reduce, se vuelve translúcida y gana sombra.</p>
      <div class="cards">
        <article v-for="[title, text] in CARDS" :key="title" class="card"><b>{{ title }}</b><span>{{ text }}</span></article>
      </div>
      <p>Los cambios se guardan solos y puedes deshacerlos desde el historial durante 30 días.</p>
      <a class="top" href="#arriba">Ir arriba ↑</a>
    </main>
  </div>
</template>

<style scoped>
.frame { height:320px; overflow:auto; scroll-behavior:smooth; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
.nav { position:sticky; top:0; z-index:1; display:flex; align-items:center; gap:12px; height:64px; padding:0 16px; background:var(--surface); border-bottom:1px solid var(--border); transition:height .2s ease, background-color .2s ease, box-shadow .2s ease; }
.nav[data-scrolled] { height:48px; background:color-mix(in srgb, var(--surface) 75%, transparent); box-shadow:var(--shadow); }
@supports (backdrop-filter:blur(8px)) { .nav[data-scrolled] { backdrop-filter:blur(10px); } }
.brand { display:flex; align-items:center; gap:8px; flex:none; font-weight:700; color:var(--text); text-decoration:none; }
.brand i { width:32px; height:32px; border-radius:min(var(--radius),6px); background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff)); transition:width .2s ease, height .2s ease; }
.nav[data-scrolled] .brand i { width:24px; height:24px; }
.links { flex:1; min-width:0; margin:-4px 0; padding:4px; overflow-x:auto; scrollbar-width:none; }
.links ul { display:flex; gap:4px; margin:0; padding:0; list-style:none; white-space:nowrap; }
.links a { display:block; padding:6px 10px; border-radius:var(--radius); color:var(--muted); text-decoration:none; transition:background .14s, color .14s; }
.links a:hover { color:var(--text); background:var(--bg); }
.links a[aria-current] { color:var(--accent); background:var(--accent-soft); font-weight:600; }
.btn { flex:none; padding:6px 12px; border-radius:var(--radius); background:var(--accent); color:var(--accent-ink); font-weight:600; text-decoration:none; white-space:nowrap; }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.content { padding:20px 16px 24px; }
h1 { margin:0 0 6px; font-size:1.3rem; font-weight:600; letter-spacing:-.01em; }
.content p { margin:0 0 16px; max-width:56ch; color:var(--muted); }
.cards { display:grid; gap:10px; margin:0 0 20px; }
.card { padding:12px 14px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
.card b { display:block; font-weight:600; }
.card span { color:var(--muted); font-size:13px; }
.top { display:inline-block; padding:6px 10px; border-radius:var(--radius); color:var(--accent); font-weight:600; text-decoration:none; }
.top:hover { background:var(--accent-soft); }
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } .frame { scroll-behavior:auto; } }
</style>
