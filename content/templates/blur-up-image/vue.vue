<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

withDefaults(defineProps<{ titulo?: string; descripcion?: string }>(), {
  titulo: 'Sierra de Ion al amanecer',
  descripcion: 'Sierra de Ion al amanecer: montañas azules con cumbres nevadas y un sol dorado',
});
const pct = ref(0);
const ready = computed(() => pct.value >= 100);
let timer = 0;

// Carga simulada: sube el progreso a saltos hasta llegar a 100.
function load() {
  clearInterval(timer); pct.value = 0;
  timer = window.setInterval(() => {
    pct.value = Math.min(100, pct.value + 8 + Math.random() * 14);
    if (pct.value >= 100) clearInterval(timer);
  }, 180);
}
onMounted(load);
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <figure :class="{ ready }" :aria-busy="!ready">
    <div class="frame" role="img" :aria-label="descripcion">
      <svg class="ph" viewBox="0 0 16 10" preserveAspectRatio="none" aria-hidden="true">
        <rect class="bg" width="16" height="10" /><circle class="sun" cx="11.5" cy="3" r="1.6" />
        <path class="far" d="M0 10V6l3-3 3 3 2-2 8 6z" /><path class="near" d="M0 10l5-2 5 1 6-1v2z" />
      </svg>
      <svg class="full" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect class="bg" width="160" height="100" /><circle class="halo" cx="112" cy="30" r="20" /><circle class="sun" cx="112" cy="30" r="12" />
        <path class="far" d="M0 74 24 40l16 18 22-34 30 38 18-16 50 40V100H0z" />
        <path class="snow" d="M62 24 53 37l4-2 5 4 5-4 4 2zM24 40 17 50l3-2 4 3 4-3 3 2z" />
        <path class="mid" d="M0 84q30-18 62-4t58-6 40 8V100H0z" /><path class="near" d="M0 94q40-14 80-4t80-6V100H0z" />
      </svg>
      <progress max="100" :value="pct" aria-label="Progreso de carga" />
    </div>
    <figcaption>
      <div>
        <b>{{ titulo }}</b>
        <span class="st"><span role="status">{{ ready ? 'Imagen cargada' : 'Cargando imagen' }}</span> {{ Math.round(pct) }} %</span>
      </div>
      <button type="button" class="btn" :disabled="!ready" @click="load">Volver a cargar</button>
    </figcaption>
  </figure>
</template>

<style scoped>
figure{max-width:640px;margin:0 auto;overflow:hidden;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.frame{position:relative;aspect-ratio:16/9;overflow:hidden;background:var(--warn-soft)}
.frame>svg{position:absolute;inset:0;width:100%;height:100%}
.ph{filter:blur(12px);transform:scale(1.1);transition:opacity .16s}
.full{opacity:0;filter:blur(8px);transition:opacity .16s,filter .16s}
.ready .ph{opacity:0}
.ready .full{opacity:1;filter:none}
.bg{fill:var(--warn-soft)}.sun{fill:var(--warn)}.halo{fill:var(--warn);opacity:.25}.far{fill:var(--accent)}.snow{fill:var(--surface)}.mid{fill:var(--info)}.near{fill:var(--ok)}
progress{position:absolute;left:0;right:0;bottom:0;width:100%;height:3px;border:0;appearance:none;background:var(--border);transition:opacity .16s}
progress::-webkit-progress-bar{background:var(--border)}
progress::-webkit-progress-value{background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .12s}
progress::-moz-progress-bar{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.ready progress{opacity:0}
figcaption{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding:12px 16px}
figcaption div{min-width:0}
b{display:block;font-weight:600}
.st{color:var(--muted);font-variant-numeric:tabular-nums}
.btn{height:36px;padding:0 14px;font:inherit;font-weight:500;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn:disabled:hover{background:var(--surface)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
