<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{
  nombre: string;
  rol: string;
  bio: string;
  seguidores: number; // sin contar al usuario actual
  siguiendo?: boolean;
  variante?: 'acento' | 'info';
}>(), { siguiendo: false, variante: 'acento' });
const emit = defineEmits<{ mensaje: [] }>();

const on = ref(props.siguiendo);
const iniciales = computed(() =>
  props.nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join(''));
const total = computed(() => (props.seguidores + (on.value ? 1 : 0)).toLocaleString('de-DE'));
</script>

<template>
  <article class="profile" :aria-label="`Perfil de ${nombre}`">
    <div :class="['avatar', { b: variante === 'info' }]" aria-hidden="true">{{ iniciales }}</div>
    <h2>{{ nombre }}</h2>
    <p class="role">{{ rol }}</p>
    <p class="bio">{{ bio }} <span class="count">{{ total }}</span> seguidores.</p>
    <div class="acts">
      <button type="button" class="follow" :aria-pressed="on" @click="on = !on">{{ on ? 'Siguiendo' : 'Seguir' }}</button>
      <button type="button" :aria-label="`Enviar mensaje a ${nombre}`" @click="emit('mensaje')">Mensaje</button>
    </div>
  </article>
</template>

<style scoped>
.profile { display: grid; grid-template-columns: auto 1fr; gap: 2px 14px; align-items: center; padding: 18px; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
.avatar { grid-row: span 2; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 50%; font-weight: 600; font-size: 1.05rem; color: var(--accent); background: var(--accent-soft); }
.avatar.b { color: var(--info); background: var(--info-soft); }
h2 { margin: 0; font-size: 1rem; font-weight: 600; align-self: end; }
.role { margin: 0; align-self: start; font-size: .8125rem; color: var(--muted); }
.bio { grid-column: 1 / -1; margin: 12px 0 14px; color: var(--muted); }
.count { color: var(--text); font-weight: 600; font-variant-numeric: tabular-nums; }
.acts { grid-column: 1 / -1; display: flex; gap: 8px; }
button { font: inherit; font-weight: 600; font-size: .875rem; padding: 7px 16px; border-radius: var(--radius); cursor: pointer; color: var(--text); background: var(--surface); border: 1px solid var(--border); transition: background 140ms, color 140ms, border-color 140ms; }
button:hover { border-color: var(--accent); }
button.follow { color: var(--accent-ink); background: var(--accent); border-color: var(--accent); }
button.follow[aria-pressed="true"] { color: var(--accent); background: var(--accent-soft); border-color: transparent; }
button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { button { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
