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
.prose { max-width: 65ch; margin-inline: auto; font: 1.0625rem/1.7 system-ui, sans-serif; color: #17130f; hyphens: auto; }
.prose > :deep(* + *) { margin-top: 1.1em; }
h1 { margin: 0; font-size: clamp(1.8rem, 1.3rem + 2.5vw, 2.4rem); line-height: 1.1; letter-spacing: -.02em; text-wrap: balance; }
.prose :deep(h2) { margin-top: 1.8em; font-size: 1.4rem; line-height: 1.2; letter-spacing: -.02em; }
.meta { font: 13px ui-monospace, monospace; color: #6b6258; }
.prose :deep(a) { color: #3b5bfd; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px; }
.prose :deep(a:hover) { background: #ffd84d; color: #17130f; }
.prose :deep(:focus-visible) { outline: 3px solid #ff5a36; outline-offset: 2px; }
blockquote { margin-inline: 0; padding: .2em 0 .2em 1em; border-left: 6px solid #ff5a36; font-size: 1.2rem; line-height: 1.45; font-style: italic; }
cite { display: block; margin-top: .4em; font: normal 13px ui-monospace, monospace; color: #6b6258; }
.prose :deep(ul), .prose :deep(ol) { padding-left: 1.4em; }
.prose :deep(li + li) { margin-top: .4em; }
.prose :deep(li::marker) { color: #ff5a36; font-weight: 700; }
.prose :deep(code) { padding: .1em .35em; font: .88em ui-monospace, monospace; background: #fffdf8; border: 1.5px solid #17130f; border-radius: 5px; }
.prose :deep(mark) { background: #ffd84d; padding: 0 .15em; }
</style>
