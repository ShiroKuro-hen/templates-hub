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
.page { display: grid; gap: 12px; min-height: 100vh; font: 14px/1.4 system-ui, sans-serif; color: #17130f;
  grid-template-columns: minmax(0, 1fr); grid-template-areas: "header" "nav" "main" "aside" "footer"; }
.page > * { margin: 0; padding: 12px 14px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; }
header { grid-area: header; background: #ffd84d; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
nav { grid-area: nav; } main { grid-area: main; } aside { grid-area: aside; background: #cfd8ff; } footer { grid-area: footer; color: #6b6258; }
h1 { margin: 0; font-size: 1.1rem; letter-spacing: -.02em; }
.tag { font: 600 .75rem ui-monospace, monospace; }
nav ul { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 6px 12px; }
nav a { color: #17130f; font-weight: 600; text-underline-offset: 3px; }
nav a[aria-current="page"] { background: #ff5a36; padding: 0 6px; border-radius: 6px; text-decoration: none; }
a:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
.skip { position: absolute; left: -9999px; background: #fffdf8; padding: 6px 10px; border: 2px solid #17130f; }
.skip:focus { left: 12px; top: 12px; z-index: 1; }
@media (min-width: 600px) {
  nav ul { flex-direction: column; flex-wrap: nowrap; }
  .page { grid-template-columns: 130px minmax(0, 1fr) 150px; grid-template-rows: auto 1fr auto;
    grid-template-areas: "header header header" "nav main aside" "footer footer footer"; }
}
</style>
