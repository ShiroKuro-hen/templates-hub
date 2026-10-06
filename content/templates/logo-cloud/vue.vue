<script setup lang="ts">
type Logo = { name: string; font: 'serif' | 'mono' | 'black' | 'ital' | 'wide' | 'round'; mark: string }; // mark = SVG interno 26x26, con currentColor

withDefaults(defineProps<{ logos?: Logo[]; title?: string }>(), {
  title: 'Más de 2.400 equipos confían en Nimbo',
  logos: () => [
    { name: 'Finca Norte', font: 'serif', mark: '<circle class="hi" cx="13" cy="13" r="10" fill="currentColor"/>' },
    { name: 'orbita.labs', font: 'mono', mark: '<path d="M13 3l10 18H3z" fill="currentColor"/>' },
    { name: 'kiwipay', font: 'black', mark: '<rect class="hi" x="3" y="3" width="20" height="20" rx="4" fill="currentColor"/>' },
    { name: 'Marea', font: 'ital', mark: '<path d="M3 18c4-12 8-12 10 0s6 12 10 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' },
    { name: 'Vértice', font: 'wide', mark: '<path class="hi" d="M13 2l11 11-11 11L2 13z" fill="currentColor"/>' },
    { name: 'Lumen', font: 'round', mark: '<circle cx="9" cy="13" r="7" fill="currentColor"/><circle class="hi" cx="17" cy="13" r="7" fill="currentColor" fill-opacity=".6"/>' },
    { name: 'Estudio Tramo', font: 'serif', mark: '<path d="M4 22V4h4v18zM11 22V10h4v12zM18 22V15h4v7z" fill="currentColor"/>' },
    { name: 'cobalto', font: 'mono', mark: '<path class="hi" d="M13 3a10 10 0 100 20V3z" fill="currentColor"/>' },
  ],
});
</script>

<template>
  <section class="logos" aria-labelledby="logos-title">
    <h2 id="logos-title">{{ title }}</h2>
    <ul class="grid">
      <li v-for="l in logos" :key="l.name" :class="`f-${l.font}`">
        <svg viewBox="0 0 26 26" aria-hidden="true" v-html="l.mark"></svg>
        {{ l.name }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.logos { max-width: 1040px; margin: 0 auto; padding: 24px 0; text-align: center; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
h2 { margin: 0 0 28px; color: var(--muted); font-size: 1rem; font-weight: 500; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; margin: 0; padding: 0; list-style: none; border: 1px solid var(--border); border-radius: var(--radius); background: var(--border); box-shadow: var(--shadow); overflow: hidden; }
@media (min-width: 640px) { .grid { grid-template-columns: repeat(4, 1fr); } }
li { display: flex; gap: 8px; align-items: center; justify-content: center; min-height: 84px; padding: 12px; background: var(--surface); color: var(--muted); font-size: 1.1rem; transition: color .14s, background .14s; }
li:hover { color: var(--text); background: var(--accent-soft); }
li svg { flex: none; width: 26px; height: 26px; }
li:hover svg :deep(.hi) { color: var(--accent); }
.f-serif { font-family: Georgia, serif; font-weight: 700; letter-spacing: -.02em; }
.f-mono { font-family: ui-monospace, "Cascadia Code", Menlo, monospace; font-weight: 700; }
.f-black { font-weight: 900; letter-spacing: -.04em; }
.f-ital { font-family: Georgia, serif; font-style: italic; }
.f-wide { font-weight: 600; letter-spacing: .06em; font-size: 1rem; }
.f-round { font-weight: 800; letter-spacing: -.02em; }
@media (prefers-reduced-motion: reduce) { li { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
