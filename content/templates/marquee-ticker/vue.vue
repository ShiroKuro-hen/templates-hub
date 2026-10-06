<script setup lang="ts">
import { ref } from 'vue';

const logos = ['Norte Labs', 'Vértice', 'Kairos', 'Alba Cloud', 'Órbita', 'Lumen', 'Pivote', 'Sierra Data'];
const avisos = [
  { tono: 'on', texto: 'Todos los sistemas operativos' },
  { tono: 'info', texto: 'Nueva región disponible: Santiago' },
  { tono: 'warn', texto: 'Mantenimiento el 14 oct a las 02:00 (30 min)' },
  { tono: 'ok', texto: 'API v3 estable desde el 28 sep' },
  { tono: 'info', texto: 'Webinar de seguridad el jueves a las 17:00' },
];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const paused = ref(false);
// Dos copias de cada lista (la segunda oculta a lectores) dan el bucle sin saltos.
const copias = calm ? [false] : [false, true];
</script>

<template>
  <section class="panel" :class="{ live: !calm }" :data-paused="paused ? '' : undefined">
    <div class="head">
      <div><h1>Empresas que usan Aurora</h1><p>La cinta se detiene al pasar el cursor o al enfocar un logo.</p></div>
      <button v-if="!calm" class="btn" type="button" @click="paused = !paused">{{ paused ? 'Reanudar' : 'Pausar' }}</button>
    </div>
    <div class="marquee" role="group" aria-label="Clientes">
      <div class="track" style="--d: 34s">
        <ul v-for="c in copias" :key="String(c)" :aria-hidden="c || undefined">
          <li v-for="n in logos" :key="n"><a class="logo" href="#" :tabindex="c ? -1 : undefined">{{ n }}</a></li>
        </ul>
      </div>
    </div>
    <div class="marquee rev" role="group" aria-label="Estado del servicio">
      <div class="track" style="--d: 44s">
        <ul v-for="c in copias" :key="String(c)" :aria-hidden="c || undefined">
          <li v-for="a in avisos" :key="a.texto" class="msg"><span class="dot" :class="a.tono" />{{ a.texto }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel{display:grid;gap:20px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px}
h1{margin:0;font-size:16px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
.btn{padding:7px 14px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;font-weight:600;cursor:pointer;transition:border-color .14s,background .14s}
.btn:hover{border-color:var(--accent);background:var(--accent-soft)}
.btn:focus-visible,.logo:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.track{display:flex}
ul{display:flex;flex-wrap:wrap;flex:none;gap:12px;margin:0;padding:0 12px 0 0;list-style:none}
.logo,.msg{display:flex;align-items:center;gap:8px;padding:8px 18px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-weight:600;white-space:nowrap;text-decoration:none;transition:border-color .14s}
.logo:hover{border-color:var(--accent)}
.msg{font-weight:400;padding:6px 14px;border-radius:999px}
.dot{width:8px;height:8px;border-radius:50%;flex:none}
.dot.ok{background:var(--ok)}.dot.info{background:var(--info)}.dot.warn{background:var(--warn)}
.dot.on{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.live .marquee{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.live .track{width:max-content;animation:slide var(--d,34s) linear infinite}
.live ul{flex-wrap:nowrap}
.live .rev .track{animation-direction:reverse}
@keyframes slide{to{transform:translateX(-50%)}}
.marquee:hover .track,.marquee:focus-within .track,.panel[data-paused] .track{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
