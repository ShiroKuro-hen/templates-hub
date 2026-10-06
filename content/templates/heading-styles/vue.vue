<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; lead?: string }>();
</script>

<template>
  <article class="doc">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h1>{{ title }}</h1>
    <p v-if="lead" class="lead">{{ lead }}</p>
    <slot /> <!-- h2–h6 y párrafos -->
  </article>
</template>

<style scoped>
.doc { max-width: 60ch; color: var(--text); font: 16px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; }
h1, .doc :deep(h2), .doc :deep(h3), .doc :deep(h4), .doc :deep(h5), .doc :deep(h6) { margin: 1.4em 0 .35em; line-height: 1.2; text-wrap: balance; }
.doc > :first-child { margin-top: 0; }
.eyebrow { display: inline-block; margin: 0 0 12px; padding: 2px 10px; font-weight: 600; font-size: 13px; color: var(--accent); background: var(--accent-soft); border-radius: 999px; }
h1 { margin-top: 0; font-size: clamp(2rem, 1.4rem + 3vw, 2.9rem); font-weight: 700; letter-spacing: -.025em; line-height: 1.08; }
.lead { margin: .5em 0 0; font-size: 1.2rem; color: var(--muted); max-width: 46ch; }
.doc :deep(h2) { font-size: 1.75rem; font-weight: 700; letter-spacing: -.02em; padding-bottom: .3em; border-bottom: 1px solid var(--border); }
.doc :deep(h3) { display: flex; align-items: center; gap: .5em; font-size: 1.35rem; font-weight: 650; letter-spacing: -.015em; }
.doc :deep(h3)::before { content: ""; flex: none; width: .5em; height: .5em; border-radius: 2px; background: linear-gradient(135deg, #22d3ee, #2f5bff); }
.doc :deep(h4) { font-size: 1.1rem; font-weight: 600; }
.doc :deep(h5) { font-size: 1rem; font-weight: 600; color: var(--muted); }
.doc :deep(h6) { font-size: .875rem; font-weight: 500; color: var(--muted); }
.doc :deep(code) { padding: .1em .4em; font: .88em ui-monospace, "Cascadia Code", Menlo, monospace; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; }
.doc :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
/* Tokens: ver pestaña HTML + CSS */
</style>
