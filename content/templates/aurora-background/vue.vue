<script setup lang="ts">
const titulo = 'Todo tu equipo, en una sola vista';
const lead = 'Reúne proyectos, plazos y avisos en un solo panel. Empieza en minutos y invita a tus compañeros cuando quieras.';
</script>

<template>
  <section class="hero" aria-labelledby="aurora-title">
    <div class="aurora" aria-hidden="true">
      <span class="blob b1" />
      <span class="blob b2" />
      <span class="blob b3" />
    </div>
    <p class="eyebrow">Novedad: panel de equipo</p>
    <h1 id="aurora-title">{{ titulo }}</h1>
    <p class="lead">{{ lead }}</p>
    <div class="actions">
      <button type="button" class="btn btn-primary">Empezar gratis</button>
      <button type="button" class="btn btn-secondary">Ver demo</button>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; isolation: isolate; overflow: hidden; max-width: 720px; margin: 0 auto; padding: 56px 28px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); text-align: center; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
.aurora { position: absolute; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
.blob { position: absolute; width: 60%; aspect-ratio: 1; border-radius: 50%; filter: blur(56px); opacity: .4; animation: drift 18s ease-in-out infinite alternate; }
.b1 { left: -12%; top: -30%; background: var(--accent); }
.b2 { right: -14%; top: -6%; background: var(--accent-2, var(--info)); animation-duration: 22s; animation-delay: -6s; }
.b3 { left: 22%; bottom: -38%; background: var(--info); animation-duration: 26s; animation-delay: -12s; }
@keyframes drift { to { transform: translate3d(8%, -6%, 0) scale(1.12); } }
.eyebrow { display: inline-block; margin: 0 0 14px; padding: 3px 10px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); font-size: 12px; font-weight: 600; }
h1 { margin: 0 auto; max-width: 18ch; font-size: clamp(26px, 6vw, 40px); line-height: 1.15; letter-spacing: -.02em; }
.lead { max-width: 50ch; margin: 14px auto 24px; }
.actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.btn { font: inherit; font-weight: 600; padding: 10px 18px; border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; transition: border-color .14s, background .14s; }
.btn-primary { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
.btn-secondary { background: var(--surface); color: var(--text); }
.btn:hover { border-color: var(--accent); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .blob { animation: none; } * { transition: none !important; } }
</style>
