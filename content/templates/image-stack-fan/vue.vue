<script setup lang="ts">
import { ref } from 'vue';

type Photo = { title: string; alt: string; src: string };

const PHOTOS: Photo[] = [
  { title: 'Montañas', alt: 'Montañas bajo un cielo anaranjado', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23ffd6a5%22%2F%3E%3Ccircle%20cx%3D%22160%22%20cy%3D%22110%22%20r%3D%2240%22%20fill%3D%22%23ff9770%22%2F%3E%3Cpath%20d%3D%22M0%20200L90%20110l60%2050%2070-70%20100%20110z%22%20fill%3D%22%236d597a%22%2F%3E%3C%2Fsvg%3E' },
  { title: 'Olas', alt: 'Olas azules bajo un sol rosado', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23bde0fe%22%2F%3E%3Ccircle%20cx%3D%22250%22%20cy%3D%2250%22%20r%3D%2222%22%20fill%3D%22%23ffc8dd%22%2F%3E%3Cpath%20d%3D%22M0%20120q40-20%2080%200t80%200%2080%200%2080%200v80H0z%22%20fill%3D%22%233a86ff%22%2F%3E%3Cpath%20d%3D%22M0%20150q40-20%2080%200t80%200%2080%200%2080%200v50H0z%22%20fill%3D%22%231d4ed8%22%2F%3E%3C%2Fsvg%3E' },
  { title: 'Bosque', alt: 'Bosque de pinos con hierba clara', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23d8f3dc%22%2F%3E%3Cpath%20d%3D%22M40%20170L70%2090l30%2080zM110%20170l30-110%2030%20110zM190%20170l30-85%2030%2085zM260%20170l25-65%2025%2065z%22%20fill%3D%22%232d6a4f%22%2F%3E%3Crect%20y%3D%22170%22%20width%3D%22320%22%20height%3D%2230%22%20fill%3D%22%2374c69d%22%2F%3E%3C%2Fsvg%3E' },
  { title: 'Bloques', alt: 'Bloques de colores redondeados', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23fde2e4%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%2230%22%20width%3D%22110%22%20height%3D%2270%22%20rx%3D%2212%22%20fill%3D%22%23e63946%22%2F%3E%3Crect%20x%3D%22160%22%20y%3D%2230%22%20width%3D%22130%22%20height%3D%2250%22%20rx%3D%2212%22%20fill%3D%22%23f4a261%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%22120%22%20width%3D%22260%22%20height%3D%2250%22%20rx%3D%2212%22%20fill%3D%22%23457b9d%22%2F%3E%3C%2Fsvg%3E' },
];

const STEPS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const order = ref<Photo[]>([...PHOTOS]);
const open = ref(false);

function rotate(step: number) {
  const k = (step + order.value.length) % order.value.length;
  order.value = [...order.value.slice(k), ...order.value.slice(0, k)];
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key in STEPS) {
    e.preventDefault();
    rotate(STEPS[e.key]);
  }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    open.value = !open.value;
  }
}
</script>

<template>
  <main class="wrap" aria-labelledby="fan-title">
    <h1 id="fan-title">Pila de fotos</h1>
    <p id="fan-hint" class="hint">
      Pasa el cursor, toca la pila o enfócala para abrirla. Enter o Espacio la abren y las flechas cambian la foto de arriba.
    </p>
    <div class="stage">
      <div
        class="stack"
        role="group"
        tabindex="0"
        aria-label="Pila de fotos"
        aria-describedby="fan-hint"
        :data-open="open ? 'true' : 'false'"
        @click="open = !open"
        @keydown="onKeyDown"
      >
        <figure v-for="(photo, p) in order" :key="photo.title" class="card" :style="{ '--p': p }">
          <img :src="photo.src" :alt="photo.alt" width="320" height="200" loading="lazy" />
          <figcaption>{{ photo.title }}</figcaption>
        </figure>
      </div>
    </div>
    <div class="bar">
      <p id="now" aria-live="polite">Arriba: {{ order[0].title }}</p>
      <button type="button" class="btn" @click="rotate(1)">Barajar</button>
    </div>
  </main>
</template>

<style scoped>
.wrap { max-width: 560px; margin: 0 auto; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
h1 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; }
.hint { margin: 0 0 16px; color: var(--muted); font-size: 13px; }
.stage { display: grid; place-items: center; height: 220px; padding: 14px; overflow: hidden; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.stack { position: relative; width: min(160px, 46vw); aspect-ratio: 4 / 3; outline-offset: 6px; }
.card { position: absolute; inset: 0; margin: 0; overflow: hidden; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); --d: calc(var(--p) - 1.5); --rot: calc(var(--d) * 8deg); transform: translate(calc(var(--p) * 2px), calc(var(--p) * -2px)); z-index: calc(4 - var(--p)); transition: transform .35s ease; }
.stack:is(:hover, :focus-within, [data-open="true"]) .card { transform: translateX(calc(var(--d) * 26%)) rotate(var(--rot)); }
.card img { display: block; width: 100%; height: 100%; object-fit: cover; }
.card figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 6px 10px; background: var(--surface); border-top: 1px solid var(--border); font-size: 12px; font-weight: 600; }
.bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-top: 14px; }
.bar p { margin: 0; color: var(--muted); font-size: 13px; }
.btn { font: 600 13px system-ui, -apple-system, "Segoe UI", sans-serif; padding: 8px 16px; color: var(--accent-ink); background: var(--accent); border: 1px solid var(--accent); border-radius: 999px; cursor: pointer; }
.btn:hover { opacity: .9; }
.stack:focus-visible, .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .card { --rot: 0deg; transition: none; } }
</style>
