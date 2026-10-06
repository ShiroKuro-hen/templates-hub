<script setup lang="ts">
type LinkItem = { label: string; href: string };
type Column = { title: string; links: LinkItem[] };
type Social = { name: string; href: string; paths: string[] }; // paths = atributos "d" 24x24

withDefaults(defineProps<{ columns: Column[]; socials?: Social[]; tagline?: string; legal?: LinkItem[] }>(), {
  socials: () => [],
  legal: () => [],
});
const year = new Date().getFullYear();
</script>

<template>
  <footer>
    <div class="top">
      <div>
        <a class="brand" href="#inicio" aria-label="Nimbo, inicio"><span aria-hidden="true">N</span>Nimbo</a>
        <p v-if="tagline" class="tag">{{ tagline }}</p>
        <ul class="social">
          <li v-for="s in socials" :key="s.name">
            <a :href="s.href" :aria-label="`Nimbo en ${s.name}`">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path v-for="d in s.paths" :key="d" :d="d" /></svg>
            </a>
          </li>
        </ul>
      </div>
      <nav class="cols" aria-label="Pie de página">
        <div v-for="c in columns" :key="c.title" class="col">
          <h2>{{ c.title }}</h2>
          <ul><li v-for="l in c.links" :key="l.label"><a :href="l.href">{{ l.label }}</a></li></ul>
        </div>
      </nav>
    </div>
    <div class="legal">
      <p>© {{ year }} Nimbo Software, S.L. Todos los derechos reservados.</p>
      <ul><li v-for="l in legal" :key="l.label"><a :href="l.href">{{ l.label }}</a></li></ul>
    </div>
  </footer>
</template>

<style scoped>
footer { position: relative; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); box-shadow: var(--shadow); overflow: hidden; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
footer::before { content: ""; position: absolute; inset: 0 0 auto; height: 2px; background: linear-gradient(135deg, #22d3ee, #2f5bff); }
a { color: inherit; }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
.top { display: grid; gap: 32px; padding: 40px 24px 32px; }
@media (min-width: 900px) { .top { grid-template-columns: 1.3fr repeat(4, 1fr); padding: 48px 32px 36px; } }
.brand { display: inline-flex; gap: 10px; align-items: center; color: var(--text); font-size: 1.2rem; font-weight: 700; letter-spacing: -.02em; text-decoration: none; }
.brand span { display: grid; place-items: center; width: 28px; height: 28px; border-radius: var(--radius); background: linear-gradient(135deg, #22d3ee, #2f5bff); color: #fff; font-size: .95rem; }
.tag { max-width: 26ch; margin: 12px 0 18px; color: var(--muted); }
.social { display: flex; gap: 8px; margin: 0; padding: 0; list-style: none; }
.social a { display: grid; place-items: center; width: 36px; height: 36px; border: 1px solid var(--border); border-radius: var(--radius); color: var(--muted); transition: color .14s, border-color .14s, background .14s; }
.social a:hover { color: var(--accent); border-color: var(--accent); background: var(--accent-soft); }
.social svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.cols { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px 16px; }
@media (min-width: 900px) { .cols { display: contents; } }
h2 { margin: 0 0 12px; color: var(--text); font-size: .9rem; font-weight: 600; }
.col ul { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.col a { color: var(--muted); text-decoration: none; transition: color .14s; }
.col a:hover { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.legal { display: flex; flex-wrap: wrap; gap: 8px 20px; justify-content: space-between; padding: 18px 24px; border-top: 1px solid var(--border); color: var(--muted); font-size: .85rem; }
@media (min-width: 900px) { .legal { padding: 18px 32px; } }
.legal p { margin: 0; }
.legal ul { display: flex; gap: 16px; margin: 0; padding: 0; list-style: none; }
.legal a:hover { color: var(--accent); }
@media (prefers-reduced-motion: reduce) { .social a, .col a { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
