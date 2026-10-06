<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

const props = withDefaults(defineProps<{ endsAt?: number; totalDays?: number }>(), { totalDays: 14 });
const end = props.endsAt ?? Date.now() + (5 * 86400 + 19 * 3600 + 23 * 60 + 40) * 1000;
const now = ref(Date.now());
const hidden = ref(false);
const timer = setInterval(() => (now.value = Date.now()), 1000);
onBeforeUnmount(() => clearInterval(timer));

const pad = (n: number) => String(n).padStart(2, '0');
const s = computed(() => Math.max(0, Math.floor((end - now.value) / 1000)));
const date = new Date(end);
const dateText = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
const parts = computed<[string, string][]>(() => [
  [String(Math.floor(s.value / 86400)), 'días'],
  [pad(Math.floor((s.value % 86400) / 3600)), 'horas'],
  [pad(Math.floor((s.value % 3600) / 60)), 'min'],
  [pad(s.value % 60), 'seg'],
]);
</script>

<template>
  <button v-if="hidden" type="button" class="btn again" @click="hidden = false">Mostrar banner</button>
  <aside v-else class="banner" aria-labelledby="ttl">
    <div class="row">
      <div class="txt">
        <strong id="ttl">
          <template v-if="s">Tu prueba de Pro termina el <time :datetime="date.toISOString()">{{ dateText }}</time></template>
          <template v-else>Tu prueba de Pro ha terminado</template>
        </strong>
        <p>{{ s ? 'Mejora tu plan para conservar informes ilimitados y hasta 10 personas en tu equipo.' : 'Mejora tu plan para recuperar el acceso a tus informes.' }}</p>
      </div>
      <div class="cd" role="timer" aria-label="Tiempo restante de la prueba">
        <div v-for="[v, u] in parts" :key="u"><b>{{ v }}</b><span>{{ u }}</span></div>
      </div>
      <div class="acts">
        <button type="button" class="btn main">Mejorar plan</button>
        <button type="button" class="btn">Comparar planes</button>
      </div>
    </div>
    <button type="button" class="x" aria-label="Cerrar banner" @click="hidden = true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" /></svg>
    </button>
    <progress :max="totalDays" :value="totalDays - Math.ceil(s / 86400)" aria-label="Días de prueba usados" />
  </aside>
</template>

<style scoped>
.banner{position:relative;max-width:900px;margin:0 auto;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:16px 24px;padding:16px 56px 16px 20px}
.txt{flex:1 1 260px;min-width:0}
.txt strong{display:block;font-size:15px;font-weight:600}
.txt p{margin:2px 0 0;color:var(--muted)}
.cd{display:flex;gap:8px}
.cd div{min-width:52px;padding:6px 8px;text-align:center;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
.cd b{display:block;font-size:18px;line-height:1.2;font-weight:600;font-variant-numeric:tabular-nums}
.cd span{color:var(--muted);font-size:12px}
.acts{display:flex;flex-wrap:wrap;gap:8px}
.btn{height:36px;padding:0 16px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;font-weight:500;cursor:pointer;transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.btn.main{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.again{display:block;margin:0 auto}
.x{position:absolute;top:12px;right:12px;display:grid;place-items:center;width:32px;height:32px;padding:0;background:none;border:0;border-radius:var(--radius);color:var(--muted);cursor:pointer}
.x:hover{color:var(--text);background:var(--accent-soft)}
progress{display:block;width:100%;height:4px;border:0;background:var(--accent-soft);-webkit-appearance:none;appearance:none}
progress::-webkit-progress-bar{background:var(--accent-soft)}
progress::-webkit-progress-value{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
progress::-moz-progress-bar{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
