<script setup lang="ts">
type Section = { id: string; titulo: string; texto: string; codigo?: string };

withDefaults(defineProps<{ actual?: string }>(), { actual: 'Autenticación' });

const nav: [string, string[]][] = [
  ['Primeros pasos', ['Introducción', 'Inicio rápido']],
  ['Seguridad', ['Autenticación', 'Permisos']],
  ['Referencia', ['Webhooks', 'Límites de uso']],
];
const secciones: Section[] = [
  { id: 'crear', titulo: 'Crear una clave', texto: 'Abre Ajustes, entra en Claves de API y pulsa Nueva clave. Copia el valor: solo se muestra una vez.' },
  {
    id: 'enviar', titulo: 'Enviar la clave', texto: 'Incluye la clave en la cabecera Authorization de cada petición.',
    codigo: 'curl https://api.ejemplo.com/v1/pedidos \\\n  -H "Authorization: Bearer $CLAVE"',
  },
  { id: 'rotar', titulo: 'Rotar claves', texto: 'Crea la clave nueva, actualiza tus servicios y revoca la anterior. Rota las claves cada 90 días.' },
];
</script>

<template>
  <div class="docs">
    <nav aria-label="Documentación">
      <div v-for="[grupo, links] in nav" :key="grupo">
        <p class="group">{{ grupo }}</p>
        <ul>
          <li v-for="l in links" :key="l"><a href="#" :aria-current="l === actual ? 'page' : undefined">{{ l }}</a></li>
        </ul>
      </div>
    </nav>
    <article>
      <p class="crumbs"><a href="#">Guía</a> / <a href="#">Seguridad</a> / {{ actual }}</p>
      <h1>{{ actual }}</h1>
      <p class="lead">Cada petición a la API necesita una clave. Crea una, envíala en la cabecera y rótala sin cortar el servicio.</p>
      <section v-for="s in secciones" :key="s.id">
        <h2 :id="s.id">{{ s.titulo }}</h2>
        <p>{{ s.texto }}</p>
        <pre v-if="s.codigo"><code>{{ s.codigo }}</code></pre>
      </section>
      <div class="pager">
        <a href="#"><small>Anterior</small>Inicio rápido</a>
        <a href="#"><small>Siguiente</small>Permisos</a>
      </div>
    </article>
    <aside class="toc" aria-labelledby="tt">
      <h2 id="tt">En esta página</h2>
      <ul><li v-for="s in secciones" :key="s.id"><a :href="`#${s.id}`">{{ s.titulo }}</a></li></ul>
    </aside>
  </div>
</template>

<style scoped>
.docs{display:grid;grid-template-columns:200px minmax(0,1fr) 180px;gap:32px;max-width:1040px;margin:0 auto;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
nav,.toc{position:sticky;top:20px;align-self:start}
h2,p{margin:0}
ul{list-style:none;margin:0;padding:0}
.group{margin:16px 0 4px;font-weight:600}
nav>div:first-child .group{margin-top:0}
nav a,.toc a{display:block;color:var(--muted);text-decoration:none;transition:color .14s,background .14s}
nav a{position:relative;padding:5px 10px;border-radius:6px}
nav a:hover,.toc a:hover{color:var(--text)}
nav a[aria-current=page]{color:var(--accent);background:var(--accent-soft);font-weight:600}
nav a[aria-current=page]::before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:3px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.toc{padding-left:12px;border-left:1px solid var(--border)}
.toc h2{margin-bottom:6px;font-size:14px}
.toc a{padding:3px 0}
a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.crumbs{color:var(--muted);margin-bottom:8px}
.crumbs a{color:inherit}
article h1{margin:0 0 8px;font-size:28px;line-height:1.2;letter-spacing:-.01em}
.lead{font-size:16px;color:var(--muted);margin-bottom:24px;max-width:60ch}
article h2{margin:28px 0 8px;font-size:20px;scroll-margin-top:20px}
section p{max-width:70ch}
section p+pre{margin-top:12px}
code{font:13px ui-monospace,"Cascadia Code",Menlo,monospace}
pre{margin:0;padding:12px 16px;overflow:auto;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
.pager{display:flex;justify-content:space-between;gap:12px;margin-top:32px;padding-top:16px;border-top:1px solid var(--border)}
.pager a{padding:10px 14px;color:var(--text);text-decoration:none;border:1px solid var(--border);border-radius:var(--radius);transition:border-color .14s}
.pager a:hover{border-color:var(--accent)}
.pager small{display:block;color:var(--muted)}
@media (max-width:900px){.docs{grid-template-columns:minmax(0,1fr);gap:20px}nav,.toc{position:static}nav{order:-2}.toc{order:-1}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
