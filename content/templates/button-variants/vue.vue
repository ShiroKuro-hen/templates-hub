<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
    type?: 'button' | 'submit' | 'reset';
  }>(),
  { variant: 'secondary', type: 'button' },
);
</script>

<template>
  <button :type="type" :class="['btn', variant !== 'secondary' && `btn--${variant}`]">
    <slot />
  </button>
</template>

<style scoped>
.btn { font: 500 14px system-ui, -apple-system, "Segoe UI", sans-serif; padding: 8px 16px; border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--surface); color: var(--text); cursor: pointer; transition: background-color .14s, filter .14s, box-shadow .14s; }
.btn:hover { background: var(--accent-soft); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn--primary { border-color: transparent; background: var(--accent); color: var(--accent-ink); }
.btn--primary:hover { background: var(--accent); filter: brightness(1.1); box-shadow: var(--shadow); }
.btn--danger { border-color: transparent; background: var(--err); color: var(--accent-ink); }
.btn--danger:hover { background: var(--err); filter: brightness(1.1); }
.btn--ghost, .btn--link { border-color: transparent; background: transparent; }
.btn--ghost { color: var(--accent); }
.btn--link { padding: 8px 4px; color: var(--accent); text-decoration: underline; text-underline-offset: 4px; }
.btn--link:hover { background: transparent; text-decoration-thickness: 2px; }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
