<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

type Slide = { id: string; big: string; title: string; text: string; color: string };

withDefaults(defineProps<{ slides?: Slide[]; label?: string }>(), {
  label: 'Rutas destacadas',
  slides: () => [
    { id: 'cerros', big: '9 km', title: 'Cerros de Lima', text: 'Sendero suave, 2 h.', color: '#ffd84d' },
    { id: 'valle', big: '14 km', title: 'Valle Sagrado', text: 'Ruta mixta, 5 h.', color: '#ff8a6e' },
    { id: 'churup', big: '6 km', title: 'Laguna Churup', text: 'Subida corta, 3 h.', color: '#9db4ff' },
    { id: 'colca', big: '22 km', title: 'Cañón del Colca', text: 'Día completo, 8 h.', color: '#8fdcaa' },
  ],
});

const track = ref<HTMLUListElement>();
const s = reactive({ i: 0, total: 0, start: true, end: false });
const step = () => {
  const c = track.value!.children as HTMLCollectionOf<HTMLElement>;
  return c[1].offsetLeft - c[0].offsetLeft;
};
function update() {
  const t = track.value!;
  s.total = t.children.length;
  s.end = t.scrollLeft + t.clientWidth >= t.scrollWidth - 2;
  s.start = t.scrollLeft <= 2;
  s.i = s.end ? s.total - 1 : Math.round(t.scrollLeft / step());
}
const go = (d: number) => track.value!.scrollBy({ left: d * step() });
onMounted(update);
</script>

<template>
  <section aria-roledescription="carrusel" :aria-label="label">
    <div class="head">
      <h1>{{ label }}</h1>
      <div class="ctrl">
        <button type="button" class="btn" aria-label="Anterior" :disabled="s.start" @click="go(-1)">‹</button>
        <span class="count" aria-live="polite">{{ s.i + 1 }} / {{ s.total }}</span>
        <button type="button" class="btn" aria-label="Siguiente" :disabled="s.end" @click="go(1)">›</button>
      </div>
    </div>
    <ul ref="track" class="track" tabindex="0" aria-label="Diapositivas, desplázate con las flechas" @scroll.passive="update">
      <li v-for="sl in slides" :key="sl.id" class="slide" aria-roledescription="diapositiva">
        <div class="art" :style="{ background: sl.color }">{{ sl.big }}</div>
        <div><h2>{{ sl.title }}</h2><p>{{ sl.text }}</p></div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
section { font: 14px/1.45 system-ui, sans-serif; color: #17130f; }
.head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
h1 { margin: 0; font-size: 20px; letter-spacing: -.02em; }
.ctrl { display: flex; align-items: center; gap: 8px; }
.count { min-width: 3.2em; text-align: center; font: 700 13px ui-monospace, monospace; }
.btn { display: grid; place-items: center; width: 38px; height: 38px; padding: 0; font: 700 18px system-ui; color: #17130f; background: #ffd84d; border: 2px solid #17130f; border-radius: 10px; box-shadow: 3px 3px 0 #17130f; cursor: pointer; }
.btn:hover:not(:disabled) { transform: translate(1.5px, 1.5px); box-shadow: 1.5px 1.5px 0 #17130f; }
.btn:disabled { opacity: .4; box-shadow: none; cursor: not-allowed; }
:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
.track { display: flex; gap: 14px; margin: 0; padding: 2px 6px 8px 2px; list-style: none; overflow-x: auto; scroll-snap-type: x mandatory; }
@media (prefers-reduced-motion: no-preference) { .track { scroll-behavior: smooth; } }
.slide { flex: 0 0 min(78%, 260px); scroll-snap-align: start; display: flex; flex-direction: column; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; overflow: hidden; }
.art { height: 96px; border-bottom: 2px solid #17130f; display: grid; place-items: center; font: 800 40px/1 system-ui; letter-spacing: -.04em; }
.slide > div + div { padding: 10px 14px 14px; }
h2 { margin: 0 0 2px; font-size: 16px; letter-spacing: -.01em; }
p { margin: 0; color: #6b6258; }
</style>
