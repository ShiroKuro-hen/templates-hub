<script setup lang="ts">
// keys: combinación con "+" ("Ctrl+K") o secuencia con espacio ("G H").
type Group = { title: string; items: { action: string; keys: string }[] };

withDefaults(defineProps<{ groups?: Group[] }>(), {
  groups: () => [
    { title: 'General', items: [
      { action: 'Abrir la paleta de comandos', keys: 'Ctrl+K' },
      { action: 'Mostrar esta lista', keys: '?' },
      { action: 'Cerrar panel o diálogo', keys: 'Esc' },
    ] },
    { title: 'Navegación', items: [
      { action: 'Ir al inicio', keys: 'G H' },
      { action: 'Elemento siguiente', keys: 'J' },
      { action: 'Elemento anterior', keys: 'K' },
    ] },
    { title: 'Edición', items: [
      { action: 'Guardar cambios', keys: 'Ctrl+S' },
      { action: 'Deshacer', keys: 'Ctrl+Z' },
      { action: 'Rehacer', keys: 'Ctrl+Shift+Z' },
    ] },
  ],
});
</script>

<template>
  <section class="card" aria-labelledby="kbd-title">
    <header>
      <h2 id="kbd-title">Atajos de teclado</h2>
      <p>Trabaja más rápido sin soltar el teclado.</p>
    </header>
    <div class="groups">
      <section v-for="g in groups" :key="g.title" :aria-label="g.title">
        <h3>{{ g.title }}</h3>
        <dl>
          <div v-for="s in g.items" :key="s.action">
            <dt>{{ s.action }}</dt>
            <dd>
              <template v-for="(combo, i) in s.keys.split(' ')" :key="combo">
                <template v-if="i > 0"> luego </template>
                <kbd><template v-for="(k, j) in combo.split('+')" :key="k"><template v-if="j > 0">+</template><kbd>{{ k }}</kbd></template></kbd>
              </template>
            </dd>
          </div>
        </dl>
      </section>
    </div>
    <footer>En macOS, usa <kbd><kbd>⌘</kbd></kbd> en lugar de <kbd><kbd>Ctrl</kbd></kbd>.</footer>
  </section>
</template>

<style scoped>
.card{max-width:880px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.card > header{position:relative;padding:16px 20px;border-bottom:1px solid var(--border)}
.card > header::after{content:"";position:absolute;left:0;bottom:-1px;width:96px;height:1px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
h2{margin:0;font-size:16px;font-weight:600}
.card > header p{margin:2px 0 0;color:var(--muted)}
.groups{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:4px 32px;padding:8px 20px 16px}
h3{margin:12px 0 4px;font-size:13px;font-weight:600;color:var(--muted)}
dl{margin:0}
dl div{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid var(--border)}
dl div:last-child{border-bottom:0}
dd{margin:0;flex:none;display:flex;align-items:center;gap:4px;color:var(--muted);font-size:12px}
kbd kbd{display:inline-grid;place-items:center;min-width:24px;height:24px;padding:0 6px;box-sizing:border-box;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:6px;box-shadow:inset 0 -1px 0 var(--border);font:600 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;font-variant-numeric:tabular-nums}
kbd{display:inline-flex;align-items:center;gap:4px;font:inherit}
.card > footer{padding:12px 20px;border-top:1px solid var(--border);color:var(--muted);font-size:13px}
/* Tokens: ver pestaña HTML + CSS */
</style>
