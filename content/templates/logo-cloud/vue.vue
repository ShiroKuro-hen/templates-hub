<script setup lang="ts">
type Logo = { name: string; font: 'serif' | 'mono' | 'black' | 'ital' | 'wide' | 'round'; mark: string }; // mark = SVG interno 26x26

withDefaults(defineProps<{ logos?: Logo[]; title?: string }>(), {
  title: 'Más de 2.400 equipos confían en Nimbo',
  logos: () => [
    { name: 'Finca Norte', font: 'serif', mark: '<circle cx="13" cy="13" r="10" fill="#ff5a36" stroke="#17130f" stroke-width="2.5"/>' },
    { name: 'orbita.labs', font: 'mono', mark: '<path d="M13 3l10 18H3z" fill="#17130f"/>' },
    { name: 'kiwipay', font: 'black', mark: '<rect x="3" y="3" width="20" height="20" rx="4" fill="#3b5bfd" stroke="#17130f" stroke-width="2.5"/>' },
    { name: 'Marea', font: 'ital', mark: '<path d="M3 18c4-12 8-12 10 0s6 12 10 0" fill="none" stroke="#17130f" stroke-width="3" stroke-linecap="round"/>' },
    { name: 'VÉRTICE', font: 'wide', mark: '<path d="M13 2l11 11-11 11L2 13z" fill="#ffd84d" stroke="#17130f" stroke-width="2.5" stroke-linejoin="round"/>' },
    { name: 'Lumen', font: 'round', mark: '<circle cx="9" cy="13" r="7" fill="#17130f"/><circle cx="17" cy="13" r="7" fill="#1f9d55" fill-opacity=".85"/>' },
    { name: 'Estudio Tramo', font: 'serif', mark: '<path d="M4 22V4h4v18zM11 22V10h4v12zM18 22V15h4v7z" fill="#17130f"/>' },
    { name: 'cobalto', font: 'mono', mark: '<path d="M13 3a10 10 0 100 20V3z" fill="#ff5a36" stroke="#17130f" stroke-width="2.5" stroke-linejoin="round"/>' },
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
.logos { max-width: 1040px; margin: 0 auto; padding: 36px 20px; text-align: center; color: #17130f; font: 15px/1.5 system-ui, sans-serif; }
h2 { margin: 0 0 22px; color: #6b6258; font-size: 1rem; font-weight: 600; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); margin: 0; padding: 0; list-style: none; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; overflow: hidden; }
@media (min-width: 640px) { .grid { grid-template-columns: repeat(4, 1fr); } }
li { display: flex; gap: 8px; align-items: center; justify-content: center; min-height: 76px; padding: 12px; border: solid #17130f; border-width: 0 2px 2px 0; font-size: 1.15rem; transition: background .15s; }
li:hover { background: #ffd84d; }
li svg { flex: none; width: 26px; height: 26px; }
.f-serif { font-family: Georgia, serif; font-weight: 700; letter-spacing: -.02em; }
.f-mono { font-family: ui-monospace, monospace; font-weight: 700; }
.f-black { font-weight: 900; letter-spacing: -.04em; text-transform: lowercase; }
.f-ital { font-family: Georgia, serif; font-style: italic; }
.f-wide { font-weight: 600; letter-spacing: .14em; font-size: .95rem; }
.f-round { font-weight: 800; letter-spacing: -.02em; }
@media (max-width: 639px) { li:nth-child(2n) { border-right: 0; } li:nth-child(n + 7) { border-bottom: 0; } }
@media (min-width: 640px) { li:nth-child(4n) { border-right: 0; } li:nth-child(n + 5) { border-bottom: 0; } }
@media (prefers-reduced-motion: reduce) { li { transition: none; } }
</style>
