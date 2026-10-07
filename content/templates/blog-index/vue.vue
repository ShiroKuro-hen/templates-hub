<script setup lang="ts">
import { computed, ref } from 'vue';

type Post = { cat: string; title: string; text: string; autor: string; ini: string; fecha: string; cover?: string };
const posts: Post[] = [
  { cat: 'Producto', title: 'Presentamos las automatizaciones con vista previa', text: 'Prueba cada regla con datos reales antes de activarla.', autor: 'Diego Salazar', ini: 'DS', fecha: '28 sep, 4 min' },
  { cat: 'Ingeniería', title: 'Reducimos un 60 % la latencia del motor de reglas', text: 'Qué medimos, qué cambiamos y qué aprendimos en el proceso.', autor: 'Camila Torres', ini: 'CT', fecha: '24 sep, 9 min', cover: 'c2' },
  { cat: 'Seguridad', title: 'SSO y SCIM: guía de implementación para equipos de TI', text: 'Configura el acceso único y el aprovisionamiento en una tarde.', autor: 'Andrés Quispe', ini: 'AQ', fecha: '19 sep, 7 min', cover: 'c3' },
  { cat: 'Guías', title: 'Siete flujos que todo equipo de soporte debería tener', text: 'Asignación, escalamiento y encuestas de satisfacción listos para copiar.', autor: 'Lucía Mejía', ini: 'LM', fecha: '12 sep, 6 min', cover: 'c4' },
  { cat: 'Producto', title: 'Novedades de septiembre: paneles, filtros y permisos', text: 'Todo lo que lanzamos este mes, con ejemplos de uso.', autor: 'Diego Salazar', ini: 'DS', fecha: '5 sep, 3 min', cover: 'c2' },
  { cat: 'Seguridad', title: 'Nimbo abre su región de datos en São Paulo', text: 'Mantén tus datos en Latinoamérica con menor latencia.', autor: 'Andrés Quispe', ini: 'AQ', fecha: '1 sep, 3 min' },
];
const cats = ['Todo', 'Producto', 'Ingeniería', 'Seguridad', 'Guías'];
const cat = ref('Todo');
const lista = computed(() => posts.filter((p) => cat.value === 'Todo' || p.cat === cat.value));
const total = computed(() => lista.value.length
  ? `${lista.value.length} ${lista.value.length === 1 ? 'artículo' : 'artículos'}`
  : 'No hay artículos en esta categoría. Prueba con otra.');
</script>

<template>
  <div class="page">
    <header><h1>Blog de Nimbo</h1><p>Historias de clientes, guías prácticas y novedades del producto.</p></header>
    <div class="chips" role="group" aria-label="Filtrar por categoría">
      <button v-for="c in cats" :key="c" type="button" :aria-pressed="c === cat" @click="cat = c">{{ c }}</button>
    </div>
    <article class="card feat">
      <div class="cover" aria-hidden="true" />
      <div class="body">
        <span class="badge">Casos de éxito</span>
        <h2><a href="#">Cómo Kintsu automatizó 40.000 aprobaciones al mes sin perder el control</a></h2>
        <p>El equipo de finanzas pasó de tres días a tres horas en su cierre mensual. Estas son las reglas que lo hicieron posible.</p>
        <div class="meta"><span class="who"><span class="av">VR</span>Valeria Rojas</span><span>2 oct 2026, 8 min de lectura</span></div>
      </div>
    </article>
    <p class="count" role="status">{{ total }}</p>
    <div class="grid">
      <article v-for="p in lista" :key="p.title" class="card">
        <div :class="['cover', p.cover]" aria-hidden="true" />
        <div class="body">
          <span class="badge">{{ p.cat }}</span>
          <h3><a href="#">{{ p.title }}</a></h3>
          <p>{{ p.text }}</p>
          <div class="meta"><span class="who"><span class="av">{{ p.ini }}</span>{{ p.autor }}</span><span>{{ p.fecha }}</span></div>
        </div>
      </article>
    </div>
    <nav aria-label="Paginación">
      <ul class="pager">
        <li><a href="#" aria-disabled="true">Anterior</a></li>
        <li><a href="#" aria-current="page" aria-label="Página 1">1</a></li>
        <li><a href="#" aria-label="Página 2">2</a></li>
        <li><a href="#" aria-label="Página 3">3</a></li>
        <li><a href="#">Siguiente</a></li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.page{max-width:1100px;margin:0 auto;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:inherit;text-decoration:none}
header h1{margin:0 0 4px;font-size:clamp(26px,4vw,36px);letter-spacing:-.02em;line-height:1.2}
header p{margin:0 0 16px;color:var(--muted)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.chips button{padding:5px 14px;font:inherit;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:999px;cursor:pointer;transition:background .14s,color .14s,border-color .14s}
.chips button:hover{color:var(--text);border-color:var(--accent)}
.chips button[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
button:focus-visible,a:focus-visible,.card:has(a:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
.card{position:relative;display:grid;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);transition:border-color .14s}
.card:hover{border-color:var(--accent)}
.cover{aspect-ratio:16/9;background:repeating-linear-gradient(135deg,transparent 0 14px,var(--border) 14px 15px),linear-gradient(135deg,var(--accent-soft),var(--info-soft))}
.c2{background-image:repeating-linear-gradient(135deg,transparent 0 14px,var(--border) 14px 15px),linear-gradient(135deg,var(--ok-soft),var(--warn-soft))}
.c3{background-image:repeating-linear-gradient(135deg,transparent 0 14px,var(--border) 14px 15px),linear-gradient(135deg,var(--warn-soft),var(--accent-soft))}
.c4{background-image:repeating-linear-gradient(135deg,transparent 0 14px,var(--border) 14px 15px),linear-gradient(135deg,var(--ok-soft),var(--info-soft))}
.body{display:grid;gap:8px;align-content:start;padding:16px}
.badge{justify-self:start;padding:1px 10px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600}
h2,h3{margin:0;line-height:1.3;letter-spacing:-.01em}
h3{font-size:17px}
h3 a::after,h2 a::after{content:"";position:absolute;inset:0}
.body p{margin:0;color:var(--muted)}
.meta{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px 12px;margin-top:4px;font-size:13px;color:var(--muted)}
.who{display:flex;align-items:center;gap:8px;color:var(--text)}
.av{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--accent-soft);color:var(--accent);font-size:10px;font-weight:700}
.feat{grid-template-columns:1.1fr 1fr;margin-bottom:16px}
.feat .cover{aspect-ratio:auto;min-height:240px;background:repeating-linear-gradient(135deg,transparent 0 14px,rgba(255,255,255,.18) 14px 15px),linear-gradient(135deg,#22d3ee,#2f5bff)}
.feat .body{gap:12px;padding:28px;align-content:center}
.feat h2{font-size:clamp(22px,3vw,28px)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.count{margin:0 0 12px;color:var(--muted)}
.pager{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:32px 0 0;padding:0;list-style:none}
.pager a{display:grid;place-items:center;min-width:34px;height:34px;padding:0 10px;box-sizing:border-box;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);font-variant-numeric:tabular-nums;transition:border-color .14s}
.pager a:hover{border-color:var(--accent)}
.pager [aria-current=page]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink);font-weight:600}
.pager [aria-disabled=true]{color:var(--muted);opacity:.6;pointer-events:none}
@media (max-width:760px){.feat{grid-template-columns:1fr}.feat .cover{min-height:150px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
