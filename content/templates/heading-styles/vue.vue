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
.doc { max-width: 60ch; font: 16px/1.55 system-ui, sans-serif; color: #17130f; }
.doc :deep(h1), .doc :deep(h2), .doc :deep(h3), .doc :deep(h4), .doc :deep(h5), .doc :deep(h6),
h1 { margin: 1.2em 0 .35em; line-height: 1.15; letter-spacing: -.02em; text-wrap: balance; }
.doc > :first-child { margin-top: 0; }
.eyebrow { display: inline-block; margin: 0 0 8px; padding: 2px 8px; font: 700 12px ui-monospace, monospace; background: #ffd84d; border: 2px solid #17130f; border-radius: 6px; }
h1 { margin-top: 0; font-size: clamp(2rem, 1.4rem + 3vw, 2.8rem); font-weight: 800; }
.lead { margin: .4em 0 0; font-size: 1.2rem; color: #6b6258; max-width: 46ch; }
.doc :deep(h2) { font-size: 1.75rem; font-weight: 800; padding-bottom: .25em; border-bottom: 2px solid #17130f; }
.doc :deep(h3) { font-size: 1.35rem; font-weight: 700; }
.doc :deep(h3)::before { content: ""; display: inline-block; width: .6em; height: .6em; margin-right: .45em; background: #ff5a36; border: 2px solid #17130f; border-radius: 3px; }
.doc :deep(h4) { font-size: 1.1rem; font-weight: 700; }
.doc :deep(h5) { font-size: 1rem; font-weight: 700; color: #6b6258; }
.doc :deep(h6) { font: 700 .8rem ui-monospace, monospace; letter-spacing: 0; color: #6b6258; }
</style>
