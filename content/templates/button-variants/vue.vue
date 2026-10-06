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
.btn { font: 600 14px system-ui, sans-serif; padding: 9px 16px; border: 2px solid #17130f; border-radius: 10px;
  background: #fffdf8; color: #17130f; box-shadow: 4px 4px 0 #17130f; cursor: pointer;
  transition: transform .1s, box-shadow .1s, background-color .1s; }
.btn:hover, .btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #17130f; }
.btn:focus-visible { outline: 3px solid #ff5a36; outline-offset: 3px; }
.btn--primary { background: #ff5a36; }
.btn--danger { background: #d6293e; color: #fff; }
.btn--ghost, .btn--link { border-color: transparent; background: transparent; box-shadow: none; }
.btn--ghost:hover, .btn--ghost:active, .btn--link:hover { transform: none; box-shadow: none; background: #ffd84d; }
.btn--link { padding: 9px 4px; text-decoration: underline 2px #ff5a36; text-underline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
</style>
