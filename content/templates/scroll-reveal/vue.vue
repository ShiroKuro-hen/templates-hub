<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';

const items = [
  { fecha: '30 sep', iso: '2026-09-30', titulo: 'Búsqueda global', texto: 'Encuentra proyectos, personas y documentos desde un solo campo.', tag: 'ok', etiqueta: 'Nuevo' },
  { fecha: '24 sep', iso: '2026-09-24', titulo: 'Paneles más rápidos', texto: 'Los informes cargan un 40 % antes en conexiones lentas.', tag: 'info', etiqueta: 'Mejora' },
  { fecha: '17 sep', iso: '2026-09-17', titulo: 'Exportación a CSV', texto: 'Descarga cualquier tabla con los filtros aplicados.', tag: 'ok', etiqueta: 'Nuevo' },
  { fecha: '10 sep', iso: '2026-09-10', titulo: 'Zonas horarias corregidas', texto: 'Las alertas ya respetan la zona horaria de cada equipo.', tag: 'warn', etiqueta: 'Corrección' },
];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sc = ref<HTMLElement>();
const shown = reactive<Record<number, number>>({}); // índice -> retraso en ms
let io: IntersectionObserver;

function arm() {
  Object.keys(shown).forEach((k) => delete shown[+k]);
  sc.value?.querySelectorAll('.item').forEach((el) => io.observe(el));
}
function repeat() { sc.value?.scrollTo({ top: 0 }); arm(); }

onMounted(() => {
  if (calm) return;
  io = new IntersectionObserver((es) => {
    es.filter((e) => e.isIntersecting).forEach((e, k) => {
      shown[Number((e.target as HTMLElement).dataset.i)] = k * 90;
      io.unobserve(e.target);
    });
  }, { root: sc.value, threshold: 0.25 });
  arm();
});
onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <section class="panel">
    <div class="bar">
      <div><h1>Novedades de la versión 4.2</h1><p>Desplázate por el panel para ver cada cambio.</p></div>
      <button v-if="!calm" class="btn" type="button" @click="repeat">Repetir</button>
    </div>
    <div ref="sc" class="scroller" tabindex="0" role="region" aria-label="Lista de novedades">
      <ol class="list">
        <li v-for="(it, i) in items" :key="it.iso" :data-i="i" class="item"
            :class="{ first: i === 0, hide: !calm && !(i in shown) }" :style="{ transitionDelay: (shown[i] ?? 0) + 'ms' }">
          <time :datetime="it.iso">{{ it.fecha }}</time><h2>{{ it.titulo }}</h2><p>{{ it.texto }}</p>
          <span class="tag" :class="it.tag">{{ it.etiqueta }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border)}
h1{margin:0;font-size:16px;font-weight:600}
.bar p{margin:2px 0 0;color:var(--muted)}
.btn{padding:7px 14px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;font-weight:600;cursor:pointer;transition:border-color .14s,background .14s}
.btn:hover{border-color:var(--accent);background:var(--accent-soft)}
.btn:focus-visible,.scroller:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.scroller{height:320px;overflow:auto;padding:8px 20px 8px 0}
.list{margin:0;padding:0;list-style:none}
.item{position:relative;display:grid;gap:2px;padding:14px 0 14px 44px;transition:opacity .45s ease,transform .45s ease}
.item.hide{opacity:0;transform:translateY(14px)}
.item::before{content:"";position:absolute;left:19px;top:0;bottom:0;border-left:1px solid var(--border)}
.item::after{content:"";position:absolute;left:14px;top:20px;width:11px;height:11px;border-radius:50%;background:var(--surface);border:1px solid var(--accent)}
.item.first::after{border-color:transparent;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
time{color:var(--muted);font-variant-numeric:tabular-nums}
h2{margin:0;font-size:15px;font-weight:600}
.item p{margin:0;color:var(--muted);max-width:56ch}
.tag{justify-self:start;margin-top:4px;padding:1px 10px;border-radius:999px;font-size:12px;font-weight:600}
.tag{color:var(--text)}
.ok{background:var(--ok-soft)}.info{background:var(--info-soft)}.warn{background:var(--warn-soft)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
