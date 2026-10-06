<script setup lang="ts">
defineProps<{
  title: string;
  meta?: string;
  quote?: { text: string; author: string };
}>();
</script>

<template>
  <article class="prose">
    <h1>{{ title }}</h1>
    <p v-if="meta" class="meta">{{ meta }}</p>
    <slot /> <!-- párrafos, h2, listas… -->
    <blockquote v-if="quote">
      {{ quote.text }}
      <cite>{{ quote.author }}</cite>
    </blockquote>
  </article>
</template>

<style scoped>
.prose { max-width: 65ch; margin-inline: auto; font: 1.0625rem/1.7 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); hyphens: auto; }
.prose > :deep(* + *) { margin-top: 1.1em; }
h1 { margin: 0; font-size: clamp(1.8rem, 1.3rem + 2.5vw, 2.5rem); font-weight: 700; line-height: 1.1; letter-spacing: -.025em; text-wrap: balance; }
.prose :deep(h2) { margin-top: 1.8em; font-size: 1.4rem; font-weight: 650; line-height: 1.2; letter-spacing: -.015em; }
.meta { margin-top: .5em; font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; }
.prose :deep(a) { color: var(--accent); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; border-radius: 4px; transition: background .14s; }
.prose :deep(a:hover) { background: var(--accent-soft); }
.prose :deep(:focus-visible) { outline: 2px solid var(--accent); outline-offset: 2px; }
blockquote { position: relative; margin-inline: 0; padding: .3em 0 .3em 1.25em; font-size: 1.2rem; line-height: 1.45; }
blockquote::before { content: ""; position: absolute; inset: 0 auto 0 0; width: 3px; border-radius: 3px; background: linear-gradient(180deg, #22d3ee, #2f5bff); }
cite { display: block; margin-top: .4em; font-size: 13px; font-style: normal; color: var(--muted); }
.prose :deep(ul), .prose :deep(ol) { padding-left: 1.4em; }
.prose :deep(li + li) { margin-top: .4em; }
.prose :deep(li::marker) { color: var(--accent); font-weight: 700; }
.prose :deep(code) { padding: .1em .4em; font: .88em ui-monospace, "Cascadia Code", Menlo, monospace; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; }
.prose :deep(mark) { background: var(--warn-soft); color: var(--text); padding: 0 .2em; border-radius: 3px; }
@media (prefers-reduced-motion: reduce) { .prose :deep(a) { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
