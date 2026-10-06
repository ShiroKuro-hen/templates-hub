<script setup lang="ts">
import { ref } from 'vue';

type Ventaja = { texto: string; incluida?: boolean };
const props = withDefaults(defineProps<{
  nombre: string;
  precio: number;
  ventajas: Ventaja[];
  destacado?: boolean;
  cta?: string;
}>(), { destacado: false });
const emit = defineEmits<{ elegir: [nombre: string] }>();

const elegido = ref(false);
function toggle() {
  elegido.value = !elegido.value;
  emit('elegir', props.nombre);
}
</script>

<template>
  <article :class="['plan', { hot: destacado }]">
    <span v-if="destacado" class="badge">Recomendado</span>
    <h2>{{ nombre }}</h2>
    <p class="price">${{ precio }} <small>/mes</small></p>
    <ul>
      <li v-for="v in ventajas" :key="v.texto" :class="{ no: v.incluida === false }">{{ v.texto }}</li>
    </ul>
    <button type="button" :aria-pressed="elegido" @click="toggle">
      {{ elegido ? 'Plan elegido' : (cta ?? `Elegir ${nombre}`) }}
    </button>
    <p role="status" class="sr">{{ elegido ? `Elegiste el plan ${nombre}.` : '' }}</p>
  </article>
</template>

<style scoped>
.plan { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 16px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; font: 14px/1.4 system-ui, sans-serif; color: #17130f; }
.plan.hot { background: #ffd84d; }
.badge { position: absolute; top: -12px; right: 12px; padding: 1px 10px; border: 2px solid #17130f; border-radius: 99px; background: #ff5a36; font: 700 .72rem ui-monospace, monospace; }
h2 { margin: 0; font-size: 1.1rem; letter-spacing: -.02em; }
.price { margin: 0; font-size: 2.4rem; font-weight: 800; letter-spacing: -.03em; line-height: 1; font-variant-numeric: tabular-nums; }
.price small { font: 600 .8rem ui-monospace, monospace; color: #4d453c; letter-spacing: 0; }
ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; flex: 1; }
li::before { content: "✓"; margin-right: 8px; font-weight: 800; }
li.no { color: #4d453c; text-decoration: line-through; } li.no::before { content: "✕"; color: #d6293e; }
button { font: 700 .9rem system-ui, sans-serif; color: #17130f; background: #fffdf8; border: 2px solid #17130f; border-radius: 10px; padding: 8px 14px; box-shadow: 4px 4px 0 #17130f; cursor: pointer; }
.hot button { background: #ff5a36; }
button[aria-pressed="true"] { background: #17130f; color: #fffdf8; }
button:hover, button:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
button:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
.hot button:focus-visible { outline-color: #17130f; }
.sr { position: absolute; left: -9999px; }
@media (prefers-reduced-motion: no-preference) { button { transition: transform .1s, box-shadow .1s; } }
</style>
