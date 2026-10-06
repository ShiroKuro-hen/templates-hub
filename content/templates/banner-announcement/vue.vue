<script setup lang="ts">
import { ref } from 'vue';

withDefaults(defineProps<{ tag?: string; href?: string; linkText?: string }>(), {
  tag: 'Nuevo',
  href: '#novedades',
  linkText: 'Ver novedades',
});
const emit = defineEmits<{ close: [] }>();
const off = ref(false);
function close() { off.value = true; emit('close'); }
</script>

<template>
  <section :class="['banner', { off }]" aria-label="Anuncio">
    <div>
      <div class="inner">
        <p>
          <span class="tag">{{ tag }}</span>
          <slot>Ya puedes exportar tus informes a PDF.</slot>
          <a :href="href">{{ linkText }}</a>
        </p>
        <button type="button" class="x" aria-label="Cerrar anuncio" @click="close">×</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner { display:grid; grid-template-rows:1fr; transition:grid-template-rows .16s ease; background:var(--accent-soft); border-bottom:1px solid var(--border); font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
.banner > div { overflow:hidden; min-height:0; }
.banner.off { grid-template-rows:0fr; border-bottom-width:0; }
.banner.off > div { visibility:hidden; transition:visibility 0s .16s; }
.inner { display:flex; align-items:center; gap:12px; padding:10px 16px 12px; background:linear-gradient(135deg,#22d3ee,#2f5bff) bottom/100% 2px no-repeat; }
.inner p { flex:1; margin:0; }
.inner a { color:var(--accent); font-weight:600; text-underline-offset:3px; margin-left:4px; white-space:nowrap; }
.tag { display:inline-block; padding:1px 9px; margin-right:8px; font-size:12px; font-weight:600; background:var(--accent); color:var(--accent-ink); border-radius:999px; }
.x { flex:none; width:30px; height:30px; font-size:20px; line-height:1; color:var(--muted); background:none; border:0; border-radius:var(--radius); cursor:pointer; transition:background .14s, color .14s; }
.x:hover { color:var(--text); background:var(--surface); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
@media (prefers-reduced-motion:reduce) { .banner, .banner.off > div, .x { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
