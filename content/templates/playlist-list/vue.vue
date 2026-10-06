<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type Track = { title: string; artist: string; album: string; d: number }; // d: segundos
const tracks: Track[] = [
  { title: 'Primer plano', artist: 'Estudio Alba', album: 'Foco', d: 198 },
  { title: 'Teclas de lluvia', artist: 'Marisol Vega', album: 'Foco', d: 224 },
  { title: 'Cinta magnética', artist: 'Estudio Alba', album: 'Archivo', d: 176 },
  { title: 'Ventana abierta', artist: 'Tomás Rey', album: 'Archivo', d: 241 },
  { title: 'Frecuencia baja', artist: 'Marisol Vega', album: 'Foco', d: 205 },
  { title: 'Última hora', artist: 'Tomás Rey', album: 'Archivo', d: 189 },
];
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const cur = ref(1), el = ref(47), on = ref(false);
const rows = ref<HTMLButtonElement[]>([]);
const total = computed(() => tracks.reduce((a, t) => a + t.d, 0));
let timer = 0;

function setPlay(v: boolean) {
  on.value = v; clearInterval(timer);
  if (v) timer = window.setInterval(() => el.value++, 1000);
}
function pick(k: number) {
  if (k === cur.value) setPlay(!on.value); else { cur.value = k; el.value = 0; setPlay(true); }
}
watch(el, (v) => {
  if (v < tracks[cur.value].d) return;
  if (cur.value < tracks.length - 1) cur.value++; else { cur.value = 0; setPlay(false); }
  el.value = 0;
});
function onKey(e: KeyboardEvent) {
  const i = rows.value.indexOf(document.activeElement as HTMLButtonElement);
  const j = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : -1;
  if (j >= 0 && j < tracks.length) { rows.value[j].focus(); e.preventDefault(); }
}
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <section class="pl" :class="{ playing: on }" aria-labelledby="h">
    <header class="head">
      <div class="art"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h12v2H4zm0 4h12v2H4zm0 4h8v2H4zm12 0v6l5-3z" /></svg></div>
      <div><h2 id="h">Música para enfocarse</h2><p class="meta">{{ tracks.length }} pistas, {{ Math.floor(total / 60) }} min {{ total % 60 }} s</p></div>
      <button type="button" class="btn" @click="setPlay(!on)">{{ on ? 'Pausar' : 'Reproducir' }}</button>
    </header>
    <ol @keydown="onKey">
      <li v-for="(t, k) in tracks" :key="t.title">
        <button ref="rows" type="button" class="row" :aria-current="k === cur ? 'true' : undefined"
                :style="k === cur ? { '--p': `${(el / t.d) * 100}%` } : undefined" @click="pick(k)">
          <span class="n">{{ k + 1 }}</span><span class="eq" aria-hidden="true"><i /><i /><i /></span>
          <span class="info"><b>{{ t.title }}</b><small>{{ t.artist }}</small></span>
          <span class="alb">{{ t.album }}</span>
          <span class="dur">{{ k === cur ? `${fmt(el)} / ${fmt(t.d)}` : fmt(t.d) }}</span>
          <i class="bar" aria-hidden="true" />
        </button>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.pl{max-width:640px;margin:0 auto;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;align-items:center;gap:14px;padding:16px;border-bottom:1px solid var(--border)}
.art{flex:none;display:grid;place-items:center;width:48px;height:48px;color:var(--accent);background:var(--accent-soft);border-radius:var(--radius)}
.art svg{width:22px;height:22px;fill:currentColor}
.head div:nth-child(2){flex:1;min-width:0}
h2{margin:0;font-size:16px;font-weight:600}
.meta{margin:0;color:var(--muted);font-variant-numeric:tabular-nums}
.btn{height:36px;padding:0 16px;font:inherit;font-weight:500;color:var(--accent-ink);background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius);cursor:pointer;transition:filter .14s}
.btn:hover{filter:brightness(1.1)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
ol{list-style:none;margin:0;padding:8px}
.row{position:relative;display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:12px;width:100%;padding:10px 12px;font:inherit;color:var(--text);text-align:left;background:transparent;border:0;border-radius:var(--radius);cursor:pointer;transition:background .14s}
.row:hover{background:var(--accent-soft)}
.row:focus-visible{outline-offset:-2px}
.row>*{min-width:0}
.n,.eq{grid-area:1/1}
.n{color:var(--muted);font-variant-numeric:tabular-nums}
.info b{display:block;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.info small{color:var(--muted)}
.alb{display:none;color:var(--muted)}
.dur{color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.row[aria-current]{background:var(--accent-soft)}
.row[aria-current] .info b{font-weight:600}
.row[aria-current] .n{display:none}
.eq{display:none;gap:2px;align-items:flex-end;height:14px}
.row[aria-current] .eq{display:flex}
.eq i{width:3px;height:100%;border-radius:1px;background:var(--accent);transform:scaleY(.4);transform-origin:bottom}
.playing .row[aria-current] .eq i{animation:eq .9s ease-in-out infinite alternate}
.eq i:nth-child(2){animation-delay:-.3s}.eq i:nth-child(3){animation-delay:-.6s}
@keyframes eq{to{transform:scaleY(1)}}
.bar{display:none;position:absolute;left:12px;right:12px;bottom:3px;height:2px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff) 0/var(--p,0%) 100% no-repeat,var(--border)}
.row[aria-current] .bar{display:block}
@media (min-width:520px){.row{grid-template-columns:28px 1fr 140px auto}.alb{display:block}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
