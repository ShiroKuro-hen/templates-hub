<script setup lang="ts">
const SOURCES = [
  { label: 'Base de datos', d: 'M5 5c0-1.7 3.1-3 7-3s7 1.3 7 3v14c0 1.7-3.1 3-7 3s-7-1.3-7-3zM5 5c0 1.7 3.1 3 7 3s7-1.3 7-3M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3' },
  { label: 'Correo', d: 'M3 5h18v14H3zM3 7l9 6 9-6' },
  { label: 'Hojas de cálculo', d: 'M3 4h18v16H3zM3 10h18M9 4v16' },
];

const TRACKS = [
  { d: 'M44 40C196 40 196 101 345 101', delay: '-0.6s' },
  { d: 'M44 120H338', delay: '-1.4s' },
  { d: 'M44 200C196 200 196 139 345 139', delay: '-2s' },
];
</script>

<template>
  <div class="beam" role="img" aria-label="Tres fuentes de datos (base de datos, correo y hojas de cálculo) conectadas a un panel central">
    <svg class="beam-svg" viewBox="0 0 420 240" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="beam-grad" gradientUnits="userSpaceOnUse" x1="44" y1="0" x2="370" y2="0">
          <stop offset="0" style="stop-color: var(--accent-2, #22d3ee)" />
          <stop offset="1" style="stop-color: var(--accent)" />
        </linearGradient>
      </defs>
      <path v-for="t in TRACKS" :key="t.d" class="track" :d="t.d" />
      <path v-for="t in TRACKS" :key="t.d + 'run'" class="beam-run" pathLength="100" :d="t.d" :style="{ animationDelay: t.delay }" />
    </svg>
    <ul class="srcs">
      <li v-for="s in SOURCES" :key="s.label" class="src">
        <svg viewBox="0 0 24 24">
          <path :d="s.d" />
        </svg>
      </li>
    </ul>
    <div class="hub">
      <svg viewBox="0 0 24 24">
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      </svg>
    </div>
  </div>
  <p class="caption">Datos, correo y tablas llegan a un mismo panel en tiempo real.</p>
</template>

<style scoped>
.beam { position: relative; width: 100%; max-width: 420px; margin: 0 auto; aspect-ratio: 420 / 240; }
.beam-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.track { fill: none; stroke: var(--border); stroke-width: 2; stroke-linecap: round; }
.beam-run { fill: none; stroke: url(#beam-grad); stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 14 86; animation: beam-flow 2.4s linear infinite; }
.srcs { position: absolute; inset: 0; margin: 0; padding: 0; list-style: none; }
.src { position: absolute; left: 0; width: 10.476%; aspect-ratio: 1; transform: translateY(-50%); display: grid; place-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); color: var(--accent); }
.src:nth-child(1) { top: 16.667%; }
.src:nth-child(2) { top: 50%; }
.src:nth-child(3) { top: 83.333%; }
.src svg { width: 50%; height: 50%; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.hub { position: absolute; left: 80.476%; top: 50%; width: 15.238%; aspect-ratio: 1; transform: translateY(-50%); display: grid; place-items: center; border-radius: 50%; background: linear-gradient(135deg, var(--accent-2, #22d3ee), var(--accent, #2f5bff)); color: var(--accent-ink); box-shadow: var(--shadow); }
.hub svg { width: 45%; height: 45%; fill: currentColor; }
.hub::after { content: ""; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid var(--accent); animation: hub-pulse 2.4s ease-out infinite; }
.caption { max-width: 420px; margin: 14px auto 0; color: var(--muted); text-align: center; font-size: 13px; }
@keyframes beam-flow { to { stroke-dashoffset: -100; } }
@keyframes hub-pulse { 0% { opacity: 0.7; transform: scale(0.9); } 100% { opacity: 0; transform: scale(1.3); } }
@media (prefers-reduced-motion: reduce) { .beam-run, .hub::after { display: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
