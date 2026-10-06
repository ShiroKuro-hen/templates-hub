<script setup lang="ts">
const LABEL = { ok: 'Activo', warn: 'Pendiente', err: 'Error', draft: 'Borrador' } as const;

defineProps<{ status: keyof typeof LABEL }>();
</script>

<template>
  <!-- El slot sustituye el texto por defecto: <StatusBadge status="err">Error de pago</StatusBadge> -->
  <span :class="['badge', status !== 'draft' && `badge--${status}`]">
    <slot>{{ LABEL[status] }}</slot>
  </span>
</template>

<style scoped>
.badge { --c: var(--muted); --bg: var(--accent-soft); display: inline-flex; align-items: center; gap: 6px; padding: 2px 10px 2px 8px;
  border: 1px solid color-mix(in srgb, var(--c) 35%, transparent); border-radius: 999px; background: var(--bg); color: var(--text);
  font: 500 12px system-ui, -apple-system, "Segoe UI", sans-serif; white-space: nowrap; }
.badge::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
.badge--ok { --c: var(--ok); --bg: var(--ok-soft); }
.badge--warn { --c: var(--warn); --bg: var(--warn-soft); }
.badge--err { --c: var(--err); --bg: var(--err-soft); }
.badge--ok::before { animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: .35; } }
@media (prefers-reduced-motion: reduce) { .badge--ok::before { animation: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
