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
      <svg viewBox="0 0 160 112" fill="none" stroke="#17130f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <ellipse cx="80" cy="104" rx="46" ry="5" fill="#17130f1f" stroke="none" />
        <circle cx="80" cy="20" r="10" stroke-dasharray="4 6" />
        <path d="M126 14v14M119 21h14" stroke="#3b5bfd" />
        <path d="M26 66l12-16h22l6 16zM134 66l-12-16h-22l-6 16z" fill="#ffd84d" />
        <rect x="26" y="66" width="108" height="34" rx="5" fill="#fffdf8" />
        <rect x="60" y="76" width="40" height="9" rx="4.5" fill="#ff5a36" />
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
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
.empty { max-width:440px; margin:0 auto; padding:14px 20px 18px; font:14px/1.5 system-ui, sans-serif; color:#17130f; text-align:center; background:#fffdf8; border:2px dashed #17130f; border-radius:10px; }
.empty :slotted(svg), .empty svg { display:block; width:128px; height:auto; margin:0 auto; }
h2 { margin:4px 0 2px; font-size:1.25rem; letter-spacing:-.02em; }
p { max-width:34ch; margin:0 auto 14px; color:#6b6258; }
.actions { display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:6px 14px; }
.btn { padding:9px 18px; font:700 14px system-ui, sans-serif; color:#17130f; background:#ff5a36; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; cursor:pointer; }
.btn:hover, .btn:active { transform:translate(2px,2px); box-shadow:2px 2px 0 #17130f; }
.link { padding:6px; font:600 14px system-ui, sans-serif; color:inherit; background:none; border:0; border-radius:6px; text-decoration:underline; text-underline-offset:3px; cursor:pointer; }
.note { min-height:1.5em; margin:10px 0 0; font:600 12px ui-monospace, monospace; color:#1f7a45; }
</style>
