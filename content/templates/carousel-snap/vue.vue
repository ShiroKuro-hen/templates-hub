<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

type Slide = { id: string; big: string; title: string; text: string; tone: 'c1' | 'c2' | 'c3' | 'c4' };

withDefaults(defineProps<{ slides?: Slide[]; label?: string }>(), {
  label: 'Rutas destacadas',
  slides: () => [
    { id: 'cerros', big: '9 km', title: 'Cerros de Lima', text: 'Sendero suave, 2 h.', tone: 'c1' },
    { id: 'valle', big: '14 km', title: 'Valle Sagrado', text: 'Ruta mixta, 5 h.', tone: 'c2' },
    { id: 'churup', big: '6 km', title: 'Laguna Churup', text: 'Subida corta, 3 h.', tone: 'c3' },
    { id: 'colca', big: '22 km', title: 'Cañón del Colca', text: 'Día completo, 8 h.', tone: 'c4' },
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
        <div :class="['art', sl.tone]">{{ sl.big }}</div>
        <div><h2>{{ sl.title }}</h2><p>{{ sl.text }}</p></div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
section { font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
.head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
h1 { margin: 0; font-size: 1.25rem; letter-spacing: -.01em; }
.ctrl { display: flex; align-items: center; gap: 8px; }
.count { min-width: 3.2em; text-align: center; font-size: 13px; font-weight: 600; color: var(--muted); font-variant-numeric: tabular-nums; }
.btn { display: grid; place-items: center; width: 36px; height: 36px; padding: 0; font: 500 18px system-ui; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; transition: background 140ms, border-color 140ms; }
.btn:hover:not(:disabled) { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
.btn:disabled { opacity: .4; cursor: not-allowed; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.track { display: flex; gap: 14px; margin: 0; padding: 4px 6px 16px 4px; list-style: none; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
@media (prefers-reduced-motion: no-preference) { .track { scroll-behavior: smooth; } }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
.slide { flex: 0 0 min(78%, 260px); scroll-snap-align: start; display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); overflow: hidden; }
.art { height: 96px; background: var(--c); color: var(--f); display: grid; place-items: center; font-size: 40px; font-weight: 700; line-height: 1; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.c1 { --c: var(--accent-soft); --f: var(--accent); } .c2 { --c: var(--info-soft); --f: var(--info); } .c3 { --c: var(--ok-soft); --f: var(--ok); } .c4 { --c: var(--warn-soft); --f: var(--warn); }
.slide > div + div { padding: 12px 16px 16px; }
h2 { margin: 0 0 2px; font-size: 1rem; font-weight: 600; }
p { margin: 0; color: var(--muted); }
/* Tokens: ver pestaña HTML + CSS */
</style>
