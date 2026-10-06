<script setup lang="ts">
import { ref } from 'vue';

withDefaults(
  defineProps<{ title?: string; description?: string; actionLabel?: string; secondaryLabel?: string }>(),
  {
    title: 'Aún no tienes proyectos',
    description: 'Crea el primero para empezar a organizar tu trabajo.',
    actionLabel: 'Crear proyecto',
    secondaryLabel: 'Importar desde CSV',
  },
);
const emit = defineEmits<{ (e: 'action'): void }>();
const note = ref('');

function create() {
  emit('action');
  note.value = 'Proyecto creado: «Sin título».'; // se anuncia con role="status"
}
</script>

<template>
  <section class="empty" aria-labelledby="empty-title">
    <slot name="illustration">
      <svg viewBox="0 0 160 112" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="80" cy="20" r="10" stroke-dasharray="3 5" />
        <path class="spark" d="M126 14v14M119 21h14" />
        <path class="lid" d="M26 66l12-16h22l6 16zM134 66l-12-16h-22l-6 16z" />
        <rect class="box" x="26" y="66" width="108" height="34" rx="5" />
        <rect class="slot" x="60" y="77" width="40" height="7" rx="3.5" />
      </svg>
    </slot>
    <h2 id="empty-title">{{ title }}</h2>
    <p>{{ description }}</p>
    <div class="actions">
      <button class="btn" type="button" @click="create">{{ actionLabel }}</button>
      <button v-if="secondaryLabel" class="link" type="button">{{ secondaryLabel }}</button>
    </div>
    <p class="note" role="status">{{ note }}</p>
  </section>
</template>

<style scoped>
.empty { max-width: 440px; margin: 0 auto; padding: 24px 24px 20px; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); text-align: center; background: var(--surface); border: 1px dashed var(--border); border-radius: var(--radius); }
.empty :slotted(svg), .empty svg { display: block; width: 112px; height: auto; margin: 0 auto 8px; color: var(--muted); }
.lid { fill: var(--accent-soft); }
.box { fill: var(--surface); }
.slot { fill: var(--accent); stroke: none; }
.spark { stroke: var(--accent); }
h2 { margin: 0 0 4px; font-size: 1.125rem; font-weight: 600; letter-spacing: -.01em; }
p { max-width: 34ch; margin: 0 auto 16px; color: var(--muted); }
.actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px 12px; }
.btn { padding: 8px 16px; font: 600 14px system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--accent-ink); background: var(--accent); border: 1px solid var(--accent); border-radius: var(--radius); cursor: pointer; transition: filter 140ms; }
.btn:hover { filter: brightness(1.08); }
.link { padding: 8px 12px; font: 500 14px system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--accent); background: none; border: 0; border-radius: var(--radius); cursor: pointer; transition: background 140ms; }
.link:hover { background: var(--accent-soft); }
.btn:focus-visible, .link:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.note { min-height: 1.5em; margin: 12px 0 0; font-size: 13px; color: var(--ok); }
@media (prefers-reduced-motion: reduce) { .btn, .link { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
