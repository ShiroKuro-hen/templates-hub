<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

type Scene = { title: string; bg: string; p: [string, string][] }; // clase de relleno + trazo
const SUN = 'M108 28a12 12 0 1 0 24 0a12 12 0 1 0-24 0';
const scenes: Scene[] = [
  { title: 'Sierra al amanecer', bg: 'bw', p: [['fw', SUN], ['fa', 'M0 100V70L40 38l28 28 26-22 66 56z'], ['fi', 'M0 100 50 74l40 14 70-18v30z']] },
  { title: 'Costa norte', bg: 'bi', p: [['fw', 'M28 26a10 10 0 1 0 20 0a10 10 0 1 0-20 0'], ['fi', 'M0 62q20-10 40 0t40 0t40 0t40 0V100H0z'], ['fa', 'M0 80q20-10 40 0t40 0t40 0t40 0V100H0z']] },
  { title: 'Ciudad nocturna', bg: 'ba', p: [['fi', 'M122 20a8 8 0 1 0 16 0a8 8 0 1 0-16 0'], ['fa', 'M10 100V50h22v50zM38 100V28h26v72zM70 100V58h20v42zM96 100V40h24v60zM126 100V60h24v40z']] },
  { title: 'Valle verde', bg: 'bo', p: [['fw', SUN], ['fo', 'M0 100V64q40-30 80 0t80 0v36z']] },
  { title: 'Atardecer en la loma', bg: 'be', p: [['fe', 'M60 70a20 20 0 0 1 40 0z'], ['fa', 'M0 100V74l30-10 40 14 40-16 50 12v26z']] },
];
const n = ref(0);
const strip = ref<HTMLElement>();
const go = (k: number) => { n.value = (k + scenes.length) % scenes.length; };
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') go(n.value - 1); else if (e.key === 'ArrowRight') go(n.value + 1); else return;
  e.preventDefault();
}
watch(n, async () => {
  await nextTick();
  const el = strip.value, b = el?.children[n.value] as HTMLElement | undefined;
  if (!el || !b) return;
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  el.scrollTo({ left: b.offsetLeft - (el.clientWidth - b.offsetWidth) / 2, behavior: calm ? 'auto' : 'smooth' });
});
</script>

<template>
  <section class="car" role="region" aria-roledescription="carrusel" aria-label="Rutas de senderismo" :style="{ '--i': n }" @keydown="onKey">
    <h2>Rutas de senderismo</h2>
    <p class="muted">Elige una miniatura o usa las flechas del teclado.</p>
    <div class="view">
      <div class="track">
        <svg v-for="(s, k) in scenes" :key="s.title" class="slide" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" role="group"
             aria-roledescription="diapositiva" :aria-label="`${k + 1} de ${scenes.length}`" :aria-hidden="k !== n">
          <rect :class="s.bg" width="160" height="100" /><path v-for="[c, d] in s.p" :key="d" :class="c" :d="d" />
        </svg>
      </div>
      <button type="button" class="ib prev" aria-label="Imagen anterior" @click="go(n - 1)"><svg viewBox="0 0 24 24"><path d="M15.4 6 14 4.6 6.6 12 14 19.4 15.4 18 9.4 12z" /></svg></button>
      <button type="button" class="ib next" aria-label="Imagen siguiente" @click="go(n + 1)"><svg viewBox="0 0 24 24"><path d="M8.6 6 10 4.6l7.4 7.4-7.4 7.4L8.6 18l6-6z" /></svg></button>
    </div>
    <div class="cap"><b>{{ scenes[n].title }}</b><span aria-live="polite">{{ n + 1 }} de {{ scenes.length }}</span></div>
    <div ref="strip" class="strip" role="group" aria-label="Miniaturas">
      <button v-for="(s, k) in scenes" :key="s.title" type="button" class="th" :aria-label="`Ver ${s.title}`" :aria-current="k === n ? 'true' : undefined" @click="n = k">
        <svg viewBox="0 0 160 100" aria-hidden="true"><rect :class="s.bg" width="160" height="100" /><path v-for="[c, d] in s.p" :key="d" :class="c" :d="d" /></svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.car{max-width:640px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px;font-weight:600}
.muted{margin:2px 0 16px;color:var(--muted)}
.view{position:relative;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.track{display:flex;transform:translateX(calc(var(--i,0) * -100%));transition:transform .16s ease}
.slide{flex:none;display:block;width:100%;aspect-ratio:16/9}
.ib{position:absolute;top:50%;display:grid;place-items:center;width:36px;height:36px;margin-top:-18px;padding:0;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:50%;box-shadow:var(--shadow);cursor:pointer;transition:background .14s}
.ib:hover{background:var(--accent-soft)}
.ib svg{width:18px;height:18px;fill:currentColor}
.prev{left:10px}.next{right:10px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.cap{display:flex;justify-content:space-between;gap:12px;margin:10px 2px}
.cap b{font-weight:600}
.cap span{color:var(--muted);font-variant-numeric:tabular-nums}
.strip{position:relative;display:flex;gap:8px;padding:4px 2px 10px;overflow-x:auto}
.th{position:relative;flex:none;width:96px;padding:0;overflow:hidden;opacity:.7;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:opacity .14s,border-color .14s}
.th:hover{opacity:1}
.th svg{display:block;width:100%;aspect-ratio:16/10}
.th[aria-current]{opacity:1;border-color:var(--accent)}
.th[aria-current]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.bw{fill:var(--warn-soft)}.bi{fill:var(--info-soft)}.ba{fill:var(--accent-soft)}.bo{fill:var(--ok-soft)}.be{fill:var(--err-soft)}
.fw{fill:var(--warn)}.fi{fill:var(--info)}.fa{fill:var(--accent)}.fo{fill:var(--ok)}.fe{fill:var(--err)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
