<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{ people: { nombre: string }[]; max?: number; size?: 'sm' | 'md' | 'lg' }>(),
  { max: 4, size: 'md' },
);

const COLORS = ['#ffd84d', '#ff8a6e', '#9db4ff', '#8fdcaa'];
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
    <li v-for="(p, i) in shown" :key="p.nombre" class="avatar" :style="{ '--c': COLORS[i % COLORS.length] }"
        role="img" :aria-label="p.nombre" :title="p.nombre" tabindex="0">{{ initials(p.nombre) }}</li>
    <li v-if="rest > 0" class="avatar more" role="img" :aria-label="`${rest} personas más`">+{{ rest }}</li>
  </ul>
</template>

<style scoped>
.avatars { display: flex; padding-left: 10px; margin: 0; list-style: none; }
.avatar { --size: 40px; display: grid; place-items: center; width: var(--size); height: var(--size); margin-left: -10px; position: relative;
  font: 700 calc(var(--size) * .36) ui-monospace, monospace; color: #17130f; background: var(--c); border: 2px solid #17130f; border-radius: 50%; transition: transform .15s; }
.avatar:hover, .avatar:focus-visible { transform: translateY(-4px); z-index: 1; }
.avatar:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
.sm .avatar { --size: 28px; margin-left: -8px; }
.lg .avatar { --size: 56px; margin-left: -14px; }
.avatar.more { --c: #17130f; color: #f6f1e7; }
@media (prefers-reduced-motion: reduce) { .avatar { transition: none; } }
</style>
