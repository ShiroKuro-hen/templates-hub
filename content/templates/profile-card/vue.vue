<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{
  nombre: string;
  rol: string;
  bio: string;
  seguidores: number; // sin contar al usuario actual
  siguiendo?: boolean;
  variante?: 'amarillo' | 'azul';
}>(), { siguiendo: false, variante: 'amarillo' });
const emit = defineEmits<{ mensaje: [] }>();

const on = ref(props.siguiendo);
const iniciales = computed(() =>
  props.nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join(''));
const total = computed(() => (props.seguidores + (on.value ? 1 : 0)).toLocaleString('de-DE'));
</script>

<template>
  <article class="profile" :aria-label="`Perfil de ${nombre}`">
    <div :class="['avatar', { b: variante === 'azul' }]" aria-hidden="true">{{ iniciales }}</div>
    <h2>{{ nombre }}</h2>
    <p class="role">{{ rol }}</p>
    <p class="bio">{{ bio }} <span>{{ total }}</span> seguidores.</p>
    <div class="acts">
      <button type="button" :aria-pressed="on" @click="on = !on">{{ on ? 'Siguiendo' : 'Seguir' }}</button>
      <button type="button" :aria-label="`Enviar mensaje a ${nombre}`" @click="emit('mensaje')">Mensaje</button>
    </div>
  </article>
</template>

<style scoped>
.profile { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items: center; padding: 14px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; font: 14px/1.4 system-ui, sans-serif; color: #17130f; }
.avatar { grid-row: span 2; width: 56px; height: 56px; display: grid; place-items: center; border: 2px solid #17130f; border-radius: 50%; background: #ffd84d; font: 800 1.25rem system-ui, sans-serif; letter-spacing: -.02em; }
.avatar.b { background: #cfd8ff; }
h2 { margin: 0; font-size: 1.05rem; letter-spacing: -.02em; align-self: end; }
.role { margin: 0; align-self: start; font: 600 .75rem ui-monospace, monospace; color: #6b6258; }
.bio { grid-column: 1 / -1; margin: 8px 0 4px; }
.acts { grid-column: 1 / -1; display: flex; gap: 8px; }
button { font: 600 .85rem system-ui, sans-serif; color: #17130f; background: #fffdf8; border: 2px solid #17130f; border-radius: 10px; padding: 6px 14px; box-shadow: 4px 4px 0 #17130f; cursor: pointer; }
button[aria-pressed="true"] { background: #17130f; color: #fffdf8; }
button:hover, button:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
button:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
@media (prefers-reduced-motion: no-preference) { button { transition: transform .1s, box-shadow .1s; } }
</style>
