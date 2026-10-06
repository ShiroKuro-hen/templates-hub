<script setup lang="ts">
type IconName = 'home' | 'user' | 'search' | 'bell' | 'heart' | 'mail';

// Usa <SvgIcon sprite name="home" /> una sola vez para inyectar el sprite; el resto, sin `sprite`.
withDefaults(defineProps<{ name: IconName; size?: number; label?: string; sprite?: boolean }>(), { size: 24 });
</script>

<template>
  <svg v-if="sprite" width="0" height="0" style="position: absolute" aria-hidden="true">
    <symbol id="i-home" viewBox="0 0 24 24"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></symbol>
    <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></symbol>
    <symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" /></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></symbol>
  </svg>

  <!-- Icono: el color viene de currentColor -->
  <svg
    class="i"
    :width="size"
    :height="size"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : true"
  >
    <use :href="`#i-${name}`" />
  </svg>
</template>

<style scoped>
.i { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
</style>
