<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type Track = { name: string; artist: string; d: number }; // d: segundos
const tracks: Track[] = [
  { name: 'Marea de neón', artist: 'Lumen Ensemble', d: 214 },
  { name: 'Horizonte lento', artist: 'Aurora Sur', d: 187 },
  { name: 'Código abierto', artist: 'Nube Cuántica', d: 245 },
  { name: 'Luz de madrugada', artist: 'Lumen Ensemble', d: 172 },
];
const PLAY = 'M8 5v14l11-7z', PAUSE = 'M6 5h4v14H6zm8 0h4v14h-4z';
const N = 60;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const i = ref(0), t = ref(0), on = ref(false);
const cur = computed(() => tracks[i.value]);
const bars = computed(() => Array.from({ length: N }, (_, k) =>
  8 + 38 * Math.abs(Math.sin((k + 2) * (i.value + 3) * 0.9) * Math.cos(k * 0.31 + i.value))));
let last = 0, raf = 0;

function tick(now: number) {
  t.value += (now - last) / 1000; last = now; raf = requestAnimationFrame(tick);
}
function toggle() {
  on.value = !on.value; cancelAnimationFrame(raf);
  if (on.value) { last = performance.now(); raf = requestAnimationFrame(tick); }
}
const go = (n: number) => { i.value = n; t.value = 0; };
const prev = () => (t.value > 3 ? (t.value = 0) : go((i.value + tracks.length - 1) % tracks.length));
const pick = (k: number) => { go(k); if (!on.value) toggle(); };
watch(t, (v) => {
  if (v < cur.value.d) return;
  if (i.value < tracks.length - 1) go(i.value + 1); else { go(0); if (on.value) toggle(); }
});
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <section class="player" :class="{ playing: on }" aria-label="Reproductor de audio">
    <div class="now">
      <div class="cover"><svg class="i" viewBox="0 0 24 24"><path d="M12 3v10.6A4 4 0 1 0 14 17V7h4V3z" /></svg></div>
      <div><h2>{{ cur.name }}</h2><p>{{ cur.artist }}</p></div>
    </div>
    <div class="wave">
      <svg viewBox="0 0 240 48" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" x2="240"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
        <rect v-for="(h, k) in bars" :key="k" :x="k * 4" :y="(48 - h) / 2" width="2.4" :height="h" rx="1.2" :class="{ on: k / N < t / cur.d }" />
      </svg>
      <input type="range" min="0" :max="cur.d" step="1" :value="Math.floor(t)" aria-label="Posición de la pista"
             :aria-valuetext="`${fmt(t)} de ${fmt(cur.d)}`" @input="t = +($event.target as HTMLInputElement).value" />
    </div>
    <div class="ctl">
      <span class="time">{{ fmt(t) }}</span>
      <div class="btns">
        <button type="button" aria-label="Pista anterior" @click="prev"><svg class="i" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg></button>
        <button type="button" class="main" :aria-label="on ? 'Pausar' : 'Reproducir'" @click="toggle"><svg class="i" viewBox="0 0 24 24"><path :d="on ? PAUSE : PLAY" /></svg></button>
        <button type="button" aria-label="Pista siguiente" @click="go((i + 1) % tracks.length)"><svg class="i" viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" /></svg></button>
      </div>
      <span class="time">{{ fmt(cur.d) }}</span>
    </div>
    <ol>
      <li v-for="(tr, k) in tracks" :key="tr.name">
        <button type="button" class="trk" :aria-current="k === i ? 'true' : undefined" @click="pick(k)">
          <span class="n">{{ k + 1 }}</span><span class="eq" aria-hidden="true"><i /><i /><i /></span>
          <span><b class="t">{{ tr.name }}</b><small>{{ tr.artist }}</small></span>
          <span class="d">{{ fmt(tr.d) }}</span>
        </button>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.player{max-width:480px;margin:0 auto;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.now{display:flex;gap:12px;align-items:center;padding:16px 16px 8px}
.cover{flex:none;display:grid;place-items:center;width:48px;height:48px;border-radius:var(--radius);background:var(--accent-soft);color:var(--accent)}
.now h2{margin:0;font-size:15px;font-weight:600}
.now p{margin:0;color:var(--muted)}
.wave{position:relative;margin:8px 16px 0;height:48px;border-radius:4px}
.wave svg{display:block;width:100%;height:100%}
.wave rect{fill:var(--muted);opacity:.35;transition:opacity .12s}
.wave rect.on{fill:url(#g);opacity:1}
.wave input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
.wave:focus-within{outline:2px solid var(--accent);outline-offset:2px}
.ctl{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:8px 16px 12px}
.time{color:var(--muted);font-variant-numeric:tabular-nums}
.ctl .time:last-child{text-align:right}
.btns{display:flex;gap:4px;align-items:center}
button{font:inherit;color:var(--text);background:transparent;border:1px solid transparent;border-radius:var(--radius);height:36px;min-width:36px;display:inline-grid;place-items:center;cursor:pointer;transition:background .14s}
button:hover{background:var(--accent-soft)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
svg.i{width:18px;height:18px;fill:currentColor}
.btns .main{width:40px;height:40px;border-radius:50%;background:var(--accent);color:var(--accent-ink)}
.btns .main:hover{background:var(--accent);filter:brightness(1.1)}
ol{list-style:none;margin:0;padding:4px;border-top:1px solid var(--border)}
.trk{display:grid;grid-template-columns:24px 1fr auto;gap:12px;place-items:center start;width:100%;height:auto;padding:8px 12px;text-align:left}
.trk>*{min-width:0}
.trk .n,.trk .eq{grid-area:1/1}
.trk .n{color:var(--muted);font-variant-numeric:tabular-nums}
.trk small{display:block;color:var(--muted);font-size:12px}
.trk .d{color:var(--muted);font-variant-numeric:tabular-nums}
.trk[aria-current]{background:var(--accent-soft)}
.trk[aria-current] .t{font-weight:600}
.eq{display:none;gap:2px;align-items:flex-end;height:14px}
.eq i{width:3px;height:100%;border-radius:1px;background:var(--accent);transform:scaleY(.4);transform-origin:bottom}
.trk[aria-current] .eq{display:flex}
.trk[aria-current] .n{display:none}
.playing .eq i{animation:eq .9s ease-in-out infinite alternate}
.eq i:nth-child(2){animation-delay:-.3s}.eq i:nth-child(3){animation-delay:-.6s}
@keyframes eq{to{transform:scaleY(1)}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
