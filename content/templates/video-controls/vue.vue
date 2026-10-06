<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const props = withDefaults(defineProps<{ title?: string; duration?: number }>(), {
  title: 'Recorrido por el panel de Ion Cloud', duration: 204,
});
const PLAY = 'M8 5v14l11-7z', PAUSE = 'M6 5h4v14H6zm8 0h4v14h-4z';
const VOL = 'M4 9v6h4l5 4V5L8 9zm12 3a4 4 0 0 0-2-3.5v7A4 4 0 0 0 16 12z', OFF = 'M4 9v6h4l5 4V5L8 9z';
const FULL = 'M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z';
const t = ref(0), playing = ref(false), muted = ref(false), vol = ref(80), rate = ref(1), full = ref(false);
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
let last = 0, raf = 0;

function tick(now: number) {
  if (!playing.value) return;
  t.value = Math.min(props.duration, t.value + ((now - last) / 1000) * rate.value); last = now;
  if (t.value >= props.duration) playing.value = false; else raf = requestAnimationFrame(tick);
}
function toggle() {
  if (!playing.value && t.value >= props.duration) t.value = 0;
  playing.value = !playing.value;
  if (playing.value) { last = performance.now(); raf = requestAnimationFrame(tick); }
}
const skip = (s: number) => { t.value = Math.max(0, Math.min(props.duration, t.value + s)); };
function onVol() { muted.value = vol.value === 0; }
function onMute() { muted.value = !muted.value; if (!muted.value && vol.value === 0) vol.value = 50; }
function onKey(e: KeyboardEvent) {
  const native = (e.target as HTMLElement).matches('input, select');
  if (e.key === 'Escape') full.value = false;
  else if (e.key === 'k' || (e.key === ' ' && e.target === e.currentTarget)) toggle();
  else if (!native && e.key === 'ArrowLeft') skip(-5);
  else if (!native && e.key === 'ArrowRight') skip(5);
  else if (e.key === 'm') onMute();
  else if (e.key === 'f') full.value = !full.value;
  else return;
  e.preventDefault();
}
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <section class="player" :class="{ playing, full }" tabindex="0" :aria-label="`Reproductor de vídeo: ${title}`" @keydown="onKey">
    <div class="screen" @click="toggle">
      <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect class="sky" width="160" height="90" />
        <circle class="sun" cx="130" cy="24" r="10" :style="{ transform: `translateX(${(-t / duration) * 110}px)` }" />
        <path class="m1" d="M0 90 50 38l26 26 30-34 54 60z" /><path class="m2" d="M0 90 34 62l28 16 40-26 58 34z" />
      </svg>
      <button type="button" class="big" tabindex="-1" aria-hidden="true"><svg class="i" viewBox="0 0 24 24"><path :d="PLAY" /></svg></button>
    </div>
    <div class="bar">
      <button type="button" :aria-label="playing ? 'Pausar' : 'Reproducir'" @click="toggle"><svg class="i" viewBox="0 0 24 24"><path :d="playing ? PAUSE : PLAY" /></svg></button>
      <span class="time">{{ fmt(t) }} / {{ fmt(duration) }}</span>
      <input class="seek" type="range" min="0" :max="duration" :value="Math.floor(t)" aria-label="Progreso"
             :aria-valuetext="`${fmt(t)} de ${fmt(duration)}`" :style="{ '--p': `${(t / duration) * 100}%` }"
             @input="t = +($event.target as HTMLInputElement).value" />
      <button type="button" :aria-pressed="muted" :aria-label="muted ? 'Activar sonido' : 'Silenciar'" @click="onMute"><svg class="i" viewBox="0 0 24 24"><path :d="muted ? OFF : VOL" /></svg></button>
      <input v-model.number="vol" class="vol" type="range" min="0" max="100" aria-label="Volumen" :aria-valuetext="`${vol} %`" @input="onVol" />
      <select v-model.number="rate" aria-label="Velocidad">
        <option v-for="r in [0.5, 1, 1.25, 1.5, 2]" :key="r" :value="r">{{ String(r).replace('.', ',') }}×</option>
      </select>
      <button type="button" :aria-pressed="full" aria-label="Pantalla completa" @click="full = !full"><svg class="i" viewBox="0 0 24 24"><path :d="FULL" /></svg></button>
    </div>
    <div class="info">
      <h2>{{ title }}</h2>
      <p class="hint"><kbd>K</kbd> reproducir, <kbd>←</kbd><kbd>→</kbd> 5 s, <kbd>M</kbd> silenciar, <kbd>F</kbd> pantalla completa</p>
    </div>
  </section>
</template>

<style scoped>
.player{max-width:760px;margin:0 auto;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.player.full{position:fixed;inset:0;max-width:none;z-index:10;border-radius:0;display:flex;flex-direction:column}
.screen{position:relative;aspect-ratio:16/9;background:var(--info-soft);cursor:pointer}
.full .screen{flex:1;aspect-ratio:auto}
.screen svg{position:absolute;inset:0;width:100%;height:100%}
.sky{fill:var(--info-soft)}.sun{fill:var(--warn)}.m1{fill:var(--accent)}.m2{fill:var(--info)}
.big{position:absolute;inset:0;margin:auto;width:56px;height:56px;border-radius:50%;background:var(--surface);box-shadow:var(--shadow);transition:opacity .14s}
.playing .big{opacity:0;pointer-events:none}
.bar{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;padding:8px 12px;border-top:1px solid var(--border)}
button,select{font:inherit;color:var(--text);background:transparent;border:1px solid transparent;border-radius:var(--radius);height:32px;min-width:32px;display:inline-grid;place-items:center;cursor:pointer;transition:background .14s}
select{border-color:var(--border);background:var(--surface);padding:0 6px}
button:hover{background:var(--accent-soft)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
svg.i{width:18px;height:18px;fill:currentColor}
.time{color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.seek{-webkit-appearance:none;appearance:none;flex:1 1 140px;height:4px;margin:0;border-radius:999px;cursor:pointer;background:linear-gradient(135deg,#22d3ee,#2f5bff) 0/var(--p,0%) 100% no-repeat,var(--border)}
.seek::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--surface);border:1px solid var(--accent);box-shadow:var(--shadow)}
.seek::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:var(--surface);border:1px solid var(--accent)}
.vol{width:72px;accent-color:var(--accent)}
.info{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:10px 12px 12px;border-top:1px solid var(--border)}
.info h2{margin:0;font-size:15px;font-weight:600}
.hint{margin:0;color:var(--muted);font-size:12px}
kbd{font:12px ui-monospace,"Cascadia Code",Menlo,monospace;padding:0 4px;border:1px solid var(--border);border-radius:4px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
