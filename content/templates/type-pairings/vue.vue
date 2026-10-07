<script setup lang="ts">
const pairs = [
  { name: 'Editorial', kind: 'Serif + sans', display: 'serif', body: 'sans', mono: false,
    title: 'El informe trimestral ya está listo',
    text: 'Titulares con serifa dan autoridad; el cuerpo en sans mantiene la lectura ágil en pantalla.',
    stats: ['Ingresos 1.284.500', 'Clientes 3.912'] },
  { name: 'Técnico', kind: 'Sans + monoespaciada', display: 'sans', body: 'sans', mono: true,
    title: 'Despliegue completado en 42 s',
    text: 'Una sola familia limpia para la interfaz, con monoespaciada reservada para identificadores y comandos.',
    stats: ['build #2481', '14 pruebas'] },
  { name: 'Humanista', kind: 'Humanista + serif', display: 'humanist', body: 'serif', mono: false,
    title: 'Tu equipo crece, tu plan también',
    text: 'Titulares cálidos y legibles, cuerpo con serifa para textos largos como guías y artículos de ayuda.',
    stats: ['12 miembros', '40 GB libres'] },
];
</script>

<template>
  <div class="grid">
    <article v-for="p in pairs" :key="p.name">
      <div class="meta"><b>{{ p.name }}</b><span>{{ p.kind }}</span></div>
      <div class="spec" :style="{ '--d': `var(--${p.display})`, '--b': `var(--${p.body})` }">
        <h3>{{ p.title }}</h3>
        <p>{{ p.text }}</p>
        <div class="nums" :style="p.mono ? { fontFamily: 'var(--mono)' } : undefined">
          <i /><span v-for="s in p.stats" :key="s">{{ s }}</span>
        </div>
      </div>
      <code>--display: var(--{{ p.display }});
--body: var(--{{ p.body }});<template v-if="p.mono">
--code: var(--mono);</template></code>
    </article>
  </div>
</template>

<style scoped>
.grid{--serif:Charter,"Iowan Old Style","Palatino Linotype",Georgia,serif;--sans:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--humanist:Seravek,"Gill Sans","Gill Sans MT",Calibri,"Segoe UI",sans-serif;--mono:ui-monospace,"Cascadia Code",Menlo,monospace;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;color:var(--text);font:14px/1.5 var(--sans)}
article{display:flex;flex-direction:column;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.meta{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid var(--border)}
.meta b{font-size:15px}
.meta span{color:var(--muted);font-size:13px}
.spec{margin-bottom:16px}
.spec h3{margin:0 0 8px;font:700 24px/1.2 var(--d);letter-spacing:-.01em;text-wrap:balance}
.spec p{margin:0 0 12px;font:16px/1.6 var(--b);max-width:60ch}
.nums{display:flex;flex-wrap:wrap;align-items:center;gap:2px 14px;font:600 13px var(--b);font-variant-numeric:tabular-nums;color:var(--muted)}
.nums i{width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
code{display:block;margin-top:auto;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);font:12px/1.6 var(--mono);white-space:pre-wrap}
/* Tokens: ver pestaña HTML + CSS */
</style>
