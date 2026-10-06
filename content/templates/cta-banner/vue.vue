<script setup lang="ts">
type Link = { label: string; href: string };

defineProps<{ title: string; text?: string; primary: Link; secondary?: Link }>();
</script>

<template>
  <section class="cta" aria-labelledby="cta-title">
    <div class="txt">
      <h2 id="cta-title">{{ title }}</h2>
      <p v-if="text">{{ text }}</p>
    </div>
    <div class="row">
      <a class="btn" :href="primary.href">{{ primary.label }}</a>
      <a v-if="secondary" class="link" :href="secondary.href">{{ secondary.label }}</a>
    </div>
  </section>
</template>

<style scoped>
.cta { position: relative; overflow: hidden; display: grid; gap: 24px; align-items: center; max-width: 1040px; margin: 0 auto; padding: 36px 24px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; box-shadow: var(--shadow); }
@media (min-width: 720px) { .cta { grid-template-columns: 1fr auto; padding: 48px; } }
.cta::before { content: ""; position: absolute; inset: 0; background: linear-gradient(var(--border) 1px, transparent 1px) 0 0 / 32px 32px, linear-gradient(90deg, var(--border) 1px, transparent 1px) 0 0 / 32px 32px; -webkit-mask-image: radial-gradient(ellipse at 100% 0, #000, transparent 70%); mask-image: radial-gradient(ellipse at 100% 0, #000, transparent 70%); pointer-events: none; }
.txt, .row { position: relative; }
.txt { max-width: 34rem; }
h2 { margin: 0 0 8px; font-size: clamp(1.6rem, 4.5vw, 2.4rem); font-weight: 700; line-height: 1.1; letter-spacing: -.025em; text-wrap: balance; }
p { margin: 0; color: var(--muted); font-size: 1.02rem; }
.row { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
.btn { padding: 11px 20px; border: 1px solid var(--accent); border-radius: var(--radius); background: var(--accent); color: var(--accent-ink); font-weight: 600; font-size: 1rem; text-decoration: none; box-shadow: var(--shadow); transition: filter .14s, transform .14s; }
.btn:hover { filter: brightness(1.08); }
.btn:active { transform: translateY(1px); }
.btn:focus-visible, .link:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.link { color: var(--text); font-weight: 600; text-underline-offset: 4px; }
.link:hover { color: var(--accent); }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
