<script setup lang="ts">
const estilos = [
  { v: 'subtle', t: 'Sutil', d: 'Acciones secundarias que no deben competir con el contenido.', href: '#historial', label: 'Ver historial' },
  { v: 'under', t: 'Subrayado animado', d: 'Enlaces dentro de un párrafo. Siempre subrayados.', href: '#guia', label: 'Leer la guía de inicio' },
  { v: 'arrow', t: 'Flecha animada', d: 'Invita a avanzar a otra página o sección.', href: '#precios', label: 'Ver precios' },
  { v: 'ext', t: 'Enlace externo', d: 'Sale del sitio. Se abre en una pestaña nueva y lo avisa.', href: 'https://example.com/api', label: 'Documentación de la API' },
] as const;
</script>

<template>
  <div class="grid">
    <article v-for="e in estilos" :key="e.v">
      <h3>{{ e.t }}</h3>
      <p>{{ e.d }}</p>
      <a :class="['l', e.v]" :href="e.href" :target="e.v === 'ext' ? '_blank' : undefined" :rel="e.v === 'ext' ? 'noopener noreferrer' : undefined">
        {{ e.label }}
        <svg v-if="e.v === 'arrow'" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        <template v-if="e.v === 'ext'">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
          <span class="vh">(se abre en una pestaña nueva)</span>
        </template>
      </a>
    </article>
  </div>
</template>

<style scoped>
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
article{display:flex;flex-direction:column;gap:4px;padding:16px 20px 20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
h3{margin:0;font-size:15px}
p{margin:0 0 12px;color:var(--muted)}
.l{display:inline-flex;align-items:center;gap:6px;align-self:flex-start;font:inherit;font-weight:600;text-decoration:none;cursor:pointer}
.l:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}
.l svg{width:16px;height:16px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .14s}
.subtle{padding:6px 10px;margin-left:-10px;border-radius:var(--radius);color:var(--muted);transition:background .14s,color .14s}
.subtle:hover{background:var(--accent-soft);color:var(--text)}
.under{color:var(--accent);padding-bottom:2px;border-bottom:1px solid var(--border);background:linear-gradient(135deg,#22d3ee,#2f5bff) 0 100%/0 2px no-repeat;transition:background-size .16s}
.under:hover,.under:focus-visible{background-size:100% 2px}
.arrow{color:var(--accent)}
.arrow:hover svg{transform:translateX(4px)}
.ext{color:var(--accent);text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}
.ext:hover{text-decoration-thickness:2px}
.ext:hover svg{transform:translate(2px,-2px)}
.vh{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
