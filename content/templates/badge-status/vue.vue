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
.badge { --c: #6b6258; --bg: #ebe5d8; display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 8px;
  border: 2px solid #17130f; border-radius: 999px; background: var(--bg); color: #17130f; font: 700 12px system-ui, sans-serif; white-space: nowrap; }
.badge::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
.badge--ok { --c: #1f9d55; --bg: #dff3e6; }
.badge--warn { --c: #e0a800; --bg: #fff1bf; }
.badge--err { --c: #d6293e; --bg: #fbdde1; }
.badge--ok::before { animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: .35; } }
@media (prefers-reduced-motion: reduce) { .badge--ok::before { animation: none; } }
</style>
