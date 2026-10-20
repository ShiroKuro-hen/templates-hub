<script setup lang="ts">
import { reactive, ref } from 'vue';

type Photo = { title: string; alt: string; src: string };

const PHOTOS: Photo[] = [
  { title: 'Colinas al atardecer', alt: 'Colinas y montañas al atardecer', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23f4d58d%22%2F%3E%3Ccircle%20cx%3D%22240%22%20cy%3D%2262%22%20r%3D%2226%22%20fill%3D%22%23e76f51%22%2F%3E%3Cpath%20d%3D%22M0%20150l70-70%2055%2050%2045-40%2060%2060%2090-70v120H0z%22%20fill%3D%22%232a9d8f%22%2F%3E%3Cpath%20d%3D%22M0%20200v-30l110-30%2080%2020%20130-25v65z%22%20fill%3D%22%23264653%22%2F%3E%3C%2Fsvg%3E' },
  { title: 'Ciudad iluminada', alt: 'Edificios con ventanas iluminadas', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%238ecae6%22%2F%3E%3Ccircle%20cx%3D%2260%22%20cy%3D%2250%22%20r%3D%2218%22%20fill%3D%22%23fefae0%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2290%22%20width%3D%2250%22%20height%3D%22110%22%20fill%3D%22%23023047%22%2F%3E%3Crect%20x%3D%2280%22%20y%3D%2260%22%20width%3D%2260%22%20height%3D%22140%22%20fill%3D%22%23219ebc%22%2F%3E%3Crect%20x%3D%22150%22%20y%3D%22100%22%20width%3D%2245%22%20height%3D%22100%22%20fill%3D%22%23126782%22%2F%3E%3Crect%20x%3D%22205%22%20y%3D%2245%22%20width%3D%2270%22%20height%3D%22155%22%20fill%3D%22%23023047%22%2F%3E%3Crect%20x%3D%22225%22%20y%3D%2270%22%20width%3D%228%22%20height%3D%2210%22%20fill%3D%22%23ffb703%22%2F%3E%3Crect%20x%3D%22242%22%20y%3D%2270%22%20width%3D%228%22%20height%3D%2210%22%20fill%3D%22%23ffb703%22%2F%3E%3Crect%20x%3D%22225%22%20y%3D%22100%22%20width%3D%228%22%20height%3D%2210%22%20fill%3D%22%23ffb703%22%2F%3E%3C%2Fsvg%3E' },
  { title: 'Formas de color', alt: 'Círculos de colores superpuestos', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23e9e3ff%22%2F%3E%3Ccircle%20cx%3D%22110%22%20cy%3D%22100%22%20r%3D%2270%22%20fill%3D%22%237b61ff%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%2290%22%20r%3D%2260%22%20fill%3D%22%23ff8fab%22%20opacity%3D%22.85%22%2F%3E%3Ccircle%20cx%3D%22160%22%20cy%3D%22150%22%20r%3D%2240%22%20fill%3D%22%233ddbd9%22%20opacity%3D%22.8%22%2F%3E%3C%2Fsvg%3E' },
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
            <img :src="photo.src" :alt="photo.alt" width="320" height="200" loading="lazy" />
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
.frame img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; }
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
