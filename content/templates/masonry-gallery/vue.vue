<script setup lang="ts">
import { ref } from 'vue';

type Shot = { src: string; alt: string; caption: string; ar: string; w: number; h: number };

const SHOTS: Shot[] = [
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23fde68a%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22170%22%20r%3D%2270%22%20fill%3D%22%23f97316%22%2F%3E%3Cpath%20d%3D%22M0%20220Q120%20170%20220%20210T400%20200V300H0Z%22%20fill%3D%22%237c2d12%22%2F%3E%3C%2Fsvg%3E', alt: 'Valle con colinas y un sol naranja al atardecer', caption: 'Valle al atardecer', ar: '4/3', w: 400, h: 300 },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22400%22%20viewBox%3D%220%200%20300%20400%22%3E%3Crect%20width%3D%22300%22%20height%3D%22400%22%20fill%3D%22%23e0f2fe%22%2F%3E%3Crect%20x%3D%22110%22%20y%3D%2260%22%20width%3D%2280%22%20height%3D%22340%22%20fill%3D%22%230c4a6e%22%2F%3E%3Crect%20x%3D%22130%22%20y%3D%2230%22%20width%3D%2240%22%20height%3D%2230%22%20fill%3D%22%230c4a6e%22%2F%3E%3Cpath%20d%3D%22M120%20100h60M120%20140h60M120%20180h60M120%20220h60M120%20260h60%22%20stroke%3D%22%237dd3fc%22%20stroke-width%3D%226%22%2F%3E%3C%2Fsvg%3E', alt: 'Torre alta de cristal azul entre nubes', caption: 'Torre del centro', ar: '3/4', w: 300, h: 400 },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22300%22%20viewBox%3D%220%200%20300%20300%22%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20fill%3D%22%23fce7f3%22%2F%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22100%22%20r%3D%2270%22%20fill%3D%22%23db2777%22%20opacity%3D%22.85%22%2F%3E%3Crect%20x%3D%22150%22%20y%3D%22150%22%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22%234338ca%22%20opacity%3D%22.8%22%2F%3E%3Cpath%20d%3D%22M20%20280%20110%20170%20200%20280Z%22%20fill%3D%22%23facc15%22%2F%3E%3C%2Fsvg%3E', alt: 'Composición geométrica con círculo, cuadrado y triángulo', caption: 'Composición geométrica', ar: '1/1', w: 300, h: 300 },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22480%22%20height%3D%22270%22%20viewBox%3D%220%200%20480%20270%22%3E%3Crect%20width%3D%22480%22%20height%3D%22270%22%20fill%3D%22%23a7f3d0%22%2F%3E%3Ccircle%20cx%3D%22380%22%20cy%3D%2270%22%20r%3D%2230%22%20fill%3D%22%23fef08a%22%2F%3E%3Cpath%20d%3D%22M0%20170q60-30%20120%200t120%200%20120%200%20120%200v100H0z%22%20fill%3D%22%230d9488%22%2F%3E%3Cpath%20d%3D%22M0%20210q60-30%20120%200t120%200%20120%200%20120%200v60H0z%22%20fill%3D%22%23115e59%22%2F%3E%3C%2Fsvg%3E', alt: 'Costa con olas suaves y sol bajo', caption: 'Costa norte', ar: '16/9', w: 480, h: 270 },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22450%22%20viewBox%3D%220%200%20300%20450%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23d9f99d%22%2F%3E%3Cpath%20d%3D%22M150%2040%20230%20200H70Z%22%20fill%3D%22%2314532d%22%2F%3E%3Cpath%20d%3D%22M150%20120%20245%20300H55Z%22%20fill%3D%22%23166534%22%2F%3E%3Cpath%20d%3D%22M150%20200%20260%20400H40Z%22%20fill%3D%22%2315803d%22%2F%3E%3Crect%20y%3D%22400%22%20width%3D%22300%22%20height%3D%2250%22%20fill%3D%22%23713f12%22%2F%3E%3C%2Fsvg%3E', alt: 'Bosque de pinos alto sobre tierra marrón', caption: 'Bosque de pinos', ar: '2/3', w: 300, h: 450 },
  { src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22400%22%20viewBox%3D%220%200%20320%20400%22%3E%3Crect%20width%3D%22320%22%20height%3D%22400%22%20fill%3D%22%23312e81%22%2F%3E%3Ccircle%20cx%3D%22250%22%20cy%3D%2270%22%20r%3D%2222%22%20fill%3D%22%23e0e7ff%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%22180%22%20width%3D%2260%22%20height%3D%22220%22%20fill%3D%22%231e1b4b%22%2F%3E%3Crect%20x%3D%22100%22%20y%3D%22120%22%20width%3D%2270%22%20height%3D%22280%22%20fill%3D%22%231e1b4b%22%2F%3E%3Crect%20x%3D%22180%22%20y%3D%22210%22%20width%3D%2250%22%20height%3D%22190%22%20fill%3D%22%231e1b4b%22%2F%3E%3Crect%20x%3D%22240%22%20y%3D%22150%22%20width%3D%2260%22%20height%3D%22250%22%20fill%3D%22%231e1b4b%22%2F%3E%3Cpath%20d%3D%22M118%20150h12M118%20180h12M195%20240h12M195%20270h12%22%20stroke%3D%22%23fde68a%22%20stroke-width%3D%226%22%2F%3E%3C%2Fsvg%3E', alt: 'Calle nocturna con edificios iluminados', caption: 'Calle nocturna', ar: '4/5', w: 320, h: 400 },
];

