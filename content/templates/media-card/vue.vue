<script setup lang="ts">
import { ref } from 'vue';

withDefaults(defineProps<{
  titulo: string;
  fecha: string;
  lectura: string; // p. ej. "5 min de lectura"
  fondo?: string; // color del placeholder SVG
}>(), { fondo: '#ffd84d' });
const emit = defineEmits<{ leer: [] }>();

const guardado = ref(false);
</script>

<template>
  <article class="media" :aria-label="titulo">
    <svg viewBox="0 0 160 90" aria-hidden="true" focusable="false">
      <rect width="160" height="90" :fill="fondo" />
      <circle cx="118" cy="30" r="14" fill="#ff5a36" stroke="#17130f" stroke-width="2" />
      <path d="M0 90V62l34-26 30 28 28-18 68 36z" fill="#17130f" />
      <path d="M0 90V74l30-14 34 16 40-12 56 26z" fill="#1f9d55" stroke="#17130f" stroke-width="2" />
    </svg>
    <div class="body">
      <h2>{{ titulo }}</h2>
      <p class="meta"><span>{{ fecha }}</span><span>{{ lectura }}</span></p>
      <div class="acts">
        <button type="button" class="main" :aria-label="`Leer el artículo ${titulo}`" @click="emit('leer')">Leer artículo</button>
        <button type="button" :aria-pressed="guardado" @click="guardado = !guardado">{{ guardado ? 'Guardado' : 'Guardar' }}</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.media { display: flex; flex-direction: column; overflow: hidden; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; font: 14px/1.4 system-ui, sans-serif; color: #17130f; }
.media svg { display: block; width: 100%; height: auto; aspect-ratio: 16/9; border-bottom: 2px solid #17130f; }
.body { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px 14px; flex: 1; }
h2 { margin: 0; font-size: 1.05rem; letter-spacing: -.02em; }
.meta { display: flex; flex-wrap: wrap; gap: 2px 12px; margin: 0; font: 600 .75rem ui-monospace, monospace; color: #4d453c; }
.acts { display: flex; gap: 8px; margin-top: auto; padding-top: 6px; }
button { font: 600 .85rem system-ui, sans-serif; color: #17130f; background: #fffdf8; border: 2px solid #17130f; border-radius: 10px; padding: 6px 14px; box-shadow: 4px 4px 0 #17130f; cursor: pointer; }
.main { background: #ff5a36; }
button[aria-pressed="true"] { background: #17130f; color: #fffdf8; }
button:hover, button:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
button:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
@media (prefers-reduced-motion: no-preference) { button { transition: transform .1s, box-shadow .1s; } }
</style>
