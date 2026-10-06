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
.banner { display:grid; grid-template-rows:1fr; transition:grid-template-rows .25s ease; background:#ffd84d; border-bottom:2px solid #17130f; font:14px/1.45 system-ui, sans-serif; color:#17130f; }
.banner > div { overflow:hidden; min-height:0; }
.banner.off { grid-template-rows:0fr; border-bottom-width:0; }
.banner.off > div { visibility:hidden; transition:visibility 0s .25s; }
.inner { display:flex; align-items:center; gap:10px; padding:9px 12px; }
.inner p { flex:1; margin:0; }
.inner a { color:#17130f; font-weight:700; text-underline-offset:3px; margin-left:4px; white-space:nowrap; }
.tag { font:700 12px ui-monospace, monospace; padding:2px 7px; margin-right:6px; background:#17130f; color:#ffd84d; border-radius:6px; }
.x { flex:none; width:30px; height:30px; font-size:20px; line-height:1; color:#17130f; background:none; border:2px solid transparent; border-radius:8px; cursor:pointer; }
.x:hover { border-color:#17130f; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
@media (prefers-reduced-motion:reduce) { .banner, .banner.off > div { transition:none; } }
</style>
