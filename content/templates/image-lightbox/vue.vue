<script setup lang="ts">
import { ref } from 'vue';

type Scene = { title: string; bg: string; p: [string, string][] }; // clase de relleno + trazo
const SUN = 'M108 28a12 12 0 1 0 24 0a12 12 0 1 0-24 0';
const scenes: Scene[] = [
  { title: 'Sierra al amanecer', bg: 'bw', p: [['fw', SUN], ['fa', 'M0 100V70L40 38l28 28 26-22 66 56z'], ['fi', 'M0 100 50 74l40 14 70-18v30z']] },
  { title: 'Costa norte', bg: 'bi', p: [['fw', 'M28 26a10 10 0 1 0 20 0a10 10 0 1 0-20 0'], ['fi', 'M0 62q20-10 40 0t40 0t40 0t40 0V100H0z'], ['fa', 'M0 80q20-10 40 0t40 0t40 0t40 0V100H0z']] },
  { title: 'Ciudad nocturna', bg: 'ba', p: [['fi', 'M122 20a8 8 0 1 0 16 0a8 8 0 1 0-16 0'], ['fa', 'M10 100V50h22v50zM38 100V28h26v72zM70 100V58h20v42zM96 100V40h24v60zM126 100V60h24v40z']] },
  { title: 'Valle verde', bg: 'bo', p: [['fw', SUN], ['fo', 'M0 100V64q40-30 80 0t80 0v36z']] },
  { title: 'Atardecer en la loma', bg: 'be', p: [['fe', 'M60 70a20 20 0 0 1 40 0z'], ['fa', 'M0 100V74l30-10 40 14 40-16 50 12v26z']] },
];
const dlg = ref<HTMLDialogElement>();
const n = ref(0);
const go = (k: number) => { n.value = (k + scenes.length) % scenes.length; };
const open = (k: number) => { n.value = k; dlg.value?.showModal(); };
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') go(n.value - 1); else if (e.key === 'ArrowRight') go(n.value + 1);
}
</script>

<template>
  <div class="gal">
    <header><h2>Paisajes del norte</h2><p>Abre una foto para verla en grande.</p></header>
    <ul class="grid">
      <li v-for="(s, k) in scenes" :key="s.title">
        <button type="button" class="th" aria-haspopup="dialog" @click="open(k)">
          <svg viewBox="0 0 160 100" aria-hidden="true">
            <rect :class="s.bg" width="160" height="100" /><path v-for="[c, d] in s.p" :key="d" :class="c" :d="d" />
          </svg>
          <span>{{ s.title }}</span>
        </button>
      </li>
    </ul>
    <dialog ref="dlg" aria-labelledby="cap" @click="$event.target === dlg && dlg?.close()" @keydown="onKey">
      <div class="stage">
        <svg viewBox="0 0 160 100" role="img" :aria-label="scenes[n].title">
          <rect :class="scenes[n].bg" width="160" height="100" /><path v-for="[c, d] in scenes[n].p" :key="d" :class="c" :d="d" />
        </svg>
        <button type="button" class="ib x" aria-label="Cerrar galería" @click="dlg?.close()"><svg viewBox="0 0 24 24"><path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4l5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z" /></svg></button>
        <button type="button" class="ib prev" aria-label="Foto anterior" @click="go(n - 1)"><svg viewBox="0 0 24 24"><path d="M15.4 6 14 4.6 6.6 12 14 19.4 15.4 18 9.4 12z" /></svg></button>
        <button type="button" class="ib next" aria-label="Foto siguiente" @click="go(n + 1)"><svg viewBox="0 0 24 24"><path d="M8.6 6 10 4.6l7.4 7.4-7.4 7.4L8.6 18l6-6z" /></svg></button>
      </div>
      <div class="meter" aria-hidden="true"><i :style="{ '--p': ((n + 1) / scenes.length) * 100 }" /></div>
      <div class="cap"><b id="cap">{{ scenes[n].title }}</b><span aria-live="polite">{{ n + 1 }} de {{ scenes.length }}</span></div>
    </dialog>
  </div>
</template>

<style scoped>
.gal{color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:18px;font-weight:600}
header p{margin:2px 0 16px;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin:0;padding:0;list-style:none}
.th{display:block;width:100%;padding:0;font:inherit;color:var(--text);text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;cursor:pointer;transition:border-color .14s}
.th:hover{border-color:var(--accent)}
.th svg{display:block;width:100%;aspect-ratio:16/10}
.th span{display:block;padding:8px 10px;font-weight:500}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.bw{fill:var(--warn-soft)}.bi{fill:var(--info-soft)}.ba{fill:var(--accent-soft)}.bo{fill:var(--ok-soft)}.be{fill:var(--err-soft)}
.fw{fill:var(--warn)}.fi{fill:var(--info)}.fa{fill:var(--accent)}.fo{fill:var(--ok)}.fe{fill:var(--err)}
dialog{width:min(720px,calc(100vw - 24px));padding:0;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
dialog::backdrop{background:rgba(10,15,28,.6)}
.stage{position:relative}
.stage>svg{display:block;width:100%;aspect-ratio:16/10}
.ib{position:absolute;display:grid;place-items:center;width:36px;height:36px;padding:0;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:50%;box-shadow:var(--shadow);cursor:pointer;transition:background .14s}
.ib:hover{background:var(--accent-soft)}
.ib svg{width:18px;height:18px;fill:currentColor}
.x{top:8px;right:8px}.prev,.next{top:50%;margin-top:-18px}.prev{left:8px}.next{right:8px}
.meter{height:3px;background:var(--border)}
.meter i{display:block;height:100%;width:calc(var(--p) * 1%);background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .14s}
.cap{display:flex;justify-content:space-between;gap:12px;padding:12px 16px}
.cap b{font-weight:600}
.cap span{color:var(--muted);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
