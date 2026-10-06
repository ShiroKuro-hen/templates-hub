<script setup lang="ts">
// Guarda la posición del cursor en --x / --y para el halo.
function follow(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--x', `${e.clientX - r.left}px`);
  el.style.setProperty('--y', `${e.clientY - r.top}px`);
}
</script>

<template>
  <div class="grid">
    <a class="card lift" href="#"><h3>Elevación</h3><p>Para tarjetas de proyecto: sube 3px y gana sombra.</p></a>
    <a class="card glow" href="#" @pointermove="follow"><h3>Brillo</h3><p>Un halo suave sigue al cursor sobre la tarjeta.</p></a>
    <a class="card line" href="#"><h3><span>Subrayado</span></h3><p>Para enlaces de documentación: la línea crece.</p></a>
    <a class="card spin" href="#">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m10 8 4 4-4 4" /></svg>
      <h3>Giro</h3><p>El icono gira 90° y anuncia que se despliega.</p>
    </a>
    <a class="card fill" href="#"><h3>Relleno</h3><p>El fondo se llena de izquierda a derecha.</p></a>
    <a class="card zoom" href="#">
      <div class="media"><svg viewBox="0 0 200 72" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60 30 48 60 52 90 30 120 36 150 18 200 24V72H0Z" fill="currentColor" opacity=".18" /><path d="M0 60 30 48 60 52 90 30 120 36 150 18 200 24" fill="none" stroke="currentColor" stroke-width="1.5" /></svg></div>
      <h3>Escala</h3><p>La imagen crece dentro de su marco.</p>
    </a>
  </div>
</template>

<style scoped>
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card{position:relative;display:block;padding:18px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:inherit;text-decoration:none;overflow:hidden;transition:transform .16s,box-shadow .16s,border-color .16s,color .16s}
.card:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.card h3{position:relative;margin:0 0 4px;font-size:15px}
.card p{position:relative;margin:0;color:var(--muted);transition:color .16s}
.lift:hover,.lift:focus-visible{transform:translateY(-3px);box-shadow:var(--shadow);border-color:var(--accent)}
.glow::before{content:"";position:absolute;inset:0;background:radial-gradient(180px circle at var(--x,50%) var(--y,50%),color-mix(in srgb,var(--accent) 16%,transparent),transparent 70%);opacity:0;transition:opacity .16s;pointer-events:none}
.glow:hover::before,.glow:focus-visible::before{opacity:1}
.line span{background:linear-gradient(135deg,#22d3ee,#2f5bff) 0 100%/0 1px no-repeat;transition:background-size .16s}
.line:hover span,.line:focus-visible span{background-size:100% 1px}
.spin svg{display:block;margin-bottom:10px;color:var(--accent);transition:transform .16s}
.spin:hover svg,.spin:focus-visible svg{transform:rotate(90deg)}
.fill::after{content:"";position:absolute;inset:0;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .16s}
.fill h3,.fill p{z-index:1}
.fill:hover,.fill:focus-visible{color:var(--accent-ink);border-color:var(--accent)}
.fill:hover p,.fill:focus-visible p{color:var(--accent-ink)}
.fill:hover::after,.fill:focus-visible::after{transform:scaleX(1)}
.media{height:72px;margin-bottom:12px;border-radius:6px;background:var(--accent-soft);overflow:hidden}
.media svg{display:block;width:100%;height:100%;color:var(--accent);transition:transform .16s}
.zoom:hover .media svg,.zoom:focus-visible .media svg{transform:scale(1.1)}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{transition:none!important}
  .lift:hover,.lift:focus-visible,.spin:hover svg,.spin:focus-visible svg,.zoom:hover .media svg,.zoom:focus-visible .media svg{transform:none}
}
/* Tokens: ver pestaña HTML + CSS */
</style>
