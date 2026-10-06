<script setup lang="ts">
import { nextTick, ref } from 'vue';

type Card = { id: number; t: string; tag: string; c: number };
const COLS = ['Por hacer', 'En curso', 'Hecho'];
const cards = ref<Card[]>([
  { id: 1, t: 'Revisar contrato de Atlas', tag: 'Legal', c: 0 },
  { id: 2, t: 'Corregir error de login', tag: 'Bug', c: 0 },
  { id: 3, t: 'Diseñar panel de informes', tag: 'Diseño', c: 1 },
  { id: 4, t: 'Migrar base de datos', tag: 'Infra', c: 2 },
]);
const msg = ref('');
const board = ref<HTMLElement | null>(null);
const list = (i: number) => cards.value.filter((k) => k.c === i);

async function move(k: Card, d: number) {
  k.c += d;
  msg.value = `${k.t} movida a ${COLS[k.c]}.`;
  await nextTick();
  const q = (s: string) => board.value?.querySelector<HTMLButtonElement>(s);
  (q(`[data-id="${k.id}"][data-d="${d}"]:not(:disabled)`) ?? q(`[data-id="${k.id}"]:not(:disabled)`))?.focus();
}
</script>

<template>
  <div ref="board" class="board">
    <section v-for="(name, i) in COLS" :key="name" class="col" :data-i="i" :aria-labelledby="`h${i}`">
      <h2 :id="`h${i}`">{{ name }}<span class="n" :aria-label="`${list(i).length} tarjetas`">{{ list(i).length }}</span></h2>
      <ul>
        <li v-if="!list(i).length" class="empty">Sin tarjetas. Mueve una aquí.</li>
        <li v-for="k in list(i)" :key="k.id" class="card">
          <p>{{ k.t }}</p>
          <div class="row">
            <span class="tag" :class="{ bug: k.tag === 'Bug' }">{{ k.tag }}</span>
            <button type="button" :data-id="k.id" data-d="-1" :disabled="i === 0" :aria-label="`Mover ${k.t} a ${COLS[i - 1] ?? ''}`" @click="move(k, -1)">
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>
            </button>
            <button type="button" :data-id="k.id" data-d="1" :disabled="i === COLS.length - 1" :aria-label="`Mover ${k.t} a ${COLS[i + 1] ?? ''}`" @click="move(k, 1)">
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
  <p class="sr" role="status">{{ msg }}</p>
</template>

<style scoped>
.board{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.col{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px}
.col h2{display:flex;align-items:center;gap:8px;margin:0 0 12px;padding-bottom:10px;font-size:14px;border-bottom:1px solid var(--border)}
.col[data-i="1"] h2{border-image:linear-gradient(90deg,#22d3ee,#2f5bff) 1}
.n{margin-left:auto;padding:0 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-variant-numeric:tabular-nums}
ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.card{padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.card p{margin:0 0 8px;font-weight:500}
.row{display:flex;align-items:center;gap:6px}
.tag{padding:1px 8px;border-radius:999px;font-size:12px;background:var(--info-soft);color:var(--info)}
.tag.bug{background:var(--err-soft)}
.row button{width:28px;height:28px;display:grid;place-items:center;padding:0;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--muted);cursor:pointer;transition:border-color .14s,color .14s}
.row button:first-of-type{margin-left:auto}
.row button:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.row button:disabled{opacity:.35;cursor:not-allowed}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.empty{padding:16px;text-align:center;color:var(--muted);border:1px dashed var(--border);border-radius:var(--radius)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
