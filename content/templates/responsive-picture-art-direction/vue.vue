<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const SOURCES = [
  { name: 'vertical para móvil', media: '(max-width: 600px)', srcset: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20300%20400%27%3E%3Crect%20width=%27300%27%20height=%27400%27%20fill=%27%23ffd9a8%27/%3E%3Ccircle%20cx=%27150%27%20cy=%27150%27%20r=%2760%27%20fill=%27%23f59e0b%27/%3E%3Crect%20y=%27250%27%20width=%27300%27%20height=%27150%27%20fill=%27%232f8fb8%27/%3E%3Cpath%20d=%27M150%20120v120h-40z%27%20fill=%27%23fff%27/%3E%3Cpath%20d=%27M100%20240h110l-18%2018H118z%27%20fill=%27%232f5bff%27/%3E%3C/svg%3E 1x, data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20300%20400%27%3E%3Crect%20width=%27300%27%20height=%27400%27%20fill=%27%23ffd9a8%27/%3E%3Ccircle%20cx=%27150%27%20cy=%27150%27%20r=%2790%27%20fill=%27%23f59e0b%27%20opacity=%27.25%27/%3E%3Ccircle%20cx=%27150%27%20cy=%27150%27%20r=%2760%27%20fill=%27%23f59e0b%27/%3E%3Cpath%20d=%27M30%2060h50a20%2020%200%200%200-20-20%2025%2025%200%200%200-30%2020z%27%20fill=%27%23fff%27%20opacity=%27.8%27/%3E%3Crect%20y=%27250%27%20width=%27300%27%20height=%27150%27%20fill=%27%232f8fb8%27/%3E%3Cpath%20d=%27M0%20300q25-10%2050%200t50%200%2050%200%2050%200%2050%200%2050%200%27%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-opacity=%27.5%27%20stroke-width=%273%27/%3E%3Cpath%20d=%27M150%20120v120h-40z%27%20fill=%27%23fff%27/%3E%3Cpath%20d=%27M100%20240h110l-18%2018H118z%27%20fill=%27%232f5bff%27/%3E%3C/svg%3E 2x' },
  { name: 'panorámica para escritorio', media: '(min-width: 601px)', srcset: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20840%20360%27%3E%3Crect%20width=%27840%27%20height=%27360%27%20fill=%27%23ffd9a8%27/%3E%3Ccircle%20cx=%27620%27%20cy=%27120%27%20r=%2758%27%20fill=%27%23f59e0b%27/%3E%3Crect%20y=%27220%27%20width=%27840%27%20height=%27140%27%20fill=%27%232f8fb8%27/%3E%3Cpath%20d=%27M420%20110v120h-70z%27%20fill=%27%23fff%27/%3E%3Cpath%20d=%27M410%20240h110l-18%2018H428z%27%20fill=%27%232f5bff%27/%3E%3C/svg%3E 1x, data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20840%20360%27%3E%3Crect%20width=%27840%27%20height=%27360%27%20fill=%27%23ffd9a8%27/%3E%3Ccircle%20cx=%27620%27%20cy=%27120%27%20r=%2790%27%20fill=%27%23f59e0b%27%20opacity=%27.25%27/%3E%3Ccircle%20cx=%27620%27%20cy=%27120%27%20r=%2758%27%20fill=%27%23f59e0b%27/%3E%3Cpath%20d=%27M60%2070h80a30%2030%200%200%200-30-30%2040%2040%200%200%200-50%2030z%27%20fill=%27%23fff%27%20opacity=%27.8%27/%3E%3Crect%20y=%27220%27%20width=%27840%27%20height=%27140%27%20fill=%27%232f8fb8%27/%3E%3Cpath%20d=%27M0%20260q40-14%2080%200t80%200%2080%200%2080%200%2080%200%2080%200%2080%200%2080%200%2080%200%2080%200%2080%200%27%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-opacity=%27.5%27%20stroke-width=%273%27/%3E%3Cpath%20d=%27M420%20110v120h-70z%27%20fill=%27%23fff%27/%3E%3Cpath%20d=%27M410%20240h110l-18%2018H428z%27%20fill=%27%232f5bff%27/%3E%3C/svg%3E 2x' },
];

const sourceTags = SOURCES.map((s) => `<source media="${s.media}" srcset="${s.srcset}">`).join('');
const REPORT_SCRIPT = `<script>const img=document.querySelector('img');const report=()=>parent.postMessage({pictureSrc:img.currentSrc,width:innerWidth,height:Math.ceil(img.getBoundingClientRect().height)},'*');img.addEventListener('load',report);addEventListener('resize',report);<\/script>`;
const SRCDOC = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden}img{display:block;width:100%;height:auto}</style></head><body><picture>${sourceTags}<img alt="Velero navegando al atardecer sobre el mar" width="840" height="360"></picture>${REPORT_SCRIPT}</body></html>`;

const frame = ref<HTMLIFrameElement>();
const width = ref(640);
const picture = ref({ active: 'cargando', viewport: 0, height: 240 });

function sourceName(pictureSrc: string): string {
  return SOURCES.find((s) => pictureSrc && s.srcset.includes(pictureSrc))?.name ?? 'cargando';
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
