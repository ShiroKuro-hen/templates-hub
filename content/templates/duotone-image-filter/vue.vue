<script setup lang="ts">
import { reactive, ref } from 'vue';

type Photo = { title: string; alt: string; src: string };

const PHOTOS: Photo[] = [
  { title: 'Costa de pinos', alt: 'Costa azul con pinos junto al mar', src: '/stock/costa-azul.webp' },
  { title: 'Calle de ciudad', alt: 'Calle de ciudad entre edificios altos', src: '/stock/calle-ciudad.webp' },
  { title: 'Escritorio de madera', alt: 'Escritorio de madera con portátil', src: '/stock/escritorio-madera.webp' },
];

const intensity = ref(100);
const duo = reactive<boolean[]>(PHOTOS.map(() => true));
</script>

<template>
  <main class="wrap" aria-labelledby="duo-title">
    <header class="head">
      <h1 id="duo-title">Galería en duotono</h1>
      <label class="ctrl">
        Intensidad
        <input v-model.number="intensity" type="range" min="0" max="100" />
      </label>
    </header>
    <ul class="grid" :style="{ '--k': intensity / 100 }">
      <li v-for="(photo, i) in PHOTOS" :key="photo.title">
        <figure class="card" :class="{ duo: duo[i] }">
          <div class="frame">
            <img :src="photo.src" :alt="photo.alt" width="800" height="533" loading="lazy" />
          </div>
          <figcaption class="cap">
            <span class="title">{{ photo.title }}</span>
            <span class="seg" role="group" :aria-label="`Modo de color: ${photo.title}`">
              <button type="button" :aria-pressed="!duo[i]" @click="duo[i] = false">Original</button>
              <button type="button" :aria-pressed="duo[i]" @click="duo[i] = true">Duotono</button>
            </span>
          </figcaption>
        </figure>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.wrap { max-width: 760px; margin: 0 auto; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
.head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
h1 { margin: 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; }
.ctrl { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 13px; font-weight: 600; }
.ctrl input { width: 160px; accent-color: var(--accent); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin: 0; padding: 0; list-style: none; }
.card { margin: 0; overflow: hidden; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.frame { position: relative; isolation: isolate; }
.frame img { display: block; width: 100%; height: auto; aspect-ratio: 3 / 2; object-fit: cover; }
.frame::before, .frame::after { content: ""; position: absolute; inset: 0; z-index: 1; opacity: 0; pointer-events: none; transition: opacity .25s ease; }
.duo .frame img { filter: grayscale(1); }
.duo .frame::before { background: var(--accent); mix-blend-mode: multiply; opacity: var(--k); }
.duo .frame::after { background: var(--bg); mix-blend-mode: soft-light; opacity: var(--k); }
.cap { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px; }
.title { font-weight: 600; }
.seg { display: inline-flex; gap: 4px; }
.seg button { font: 600 12px system-ui, -apple-system, "Segoe UI", sans-serif; padding: 4px 12px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 999px; cursor: pointer; }
.seg button:hover { border-color: var(--accent); }
.seg button[aria-pressed="true"] { color: var(--accent-ink); background: var(--accent); border-color: var(--accent); }
.seg button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .frame::before, .frame::after { transition: none; } }
</style>
