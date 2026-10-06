<script setup lang="ts">
import { ref } from 'vue';

type Icon = { name: string; d: string }; // d = contenido interno del <svg> (viewBox 24)

const props = withDefaults(defineProps<{ icons?: Icon[] }>(), {
  icons: () => [
    { name: 'inicio', d: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>' },
    { name: 'buscar', d: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>' },
    { name: 'usuario', d: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>' },
    { name: 'correo', d: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>' },
    { name: 'estrella', d: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>' },
    { name: 'aviso', d: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>' },
    { name: 'listo', d: '<path d="M4 12l5 5L20 6"/>' },
    { name: 'cerrar', d: '<path d="M5 5l14 14M19 5L5 19"/>' },
  ],
});

const copied = ref('');

async function copy(icon: Icon) {
  await navigator.clipboard.writeText(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon.d}</svg>`
  );
  copied.value = icon.name;
}
</script>

<template>
  <section>
    <header>
      <h1>Iconos</h1>
      <p id="st" role="status">{{ copied ? `Copiado: ${copied}` : 'Clic para copiar el SVG' }}</p>
    </header>
    <ul class="grid">
      <li v-for="icon in props.icons" :key="icon.name">
        <button type="button" class="ico" :aria-label="`Copiar SVG de ${icon.name}`" @click="copy(icon)">
          <svg viewBox="0 0 24 24" aria-hidden="true" v-html="icon.d" />
          <span>{{ icon.name }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
section { font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
h1 { margin: 0; font-size: 1.1rem; font-weight: 600; letter-spacing: -.01em; }
#st { margin: 0; font-size: 12px; color: var(--muted); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
.ico { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 4px 8px; font: 12px system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--muted); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; transition: border-color .14s, color .14s, box-shadow .14s; }
.ico:hover { color: var(--accent); border-color: var(--accent); box-shadow: var(--shadow); }
.ico:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.ico svg { width: 24px; height: 24px; color: var(--text); fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ico:hover svg { color: var(--accent); }
@media (prefers-reduced-motion: reduce) { .ico { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
