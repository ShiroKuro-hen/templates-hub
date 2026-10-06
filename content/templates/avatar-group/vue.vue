<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{ people: { nombre: string }[]; max?: number; size?: 'sm' | 'md' | 'lg' }>(),
  { max: 4, size: 'md' },
);

const TONES = ['c1', 'c2', 'c3', 'c4'];
const shown = computed(() => props.people.slice(0, props.max));
const rest = computed(() => props.people.length - shown.value.length);
const label = computed(
  () => `Miembros: ${shown.value.map((p) => p.nombre).join(', ')}${rest.value > 0 ? ` y ${rest.value} más` : ''}`,
);
const initials = (n: string) =>
  n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
</script>

<template>
  <ul :class="['avatars', size]" :aria-label="label">
    <li v-for="(p, i) in shown" :key="p.nombre" :class="['avatar', TONES[i % TONES.length]]"
        role="img" :aria-label="p.nombre" :title="p.nombre" tabindex="0">{{ initials(p.nombre) }}</li>
    <li v-if="rest > 0" class="avatar more" role="img" :aria-label="`${rest} personas más`">+{{ rest }}</li>
  </ul>
</template>

<style scoped>
.avatars { display: flex; padding-left: 10px; margin: 0; list-style: none; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
.avatar { --size: 40px; display: grid; place-items: center; width: var(--size); height: var(--size); margin-left: -10px; position: relative;
  font-size: calc(var(--size) * .36); font-weight: 600; color: var(--f); background: var(--c); box-shadow: 0 0 0 2px var(--bg); border-radius: 50%; transition: transform 140ms; }
.avatar:hover, .avatar:focus-visible { transform: translateY(-3px); z-index: 1; }
.avatar:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.sm .avatar { --size: 28px; margin-left: -8px; }
.lg .avatar { --size: 56px; margin-left: -14px; }
.avatar.more { --c: var(--border); --f: var(--text); font-variant-numeric: tabular-nums; }
.c1 { --c: var(--accent-soft); --f: var(--accent); } .c2 { --c: var(--info-soft); --f: var(--info); }
.c3 { --c: var(--ok-soft); --f: var(--ok); } .c4 { --c: var(--warn-soft); --f: var(--warn); }
@media (prefers-reduced-motion: reduce) { .avatar { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
