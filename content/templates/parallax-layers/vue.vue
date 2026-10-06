<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sc = ref<HTMLElement>();
// --s: píxeles que recorre cada capa con el scroll completo (negativo sube, positivo baja).
const onScroll = () => sc.value?.style.setProperty('--t', String(sc.value.scrollTop / (sc.value.scrollHeight - sc.value.clientHeight)));
const fallback = !calm && !CSS.supports('animation-timeline', 'scroll()'); // alternativa con JS

onMounted(() => { if (fallback) sc.value?.addEventListener('scroll', onScroll, { passive: true }); });
onBeforeUnmount(() => sc.value?.removeEventListener('scroll', onScroll));
const inicio = () => sc.value?.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
</script>

<template>
  <section>
    <div ref="sc" class="scroller" tabindex="0" role="region" aria-label="Escena con capas de profundidad">
      <div class="scene">
        <div class="layer sun" style="--s: 60" />
        <svg class="layer far" style="--s: -24" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 90 50 50l60 35 60-50 70 45 60-35 100 50v105H0Z" /></svg>
        <svg class="layer mid" style="--s: -56" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 70 30l60 40 80-45 70 50 60-30 60 20v145H0Z" /></svg>
        <svg class="layer near" style="--s: -100" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60C60 20 110 20 170 55s120 20 230-15v160H0Z" /></svg>
        <div class="copy" style="--s: -70">
          <h1>Capas con profundidad</h1>
          <p>Cada capa se mueve a su propia velocidad mientras te desplazas.</p>
        </div>
      </div>
      <div class="spacer" />
    </div>
    <div class="bar">
      <p>Desplaza dentro del recuadro para separar las capas.</p>
      <button class="btn" type="button" @click="inicio">Volver al inicio</button>
    </div>
  </section>
</template>

<style scoped>
.scroller{height:360px;overflow:auto;border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.scroller:focus-visible,.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.scene{position:sticky;top:0;height:360px;overflow:hidden;background:linear-gradient(var(--accent-soft),var(--surface))}
.spacer{height:360px}
.layer{position:absolute;left:0;right:0;bottom:-30%;display:block;width:100%;fill:currentColor;transform:translateY(calc(var(--s) * 1px * var(--t, 0)))}
.sun{left:auto;right:14%;bottom:auto;top:46px;width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.far{height:85%;color:color-mix(in srgb,var(--accent) 16%,var(--surface))}
.mid{height:70%;color:color-mix(in srgb,var(--accent) 34%,var(--surface))}
.near{height:55%;color:color-mix(in srgb,var(--accent) 62%,var(--surface))}
.copy{position:absolute;top:32px;left:24px;right:24px;max-width:400px;transform:translateY(calc(var(--s) * 1px * var(--t, 0)));opacity:calc(1 - var(--t, 0))}
h1{margin:0;font-size:clamp(20px,5vw,28px);line-height:1.2;letter-spacing:-.01em}
.copy p{margin:8px 0 0;color:var(--muted)}
.bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;color:var(--muted);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.bar p{margin:0}
.btn{padding:7px 14px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;font-weight:600;cursor:pointer;transition:border-color .14s,background .14s}
.btn:hover{border-color:var(--accent);background:var(--accent-soft)}
/* CSS puro: la línea de tiempo del scroll anima --t; sin soporte, lo hace el script */
@property --t{syntax:"<number>";inherits:true;initial-value:0}
@media (prefers-reduced-motion:no-preference){
  @supports (animation-timeline:scroll()){
    .scroller{animation:prog linear both;animation-timeline:scroll(self)}
    @keyframes prog{to{--t:1}}
  }
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
