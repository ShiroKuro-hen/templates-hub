<script setup lang="ts">
const titulo = 'Informes que se escriben solos';
</script>

<template>
  <section class="card" aria-labelledby="shimmer-title">
    <span class="badge"><span class="shine">Nuevo</span></span>
    <h1 id="shimmer-title" class="shine">{{ titulo }}</h1>
    <p class="lead">Conecta tus datos y recibe cada lunes un resumen claro, con cifras y próximos pasos.</p>
    <a class="link" href="#">Ver novedades</a>
  </section>
  <div class="skeleton" role="status">
    <span class="sr">Cargando resumen</span>
    <span class="sk sk-title" aria-hidden="true" />
    <span class="sk" aria-hidden="true" />
    <span class="sk sk-short" aria-hidden="true" />
  </div>
</template>

<style scoped>
.card, .skeleton { max-width: 640px; margin: 0 auto; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
.skeleton { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; padding: 20px 24px; }
.badge { display: inline-block; padding: 2px 10px; border: 1px solid var(--border); border-radius: 999px; background: var(--accent-soft); font-size: 12px; font-weight: 600; }
h1 { margin: 12px 0 0; font-size: clamp(24px, 6vw, 34px); line-height: 1.2; letter-spacing: -.015em; }
.shine { color: var(--text); }
.lead { max-width: 52ch; margin: 12px 0 0; color: var(--muted); }
.link { display: inline-block; margin-top: 18px; color: var(--accent); font-weight: 600; }
.sk { display: block; height: 12px; border-radius: min(var(--radius), 6px); background: var(--accent-soft); }
.sk-title { width: 60%; height: 18px; }
.sk-short { width: 70%; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: no-preference) {
  @supports ((background-clip: text) or (-webkit-background-clip: text)) {
    .shine { background: linear-gradient(100deg, var(--text) 40%, var(--accent) 50%, var(--text) 60%) 0 0 / 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shine 3.2s linear infinite; }
  }
  .sk { background: linear-gradient(90deg, var(--accent-soft) 25%, var(--surface) 50%, var(--accent-soft) 75%) 0 0 / 200% 100%; animation: sk 1.4s ease-in-out infinite; }
  @keyframes shine { from { background-position: 100% 0; } to { background-position: -100% 0; } }
  @keyframes sk { from { background-position: 100% 0; } to { background-position: -100% 0; } }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
