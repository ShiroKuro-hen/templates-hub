<script setup lang="ts">
withDefaults(defineProps<{ titulo?: string; texto?: string; accion?: string }>(), {
  titulo: 'Plan Empresa',
  texto: 'Informes avanzados, soporte prioritario y espacios ilimitados.',
  accion: 'Activar notificaciones',
});
</script>

<template>
  <main class="stage">
    <article class="gbg gbg-card">
      <div class="gbg-face">
        <h3>{{ titulo }}</h3>
        <p>{{ texto }}</p>
      </div>
    </article>
    <button type="button" class="gbg gbg-btn"><span class="gbg-face">{{ accion }}</span></button>
  </main>
</template>

<style scoped>
.stage{--dur:4s;display:flex;flex-wrap:wrap;align-items:center;gap:32px;padding:32px 24px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.gbg{position:relative;isolation:isolate;display:inline-block;padding:0;border:0;border-radius:var(--radius);background:none;color:inherit;font:inherit;text-align:left;animation:gbg-spin var(--dur) linear infinite}
.gbg::before,.gbg::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:conic-gradient(from var(--gbg-angle),var(--accent-2,#22d3ee),var(--accent,#2f5bff),var(--accent-2,#22d3ee))}
.gbg::after{z-index:-2;filter:blur(18px);opacity:.45;transition:opacity .2s}
.gbg:hover::after,.gbg:focus-visible::after{opacity:.9}
.gbg-card{width:260px;max-width:100%}
.gbg-face{display:block;margin:2px;padding:18px;border-radius:calc(var(--radius) - 2px);background:var(--surface)}
.gbg-face h3{margin:0 0 4px;font-size:15px}
.gbg-face p{margin:0;color:var(--muted)}
.gbg-btn{cursor:pointer}
.gbg-btn .gbg-face{padding:10px 20px;font-weight:600}
.gbg-btn:hover .gbg-face{color:var(--accent)}
@property --gbg-angle{syntax:'<angle>';inherits:true;initial-value:0deg}
@keyframes gbg-spin{to{--gbg-angle:360deg}}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.gbg{animation:none}.gbg::after{transition:none}}
/* Tokens: ver pestaña HTML + CSS */
</style>