const open = ref<Shot | null>(null);
const dlg = ref<HTMLDialogElement>();
let opener: HTMLElement | null = null;

function show(s: Shot, e: MouseEvent) {
  opener = e.currentTarget as HTMLElement;
  open.value = s;
  dlg.value?.showModal();
}

function onClose() {
  open.value = null;
  opener?.focus();
}
</script>

<template>
  <main class="gal" aria-labelledby="gallery-title">
    <h1 id="gallery-title">Galería de proyectos</h1>
    <p class="lead">Pasa el cursor o usa el teclado para ver el pie. Pulsa una imagen para ampliarla.</p>
    <ul class="masonry">
      <li v-for="s in SHOTS" :key="s.caption">
        <button type="button" class="shot" :style="{ '--ar': s.ar }" aria-haspopup="dialog" @click="show(s, $event)">
          <img :src="s.src" :alt="s.alt" :width="s.w" :height="s.h" loading="lazy" />
          <span class="cap">{{ s.caption }}</span>
        </button>
      </li>
    </ul>
    <dialog ref="dlg" aria-label="Imagen ampliada" @close="onClose">
      <figure v-if="open">
        <img :src="open.src" :alt="open.alt" :width="open.w" :height="open.h" loading="lazy" />
        <figcaption>{{ open.caption }}</figcaption>
      </figure>
      <button type="button" class="close" aria-label="Cerrar imagen" @click="dlg?.close()">×</button>
    </dialog>
  </main>
</template>

<style scoped>
.gal { max-width: 960px; margin: 0 auto; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
h1 { margin: 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; }
.lead { margin: 4px 0 18px; color: var(--muted); }
.masonry { columns: 3; column-gap: 12px; margin: 0; padding: 0; list-style: none; }
.masonry li { break-inside: avoid; margin: 0 0 12px; }
@media (max-width: 767px) { .masonry { columns: 2; } }
@media (max-width: 479px) { .masonry { columns: 1; } }
.shot { position: relative; display: block; width: 100%; padding: 0; overflow: hidden; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); cursor: zoom-in; }
.shot img { display: block; width: 100%; height: auto; aspect-ratio: var(--ar, 4 / 3); object-fit: cover; transition: transform .4s ease; }
.shot:hover img { transform: scale(1.03); }
.shot:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.cap { position: absolute; inset: auto 0 0; padding: 28px 12px 10px; color: rgba(255, 255, 255, .96); font-size: 13px; font-weight: 600; text-align: left; background: linear-gradient(transparent, rgba(0, 0, 0, .72)); opacity: 0; transition: opacity .2s ease; }
.shot:hover .cap, .shot:focus-visible .cap { opacity: 1; }
dialog { width: min(92vw, 900px); max-height: 92vh; padding: 0; overflow: auto; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
dialog::backdrop { background: rgba(0, 0, 0, .6); }
dialog figure { margin: 0; padding: 12px; }
dialog img { display: block; width: auto; height: auto; max-width: 100%; max-height: 72vh; margin: 0 auto; border-radius: min(var(--radius), 6px); }
figcaption { margin-top: 10px; font-weight: 600; text-align: center; }
.close { position: absolute; top: 8px; right: 8px; display: grid; place-items: center; width: 32px; height: 32px; padding: 0; font-size: 20px; line-height: 1; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; }
.close:hover { border-color: var(--accent); }
.close:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } .shot:hover img { transform: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
