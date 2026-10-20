<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const SOURCES: Record<string, string> = {
  'atardecer-vertical.webp': 'vertical para móvil',
  'atardecer-panoramica.webp': 'panorámica para escritorio',
};
const REPORT_SCRIPT = `<script>const img=document.querySelector('img');const report=()=>parent.postMessage({pictureSrc:img.currentSrc,width:innerWidth,height:Math.ceil(img.getBoundingClientRect().height)},'*');img.addEventListener('load',report);addEventListener('resize',report);<\/script>`;
const SRCDOC = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden}img{display:block;width:100%;height:auto}</style></head><body><picture><source media="(max-width: 600px)" srcset="/stock/atardecer-vertical.webp"><img loading="lazy" src="/stock/atardecer-panoramica.webp" alt="Atardecer sobre un paisaje de colinas con el sol bajo el horizonte" width="1200" height="500"></picture>${REPORT_SCRIPT}</body></html>`;

const frame = ref<HTMLIFrameElement>();
const width = ref(640);
const picture = ref({ active: 'cargando', viewport: 0, height: 240 });

function sourceName(pictureSrc: string): string {
  const file = Object.keys(SOURCES).find((f) => pictureSrc.endsWith(f));
  return file ? SOURCES[file] : 'cargando';
}

function onReport(e: MessageEvent) {
  if (e.source !== frame.value?.contentWindow || typeof e.data?.pictureSrc !== 'string') return;
  const { pictureSrc, width: viewport, height } = e.data;
  picture.value = { active: sourceName(pictureSrc), viewport, height };
}

onMounted(() => window.addEventListener('message', onReport));
onUnmounted(() => window.removeEventListener('message', onReport));
</script>

<template>
  <main class="wrap">
    <h2>Portada del evento</h2>
    <div class="ctl">
      <label for="range">Ancho de la vista previa</label>
      <input id="range" v-model.number="width" type="range" min="320" max="960" step="10" :aria-valuetext="`${width} px`" />
      <output for="range">{{ width }} px</output>
    </div>
    <div class="stage" :style="{ width: width + 'px' }">
      <iframe
        ref="frame"
        class="preview"
        title="Vista previa del picture"
        :srcdoc="SRCDOC"
        :style="{ height: picture.height + 'px' }"
      />
    </div>
    <p class="ind" aria-live="polite">
      Fuente activa: <b>{{ picture.active }}</b> · ancho del marco {{ picture.viewport }} px
    </p>
    <p class="note">
      El atributo media de source responde al ancho del viewport, no al del contenedor. Por eso la vista previa es un
      iframe: el deslizador cambia su ancho y el navegador vuelve a elegir la imagen.
    </p>
  </main>
</template>

<style scoped>

  *{box-sizing:border-box}
  .wrap{max-width:720px;margin:0 auto}
  h2{margin:0 0 12px;font-size:18px;font-weight:600}
  .ctl{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:12px}
  .ctl label{color:var(--muted)}
  input[type=range]{flex:1 1 160px;min-width:0;accent-color:var(--accent)}
  output{min-width:64px;font-variant-numeric:tabular-nums;font-weight:600}
  .stage{max-width:100%;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);transition:width .2s ease}
  .preview{display:block;width:100%;height:240px;border:0}
  .ind,.note{margin:12px 0 0;color:var(--muted);font-size:13px}
  .ind b{color:var(--text);font-weight:600}
  :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
  @media (prefers-reduced-motion:reduce){*{transition:none!important}}

</style>
