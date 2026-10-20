<script setup lang="ts">
const CARDS = [
  { id: 'seguridad', titulo: 'Seguridad', texto: 'Cifrado de extremo a extremo y permisos por rol para cada equipo.' },
  { id: 'analitica', titulo: 'Analítica', texto: 'Paneles en tiempo real con alertas cuando una métrica se desvía.' },
  { id: 'equipos', titulo: 'Equipos', texto: 'Espacios compartidos con comentarios y menciones en cada documento.' },
];

// Guarda la posición del cursor en --mx / --my; el táctil no tiene foco de luz.
function follow(e: PointerEvent) {
  if (e.pointerType === 'touch') return;
  const el = e.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
</script>

<template>
  <main class="grid">
    <a v-for="c in CARDS" :key="c.id" class="spot" href="#" @pointermove="follow">
      <span class="ico" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
          <path d="M12 3l9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" />
        </svg>
      </span>
      <h3>{{ c.titulo }}</h3>
      <p>{{ c.texto }}</p>
    </a>
  </main>
</template>

<style scoped>
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;max-width:820px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.spot{position:relative;isolation:isolate;display:block;padding:18px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:inherit;text-decoration:none;transition:box-shadow .2s}
.spot>*{position:relative}
.spot::before,.spot::after{content:"";position:absolute;z-index:-1;pointer-events:none;opacity:0;transition:opacity .2s}
.spot::before{inset:0;border-radius:inherit;background:radial-gradient(240px circle at var(--mx,50%) var(--my,50%),color-mix(in srgb,var(--accent) 16%,transparent),transparent 70%)}
.spot::after{inset:-1px;padding:1px;border-radius:inherit;background:radial-gradient(180px circle at var(--mx,50%) var(--my,50%),var(--accent),transparent 70%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
@media (hover:hover){.spot:hover{box-shadow:var(--shadow)}.spot:hover::before,.spot:hover::after{opacity:1}}
.spot:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.spot:focus-visible::before,.spot:focus-visible::after{opacity:1}
.ico{display:grid;place-items:center;width:36px;height:36px;margin-bottom:12px;border-radius:min(var(--radius),6px);background:var(--accent-soft);color:var(--accent)}
.spot h3{margin:0 0 4px;font-size:15px}
.spot p{margin:0;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
