<script setup lang="ts">
import { ref } from 'vue';

withDefaults(defineProps<{ titulo?: string; antes?: string; despues?: string }>(), {
  titulo: 'Retoque de color',
  antes: 'Versión original, sin retoque',
  despues: 'Versión retocada, con color',
});
const p = ref(50);
</script>

<template>
  <div class="wrap">
    <h2>{{ titulo }}</h2>
    <p class="muted">Fotografía de montaña antes y después de la edición.</p>
    <div class="cmp" role="group" aria-label="Comparación antes y después" :style="{ '--p': `${p}%` }">
      <svg v-for="v in ['before', 'after']" :key="v" :class="['img', v]" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" role="img"
           :aria-label="v === 'before' ? antes : despues">
        <rect class="bg" width="160" height="100" />
        <path class="sun" d="M99 30a13 13 0 1 0 26 0a13 13 0 1 0-26 0" />
        <path class="far" d="M0 78 30 44l22 24 26-34 34 40 20-18 28 22V100H0z" />
        <path class="near" d="M0 90q30-22 60-6t60-4t40 6V100H0z" />
        <path class="lake" d="M0 96q40-8 80 0t80 0V100H0z" />
      </svg>
      <span class="tag a" aria-hidden="true">Antes</span>
      <span class="tag d" aria-hidden="true">Después</span>
      <span class="line" aria-hidden="true" />
      <span class="knob" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 7 3 12l5 5zm8 0v10l5-5z" /></svg></span>
      <input v-model.number="p" type="range" min="0" max="100" step="1" aria-label="Divisor entre antes y después"
             :aria-valuetext="`Antes ${p} %, después ${100 - p} %`" />
    </div>
    <p class="hint">Arrastra el divisor o usa las flechas, Inicio y Fin.</p>
  </div>
</template>

<style scoped>
.wrap{max-width:640px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:16px;font-weight:600}
.muted{margin:2px 0 0;color:var(--muted)}
.cmp{--p:50%;position:relative;aspect-ratio:16/10;margin:16px 0 12px;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.img{position:absolute;inset:0;width:100%;height:100%}
.before{filter:grayscale(1) contrast(.8) brightness(.95)}
.after{clip-path:inset(0 0 0 var(--p))}
.bg{fill:var(--warn-soft)}.sun{fill:var(--warn)}.far{fill:var(--accent)}.near{fill:var(--ok)}.lake{fill:var(--info)}
.tag{position:absolute;top:10px;padding:2px 10px;font-size:12px;font-weight:500;background:var(--surface);border:1px solid var(--border);border-radius:999px}
.tag.a{left:10px}.tag.d{right:10px}
.line{position:absolute;top:0;bottom:0;left:var(--p);width:2px;margin-left:-1px;background:linear-gradient(135deg,#22d3ee,#2f5bff);pointer-events:none}
.knob{position:absolute;top:50%;left:var(--p);display:grid;place-items:center;width:36px;height:36px;margin:-18px 0 0 -18px;color:var(--accent);background:var(--surface);border:1px solid var(--border);border-radius:50%;box-shadow:var(--shadow);pointer-events:none}
.knob svg{width:20px;height:20px;fill:currentColor}
.cmp input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize}
.cmp:has(input:focus-visible) .knob{outline:2px solid var(--accent);outline-offset:2px}
.hint{margin:0;color:var(--muted);font-size:12px}
/* Tokens: ver pestaña HTML + CSS */
</style>
