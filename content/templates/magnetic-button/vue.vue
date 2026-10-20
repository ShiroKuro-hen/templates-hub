<script setup lang="ts">
import { ref } from 'vue';

const PULL = 0.3;
const MAX = 8;
const saved = ref(false);
const offset = (d: number) => `${Math.max(-MAX, Math.min(MAX, d * PULL))}px`;

// Mueve el botón hacia el cursor dentro de su zona; el táctil no se desplaza.
function follow(e: PointerEvent) {
  if (e.pointerType === 'touch') return;
  const zone = e.currentTarget as HTMLElement;
  const r = zone.getBoundingClientRect();
  const btn = zone.querySelector<HTMLElement>('.mag');
  btn?.style.setProperty('--tx', offset(e.clientX - r.left - r.width / 2));
  btn?.style.setProperty('--ty', offset(e.clientY - r.top - r.height / 2));
}

function reset(e: PointerEvent) {
  const btn = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('.mag');
  btn?.style.setProperty('--tx', '0px');
  btn?.style.setProperty('--ty', '0px');
}
</script>

<template>
  <main class="stage">
    <div class="zone" @pointermove="follow" @pointerleave="reset">
      <button type="button" class="mag primary">Empezar gratis</button>
    </div>
    <div class="zone" @pointermove="follow" @pointerleave="reset">
      <button
        type="button"
        class="mag icon"
        :aria-pressed="saved"
        aria-label="Guardar en favoritos"
        @click="saved = !saved"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 3h12v18l-6-4-6 4z" />
        </svg>
      </button>
    </div>
  </main>
</template>

<style scoped>
.stage { --dur: .35s; --ease: cubic-bezier(.2,.8,.2,1); --halo: 0 0 0 4px var(--accent-soft), 0 10px 26px -8px var(--accent); display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; max-width: 520px; margin: 0 auto; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.zone { display: inline-block; padding: 24px; }
.mag { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 44px; font: inherit; font-size: 14px; font-weight: 600; line-height: 1; border: 1px solid transparent; border-radius: var(--radius); cursor: pointer; transition: transform var(--dur) var(--ease), box-shadow .3s ease, border-color .2s, background-color .2s, color .2s; }
.primary { padding: 0 18px; background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
.icon { width: 44px; padding: 0; border-radius: 50%; border-color: var(--border); background: var(--surface); color: var(--text); }
.icon[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
.icon svg { width: 18px; height: 18px; }
.mag:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; box-shadow: var(--halo); }
@media (hover: hover) and (pointer: fine) { .mag { transform: translate(var(--tx, 0px), var(--ty, 0px)); } .mag:hover { box-shadow: var(--halo); } }
@media (prefers-reduced-motion: reduce) { .mag { transition: none !important; transform: none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
</content>
