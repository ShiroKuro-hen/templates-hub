<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const secciones = [
  { id: 'conceptos', titulo: 'Conceptos', texto: ['Un proyecto agrupa servicios, variables y miembros. Cada proyecto tiene entornos independientes.', 'Los servicios se comunican por una red privada y solo exponen los puertos que declaras.'] },
  { id: 'instalacion', titulo: 'Instalación', texto: ['Instala la herramienta de línea de comandos y verifica la versión antes de continuar.', 'Necesitas permisos de administrador solo la primera vez.'] },
  { id: 'configuracion', titulo: 'Configuración', texto: ['Define las variables de entorno en el panel o en el archivo del proyecto.', 'Los valores secretos se cifran y no se muestran después de guardarlos.'] },
  { id: 'despliegue', titulo: 'Despliegue', texto: ['Cada cambio en la rama principal genera un despliegue que puedes revisar antes de publicar.', 'Si algo falla, vuelve a la versión anterior con un clic.'] },
  { id: 'problemas', titulo: 'Solución de problemas', texto: ['Revisa el registro del despliegue para ver qué paso falló.', 'Si continúa, escribe a soporte con el identificador del despliegue.'] },
];
const actual = ref(secciones[0].id);
const scroll = ref<HTMLElement>();
let io: IntersectionObserver;

onMounted(() => {
  const vis = new Set<Element>();
  const els = secciones.map((s) => document.getElementById(s.id)!);
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)));
      const cur = els.find((el) => vis.has(el));
      if (cur) actual.value = cur.id;
    },
    { root: scroll.value, rootMargin: '0px 0px -65% 0px' },
  );
  els.forEach((el) => io.observe(el));
});
onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <div class="wrap">
    <div ref="scroll" class="scroll" tabindex="0" role="region" aria-label="Contenido del artículo">
      <section v-for="s in secciones" :id="s.id" :key="s.id">
        <h2>{{ s.titulo }}</h2>
        <p v-for="t in s.texto" :key="t">{{ t }}</p>
      </section>
    </div>
    <nav class="toc" aria-labelledby="tt">
      <h2 id="tt">En esta página</h2>
      <ul>
        <li v-for="s in secciones" :key="s.id"><a :href="`#${s.id}`" :aria-current="s.id === actual ? 'location' : undefined">{{ s.titulo }}</a></li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.wrap{display:grid;grid-template-columns:minmax(0,1fr) 200px;gap:16px;max-width:860px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap>*{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.scroll{height:400px;overflow:auto;padding:8px 24px}
.scroll:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.scroll::after{content:"";display:block;height:300px}
section{min-height:200px;padding:16px 0}
h2{margin:0 0 8px;font-size:20px;scroll-margin-top:8px}
p{margin:0 0 12px;max-width:62ch;color:var(--muted)}
.toc{align-self:start;position:sticky;top:20px;padding:16px}
.toc h2{margin:0 0 8px;font-size:14px}
ul{list-style:none;margin:0;padding:0;border-left:1px solid var(--border)}
.toc a{position:relative;display:block;padding:4px 12px;color:var(--muted);text-decoration:none;transition:color .14s}
.toc a:hover{color:var(--text)}
.toc a[aria-current]{color:var(--accent);font-weight:600}
.toc a[aria-current]::before{content:"";position:absolute;left:-1px;top:3px;bottom:3px;width:3px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
@media (prefers-reduced-motion:no-preference){.scroll{scroll-behavior:smooth}}
@media (max-width:560px){.wrap{grid-template-columns:minmax(0,1fr)}.toc{order:-1;position:static}.scroll{height:320px;padding:8px 16px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
