<script setup lang="ts">
import { useId } from 'vue';

// Tooltip solo CSS: Vue solo conecta aria-describedby con el role="tooltip".
defineProps<{ tip: string; below?: boolean }>();
const id = useId();
</script>

<template>
  <span :class="['tip', { below }]">
    <button type="button" class="btn" :aria-describedby="id"><slot /></button>
    <span role="tooltip" :id="id">{{ tip }}</span>
  </span>
</template>

<style scoped>
.btn { font: 500 14px/1 system-ui, -apple-system, "Segoe UI", sans-serif; padding: 9px 14px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: 0 1px 2px rgba(14, 23, 38, .06); cursor: pointer; transition: border-color .14s, background .14s; }
.btn:hover { border-color: var(--accent); background: var(--accent-soft); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.tip { position: relative; display: inline-block; }
.tip [role="tooltip"] { position: absolute; left: 50%; bottom: calc(100% + 8px); z-index: 10; width: max-content; max-width: 220px; padding: 6px 10px; font: 13px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; text-align: center; color: var(--surface); background: var(--text); border-radius: 6px; box-shadow: var(--shadow); opacity: 0; visibility: hidden; transform: translate(-50%, 4px); transition: opacity .14s, transform .14s, visibility 0s .14s; }
.tip [role="tooltip"]::after { content: ""; position: absolute; left: 50%; top: 100%; margin-left: -5px; border: 5px solid transparent; border-top-color: var(--text); }
.tip [role="tooltip"]::before { content: ""; position: absolute; left: 0; right: 0; top: 100%; height: 8px; } /* puente: el puntero no la pierde */
.tip.below [role="tooltip"] { bottom: auto; top: calc(100% + 8px); transform: translate(-50%, -4px); }
.tip.below [role="tooltip"]::after { top: auto; bottom: 100%; border-top-color: transparent; border-bottom-color: var(--text); }
.tip.below [role="tooltip"]::before { top: auto; bottom: 100%; }
.tip:hover [role="tooltip"], .tip:has(:focus-visible) [role="tooltip"] { opacity: 1; visibility: visible; transform: translate(-50%, 0); transition-delay: 0s; }
@media (prefers-reduced-motion: reduce) { .btn, .tip [role="tooltip"] { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
