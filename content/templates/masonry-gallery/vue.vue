<script setup lang="ts">
import { ref } from 'vue';

type Shot = { src: string; alt: string; caption: string; ar: string; w: number; h: number };

const SHOTS: Shot[] = [
  { src: '/stock/costa-azul.webp', alt: 'Costa con pinos y mar azul', caption: 'Costa azul con pinos', ar: '16/9', w: 800, h: 533 },
  { src: '/stock/valle-bruma.webp', alt: 'Valle verde cubierto de bruma', caption: 'Valle con bruma', ar: '4/5', w: 800, h: 533 },
  { src: '/stock/calle-ciudad.webp', alt: 'Calle de la ciudad entre edificios altos', caption: 'Calle entre edificios', ar: '1/1', w: 800, h: 533 },
  { src: '/stock/montana-nieve.webp', alt: 'Picos montañosos cubiertos de nieve', caption: 'Picos nevados', ar: '3/4', w: 800, h: 533 },
  { src: '/stock/puente-noche.webp', alt: 'Puente y skyline de noche en blanco y negro', caption: 'Puente de noche', ar: '2/3', w: 800, h: 533 },
  { src: '/stock/canon-verde.webp', alt: 'Cañón verde con un arroyo', caption: 'Cañón verde', ar: '4/3', w: 800, h: 533 },
  { src: '/stock/isla-blanca.webp', alt: 'Pueblo blanco frente al mar', caption: 'Pueblo blanco junto al mar', ar: '4/5', w: 800, h: 533 },
  { src: '/stock/puerta-antigua.webp', alt: 'Puerta de madera antigua en un muro de piedra', caption: 'Puerta antigua', ar: '3/4', w: 800, h: 533 },
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
    <h1 id="gallery-title">Galería de paisajes y ciudad</h1>
    <p class="lead">Pasa el cursor o usa el teclado para ver el pie. Pulsa una imagen para ampliarla.</p>
    <ul class="masonry">
      <li v-for="s in SHOTS" :key="s.caption">
        <button type="button" class="shot" :style="{ '--ar': s.ar }" aria-haspopup="dialog" @click="show(s, $event)">
          <img :src="s.src" :alt="s.alt" :width="s.w" :height="s.h" decoding="async" />
          <span class="cap">{{ s.caption }}</span>
        </button>
      </li>
    </ul>
    <dialog ref="dlg" aria-label="Imagen ampliada" @close="onClose">
      <figure v-if="open">
        <img :src="open.src" :alt="open.alt" :width="open.w" :height="open.h" />
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
