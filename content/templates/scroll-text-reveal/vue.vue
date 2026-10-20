<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const TEXT =
  'Cada palabra del párrafo cambia de tono a medida que avanzas por el recuadro. Así sabes con un vistazo cuánto llevas leído y cuánto te queda por delante. Los informes trimestrales resumen las ventas, los costes y los objetivos de cada equipo. Revisa primero las cifras clave, compara el avance con el mes anterior y comparte las conclusiones antes del viernes. Si algún dato no cuadra, abre el detalle de la categoría y revisa las transacciones una a una. Con el tiempo, cada cifra quedará documentada en el mismo lugar para que cualquiera del equipo pueda seguir el hilo.';
const WORDS = TEXT.split(' ');
const LAG = 4;

const box = ref<HTMLDivElement | null>(null);
const progress = ref(0);

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const wordStyle = (index: number) => ({
  '--r': clamp((progress.value * (WORDS.length + LAG) - index) / LAG).toFixed(3),
});

function update() {
  const el = box.value;
  if (!el) return;
  const max = el.scrollHeight - el.clientHeight;
  progress.value = max > 0 ? el.scrollTop / max : 1;
}

onMounted(() => {
  update();
  window.addEventListener('resize', update);
});
onUnmounted(() => window.removeEventListener('resize', update));
</script>

<template>
  <p id="reveal-hint" class="hint">Desplázate dentro del recuadro para leer. Con teclado, enfócalo y usa las flechas.</p>
  <div ref="box" class="reveal" tabindex="0" role="region" aria-labelledby="reveal-hint" @scroll.passive="update">
    <p class="reveal-text">
      <span v-for="(word, i) in WORDS" :key="i" class="w" :style="wordStyle(i)">{{ word }} </span>
    </p>
  </div>
</template>

<style scoped>
.hint { max-width: 560px; margin: 0 auto 10px; color: var(--muted); font-size: 13px; }
.reveal { max-width: 560px; height: 240px; margin: 0 auto; padding: 20px 24px; overflow: auto; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.reveal-text { margin: 0; font-size: 16px; line-height: 1.7; }
.w { color: var(--muted); color: color-mix(in srgb, var(--text) calc(var(--r, 1) * 100%), var(--muted)); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .w { color: var(--text); } }
/* Tokens: ver pestaña HTML + CSS */
</style>
