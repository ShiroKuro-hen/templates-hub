<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue';

const groups: Record<string, string[]> = {
  Producto: ['Plataforma', 'Integraciones', 'Seguridad', 'Precios'],
  Recursos: ['Documentación', 'Referencia API', 'Guías', 'Comunidad'],
  Empresa: ['Nosotros', 'Clientes', 'Empleo', 'Contacto'],
  Legal: ['Privacidad', 'Términos', 'Cookies', 'Accesibilidad'],
};
const mq = matchMedia('(min-width:720px)');
const wide = ref(mq.matches);
const open = reactive<Record<string, boolean>>({});
const on = () => { wide.value = mq.matches; Object.keys(open).forEach((k) => (open[k] = false)); };
mq.addEventListener('change', on);
onBeforeUnmount(() => mq.removeEventListener('change', on));
const toggle = (name: string) => { if (!wide.value) open[name] = !open[name]; };
</script>

<template>
  <footer>
    <nav class="cols" aria-label="Pie de página">
      <details v-for="(links, name) in groups" :key="name" :open="wide || open[name]">
        <summary :tabindex="wide ? -1 : 0" @click.prevent="toggle(name)">{{ name }}</summary>
        <ul><li v-for="l in links" :key="l"><a href="#">{{ l }}</a></li></ul>
      </details>
    </nav>
    <div class="bar">
      <a class="st" href="#estado">Todos los sistemas operativos</a>
      <label>Idioma <select><option>Español (Perú)</option><option>English</option><option>Português</option></select></label>
      <a class="up" href="#top">Volver arriba</a>
      <p class="copy">© 2026 Nimbo Software S.A.C. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
footer{position:relative;max-width:960px;margin:0 auto;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
footer::before{content:"";position:absolute;inset:0 0 auto;height:1px;background:linear-gradient(90deg,transparent,#22d3ee,#2f5bff,transparent)}
a{color:var(--muted);text-decoration:none;transition:color .14s}
a:hover{color:var(--text);text-decoration:underline;text-underline-offset:3px}
a:focus-visible,summary:focus-visible,select:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}
.cols{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:28px}
summary{display:flex;justify-content:space-between;align-items:center;list-style:none;font-weight:600;cursor:default}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";display:none;color:var(--muted)}
details[open] summary::after{content:"\2212"}
ul{display:grid;gap:8px;margin:12px 0 0;padding:0;list-style:none}
.bar{display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px;padding:16px 28px;border-top:1px solid var(--border);color:var(--muted);font-size:13px}
.st{display:inline-flex;align-items:center;gap:8px}
.st::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--ok)}
.bar label{display:flex;align-items:center;gap:8px}
select{font:inherit;padding:4px 8px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text)}
.up{margin-left:auto}
.copy{flex-basis:100%;margin:0}
@media (max-width:719px){
  .cols{grid-template-columns:1fr;gap:0;padding:0 20px}
  details{border-bottom:1px solid var(--border)}
  summary{padding:14px 0;cursor:pointer}
  summary::after{display:block}
  ul{margin:0;padding-bottom:14px}
  .bar{padding:16px 20px}
  .up{margin-left:0}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
