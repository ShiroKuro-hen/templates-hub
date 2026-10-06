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
footer { background: #17130f; color: #d9d2c5; border-top: 4px solid #ff5a36; font: 14px/1.5 system-ui, sans-serif; }
a { color: inherit; }
a:focus-visible { outline: 3px solid #ffd84d; outline-offset: 3px; border-radius: 4px; }
.top { display: grid; gap: 28px; max-width: 1040px; margin: 0 auto; padding: 36px 20px 28px; }
@media (min-width: 900px) { .top { grid-template-columns: 1.3fr repeat(4, 1fr); } }
.brand { display: inline-flex; gap: 10px; align-items: center; color: #fffdf8; font-size: 1.25rem; font-weight: 800; text-decoration: none; }
.brand span { display: grid; place-items: center; width: 30px; height: 30px; border: 2px solid #fffdf8; border-radius: 8px; background: #ff5a36; color: #17130f; }
.tag { max-width: 26ch; margin: 12px 0 16px; color: #a89f92; }
.social { display: flex; gap: 10px; margin: 0; padding: 0; list-style: none; }
.social a { display: grid; place-items: center; width: 38px; height: 38px; border: 2px solid #d9d2c5; border-radius: 10px; color: #fffdf8; }
.social a:hover { background: #ffd84d; border-color: #ffd84d; color: #17130f; }
.social svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.cols { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px 16px; }
@media (min-width: 900px) { .cols { display: contents; } }
h2 { margin: 0 0 10px; color: #fffdf8; font: 700 .8rem ui-monospace, monospace; }
.col ul { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.col a { text-decoration: none; }
.col a:hover { color: #ffd84d; text-decoration: underline; }
.legal { display: flex; flex-wrap: wrap; gap: 8px 20px; justify-content: space-between; max-width: 1040px; margin: 0 auto; padding: 18px 20px; border-top: 1px solid #3d362e; color: #a89f92; font-size: .85rem; }
.legal p { margin: 0; }
.legal ul { display: flex; gap: 16px; margin: 0; padding: 0; list-style: none; }
</style>
