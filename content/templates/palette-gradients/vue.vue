<script setup lang="ts">
import { reactive } from 'vue';

const grads = [
  { id: 'ultramar', name: 'Ultramar', use: 'Marca principal. Úsalo en encabezados y llamadas a la acción.' },
  { id: 'aurora', name: 'Aurora', use: 'Estados positivos, métricas en crecimiento y logros.' },
  { id: 'brasa', name: 'Brasa', use: 'Avisos destacados y ofertas con fecha límite.' },
  { id: 'nebulosa', name: 'Nebulosa', use: 'Campañas y lanzamientos. Úsalo poco.' },
];
const labels = reactive<Record<string, string>>({});

async function copy(id: string) {
  try { await navigator.clipboard.writeText(`background: var(--grad-${id});`); labels[id] = 'Copiado'; }
  catch { labels[id] = 'Sin acceso'; }
  setTimeout(() => delete labels[id], 1500);
}
</script>

<template>
  <div class="grid">
    <article v-for="g in grads" :key="g.id" :style="{ '--g': `var(--grad-${g.id})` }">
      <div class="fill" role="img" :aria-label="`Muestra del degradado ${g.name}`" />
      <h3>{{ g.name }}</h3>
      <p>{{ g.use }}</p>
      <div class="uses">
        <div class="ring">Borde degradado</div>
        <div class="bar" role="img" :aria-label="`Barra con degradado ${g.name}`" />
      </div>
      <div class="copy">
        <code>background: var(--grad-{{ g.id }});</code>
        <button type="button" :aria-label="`Copiar CSS de ${g.name}`" @click="copy(g.id)">{{ labels[g.id] ?? 'Copiar' }}</button>
      </div>
    </article>
  </div>
</template>

<style scoped>
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;--grad-ultramar:linear-gradient(135deg,var(--info),var(--accent));--grad-aurora:linear-gradient(135deg,var(--ok),var(--info));--grad-brasa:linear-gradient(135deg,var(--warn),var(--err));--grad-nebulosa:linear-gradient(135deg,var(--accent),var(--err))}
article{padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.fill{height:96px;border-radius:var(--radius);background:var(--g)}
h3{margin:12px 0 0;font-size:15px}
p{margin:0;color:var(--muted)}
.uses{display:grid;gap:10px;margin:12px 0}
.ring{padding:8px 12px;border:1px solid transparent;border-radius:var(--radius);background:linear-gradient(var(--surface),var(--surface)) padding-box,var(--g) border-box}
.bar{height:6px;border-radius:999px;background:var(--g)}
.copy{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg)}
code{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:12px ui-monospace,"Cascadia Code",Menlo,monospace}
button{padding:4px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;cursor:pointer;transition:background .14s,border-color .14s}
button:hover{background:var(--accent-soft);border-color:var(--accent)}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
