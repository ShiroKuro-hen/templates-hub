<script setup lang="ts">
import { ref } from 'vue';

type Pattern = 'dots' | 'lines' | 'diagonal';

const PATTERNS: { id: Pattern; label: string }[] = [
  { id: 'dots', label: 'Puntos' },
  { id: 'lines', label: 'Cuadrícula' },
  { id: 'diagonal', label: 'Diagonal' },
];
const pattern = ref<Pattern>('dots');
</script>

<template>
  <div class="seg" role="group" aria-label="Patrón de fondo">
    <button
      v-for="p in PATTERNS"
      :key="p.id"
      type="button"
      :aria-pressed="pattern === p.id"
      @click="pattern = p.id"
    >
      {{ p.label }}
    </button>
  </div>
  <section class="stage" aria-labelledby="gdb-title">
    <div class="layer" :data-pattern="pattern" aria-hidden="true" />
    <div class="glow" aria-hidden="true" />
    <div class="content">
      <h1 id="gdb-title">Lanza tu producto con una base clara</h1>
      <p>Plantillas, datos y permisos listos desde el primer día para tu equipo.</p>
      <a class="cta" href="#">Empezar gratis</a>
    </div>
  </section>
</template>

<style scoped>
.seg { display: flex; width: fit-content; margin: 0 auto 16px; padding: 3px; gap: 2px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.seg button { font: inherit; font-size: 13px; font-weight: 600; padding: 6px 12px; border: 0; border-radius: min(var(--radius), 6px); background: none; color: var(--muted); cursor: pointer; }
.seg button:hover { color: var(--text); }
.seg button[aria-pressed="true"] { background: var(--accent-soft); color: var(--accent); }
.stage { --line: color-mix(in srgb, var(--accent) 20%, transparent); --dot: color-mix(in srgb, var(--accent) 45%, transparent); position: relative; isolation: isolate; display: grid; place-items: center; overflow: hidden; min-height: 280px; max-width: 720px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.layer { position: absolute; inset: 0; pointer-events: none; -webkit-mask-image: radial-gradient(ellipse at center, rgb(0 0 0) 25%, transparent 75%); mask-image: radial-gradient(ellipse at center, rgb(0 0 0) 25%, transparent 75%); }
.layer[data-pattern="dots"] { background-image: radial-gradient(circle, var(--dot) 1px, transparent 1.5px); background-size: 20px 20px; }
.layer[data-pattern="lines"] { background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 32px 32px; }
.layer[data-pattern="diagonal"] { background-image: repeating-linear-gradient(45deg, var(--line) 0 1px, transparent 1px 14px); }
.glow { position: absolute; left: 50%; top: 50%; width: min(100%, 480px); aspect-ratio: 1; border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 18%, transparent), transparent); }
.content { position: relative; max-width: 460px; padding: 56px 24px; text-align: center; }
h1 { margin: 0 0 10px; font-size: clamp(24px, 5vw, 34px); line-height: 1.15; letter-spacing: -.02em; }
p { margin: 0 0 20px; color: var(--text); }
.cta { display: inline-block; padding: 10px 18px; background: var(--accent); color: var(--accent-ink); border: 1px solid var(--accent); border-radius: var(--radius); font-weight: 600; text-decoration: none; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
