<script setup lang="ts">
const enlaces = ['Inicio', 'Proyectos', 'Equipo'];
</script>

<template>
  <main class="stage">
    <span class="shape s1" aria-hidden="true" />
    <span class="shape s2" aria-hidden="true" />
    <span class="shape s3" aria-hidden="true" />
    <nav class="glass glass-nav" aria-label="Principal">
      <strong class="brand">Aurora</strong>
      <ul class="links">
        <li v-for="(texto, i) in enlaces" :key="texto">
          <a href="#" :aria-current="i === 0 ? 'page' : undefined">{{ texto }}</a>
        </li>
      </ul>
    </nav>
    <article class="glass glass-card">
      <h2>Plan Pro</h2>
      <p>Acceso a todos los paneles, informes semanales y soporte prioritario.</p>
      <button type="button" class="btn">Cambiar plan</button>
    </article>
    <section class="glass glass-window" aria-labelledby="ajustes">
      <header class="win-bar"><h2 id="ajustes">Ajustes</h2></header>
      <label class="row"><span>Avisos por correo</span><input type="checkbox" class="switch" checked /></label>
      <label class="row"><span>Sincronizar en segundo plano</span><input type="checkbox" class="switch" /></label>
    </section>
  </main>
</template>

<style scoped>
.stage { position: relative; isolation: isolate; overflow: hidden; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; max-width: 760px; margin: 0 auto; padding: 16px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg); color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
.shape { position: absolute; z-index: -1; border-radius: 50%; filter: blur(36px); opacity: .75; pointer-events: none; }
.s1 { width: 200px; height: 200px; left: -50px; top: -70px; background: var(--accent); }
.s2 { width: 170px; height: 170px; right: -30px; top: 35%; background: var(--accent-2, var(--info)); }
.s3 { width: 220px; height: 220px; left: 30%; bottom: -130px; background: var(--info); }
.glass { color: var(--text); background: color-mix(in srgb, var(--surface) 72%, transparent); border: 1px solid color-mix(in srgb, var(--text) 14%, transparent); border-radius: var(--radius); box-shadow: var(--shadow); -webkit-backdrop-filter: blur(16px) saturate(140%); backdrop-filter: blur(16px) saturate(140%); }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .glass { background: var(--surface); } }
.glass-nav { grid-column: 1 / -1; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 16px; }
.brand { font-weight: 700; }
.links { display: flex; flex-wrap: wrap; gap: 4px; margin: 0; padding: 0; list-style: none; }
.links a { display: block; padding: 6px 10px; border-radius: var(--radius); color: var(--text); text-decoration: none; }
.links a:hover, .links a[aria-current=page] { background: var(--accent-soft); }
.glass-card { padding: 20px; }
.glass-card p { margin: 0 0 14px; }
h2 { margin: 0 0 6px; font-size: 16px; font-weight: 600; }
.btn { font: inherit; font-weight: 600; padding: 7px 14px; border: 1px solid var(--accent); border-radius: var(--radius); background: var(--accent); color: var(--accent-ink); cursor: pointer; }
.glass-window { overflow: hidden; }
.win-bar { padding: 10px 14px; border-bottom: 1px solid color-mix(in srgb, var(--text) 14%, transparent); }
.win-bar h2 { margin: 0; font-size: 14px; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; cursor: pointer; }
.row + .row { border-top: 1px solid color-mix(in srgb, var(--text) 10%, transparent); }
.switch { appearance: none; flex: none; position: relative; width: 38px; height: 22px; margin: 0; border-radius: 999px; background: var(--muted); cursor: pointer; transition: background .2s; }
.switch::before { content: ""; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--surface); transition: transform .2s; }
.switch:checked { background: var(--accent); }
.switch:checked::before { transform: translateX(16px); }
a:focus-visible, .btn:focus-visible, .switch:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .switch, .switch::before { transition: none; } }
</style>
