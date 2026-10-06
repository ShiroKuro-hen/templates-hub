<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ label?: string }>();
const views = ['Frontal', 'Perfil', 'Correa', 'Caja'];
const n = views.length;
const cur = ref(0);
const thumbs = ref<HTMLElement>();
const go = (i: number) => { cur.value = (i + n) % n; };

function onKey(e: KeyboardEvent) {
  const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : d !== undefined ? (cur.value + d + n) % n : null;
  if (next === null) return;
  e.preventDefault();
  cur.value = next;
  (thumbs.value?.children[next] as HTMLElement).focus();
}
</script>

<template>
  <section class="gallery" aria-roledescription="galería" :aria-label="label ?? 'Reloj Orbit S2'">
    <figure>
      <div class="stage" :data-t="cur">
        <svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
          <template v-if="cur === 0"><rect x="38" y="6" width="24" height="24" rx="6" /><rect x="38" y="70" width="24" height="24" rx="6" /><circle cx="50" cy="50" r="26" /><circle cx="50" cy="50" r="20" /><path d="M50 50V37M50 50l9 5" /></template>
          <template v-else-if="cur === 1"><rect x="34" y="28" width="32" height="44" rx="8" /><rect x="66" y="45" width="7" height="10" rx="2" /><path d="M42 28L46 8h8l4 20M42 72l4 20h8l4-20" /></template>
          <template v-else-if="cur === 2"><rect x="34" y="6" width="32" height="88" rx="14" /><circle v-for="y in [30, 42, 54, 66]" :key="y" cx="50" :cy="y" r="2.5" /></template>
          <template v-else><rect x="14" y="34" width="72" height="42" rx="6" /><path d="M14 48h72" /><circle cx="50" cy="62" r="6" /></template>
        </svg>
      </div>
      <button class="nav prev" type="button" aria-label="Imagen anterior" @click="go(cur - 1)">&lsaquo;</button>
      <button class="nav next" type="button" aria-label="Imagen siguiente" @click="go(cur + 1)">&rsaquo;</button>
      <figcaption aria-live="polite">{{ views[cur] }} ({{ cur + 1 }} de {{ n }})</figcaption>
    </figure>
    <div ref="thumbs" class="thumbs" role="group" aria-label="Miniaturas. Usa las flechas para cambiar de imagen." @keydown="onKey">
      <button v-for="(v, i) in views" :key="v" class="thumb" type="button" :aria-label="`${v}, imagen ${i + 1} de ${n}`"
              :aria-current="i === cur" :tabindex="i === cur ? 0 : -1" @click="cur = i">
        <span class="dot" aria-hidden="true">{{ i + 1 }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.gallery{max-width:520px;padding:16px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
figure{position:relative;margin:0}
.stage{display:grid;place-items:center;aspect-ratio:4/3;border:1px solid var(--border);border-radius:var(--radius);background:var(--accent-soft)}
.stage svg{width:62%;height:auto;color:var(--accent)}
.stage[data-t="1"]{background:var(--info-soft)} .stage[data-t="2"]{background:var(--ok-soft)} .stage[data-t="3"]{background:var(--warn-soft)}
figcaption{margin-top:8px;color:var(--muted);font-variant-numeric:tabular-nums}
.nav{position:absolute;top:calc(50% - 20px);width:36px;height:36px;display:grid;place-items:center;padding:0;font:inherit;font-size:18px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:999px;box-shadow:var(--shadow);cursor:pointer;transition:background .14s}
.nav:hover{background:var(--accent-soft)}
.prev{left:8px}.next{right:8px}
.thumbs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:12px}
.thumb{display:grid;place-items:center;aspect-ratio:1;padding:6px;font:inherit;font-weight:600;color:var(--muted);background:linear-gradient(var(--surface),var(--surface)) padding-box,linear-gradient(var(--border),var(--border)) border-box;border:1px solid transparent;border-radius:var(--radius);cursor:pointer;transition:background .14s}
.thumb:hover{background:linear-gradient(var(--accent-soft),var(--accent-soft)) padding-box,linear-gradient(var(--border),var(--border)) border-box}
.thumb[aria-current=true]{color:var(--accent);background:linear-gradient(var(--surface),var(--surface)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
