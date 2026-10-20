<script setup lang="ts">
const stats: [string, string][] = [
  ['Equipos activos', '12 mil'],
  ['Valoración media', '4,9/5'],
  ['Disponibilidad', '99,9 %'],
  ['Respuesta de soporte', '< 2 h'],
];
</script>

<template>
  <section class="hero" aria-labelledby="h">
    <a class="pill" href="#novedades">
      <b>Nuevo</b> Plantillas 3.0 ya disponibles <span aria-hidden="true">→</span>
    </a>
    <h1 id="h">Diseña landings que <span class="grad">convierten</span> desde el primer día</h1>
    <p class="sub">
      Lumen reúne plantillas, datos y pruebas A/B en un solo lugar para que cada visita se convierta en una venta.
    </p>
    <div class="row">
      <a class="btn main" href="#empezar">Empezar gratis</a>
      <a class="btn" href="#demo">Ver demo</a>
    </div>
    <dl class="stats">
      <div v-for="[label, value] in stats" :key="label">
        <dt>{{ label }}</dt>
        <dd>{{ value }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.hero { position:relative; isolation:isolate; overflow:hidden; max-width:1040px; margin:0 auto; padding:44px 16px 40px; text-align:center; }
.hero::before { content:""; position:absolute; inset:0; z-index:-2; background:radial-gradient(var(--border) 1px,transparent 1px) 0 0/22px 22px; -webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 0,rgba(0,0,0,1),transparent); mask-image:radial-gradient(ellipse 70% 60% at 50% 0,rgba(0,0,0,1),transparent); }
.hero::after { content:""; position:absolute; inset:0; z-index:-1; background:radial-gradient(60% 45% at 50% 0,var(--accent-soft),transparent 70%); pointer-events:none; }
.pill { display:inline-flex; align-items:center; gap:8px; margin:0 0 24px; padding:4px 12px 4px 4px; border:1px solid var(--border); border-radius:999px; background:var(--surface); color:var(--muted); font-size:13px; text-decoration:none; }
.pill:hover { color:var(--text); border-color:var(--accent); }
.pill b { padding:2px 9px; border-radius:999px; background:var(--accent); color:var(--accent-ink); font-weight:600; }
h1 { margin:0 auto 18px; max-width:16ch; font-size:clamp(2.2rem,7vw,3.9rem); font-weight:750; line-height:1.02; letter-spacing:-.04em; text-wrap:balance; }
.grad { background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff)); -webkit-background-clip:text; background-clip:text; color:transparent; }
.sub { max-width:52ch; margin:0 auto 28px; color:var(--muted); font-size:1.1rem; line-height:1.55; }
.row { display:flex; flex-wrap:wrap; justify-content:center; gap:12px; }
.btn { display:inline-flex; align-items:center; padding:11px 20px; border:1px solid var(--border); border-radius:var(--radius); background:var(--surface); color:var(--text); font:600 1rem system-ui,sans-serif; text-decoration:none; }
.btn:hover { border-color:var(--accent); }
.btn.main { background:var(--accent); border-color:var(--accent); color:var(--accent-ink); box-shadow:var(--shadow); }
.btn.main:hover { filter:brightness(1.08); }
.stats { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; max-width:720px; margin:48px auto 0; overflow:hidden; background:var(--border); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
@media (min-width:640px) { .stats { grid-template-columns:repeat(4,1fr); } }
.stats div { padding:16px 12px; background:var(--surface); }
.stats dt { color:var(--muted); font-size:13px; }
.stats dd { margin:2px 0 0; font-size:1.5rem; font-weight:700; letter-spacing:-.02em; }
@media (prefers-reduced-motion:no-preference) { .grad { background-size:200% 200%; animation:shift 8s ease-in-out infinite alternate; } }
@keyframes shift { to { background-position:100% 100%; } }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
</style>
