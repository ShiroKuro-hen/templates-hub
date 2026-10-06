<script setup lang="ts">
import { computed, ref } from 'vue';

type QuickLink = { title: string; desc: string; href: string; icon: string }; // icon: atributo d de un path SVG 24x24

const props = withDefaults(defineProps<{ links?: QuickLink[] }>(), {
  links: () => [
    { title: 'Panel de inicio', desc: 'Vuelve a tus proyectos recientes.', href: '/', icon: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z' },
    { title: 'Centro de ayuda', desc: 'Guías paso a paso y respuestas rápidas.', href: '/ayuda', icon: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6M12 17h.01' },
    { title: 'Estado del servicio', desc: 'Comprueba si hay incidencias activas.', href: '/estado', icon: 'M3 12h4l3-7 4 14 3-7h4' },
    { title: 'Contactar con soporte', desc: 'Respondemos en menos de 24 horas.', href: '/soporte', icon: 'M4 6h16v10H8l-4 4z' },
  ],
});
const emit = defineEmits<{ search: [q: string] }>();
const q = ref('');
const shown = computed(() => props.links.filter((l) => `${l.title} ${l.desc}`.toLowerCase().includes(q.value.trim().toLowerCase())));
function submit() { if (q.value.trim()) emit('search', q.value.trim()); } // p. ej. navegar a /buscar?q=...
</script>

<template>
  <div class="page">
    <header class="top">
      <a class="brand" href="/"><span class="logo" aria-hidden="true" />Nimbo</a>
      <a class="link" href="/">Ir al panel</a>
    </header>
    <main>
      <p class="code" aria-hidden="true">404</p>
      <h1>No encontramos esta página</h1>
      <p class="lead">Puede que el enlace esté mal escrito o que la página se haya movido. Busca lo que necesitas o elige uno de estos accesos.</p>
      <form role="search" @submit.prevent="submit">
        <div class="field">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input v-model="q" type="search" aria-label="Buscar en Nimbo" placeholder="Buscar proyectos, informes o ayuda" autocomplete="off" />
        </div>
        <button class="btn" type="submit">Buscar</button>
      </form>
      <h2 id="links-title">Enlaces útiles</h2>
      <ul aria-labelledby="links-title">
        <li v-for="l in shown" :key="l.href">
          <a :href="l.href">
            <span class="ico" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path :d="l.icon" /></svg></span>
            <span><strong>{{ l.title }}</strong><span>{{ l.desc }}</span></span>
          </a>
        </li>
        <li v-if="!shown.length" class="empty" role="status">Ningún acceso coincide. Pulsa Buscar para consultar todo el centro de ayuda.</li>
      </ul>
      <p class="ref">Código de error 404. Si llegaste aquí desde un enlace de Nimbo, avísanos para corregirlo.</p>
    </main>
  </div>
</template>

<style scoped>
.page{color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.top{max-width:960px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:16px;color:var(--text);text-decoration:none}
.logo{width:26px;height:26px;border-radius:7px;background:var(--accent)}
.link{color:var(--accent);font-weight:500;text-decoration:none}
.link:hover{text-decoration:underline}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
main{max-width:640px;margin:0 auto;padding:48px 0 24px}
.code{margin:0;font-size:clamp(64px,16vw,112px);line-height:1;font-weight:800;letter-spacing:-.04em;font-variant-numeric:tabular-nums;background:linear-gradient(135deg,#22d3ee,#2f5bff);-webkit-background-clip:text;background-clip:text;color:transparent;width:max-content}
h1{font-size:clamp(22px,4vw,28px);line-height:1.25;margin:16px 0 8px}
.lead{margin:0 0 24px;color:var(--muted);max-width:56ch}
form{display:flex;gap:8px;flex-wrap:wrap}
.field{flex:1 1 240px;position:relative}
.field svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted)}
input{width:100%;box-sizing:border-box;font:inherit;color:inherit;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px 10px 38px}
.btn{font:inherit;font-weight:600;border-radius:var(--radius);padding:10px 16px;cursor:pointer;background:var(--accent);color:var(--accent-ink);border:1px solid var(--accent)}
h2{font-size:15px;margin:32px 0 8px;color:var(--muted);font-weight:600}
ul{list-style:none;margin:0;padding:0;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
li + li{border-top:1px solid var(--border)}
li a{display:flex;align-items:center;gap:14px;padding:14px 16px;color:var(--text);text-decoration:none;transition:background .14s}
li a:hover{background:var(--accent-soft)}
li a:focus-visible{outline-offset:-2px}
.ico{width:34px;height:34px;flex:none;display:grid;place-items:center;border-radius:var(--radius);background:var(--accent-soft);color:var(--accent)}
li strong{display:block;font-weight:600}
li span span{color:var(--muted)}
.empty{padding:16px;color:var(--muted)}
.ref{margin:24px 0 0;color:var(--muted);font-size:13px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
