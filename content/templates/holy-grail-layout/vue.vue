<script setup lang="ts">
withDefaults(defineProps<{
  titulo?: string;
  nav?: { href: string; label: string }[];
  actual?: string;
}>(), {
  titulo: 'Taller Luna',
  actual: '#inicio',
  nav: () => [
    { href: '#inicio', label: 'Inicio' },
    { href: '#pedidos', label: 'Pedidos' },
    { href: '#clientes', label: 'Clientes' },
    { href: '#ajustes', label: 'Ajustes' },
  ],
});
</script>

<template>
  <a class="skip" href="#contenido">Saltar al contenido</a>
  <div class="page">
    <header><h1>{{ titulo }}</h1><span class="tag">Panel</span></header>
    <nav aria-label="Principal">
      <ul>
        <li v-for="n in nav" :key="n.href">
          <a :href="n.href" :aria-current="n.href === actual ? 'page' : undefined">{{ n.label }}</a>
        </li>
      </ul>
    </nav>
    <main id="contenido"><slot /></main>
    <aside aria-label="Avisos"><slot name="aside" /></aside>
    <footer><small>© 2026 {{ titulo }}. Todos los derechos reservados.</small></footer>
  </div>
</template>

<style scoped>
.page { display: grid; gap: 12px; min-height: 100vh; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text);
  grid-template-columns: minmax(0, 1fr); grid-template-areas: "header" "nav" "main" "aside" "footer"; }
.page > * { margin: 0; padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); }
header { grid-area: header; position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
header::after { content: ""; position: absolute; inset: auto 0 0; height: 2px; background: linear-gradient(135deg, #22d3ee, #2f5bff); }
nav { grid-area: nav; } main { grid-area: main; } aside { grid-area: aside; background: var(--accent-soft); } footer { grid-area: footer; color: var(--muted); }
h1 { margin: 0; font-size: 1.125rem; letter-spacing: -.01em; }
.tag { padding: 2px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: .75rem; font-weight: 600; }
nav ul { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 4px 8px; }
nav a { display: block; padding: 4px 10px; border-radius: var(--radius); color: var(--text); font-weight: 500; text-decoration: none; transition: background 140ms; }
nav a:hover { background: var(--accent-soft); }
nav a[aria-current="page"] { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.skip { position: absolute; left: -9999px; background: var(--surface); color: var(--text); padding: 6px 10px; border: 1px solid var(--border); border-radius: var(--radius); }
.skip:focus { left: 12px; top: 12px; z-index: 1; }
@media (min-width: 600px) {
  nav ul { flex-direction: column; flex-wrap: nowrap; }
  .page { grid-template-columns: 140px minmax(0, 1fr) 160px; grid-template-rows: auto 1fr auto;
    grid-template-areas: "header header header" "nav main aside" "footer footer footer"; }
}
@media (prefers-reduced-motion: reduce) { nav a { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
